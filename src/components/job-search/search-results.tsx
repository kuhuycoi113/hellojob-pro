
'use client';

import { useCallback, useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { FilterSidebar } from "./filter-sidebar";
import { Job, jobData } from "@/lib/mock-data";
import { ChevronLeft, ListFilter, Loader2 } from "lucide-react";
import { locations } from "@/lib/location-data";
import { JobCard } from "../job-card";

export type SearchFilters = {
    visa: string;
    visaDetail: string;
    industry: string;
    location: string[];
    interviewLocation: string;
    jobDetail?: string;
    experienceRequirement?: string;
    gender?: 'nam' | 'nu' | '';
    height?: [number, number];
    weight?: [number, number];
    age?: [number, number];
    basicSalary?: string;
    netSalary?: string;
    hourlySalary?: string;
    annualIncome?: string;
    annualBonus?: string;
    interviewDate?: string;
    specialConditions?: string[];
    languageRequirement?: string;
    englishRequirement?: string; // Added this line
    educationRequirement?: string;
    yearsOfExperience?: string;
    tattooRequirement?: string;
    hepatitisBRequirement?: string;
    netFee?: string;
    quantity?: string;
    interviewRounds?: string;
    visionRequirement?: string;
    dominantHand?: string;
    otherSkillRequirement?: string[];
    companyArrivalTime?: string;
    workShift?: string;
}

export const experienceYears: { name: string; slug: string }[] = [
    { name: 'Không yêu cầu', slug: 'khong-yeu-cau' },
    { name: 'Dưới 1 năm', slug: 'duoi-1-nam' },
    { name: '1-2 năm', slug: '1-2-nam' },
    { name: '2-3 năm', slug: '2-3-nam' },
    { name: 'Trên 3 năm', slug: 'tren-3-nam' },
    { name: '0,5 - 1 năm', slug: '0.5-1-nam' },
    { name: '1 - 1,5 năm', slug: '1-1.5-nam' },
    { name: '1,5 - 2 năm', slug: '1.5-2-nam' },
    { name: '2 - 2,5 năm', slug: '2-2.5-nam' },
    { name: '2,5 - 3 năm', slug: '2.5-3-nam' },
    { name: '3 - 3,5 năm', slug: '3-3.5-nam' },
    { name: '3,5 - 4 năm', slug: '3.5-4-nam' },
    { name: '4 - 4,5 năm', slug: '4-4.5-nam' },
    { name: '4,5 - 5 năm', slug: '4.5-5-nam' },
    { name: 'Trên 5 năm', slug: 'tren-5-nam' }
];

type SearchResultsProps = {
    jobs: Job[];
    filters: SearchFilters;
    appliedFilters: SearchFilters;
    onFilterChange: (newFilters: Partial<SearchFilters>) => void;
    applyFilters: () => void;
    resetFilters: () => void;
    resultCount: number;
    sortBy: string;
    onSortChange: (value: string) => void;
}

export const SearchResults = ({ jobs, filters, appliedFilters, onFilterChange, applyFilters, resetFilters, resultCount, sortBy, onSortChange }: SearchResultsProps) => {
    const [visibleJobsCount, setVisibleJobsCount] = useState(24);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const loadMoreJobs = useCallback(() => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleJobsCount(prevCount => Math.min(prevCount + 24, jobs.length));
            setIsLoadingMore(false);
        }, 1000); // Simulate network delay
    }, [jobs.length]);

    const lastJobElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoadingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleJobsCount < jobs.length) {
                loadMoreJobs();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoadingMore, loadMoreJobs, visibleJobsCount, jobs.length]);
      
    const handleApply = () => {
        applyFilters();
        setIsSheetOpen(false); // Close sheet on apply
    };

    const handleReset = () => {
        resetFilters();
        setIsSheetOpen(false); // Close sheet on reset
    }

    return (
     <div className="w-full bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
                <div className="hidden md:block">
                  <FilterSidebar filters={filters} appliedFilters={appliedFilters} onFilterChange={onFilterChange} onApply={applyFilters} onReset={resetFilters} resultCount={resultCount} />
                </div>

                <div className="md:col-span-3 lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Kết quả ({jobs.length})</h2>
                        <div className="flex items-center gap-2">
                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                                  <FilterSidebar filters={filters} appliedFilters={appliedFilters} onFilterChange={onFilterChange} onApply={handleApply} onReset={handleReset} resultCount={resultCount}/>
                                </div>
                              </SheetContent>
                            </Sheet>
                            
                             <Select value={sortBy} onValueChange={onSortChange}>
                                <SelectTrigger id="SAPXEP01" className="w-auto md:w-[180px]">
                                    <SelectValue placeholder="Sắp xếp theo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Mới nhất</SelectItem>
                                    <SelectItem value="salary_desc">Lương cơ bản: Cao {'>'} Thấp</SelectItem>
                                    <SelectItem value="salary_asc">Lương cơ bản: Thấp {'>'} Cao</SelectItem>
                                    <SelectItem value="net_salary_desc">Thực lĩnh: Cao {'>'} Thấp</SelectItem>
                                    <SelectItem value="net_salary_asc">Thực lĩnh: Thấp {'>'} Cao</SelectItem>
                                    <SelectItem value="fee_asc">Phí thấp {'>'} Cao</SelectItem>
                                    <SelectItem value="fee_desc">Phí cao {'>'} Thấp</SelectItem>
                                    <SelectItem value="interview_date_asc">Ngày phỏng vấn: Gần nhất</SelectItem>
                                    <SelectItem value="interview_date_desc">Ngày phỏng vấn: Xa nhất</SelectItem>
                                    <SelectItem value="has_image">Ưu tiên có ảnh</SelectItem>
                                    <SelectItem value="has_video">Ưu tiên có video</SelectItem>
                                    <SelectItem value="hot">Độ hot</SelectItem>
                                    <SelectItem value="most_applicants">Nhiều người ứng tuyển</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {jobs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                        {jobs.slice(0, visibleJobsCount).map((job, index) => {
                            const card = <JobCard job={job} showPostedTime={true} showLikes={false} showApplyButtons={true} variant="list-item" />;
                            if (index === visibleJobsCount - 1) {
                                return <div ref={lastJobElementRef} key={job.id}>{card}</div>
                            }
                            return <div key={job.id}>{card}</div>
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

    