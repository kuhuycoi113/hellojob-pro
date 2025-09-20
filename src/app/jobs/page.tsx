

'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Job, jobData } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';
import { SearchModule } from '@/components/job-search/search-module';
import type { SearchFilters } from '@/components/job-search/search-results';
import { JobCard } from '@/components/job-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function JobsPageContent() {
    const router = useRouter();
    const [initialFilters, setInitialFilters] = useState<SearchFilters>({
        visa: '',
        visaDetail: '',
        industry: '',
        location: [],
        interviewLocation: '',
    });

    const handleSearch = (filters: SearchFilters) => {
        const query = new URLSearchParams();
        if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set('visaDetail', filters.visaDetail);
        if (filters.industry && filters.industry !== 'all') query.set('industry', filters.industry);
        if (Array.isArray(filters.location) && filters.location.length > 0 && !filters.location.includes('all')) {
            filters.location.forEach(loc => query.append('location', loc));
        } else if (typeof filters.location === 'string' && filters.location && filters.location !== 'all') {
            query.append('location', filters.location);
        }
        router.push(`/job-search?${query.toString()}`);
    };

    const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
        setInitialFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const jobGroups = {
        'Đặc định đầu Nhật': jobData.filter(j => j.visaDetail === 'Đặc định đầu Nhật').slice(0, 8),
        'Đặc định đầu Việt': jobData.filter(j => j.visaDetail === 'Đặc định đầu Việt').slice(0, 8),
        'Việc làm lương cao': [...jobData].sort((a, b) => parseInt(b.salary.basic.replace(/,/g, '')) - parseInt(a.salary.basic.replace(/,/g, ''))).slice(0, 8),
    };

    return (
        <div className="flex flex-col">
            <SearchModule 
                onSearch={handleSearch} 
                filters={initialFilters}
                onFilterChange={handleFilterChange}
            />
            <div className="w-full bg-secondary">
                <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
                    {Object.entries(jobGroups).map(([title, jobs]) => (
                        <section key={title}>
                             <Card className="shadow-lg">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-2xl font-bold font-headline">{title}</CardTitle>
                                        <Button asChild variant="link">
                                            <Link href={`/job-search?visaDetail=${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}`}>Xem tất cả</Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {jobs.map(job => (
                                            <JobCard key={job.id} job={job} variant="grid-item" showApplyButtons={true} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    ))}
                </div>
            </div>
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
