
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters } from '@/components/job-search/search-results';
import { Job } from '@/lib/mock-data';
import { SearchModule } from '@/components/job-search/search-module';
import { allSpecialConditions } from '@/lib/visa-data';
import { countJobs, getJobs } from '@/actions/jobs-action';
import { generateJobFilter, initialSearchFilters, keyMap, sortOptionMap } from '@/lib/job-filter-util';




// Helper function to escape regex special characters
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const createSlug = (str: string) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-.]+/g, '');
};


const parseSalary = (salaryStr?: string): number | null => {
    if (!salaryStr) return null;
    const numericStr = String(salaryStr).replace(/[^0-9]/g, '');
    const value = parseInt(numericStr, 10);
    return isNaN(value) ? null : value;
};

const parseExperienceToRange = (expStr?: string): [number, number] => {
    if (!expStr || expStr === 'Không yêu cầu') return [0, Infinity];

    const cleanedStr = expStr.toLowerCase().replace(',', '.');

    if (cleanedStr.startsWith('dưới')) {
        const val = parseFloat(cleanedStr.replace(/[^0-9.]/g, ''));
        return [0, val];
    }
    if (cleanedStr.startsWith('trên')) {
        const val = parseFloat(cleanedStr.replace(/[^0-9.]/g, ''));
        return [val, Infinity];
    }
    const parts = cleanedStr.split('-').map(p => parseFloat(p.trim().replace(/[^0-9.]/g, '')));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
    }
    return [0, Infinity]; // Default fallback
};

const parseAgeRequirement = (ageStr?: string): [number, number] | null => {
    if (!ageStr) return null;
    const parts = ageStr.split('-').map(p => parseInt(p.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
    }
    return null;
};

const parsePhysicalRequirement = (reqStr?: string): [number, number] => {
    if (!reqStr) return [0, Infinity];
    const cleanedStr = reqStr.toLowerCase();
    const numbers = cleanedStr.match(/\d+/g)?.map(Number) || [];

    if (cleanedStr.includes('trên')) {
        return [numbers[0] || 0, Infinity];
    }
    if (cleanedStr.includes('dưới')) {
        return [0, numbers[0] || Infinity];
    }
    if (numbers.length === 2) {
        return [numbers[0], numbers[1]];
    }
    if (numbers.length === 1) {
        return [numbers[0], numbers[0]]; // Exact match
    }

    return [0, Infinity];
};

export default function JobSearchPageContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const router = useRouter();
    const readOnlySearchParams = useSearchParams();

    const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(initialSearchFilters);
    const [stagedFilters, setStagedFilters] = useState<SearchFilters>(initialSearchFilters);
    const [sortBy, setSortBy] = useState('newest');

    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [stagedResultCount, setStagedResultCount] = useState<number>(0);
    const [pageTitle, setPageTitle] = useState("Tìm kiếm việc làm tại Nhật Bản");
    const [pageDescription, setPageDescription] = useState("Tìm kiếm hàng ngàn cơ hội việc làm tại Nhật Bản.");
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const loadedPages = [1];

    const runFilter = useCallback(async (filtersToApply: SearchFilters, sortOption: string, page: number) => {
        const { docs: jobs, total, totalPages } = await getJobs(filtersToApply, page, 20);
        setFilteredJobs(jobs);
        setTotalJobs(total);
        setTotalPage(totalPages);
    }, []);

    const countStagedResults = useCallback(async (filtersToCount: SearchFilters) => {
        const total = await countJobs(filtersToCount);
        document.getElementById('filter-staged-count-badge')!.textContent = total.toString();
        setStagedResultCount(total);
    }, []);

    useEffect(() => {
        const { newFilters, sortOption } = generateJobFilter(readOnlySearchParams);
        setCurrentPage(1);
        loadedPages.splice(0, loadedPages.length, 1);
        setSortBy(sortOption);
        setAppliedFilters(newFilters);
        setStagedFilters(newFilters);
        runFilter(newFilters, sortOption, 1);
        console.log('Filters from URL:', newFilters);
    }, [readOnlySearchParams, runFilter, countStagedResults]);

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
        router.push(`/tim-viec-lam?${query.toString()}`);
    };

    const loadMoreJobs = useCallback(async () => {
        const nextPage = loadedPages[loadedPages.length - 1] + 1;
        const { newFilters } = generateJobFilter(readOnlySearchParams);
        const { docs: jobs } = await getJobs(newFilters, nextPage, 20);
        setFilteredJobs(prevJobs => [...prevJobs, ...jobs]);
        setCurrentPage(nextPage);
        loadedPages.push(nextPage);
    }, [appliedFilters]);

    const handleResetFilters = useCallback(() => {
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
                loadMoreJobs={loadMoreJobs}
                totalPage={totalPage}
                currentPage={currentPage}
            />
        </div>
    );
}
