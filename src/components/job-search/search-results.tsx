

'use client';

import { useCallback, useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { FilterSidebar } from "./filter-sidebar";
import { Job, jobData } from "@/lib/mock-data";
import { JobCard } from "../job-card";
import { ChevronLeft, ListFilter, Loader2 } from "lucide-react";
import { locations } from "@/lib/location-data";

export type SearchFilters = {
    visa: string;
    visaDetail: string;
    industry: string;
    location: string;
    jobDetail?: string; // Add jobDetail
}

type SearchResultsProps = {
    jobs: Job[];
    initialFilters: SearchFilters;
}

export const SearchResults = ({ jobs: initialJobs, initialFilters }: SearchResultsProps) => {
    const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);
    const [visibleJobsCount, setVisibleJobsCount] = useState(24);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        setFilters(initialFilters);
        setFilteredJobs(initialJobs);
    }, [initialFilters, initialJobs]);

    const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const applyFilters = useCallback(() => {
        const results = jobData.filter(job => {
            let visaMatch = true;
            if (filters.visaDetail && filters.visaDetail !== 'all-details') {
                visaMatch = job.visaDetail === filters.visaDetail;
            } else if (filters.visa && filters.visa !== 'all') {
                visaMatch = job.visaType === filters.visa;
            }

            const industryMatch = !filters.industry || filters.industry === 'all' || (job.industry && job.industry.toLowerCase().includes(filters.industry.toLowerCase()));
            
            let locationMatch = false;
            if (!filters.location || filters.location === 'all') {
                locationMatch = true;
            } else {
                const isRegion = Object.keys(locations['Nhật Bản']).includes(filters.location);
                if (isRegion) {
                    const regionPrefectures = locations['Nhật Bản'][filters.location as keyof typeof locations['Nhật Bản']];
                    locationMatch = regionPrefectures.some(prefecture => job.workLocation.toLowerCase().includes(prefecture.toLowerCase()));
                } else {
                    locationMatch = job.workLocation && job.workLocation.toLowerCase().includes(filters.location.toLowerCase());
                }
            }

            const jobDetailMatch = !filters.jobDetail || (job.title && job.title.toLowerCase().includes(filters.jobDetail.toLowerCase())) || (job.details.description && job.details.description.toLowerCase().includes(filters.jobDetail.toLowerCase()));
            
            return visaMatch && industryMatch && locationMatch && jobDetailMatch;
        });
        setFilteredJobs(results);
        setVisibleJobsCount(24); // Reset pagination on new filter apply
    }, [filters]);


    const loadMoreJobs = useCallback(() => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleJobsCount(prevCount => Math.min(prevCount + 24, filteredJobs.length));
            setIsLoadingMore(false);
        }, 1000); // Simulate network delay
    }, [filteredJobs.length]);

    const lastJobElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoadingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleJobsCount < filteredJobs.length) {
                loadMoreJobs();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoadingMore, loadMoreJobs, visibleJobsCount, filteredJobs.length]);
      

    return (
     <div className="w-full bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
                <div className="hidden md:block">
                  <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onApply={applyFilters} />
                </div>

                <div className="md:col-span-3 lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Kết quả ({filteredJobs.length})</h2>
                        <Sheet>
                          <SheetTrigger asChild>
                             <Button variant="ghost" size="sm" className="flex items-center gap-1 md:hidden">
                                <ListFilter className="w-4 h-4" />
                                Lọc
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                              <SheetDescription>
                                Tinh chỉnh kết quả tìm kiếm của bạn.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="py-4 h-[calc(100vh-8rem)] overflow-y-auto">
                              <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onApply={applyFilters} />
                            </div>
                          </SheetContent>
                        </Sheet>
                        
                         <Select>
                            <SelectTrigger className="w-[180px] hidden md:flex">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Mới nhất</SelectItem>
                                <SelectItem value="salary_desc">Lương cao đến thấp</SelectItem>
                                <SelectItem value="salary_asc">Lương thấp đến cao</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {filteredJobs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                        {filteredJobs.slice(0, visibleJobsCount).map((job, index) => {
                            if (index === visibleJobsCount - 1) {
                                return <div ref={lastJobElementRef} key={job.id}><JobCard job={job} /></div>
                            }
                            return <JobCard key={job.id} job={job} />
                        })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-background rounded-lg">
                            <p className="text-lg font-semibold text-muted-foreground">Không tìm thấy công việc nào phù hợp.</p>
                            <p className="text-sm text-muted-foreground mt-2">Hãy thử thay đổi bộ lọc hoặc tìm kiếm lại.</p>
                        </div>
                    )}
                    {isLoadingMore && (
                        <div className="flex justify-center items-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>
            </div>
        </div>
     </div>
    )
  };
