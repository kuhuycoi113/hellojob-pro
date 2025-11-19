
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MainContent } from '@/components/home/main-content';
import { SearchModule } from '@/components/job-search/search-module';
import type { SearchFilters } from '@/components/job-search/search-results';


export default function HomeClient() {
  const router = useRouter();

  const handleSearch = (filters: Partial<SearchFilters>) => {
    const query = new URLSearchParams();

    if (filters.visaDetail && filters.visaDetail !== 'all') query.set('chi-tiet-loai-hinh-visa', filters.visaDetail);
    if (filters.career && filters.career !== 'all') query.set('nganh-nghe', filters.career);
    if (Array.isArray(filters.workLocation) && filters.workLocation.length > 0 && !filters.workLocation.includes('all')) {
      filters.workLocation.forEach(loc => query.append('dia-diem', loc));
    } else if (typeof filters.workLocation === 'string' && filters.workLocation && filters.workLocation !== 'all') {
      query.append('dia-diem', filters.workLocation);
    }

    router.push(`/tim-viec-lam?${query.toString()}`);
  };

  const [homeFilters, setHomeFilters] = React.useState<Partial<SearchFilters>>({
    q: '',
    visa: '',
    visaDetail: 'all',
    workLocation: [],
    career: '',
  });

  const handleHomeFilterChange = (newFilters: Partial<SearchFilters>) => {
    setHomeFilters(prev => ({ ...prev, ...newFilters }));
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
