
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters } from '@/components/job-search/search-results';
import { Job } from '@/lib/mock-data';
import { SearchModule } from '@/components/job-search/search-module';
import { allSpecialConditions, japanJobTypes } from '@/lib/visa-data';
import { countJobs } from '@/actions/jobs-action';
import { initialSearchFilters, keyMap, sortOptionMap } from '@/lib/job-filter-util';
import { useAuth } from '@/contexts/AuthContext';

export default function JobSearchPageContent({ jobs = [], filters, total, totalPages = 0, page = 1, sort = 'newest' }: { jobs?: Job[], filters: SearchFilters, total: number, totalPages?: number, page?: number, sort?: string }) {
    const router = useRouter();
    const readOnlySearchParams = useSearchParams();
    const { role, postLoginAction, clearPostLoginAction } = useAuth();
    if (role === 'admin') {
        initialSearchFilters.hasForm = true;
    }
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
        document.getElementById('filter-staged-count-badge')!.textContent = total.toString();
        setStagedResultCount(total);
    }, [stagedFilters]);


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
    }, [stagedFilters]);

    const handleResetFilters = useCallback(() => {
        router.push(`/tim-viec-lam`);
    }, []);

    const handleNewSearch = useCallback((filters: Partial<SearchFilters>) => {
        const query = new URLSearchParams();
        if (!!filters.visaDetail && filters.visaDetail != '' && filters.visaDetail != 'all') {
            query.set('chi-tiet-loai-hinh-visa', filters.visaDetail || '');
        }
        if (!!filters.career && filters.career != '' && filters.career != 'all') {
            query.set('nganh-nghe', filters.career || '');
        }
        if (!!filters.workLocation && !!filters.workLocation?.length) {
            filters.workLocation.forEach(loc => {
                if (!!loc?.length) {
                    query.append('dia-diem', loc || '');
                }
            })
        }
        router.push(`/tim-viec-lam?${query.toString()}`);
        // Thực hiện logic tìm kiếm ở đây
    }, []);

    useEffect(() => {
        switch (postLoginAction?.type) {
            case 'EDITED_JOB': {
                const editedJob = postLoginAction.data;
                const jobID = editedJob.id;
                const jobIndex = jobs.findIndex(job => job.id === jobID);
                if (jobIndex > -1) {
                    jobs[jobIndex] = { ...jobs[jobIndex], ...editedJob };
                }
                clearPostLoginAction();
                break;
            }
            case 'CLOSED_JOB': {
                const { id: jobID } = postLoginAction.data;
                const jobIndex = jobs.findIndex(job => job.id === jobID);
                if (jobIndex > -1) {
                    jobs = jobs.splice(jobIndex, 1);
                    // jobs = [...jobs.filter(item => item.id !== jobID)];
                }
                clearPostLoginAction();
                break;
            }
        }
    }, [postLoginAction])
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
