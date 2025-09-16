

'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults, type SearchFilters } from '@/components/job-search/search-results';
import { Job, jobData } from '@/lib/mock-data';
import { locations } from '@/lib/location-data';
import { Loader2 } from 'lucide-react';
import { SearchModule } from '@/components/job-search/search-module';


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
};

function JobsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

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
            
            let locationMatch = true;
            if (Array.isArray(location) && location.length > 0) {
                locationMatch = location.includes(job.workLocation);
            }
            
            const interviewLocationMatch = !interviewLocation || interviewLocation === 'all' || (job.interviewLocation && job.interviewLocation.toLowerCase().includes(interviewLocation.toLowerCase()));
            
            return visaMatch && industryMatch && locationMatch && jobDetailMatch && interviewLocationMatch;
        });

        setFilteredJobs(results);
    }, []);

    useEffect(() => {
        const newFilters: Partial<SearchFilters> = {};
        for (const [key, value] of searchParams.entries()) {
            if (key === 'location') {
                 // @ts-ignore
                newFilters[key] = value.split(',');
            } else {
                 // @ts-ignore
                newFilters[key] = value;
            }
        }
        const updatedFilters = {...initialSearchFilters, ...newFilters};
        setSearchFilters(updatedFilters);
        applyFilters(updatedFilters);
        
    }, [searchParams, applyFilters]);
    
    const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
      const updatedFilters = {...searchFilters, ...newFilters};
      setSearchFilters(updatedFilters);
       const query = new URLSearchParams();
        if (updatedFilters.visaDetail && updatedFilters.visaDetail !== 'all-details') query.set('visaDetail', updatedFilters.visaDetail);
        if (updatedFilters.industry && updatedFilters.industry !== 'all') query.set('industry', updatedFilters.industry);
        if (Array.isArray(updatedFilters.location) && updatedFilters.location.length > 0) {
            query.set('location', updatedFilters.location.join(','));
        }
       router.push(`/jobs?${query.toString()}`);

    }, [searchFilters, router]);
  
    const handleResetFilters = useCallback(() => {
        setSearchFilters(initialSearchFilters);
        router.push('/jobs');
    }, [router]);
    
    const handleNewSearch = (filters: SearchFilters) => {
        const query = new URLSearchParams();
        if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set('visaDetail', filters.visaDetail);
        if (filters.industry && filters.industry !== 'all') query.set('industry', filters.industry);
        if (Array.isArray(filters.location) && filters.location.length > 0) {
            query.set('location', filters.location.join(','));
        }
        router.push(`/jobs?${query.toString()}`);
    }

    return (
        <div className="flex flex-col">
            <SearchModule 
                onSearch={handleNewSearch} 
                filters={searchFilters} 
                onFilterChange={handleFilterChange} 
            />
            <SearchResults 
                jobs={filteredJobs} 
                filters={searchFilters} 
                onFilterChange={handleFilterChange} 
                applyFilters={() => applyFilters(searchFilters)} 
                resetFilters={handleResetFilters}
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
