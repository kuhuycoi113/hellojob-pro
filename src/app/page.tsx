

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MainContent } from '@/components/home/main-content';
import { SearchModule } from '@/components/job-search/search-module';
import type { SearchFilters } from '@/components/job-search/search-results';
import { recommendJobs } from '@/ai/flows/recommend-jobs-flow';
import { japanJobTypes } from '@/lib/visa-data';
import { allIndustries } from '@/lib/industry-data';
import { allJapanLocations } from '@/lib/location-data';


export default function HomePage() {
  const router = useRouter();

  const handleSearch = async (filters: Partial<SearchFilters>) => {
    const query = new URLSearchParams();

    if (filters.q) {
        const criteria = await recommendJobs(filters.q);
        if (criteria?.industry) {
            const industrySlug = allIndustries.find(i => i.name === criteria.industry)?.slug;
            if (industrySlug) query.set('nganh-nghe', industrySlug);
        }
        if (criteria?.workLocation) {
             const locationSlug = allJapanLocations.find(l => l.name === criteria.workLocation)?.slug;
             if(locationSlug) query.set('dia-diem', locationSlug);
        }
        if (criteria?.visaType) {
            const visaSlug = japanJobTypes.find(v => v.name === criteria.visaType)?.slug;
            if(visaSlug) query.set('loai-visa', visaSlug);
        }
        if (criteria?.gender) {
            query.set('gioi-tinh', criteria.gender.toLowerCase() === 'nam' ? 'nam' : 'nu');
        }
        if (criteria?.sortBy) {
            query.set('sap-xep', 'salary_desc');
        }

        // If there's a text query but AI returns no specific criteria, pass the raw query for keyword matching.
        if (!criteria?.industry && !criteria?.workLocation && !criteria?.visaType && !criteria.gender && !criteria.sortBy) {
             query.set('q', filters.q);
        }

    } else {
        if (filters.visaDetail && filters.visaDetail !== 'all') query.set('chi-tiet-loai-hinh-visa', filters.visaDetail);
        if (filters.industry && filters.industry !== 'all') query.set('nganh-nghe', filters.industry);
        if (Array.isArray(filters.location) && filters.location.length > 0 && !filters.location.includes('all')) {
            filters.location.forEach(loc => query.append('dia-diem', loc));
        } else if (typeof filters.location === 'string' && filters.location && filters.location !== 'all') {
            query.append('dia-diem', filters.location);
        }
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
