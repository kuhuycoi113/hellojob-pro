'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SearchModule } from '@/components/job-search/search-module';
import type { SearchFilters } from '@/components/job-search/search-results';
import { jobData, Job } from '@/lib/mock-data';
import { JobCarousel } from '@/components/job-carousel';
import { visaDetailsByVisaType } from '@/lib/visa-data';


export default function HomePage() {
  const router = useRouter();

  const handleSearch = (filters: Partial<SearchFilters>) => {
    const query = new URLSearchParams();

    if (filters.visaDetail && filters.visaDetail !== 'all') query.set('chi-tiet-loai-hinh-visa', filters.visaDetail);
    if (filters.industry && filters.industry !== 'all') query.set('nganh-nghe', filters.industry);
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
  
  const groupedJobs = React.useMemo(() => {
    const groups: { [key: string]: Job[] } = {};
    const visaDetailOrder = [
        'Đặc định đầu Nhật',
        'Đặc định đầu Việt',
        'Thực tập sinh 3 năm',
        'Kỹ sư, tri thức đầu Nhật',
        'Kỹ sư, tri thức đầu Việt',
        'Thực tập sinh 1 năm',
        'Thực tập sinh 3 Go',
        'Đặc định đi mới',
    ];

    visaDetailOrder.forEach(detail => {
        groups[detail] = [];
    });

    jobData.forEach(job => {
        if (job.visaDetail && groups[job.visaDetail]) {
            groups[job.visaDetail].push(job);
        }
    });

    // Filter out empty groups and return in the desired order
    return visaDetailOrder
        .map(detail => ({ title: detail, jobs: groups[detail].slice(0, 10) })) // Limit to 10 jobs per carousel
        .filter(group => group.jobs.length > 0);

  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen">
        <SearchModule 
            onSearch={handleSearch} 
            filters={homeFilters} 
            onFilterChange={handleHomeFilterChange} 
            showHero={true} 
        />
        <div className="w-full flex-grow container mx-auto px-4 md:px-6 py-8">
            {groupedJobs.map(group => (
                <JobCarousel 
                    key={group.title}
                    title={group.title}
                    jobs={group.jobs}
                    viewAllLink={`/tim-viec-lam?chi-tiet-loai-hinh-visa=${visaDetailsByVisaType[Object.keys(visaDetailsByVisaType).find(key => visaDetailsByVisaType[key].some(detail => detail.name === group.title)) as keyof typeof visaDetailsByVisaType]?.find(d => d.name === group.title)?.slug || ''}`}
                />
            ))}
        </div>
    </div>
  );
}
