

'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters } from '@/components/job-search/search-results';
import { Job, jobData } from '@/lib/mock-data';
import { allJapanLocations, japanRegions, interviewLocations } from '@/lib/location-data';
import { Loader2 } from 'lucide-react';
import { SearchModule } from '@/components/job-search/search-module';
import { industriesByJobType } from '@/lib/industry-data';
import { visaDetailsByVisaType } from '@/lib/visa-data';


const initialSearchFilters: SearchFilters = {
    visa: '', 
    visaDetail: '', 
    industry: '', 
    location: [], 
    interviewLocation: '', 
    jobDetail: '',
    height: [135, 210],
    weight: [35, 120],
    age: [18, 70],
    basicSalary: '',
    netSalary: '',
    hourlySalary: '',
    annualIncome: '',
    annualBonus: '',
    specialConditions: [],
    languageRequirement: '',
    educationRequirement: '',
    yearsOfExperience: '',
    tattooRequirement: '',
    hepatitisBRequirement: '',
    quantity: '',
};

// Helper function to escape regex special characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


function JobsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // `appliedFilters` are the filters currently reflected in the displayed job list.
    const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(initialSearchFilters);
    // `stagedFilters` are the filters the user is currently selecting in the sidebar, before clicking "Apply".
    const [stagedFilters, setStagedFilters] = useState<SearchFilters>(initialSearchFilters);
    
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [stagedResultCount, setStagedResultCount] = useState<number>(jobData.length);
    
    // This function applies filters and updates the displayed job list.
    // It is now only called when the user clicks "Apply" or on initial page load.
    const runFilter = useCallback((filtersToApply: SearchFilters) => {
        const { 
            visa, visaDetail, industry, location, jobDetail, interviewLocation, quantity, netFee
        } = filtersToApply;
        
        const visaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name || visaDetail;
        const industryName = Object.values(industriesByJobType).flat().find(i => i.slug === industry)?.name || industry;
        const jobDetailName = Object.values(industriesByJobType).flat().flatMap(i => i.keywords).find(k => k.slug === jobDetail)?.name || jobDetail;
        const feeLimit = netFee ? parseInt(netFee.replace(/[^0-9]/g, '')) : null;
        
        const allInterviewLocations = [...interviewLocations['Việt Nam'], ...interviewLocations['Nhật Bản']];
        const interviewLocationName = allInterviewLocations.find(l => l.slug === interviewLocation)?.name;


        let results = jobData.filter(job => {
            let visaMatch = true;
            if (visaDetail && visaDetail !== 'all-details') {
                const targetVisaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name;
                visaMatch = job.visaDetail === targetVisaName;
            } else if (visa && visa !== 'all') {
                const targetVisaType = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visa)?.name;
                visaMatch = job.visaType === targetVisaType;
            }

            const industryMatch = !industry || industry === 'all' || (job.industry && job.industry.toLowerCase().includes(industryName.toLowerCase()));
            
            const jobDetailRegex = jobDetailName ? new RegExp(`\\b${escapeRegExp(jobDetailName)}\\b`, 'i') : null;
            const jobDetailMatch = !jobDetailRegex || (job.title && jobDetailRegex.test(job.title)) || (job.details.description && jobDetailRegex.test(job.details.description));
            
            let locationMatch = true;
            if (Array.isArray(location) && location.length > 0 && !location.includes('all')) {
                locationMatch = location.some(locSlug => {
                    const region = japanRegions.find(r => r.slug === locSlug);
                    if (region) {
                        // It's a region slug, check if job location is in any of its prefectures
                        return region.prefectures.some(p => job.workLocation.toLowerCase().includes(p.name.toLowerCase()));
                    }
                    // It's a prefecture slug, find its name and compare
                    const locationName = allJapanLocations.find(l => l.slug === locSlug)?.name;
                    return locationName ? job.workLocation && job.workLocation.toLowerCase().includes(locationName.toLowerCase()) : false;
                });
            }
            
            const interviewLocationMatch = !interviewLocationName || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocationName.toLowerCase()));

            const quantityMatch = !quantity || job.quantity >= parseInt(quantity, 10);

            const feeMatch = feeLimit === null || !job.netFee || parseInt(job.netFee.replace(/[^0-9]/g, '')) <= feeLimit;
            
            return visaMatch && industryMatch && locationMatch && jobDetailMatch && interviewLocationMatch && quantityMatch && feeMatch;
        });

        setFilteredJobs(results);
    }, []);

    // This function ONLY counts the results based on staged filters without updating the UI.
    const countStagedResults = useCallback((filtersToCount: SearchFilters) => {
        const { visa, visaDetail, industry, location, jobDetail, interviewLocation, quantity, netFee } = filtersToCount;
        
        const visaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name || visaDetail;
        const industryName = Object.values(industriesByJobType).flat().find(i => i.slug === industry)?.name || industry;
        const jobDetailName = Object.values(industriesByJobType).flat().flatMap(i => i.keywords).find(k => k.slug === jobDetail)?.name || jobDetail;
        const feeLimit = netFee ? parseInt(netFee.replace(/[^0-9]/g, '')) : null;
        
        const allInterviewLocations = [...interviewLocations['Việt Nam'], ...interviewLocations['Nhật Bản']];
        const interviewLocationName = allInterviewLocations.find(l => l.slug === interviewLocation)?.name;
        
        const count = jobData.filter(job => {
            let visaMatch = true;
            if (visaDetail && visaDetail !== 'all-details') {
                const targetVisaName = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visaDetail)?.name;
                visaMatch = job.visaDetail === targetVisaName;
            } else if (visa && visa !== 'all') {
                 const targetVisaType = Object.values(visaDetailsByVisaType).flat().find(v => v.slug === visa)?.name;
                visaMatch = job.visaType === targetVisaType;
            }
            const industryMatch = !industry || industry === 'all' || (job.industry && job.industry.toLowerCase().includes(industryName.toLowerCase()));

            const jobDetailRegex = jobDetailName ? new RegExp(`\\b${escapeRegExp(jobDetailName)}\\b`, 'i') : null;
            const jobDetailMatch = !jobDetailRegex || (job.title && jobDetailRegex.test(job.title)) || (job.details.description && jobDetailRegex.test(job.details.description));
            
             let locationMatch = true;
            if (Array.isArray(location) && location.length > 0 && !location.includes('all')) {
                 locationMatch = location.some(locSlug => {
                    const region = japanRegions.find(r => r.slug === locSlug);
                    if (region) {
                        return region.prefectures.some(p => job.workLocation.toLowerCase().includes(p.name.toLowerCase()));
                    }
                    const locationName = allJapanLocations.find(l => l.slug === locSlug)?.name;
                    return locationName ? job.workLocation && job.workLocation.toLowerCase().includes(locationName.toLowerCase()) : false;
                });
            }
            const interviewLocationMatch = !interviewLocationName || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocationName.toLowerCase()));
            const quantityMatch = !quantity || job.quantity >= parseInt(quantity, 10);
            const feeMatch = feeLimit === null || !job.netFee || parseInt(job.netFee.replace(/[^0-9]/g, '')) <= feeLimit;
            return visaMatch && industryMatch && locationMatch && jobDetailMatch && interviewLocationMatch && quantityMatch && feeMatch;
        }).length;
        setStagedResultCount(count);
    }, []);

    // Effect for initial load and URL changes
    useEffect(() => {
        const newFilters: SearchFilters = { ...initialSearchFilters };
        for (const [key, value] of searchParams.entries()) {
            if (key === 'location') {
                 if (!Array.isArray(newFilters.location)) {
                    newFilters.location = [];
                }
                newFilters.location = searchParams.getAll(key);
            } else if (Array.isArray(newFilters[key as keyof SearchFilters])) {
                // If the key corresponds to an array in filters, use getAll
                (newFilters[key as keyof SearchFilters] as any) = searchParams.getAll(key);
            } else {
                 // @ts-ignore
                newFilters[key] = value;
            }
        }
        setAppliedFilters(newFilters);
        setStagedFilters(newFilters); // Sync staged with applied on load
        runFilter(newFilters);
        countStagedResults(newFilters); // Count results for initial load
        
    }, [searchParams, runFilter, countStagedResults]);
    
    // Handler for changes in the filter sidebar. It updates the staged filters and recounts.
    const handleStagedFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
      setStagedFilters(prev => {
          const updated = {...prev, ...newFilters};
          countStagedResults(updated);
          return updated;
      });
    }, [countStagedResults]);

    // Handler for the "Apply" button. It updates the URL and applied filters.
    const handleApplyFilters = useCallback(() => {
        const query = new URLSearchParams();
        Object.entries(stagedFilters).forEach(([key, value]) => {
            if (value && (!Array.isArray(value) || value.length > 0) && JSON.stringify(value) !== JSON.stringify(initialSearchFilters[key as keyof SearchFilters])) {
                 if (key !== 'visa' && !(Array.isArray(value) && value.includes('all'))) {
                    if (Array.isArray(value)) {
                        value.forEach(item => query.append(key, item));
                    } else {
                        query.set(key, String(value));
                    }
                 }
            }
        });
        router.push(`/jobs?${query.toString()}`);
    }, [stagedFilters, router]);
  
    // Handler for resetting filters.
    const handleResetFilters = useCallback(() => {
        setStagedFilters(initialSearchFilters);
        countStagedResults(initialSearchFilters);
        if (searchParams.toString() !== '') {
            router.push('/jobs');
        } else {
             runFilter(initialSearchFilters);
        }
    }, [router, runFilter, countStagedResults, searchParams]);
    
    // Handler for new searches initiated from the SearchModule (e.g., on the homepage)
    const handleNewSearch = (filters: SearchFilters) => {
        const query = new URLSearchParams();
        // This is simplified, can be expanded to include all filters from home search
        if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set('visaDetail', filters.visaDetail);
        if (filters.industry && filters.industry !== 'all') query.set('industry', filters.industry);
        if (Array.isArray(filters.location) && filters.location.length > 0 && !filters.location.includes('all')) {
            filters.location.forEach(loc => query.append('location', loc));
        } else if (typeof filters.location === 'string' && filters.location && filters.location !== 'all') {
            query.append('location', filters.location);
        }
        router.push(`/jobs?${query.toString()}`);
    }

    return (
        <div className="flex flex-col">
            <SearchModule 
                onSearch={handleNewSearch} 
                filters={stagedFilters} // SearchModule always reflects the latest user interaction
                onFilterChange={handleStagedFilterChange} 
            />
            <SearchResults 
                jobs={filteredJobs} 
                filters={stagedFilters} // Pass staged filters to the sidebar
                onFilterChange={handleStagedFilterChange} 
                applyFilters={handleApplyFilters} 
                resetFilters={handleResetFilters}
                resultCount={stagedResultCount}
            />
        </div>
    );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-secondary">
            <Loader2 className="h-16 w-16 animate-spin text-primary"/>
        </div>
    }>
        <JobsPageContent />
    </Suspense>
  );
}

