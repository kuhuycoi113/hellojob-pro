
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters } from '@/components/job-search/search-results';
import { Job } from '@/lib/mock-data';
import { SearchModule } from '@/components/job-search/search-module';
import { allSpecialConditions } from '@/lib/visa-data';
import { countJobs, getJobs } from '@/actions/jobs-action';
import { generateJobFilter, initialSearchFilters, keyMap, sortOptionMap } from '@/lib/job-filter-util';

const DISPLAYED_JOBS_PER_PAGE = 30;
export default function JobSearchPageContent() {
    const router = useRouter();
    const readOnlySearchParams = useSearchParams();

    const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(initialSearchFilters);
    const [stagedFilters, setStagedFilters] = useState<SearchFilters>(initialSearchFilters);
    const [sortBy, setSortBy] = useState('newest');

    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [stagedResultCount, setStagedResultCount] = useState<number>(0);
    const [totalJobs, setTotalJobs] = useState<number | null>(null);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstLoad, setFirstLoad] = useState(false);
    const runFilter = useCallback(async (filtersToApply: SearchFilters, sortOption: string, page: number) => {
        const { docs: jobs, total, totalPages } = await getJobs(filtersToApply, sortOption, page, DISPLAYED_JOBS_PER_PAGE);
        setFilteredJobs(jobs);
        setTotalJobs(total);
        setTotalPage(totalPages);
        setFirstLoad(true);
    }, []);

    const countStagedResults = useCallback(async (filtersToCount: SearchFilters) => {
        const total = await countJobs(filtersToCount);
        document.getElementById('filter-staged-count-badge')!.textContent = total.toString();
        setStagedResultCount(total);
    }, []);

    useEffect(() => {
        const { newFilters, sortOption, page } = generateJobFilter(readOnlySearchParams);
        setCurrentPage(page);
        setSortBy(sortOption);
        setAppliedFilters(newFilters);
        setStagedFilters(newFilters);
        runFilter(newFilters, sortOption, page);
        console.log('Filters from URL:', newFilters);
    }, [readOnlySearchParams]);

    const handleStagedFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
        setStagedFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    useEffect(() => {
        countStagedResults(stagedFilters);
    }, [stagedFilters]);


    const handleApplyFilters = useCallback(() => {
        const query = new URLSearchParams();
        Object.entries(stagedFilters).forEach(([key, value]) => {
            const urlKey = keyMap[key] || key;
            if (value && (!Array.isArray(value) || value.length > 0) && JSON.stringify(value) !== JSON.stringify(initialSearchFilters[key as keyof SearchFilters])) {
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
    }, [stagedFilters, sortBy, router]);

    const handleSortChange = (value: string) => {
        setSortBy(value);
        const query = new URLSearchParams(readOnlySearchParams.toString());
        if (value === 'newest') {
            query.delete(keyMap['sortBy']);
        } else {
            query.set(keyMap['sortBy'], sortOptionMap[value]);
        }
        query.delete('page');
        router.push(`/tim-viec-lam?${query.toString()}`);
    };
    const onPageChange = (page: number) => {
        const query = new URLSearchParams(readOnlySearchParams.toString());
        query.set('page', page.toString());
        router.push(`/tim-viec-lam?${query.toString()}`);
    }

    const handleResetFilters = useCallback(() => {
        router.push(`/tim-viec-lam`);
    }, [router, runFilter, countStagedResults, readOnlySearchParams]);

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
