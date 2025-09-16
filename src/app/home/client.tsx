
'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { type SearchFilters } from '@/components/job-search/search-results';
import { MainContent } from '@/components/home/main-content';
import { SearchModule } from '@/components/job-search/search-module';


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

export default function HomeClient() {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialSearchFilters);

  const handleSearch = (filters: SearchFilters) => {
    const query = new URLSearchParams();
    if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set('visaDetail', filters.visaDetail);
    if (filters.industry && filters.industry !== 'all') query.set('industry', filters.industry);
    if (filters.location && filters.location !== 'all') query.set('location', filters.location);
    
    // If no filters are selected, navigate to /jobs to show all jobs
    router.push(`/jobs?${query.toString()}`);
  };
  
  const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
      const updatedFilters = {...searchFilters, ...newFilters};
      setSearchFilters(updatedFilters);
  }, [searchFilters]);


  return (
    <div className="flex flex-col items-center min-h-screen">
        <SearchModule onSearch={handleSearch} filters={searchFilters} onFilterChange={handleFilterChange} showHero={true} />
        <div className="w-full flex-grow">
          <MainContent />
        </div>
    </div>
  );
}
