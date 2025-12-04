
'use client';

import { useCallback, useRef, useState, useEffect, memo } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { FilterSidebar, RECENT_FILTERS_KEY } from "./filter-sidebar";
import { Job } from "@/lib/mock-data";
import { Bookmark, ListFilter, Loader2 } from "lucide-react";
import { JobCard } from "../job-card";
import { experienceYears } from "@/lib/visa-data";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { PaginationComponent } from "../pagination";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export type SearchFilters = {
    q?: string;
    visa?: string;
    visaDetail?: string;
    career?: string;
    workLocation?: string[];
    interviewLocation?: string;
    job?: string;
    experienceRequirement?: string;
    gender?: 'nam' | 'nu' | '';
    height?: [number, number];
    weight?: [number, number];
    age?: [number, number];
    basicSalary?: string;
    realSalary?: string;
    hourlySalary?: string;
    annualIncome?: string;
    annualBonus?: string;
    interviewDate?: string;
    interviewDateType?: 'until' | 'exact' | 'from';
    specialConditions?: string[];
    languageRequirement?: string;
    englishRequirement?: string;
    educationRequirement?: string;
    yearsOfExperience?: string;
    tattooRequirement?: string;
    netFee?: string;
    netFeeNoTicket?: string;
    numberRecruits?: string;
    interviewRounds?: string;
    visionRequirement?: string;
    dominantHand?: string;
    otherSkillRequirement?: string[];
    companyArrivalTime?: string;
    workShift?: string;
    suggestionType?: 'accurate' | 'related';
    showExpired?: boolean;
    hasForm?: boolean;
    // hasNiceForm?: boolean;
    sortExpiredToEnd?: boolean;
}

export { experienceYears };

type SearchResultsProps = {
    jobs: Job[];
    total: number | null;
    filters: SearchFilters;
    appliedFilters: SearchFilters;
    onFilterChange: (newFilters: Partial<SearchFilters>) => void;
    applyFilters: () => void;
    resetFilters: () => void;
    resultCount: number;
    sortBy: string;
    onSortChange: (value: string) => void;
    onPageChange: (page: number) => void;
    totalPage: number;
    currentPage: number;
    firstLoad?: boolean;
}

export const SearchResults = memo(({ jobs, total, filters, appliedFilters, firstLoad = false, totalPage, currentPage, onFilterChange, applyFilters, resetFilters, resultCount, sortBy, onSortChange, onPageChange }: SearchResultsProps) => {
    const { role } = useAuth();
    const isMobile = useIsMobile();
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const router = useRouter();

    const handleApply = () => {
        applyFilters();
        setIsSheetOpen(false); // Close sheet on apply
    };

    const handleReset = () => {
        resetFilters();
        setIsSheetOpen(false); // Close sheet on reset
    }
    const [isShowSaveFilter, setIsShowSaveFilter] = useState(false);
    const [filterTitle, setFilterTitle] = useState('');
    const saveFilter = () => {
        const obj = { filters: appliedFilters, sortBy, id: '' + Date.now(), label: filterTitle }
        const raw = localStorage.getItem(RECENT_FILTERS_KEY);
        const savedFilters: any[] = raw ? JSON.parse(raw) : [];
        savedFilters.unshift(obj);
        localStorage.setItem(RECENT_FILTERS_KEY, JSON.stringify(savedFilters));
        toast({
            title: "Lưu bộ lọc thành công!",
            duration: 1000,
        });
        setFilterTitle('');
        setIsShowSaveFilter(false);
        router.refresh();
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
                            <h2 className="text-xl font-bold">Kết quả {total === null ? '' : `(${total})`}</h2>
                            {role === 'admin' && <Popover open={isShowSaveFilter} onOpenChange={setIsShowSaveFilter}>
                                <PopoverTrigger asChild>
                                    <Bookmark className={"h-5 w-5 text-primary mr-auto ml-1 cursor-pointer hover:fill-current transition-all duration-300"} />
                                </PopoverTrigger>
                                <PopoverContent className="w-270" side="top" align="start">
                                    <div className="flex items-center">
                                        <Input
                                            id="title"
                                            placeholder="Đặt một tên dễ nhớ cho bộ lọc này"
                                            autoFocus
                                            tabIndex={1}
                                            className="w-[270px]"
                                            value={filterTitle}
                                            onChange={(e) => setFilterTitle(e.target.value)}
                                        />
                                        <Button variant="outline" onClick={saveFilter}
                                            className={"ml-2 bg-white flex border-gray-300 border border-accent-orange bg-background text-accent-orange hover:bg-accent-orange/5 hover:text-accent-orange"}>
                                            Lưu
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>}
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
                                            <FilterSidebar filters={filters} appliedFilters={appliedFilters} onFilterChange={onFilterChange} onApply={handleApply} onReset={handleReset} resultCount={resultCount} />
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
                        {(totalPage > 0 || !firstLoad) ? (
                            <div className="grid grid-cols-1 gap-4">
                                {jobs.map((job, index) => {
                                    const card = <JobCard job={job} showPostedTime={true} showLikes={false} showApplyButtons={role !== 'admin'} variant="list-item" appliedFilters={appliedFilters} isSearchPage={true} />;
                                    return <div key={job.id}>{card}</div>
                                })}
                                {(!firstLoad || isLoadingMore) && Array.from({ length: 4 }).map((_, i) => (
                                    <Card key={i}>
                                        <CardContent className="p-3 flex flex-col items-stretch gap-4 md:flex-row">
                                            <Skeleton className="h-48 w-full flex-shrink-0 md:h-40 md:w-60" />
                                            <Skeleton className="flex flex-grow flex-col" />
                                        </CardContent>
                                    </Card>
                                ))}

                            </div>
                        ) : (
                            <div className="text-center py-16 bg-background rounded-lg">
                                <p className="text-lg font-semibold text-muted-foreground">Không tìm thấy công việc nào phù hợp.</p>
                                <p className="text-sm text-muted-foreground mt-2">Hãy thử thay đổi bộ lọc hoặc tìm kiếm lại.</p>
                            </div>
                        )}
                        {totalPage > 1 && (
                            <div className="mt-8">
                                <PaginationComponent
                                    currentPage={currentPage}
                                    totalPages={totalPage}
                                    onPageChange={onPageChange}
                                    isMobile={isMobile}
                                />
                            </div>
                        )}
                        {/* {isLoadingMore && (
                            <div className="flex justify-center items-center p-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    )
});
