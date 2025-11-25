
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters } from '@/components/job-search/search-results';
import { Job } from '@/lib/mock-data';
import { SearchModule } from '@/components/job-search/search-module';
import { allSpecialConditions } from '@/lib/visa-data';
import { countJobs, getJobs } from '@/actions/jobs-action';
import { generateJobFilter, initialSearchFilters, keyMap, sortOptionMap } from '@/lib/job-filter-util';

export default function JobSearchPageContent({ jobs = [], filters, total, totalPages = 0, page = 1, sort = 'newest' }: { jobs?: Job[], filters: SearchFilters, total: number, totalPages?: number, page?: number, sort?: string }) {
    const router = useRouter();
    const readOnlySearchParams = useSearchParams();

    const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(filters);
    const [stagedFilters, setStagedFilters] = useState<SearchFilters>(filters);
    const [sortBy, setSortBy] = useState(sort);

    const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
    const [stagedResultCount, setStagedResultCount] = useState<number>(total);
    const [totalJobs, setTotalJobs] = useState<number | null>(total);
    const [totalPage, setTotalPage] = useState(totalPages);
    const [currentPage, setCurrentPage] = useState(page);
    const [firstLoad, setFirstLoad] = useState(false);
    
    useEffect(() => {
        // Đồng bộ hóa tất cả các state được khởi tạo từ props
        setFilteredJobs(jobs);
        setTotalJobs(total);
        setTotalPage(totalPages);
        setCurrentPage(page);
        setSortBy(sort);
        
        // Cập nhật cả appliedFilters và stagedFilters theo props mới từ SC
        setAppliedFilters(filters);
        setStagedFilters(filters);
        
        // Bạn có thể giữ lại stagedResultCount để nó cập nhật theo total
        setStagedResultCount(total);
        
        // Có thể loại bỏ setFirstLoad(true) ở đây nếu logic không cần
        setFirstLoad(true);
        
        // Dependency Array: Chạy lại mỗi khi các props này thay đổi
    }, [jobs, filters, total, totalPages, page, sort]);

    const handleStagedFilterChange = useCallback(async (updateFilters: Partial<SearchFilters>) => {
        const newFilter: SearchFilters = { ...stagedFilters, ...updateFilters };
        setStagedFilters(newFilter);
        const total = await countJobs(newFilter);
        console.log(newFilter)
        document.getElementById('filter-staged-count-badge')!.textContent = total.toString();
        setStagedResultCount(total);
    },[]);


    const handleApplyFilters = useCallback(() => {
        const query = new URLSearchParams();
        Object.entries(stagedFilters).forEach(([key, value]) => {
            const urlKey = keyMap[key] || key;
            if ((value || typeof value === 'boolean') && (!Array.isArray(value) || value.length > 0) && JSON.stringify(value) !== JSON.stringify(initialSearchFilters[key as keyof SearchFilters])) {
                if (key !== 'visa') {
                    if (Array.isArray(value)) {
                        if (key === 'specialConditions') {
                            value.forEach(item => {
                                const conditionSlug = allSpecialConditions.find(c => c.name === item)?.slug;
                                if (conditionSlug) {
                                    query.append(urlKey, conditionSlug);
                                }
                            });
                        } else {
                            value.forEach(item => query.append(urlKey, String(item)));
                        }
                    } else {
                        query.set(urlKey, String(value));
                    }
                }
            }
        });

        if (sortBy !== 'newest') {
            query.set(keyMap['sortBy'], sortOptionMap[sortBy]);
        }
        router.push(`/tim-viec-lam?${query.toString()}`);
    }, [stagedFilters]);
    const handleSortChange = useCallback((value: string) => {
        setSortBy(value);
        const query = new URLSearchParams(readOnlySearchParams.toString());
        if (value === 'newest') {
            query.delete(keyMap['sortBy']);
        } else {
            query.set(keyMap['sortBy'], sortOptionMap[value]);
        }
        query.delete('page');
        router.push(`/tim-viec-lam?${query.toString()}`);
    }, []);  // hoặc []

    const onPageChange = useCallback((page: number) => {
        const query = new URLSearchParams(readOnlySearchParams.toString());
        query.set('page', page.toString());
        router.push(`/tim-viec-lam?${query.toString()}`);
    }, []);

    const handleResetFilters = useCallback(() => {
        router.push(`/tim-viec-lam`);
    }, []);

    const handleNewSearch = useCallback((filters: Partial<SearchFilters>) => {
        const query = new URLSearchParams();
        query.set('chi-tiet-loai-hinh-visa', filters.visaDetail || '');
        query.set('nganh-nghe', filters.career || '');
        query.set('dia-diem', filters.workLocation?.join(',') || '');
        router.push(`/tim-viec-lam?${query.toString()}`);
        // Thực hiện logic tìm kiếm ở đây
    }, []);


    return (
        <div className="flex flex-col">
            {/* <JsonLdScript
                jobList={filteredJobs}
                pageMetadata={{ title: pageTitle, description: pageDescription }}
                appliedFilters={appliedFilters}
            /> */}
            <SearchModule
                onSearch={handleNewSearch}
                filters={stagedFilters}
                onFilterChange={handleStagedFilterChange}
            />
            <SearchResults
                jobs={filteredJobs}
                total={totalJobs}
                filters={stagedFilters}
                appliedFilters={appliedFilters}
                onFilterChange={handleStagedFilterChange}
                applyFilters={handleApplyFilters}
                resetFilters={handleResetFilters}
                resultCount={stagedResultCount}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                onPageChange={onPageChange}
                totalPage={totalPage}
                currentPage={currentPage}
                firstLoad={firstLoad}
            />
        </div>
    );
}
