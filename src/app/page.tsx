
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MainContent } from '@/components/home/main-content';
import { SearchModule } from '@/components/job-search/search-module';
import type { SearchFilters } from '@/components/job-search/search-results';

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (filters: SearchFilters) => {
    const query = new URLSearchParams();
    if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set('visaDetail', filters.visaDetail);
    if (filters.industry && filters.industry !== 'all') query.set('industry', filters.industry);
    
    // Handle location which can be an array
    if (Array.isArray(filters.location)) {
        filters.location.forEach(loc => query.append('location', loc));
    } else if (filters.location && filters.location !== 'all') {
        query.append('location', filters.location);
    }
    
    router.push(`/jobs?${query.toString()}`);
  };

  // Dummy filter state and handler for SearchModule on homepage
  const [homeFilters, setHomeFilters] = React.useState<SearchFilters>({
    visa: '', 
    visaDetail: '', 
    industry: '', 
    location: [], 
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
