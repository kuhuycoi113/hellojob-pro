

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
    
    const parseSalary = (salaryStr?: string): number => {
        if (!salaryStr) return 0;
        const numericStr = salaryStr.replace(/,/g, '').toLowerCase();
        return parseInt(numericStr, 10) || 0;
    };
    
    const parseFee = (feeStr?: string): number => {
        if (!feeStr || feeStr.toLowerCase() === 'miễn phí') return 0;
        // Simple parsing, assuming millions in VND if 'tr' is present
        if (feeStr.toLowerCase().includes('tr')) {
            return parseFloat(feeStr.replace(/[^0-9.]/g, '')) * 1000000;
        }
        // Assuming it's yen if no 'tr'
        return parseInt(feeStr.replace(/[^0-9]/g, ''), 10) || Infinity;
    }

    const jobGroups = {
        'Đặc định đầu Nhật': jobData.filter(j => j.visaDetail === 'Đặc định đầu Nhật').slice(0, 8),
        'Đặc định đầu Việt': jobData.filter(j => j.visaDetail === 'Đặc định đầu Việt').slice(0, 8),
        'Thực tập sinh 3 năm': jobData.filter(j => j.visaDetail === 'Thực tập sinh 3 năm').slice(0, 8),
        'Kỹ sư, tri thức đầu Nhật': jobData.filter(j => j.visaDetail === 'Kỹ sư, tri thức đầu Nhật').slice(0, 8),
        'Kỹ sư, tri thức đầu Việt': jobData.filter(j => j.visaDetail === 'Kỹ sư, tri thức đầu Việt').slice(0, 8),
        'Đặc định đi mới': jobData.filter(j => j.visaDetail === 'Đặc định đi mới').slice(0, 8),
        'Thực tập sinh 1 năm': jobData.filter(j => j.visaDetail === 'Thực tập sinh 1 năm').slice(0, 8),
        'Thực tập sinh 3 Go': jobData.filter(j => j.visaDetail === 'Thực tập sinh 3 Go').slice(0, 8),
        'Việc làm lương cao': [...jobData].sort((a, b) => parseSalary(b.salary.basic) - parseSalary(a.salary.basic)).slice(0, 8),
        'Việc làm phí thấp': [...jobData].sort((a,b) => parseFee(a.netFee) - parseFee(b.netFee)).slice(0, 8),
        'Có thể bạn quan tâm': jobData.slice(8, 16), // Placeholder, replace with actual logic
        'Gợi ý cho bạn': jobData.slice(16, 24), // Placeholder, replace with actual logic
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
                    {Object.entries(jobGroups).map(([title, jobs]) => {
                        if (jobs.length === 0) return null;
                        const visaDetailSlug = title.toLowerCase().replace(/ /g, '-');
                        let link = `/job-search?visaDetail=${encodeURIComponent(visaDetailSlug)}`;
                        if (title === 'Việc làm lương cao') {
                            link = '/job-search?sortBy=salary_desc';
                        } else if (title === 'Việc làm phí thấp') {
                             link = '/job-search?sortBy=fee_asc';
                        } else if (title === 'Có thể bạn quan tâm' || title === 'Gợi ý cho bạn') {
                            link = '/my-jobs';
                        }

                        return (
                            <section key={title}>
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-2xl font-bold font-headline">{title}</CardTitle>
                                            <Button asChild variant="link">
                                                <Link href={link}>Xem tất cả</Link>
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
                        )
                    })}
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
