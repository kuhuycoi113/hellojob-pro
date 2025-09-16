
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { type SearchFilters } from '@/components/job-search/search-results';
import { MainContent } from '@/components/home/main-content';
import { SearchModule } from '@/components/job-search/search-module';


export default function HomeClient() {
  const router = useRouter();
  
  const handleSearch = (filters: SearchFilters) => {
    const query = new URLSearchParams();
    if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set('visaDetail', filters.visaDetail);
    if (filters.industry && filters.industry !== 'all') query.set('industry', filters.industry);
    if (filters.location && filters.location !== 'all') query.set('location', filters.location);
    
    router.push(`/jobs?${query.toString()}`);
  };
  
  // Dummy filter state and handler for SearchModule on homepage
  const [homeFilters, setHomeFilters] = React.useState<SearchFilters>({
    visa: '', 
    visaDetail: '', 
    industry: '', 
    location: '', 
    interviewLocation: '',
  });

  const handleHomeFilterChange = (newFilters: Partial<SearchFilters>) => {
      setHomeFilters(prev => ({...prev, ...newFilters}));
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
        <SearchModule 
            onSearch={handleSearch} 
            filters={homeFilters} 
            onFilterChange={handleHomeFilterChange} 
            showHero={true} 
        />
        <div className="w-full flex-grow">
          <MainContent />
        </div>
    </div>
  );
}
