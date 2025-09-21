

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MainContent } from '@/components/home/main-content';
import { SearchModule } from '@/components/job-search/search-module';
import type { SearchFilters } from '@/components/job-search/search-results';

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (filters: Partial<SearchFilters>) => {
    const query = new URLSearchParams();
    if (filters.q) query.set('q', filters.q);
    if (filters.visaDetail && filters.visaDetail !== 'all') query.set('chi-tiet-loai-hinh-visa', filters.visaDetail);
    if (filters.industry && filters.industry !== 'all') query.set('nganh-nghe', filters.industry);
    
    // Handle location which can be an array
    if (Array.isArray(filters.location) && filters.location.length > 0 && !filters.location.includes('all')) {
        filters.location.forEach(loc => query.append('dia-diem', loc));
    } else if (typeof filters.location === 'string' && filters.location && filters.location !== 'all') {
        query.append('dia-diem', filters.location);
    }
    
    router.push(`/tim-viec-lam?${query.toString()}`);
  };

  const [homeFilters, setHomeFilters] = React.useState<Partial<SearchFilters>>({
    q: '',
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
