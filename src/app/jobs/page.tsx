

'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Job, jobData } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';
import { SearchModule } from '@/components/job-search/search-module';
import type { SearchFilters } from '@/components/job-search/search-results';
import { JobCard } from '@/components/job-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth-dialog';
import { Briefcase, LogIn } from 'lucide-react';

function JobsPageContent() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [initialFilters, setInitialFilters] = useState<SearchFilters>({
        visa: '',
        visaDetail: '',
        industry: '',
        location: [],
        interviewLocation: '',
    });

    const handleSearch = (filters: SearchFilters) => {
        const query = new URLSearchParams();
        if (filters.visaDetail && filters.visaDetail !== 'all-details') query.set('chi-tiet-loai-hinh-visa', filters.visaDetail);
        if (filters.industry && filters.industry !== 'all') query.set('nganh-nghe', filters.industry);
        if (Array.isArray(filters.location) && filters.location.length > 0 && !filters.location.includes('all')) {
            filters.location.forEach(loc => query.append('dia-diem', loc));
        } else if (typeof filters.location === 'string' && filters.location && filters.location !== 'all') {
            query.append('dia-diem', filters.location);
        }
        router.push(`/tim-viec-lam?${query.toString()}`);
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

    const CTAForGuest = ({ title }: { title: string }) => (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold font-headline">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8">
                     <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Briefcase className="h-10 w-10 text-primary"/>
                    </div>
                    <p className="font-semibold text-lg">Xem gợi ý việc làm dành riêng cho bạn</p>
                    <p className="text-muted-foreground mt-2 mb-6">Đăng nhập hoặc tạo hồ sơ để nhận được những gợi ý phù hợp nhất từ HelloJob AI.</p>
                    <Button onClick={() => setIsAuthDialogOpen(true)}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Đăng nhập / Đăng ký
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <>
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

                            const isProfileSuggestionModule = title === 'Gợi ý cho bạn';

                            if (isProfileSuggestionModule && !isLoggedIn) {
                                return <CTAForGuest key={title} title={title} />;
                            }
                            
                            const visaDetailSlug = title.toLowerCase().replace(/ /g, '-');
                            let link = `/tim-viec-lam?chi-tiet-loai-hinh-visa=${encodeURIComponent(visaDetailSlug)}`;
                            if (title === 'Việc làm lương cao') {
                                link = '/tim-viec-lam?sap-xep=salary_desc';
                            } else if (title === 'Việc làm phí thấp') {
                                link = '/tim-viec-lam?sap-xep=fee_asc';
                            } else if (isProfileSuggestionModule || title === 'Có thể bạn quan tâm') {
                                link = '/viec-lam-cua-toi';
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
            <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </>
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
