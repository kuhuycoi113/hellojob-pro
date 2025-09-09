
'use client';

import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { FilterSidebar } from "./filter-sidebar";
import { jobData } from "@/lib/mock-data";
import { JobCard } from "../job-card";
import { ChevronLeft, ListFilter, Loader2 } from "lucide-react";

type SearchResultsProps = {
    onBack: () => void;
}

const CompactSearchForm = ({ onBack, searchTerm }: { onBack: () => void, searchTerm: string }) => (
     <div className="bg-primary p-2 md:hidden sticky top-16 z-40 shadow-lg">
        <Button 
            variant="outline" 
            className="w-full justify-start text-left h-auto py-2 px-3 bg-background text-foreground hover:bg-background/90"
            onClick={onBack}
        >
            <ChevronLeft className="mr-2 text-muted-foreground"/>
            <div className="flex-grow overflow-hidden">
                <p className="font-bold text-base truncate">{searchTerm || 'Tất cả việc làm'}</p>
                <p className="text-sm text-muted-foreground truncate">Chỉnh sửa tìm kiếm của bạn</p>
            </div>
        </Button>
    </div>
);

export const SearchResults = ({ onBack }: SearchResultsProps) => {
    const [visibleJobsCount, setVisibleJobsCount] = useState(24);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const loadMoreJobs = useCallback(() => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleJobsCount(prevCount => Math.min(prevCount + 24, jobData.length));
            setIsLoadingMore(false);
        }, 1000); // Simulate network delay
    }, []);

    const lastJobElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoadingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleJobsCount < jobData.length) {
                loadMoreJobs();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoadingMore, loadMoreJobs, visibleJobsCount]);
      
    return (
     <div className="w-full bg-secondary">
        <CompactSearchForm onBack={onBack} searchTerm="Kết quả tìm kiếm" />
        <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
                <div className="hidden md:block">
                  <FilterSidebar />
                </div>

                <div className="md:col-span-3 lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Kết quả ({jobData.length})</h2>
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
                              <FilterSidebar />
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
                    <div className="grid grid-cols-1 gap-4">
                      {jobData.slice(0, visibleJobsCount).map((job, index) => {
                          if (index === visibleJobsCount - 1) {
                              return <div ref={lastJobElementRef} key={job.id}><JobCard job={job} /></div>
                          }
                          return <JobCard key={job.id} job={job} />
                      })}
                    </div>
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

