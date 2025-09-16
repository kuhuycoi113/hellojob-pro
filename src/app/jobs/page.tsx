
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters } from '@/components/job-search/search-results';
import { Job, jobData } from '@/lib/mock-data';
import { locations } from '@/lib/location-data';
import { Loader2 } from 'lucide-react';
import { MainContent } from '@/components/home/main-content';


const initialSearchFilters: SearchFilters = {
    visa: '', 
    visaDetail: '', 
    industry: '', 
    location: '', 
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
};

function JobsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isSearching, setIsSearching] = useState(false);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialSearchFilters);

    const applyFilters = useCallback((currentFilters: SearchFilters) => {
        const { 
            visa, visaDetail, industry, location, jobDetail, interviewLocation, 
        } = currentFilters;
        
        let results = jobData.filter(job => {
            let visaMatch = true;
            if (visaDetail && visaDetail !== 'all-details') {
                visaMatch = job.visaDetail === visaDetail;
            } else if (visa && visa !== 'all') {
                visaMatch = job.visaType === visa;
            }

            const industryMatch = !industry || industry === 'all' || (job.industry && job.industry.toLowerCase().includes(industry.toLowerCase()));
            
            const jobDetailMatch = !jobDetail || jobDetail === 'all-details' || (job.title && job.title.toLowerCase().includes(jobDetail.toLowerCase())) || (job.details.description && job.details.description.toLowerCase().includes(jobDetail.toLowerCase()));
            
            let locationMatch = false;
            if (!location || location === 'all') {
                locationMatch = true;
            } else {
                const isRegion = Object.keys(locations['Nhật Bản']).includes(location);
                if (isRegion) {
                    const regionPrefectures = locations['Nhật Bản'][location as keyof typeof locations['Nhật Bản']];
                    locationMatch = regionPrefectures.some(prefecture => job.workLocation.toLowerCase().includes(prefecture.toLowerCase()));
                } else {
                    locationMatch = job.workLocation && job.workLocation.toLowerCase().includes(location.toLowerCase());
                }
            }
            
            const interviewLocationMatch = !interviewLocation || interviewLocation === 'all' || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocation.toLowerCase()));
            
            return visaMatch && industryMatch && locationMatch && jobDetailMatch && interviewLocationMatch;
        });

        setFilteredJobs(results);
    }, []);

    useEffect(() => {
        const hasSearchParams = Array.from(searchParams.keys()).length > 0;
        setIsSearching(hasSearchParams);

        if (hasSearchParams) {
            const newFilters: Partial<SearchFilters> = {};
            for (const [key, value] of searchParams.entries()) {
                // @ts-ignore
                newFilters[key] = value;
            }
            const updatedFilters = {...initialSearchFilters, ...newFilters};
            setSearchFilters(updatedFilters);
            applyFilters(updatedFilters);
        } else {
            // If no search params, show all jobs
            setFilteredJobs(jobData);
        }
    }, [searchParams, applyFilters]);
    
    const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
      const updatedFilters = {...searchFilters, ...newFilters};
      setSearchFilters(updatedFilters);
       const query = new URLSearchParams();
        if (updatedFilters.visaDetail && updatedFilters.visaDetail !== 'all-details') query.set('visaDetail', updatedFilters.visaDetail);
        if (updatedFilters.industry && updatedFilters.industry !== 'all') query.set('industry', updatedFilters.industry);
        if (updatedFilters.location && updatedFilters.location !== 'all') query.set('location', updatedFilters.location);
       router.push(`/jobs?${query.toString()}`);

    }, [searchFilters, router]);
  
  const handleResetFilters = useCallback(() => {
    setSearchFilters(initialSearchFilters);
    router.push('/jobs');
  }, [router]);

    return (
        <SearchResults 
            jobs={filteredJobs} 
            filters={searchFilters} 
            onFilterChange={handleFilterChange} 
            applyFilters={() => applyFilters(searchFilters)} 
            resetFilters={handleResetFilters}
        />
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
