'use client';
import { JobCard } from '@/components/job-card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, stringifyObject } from '@/lib/utils';
import { Loader2, Pencil, Star } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { EditAspirationsDialog } from './edit-aspirations-dialog';
import { EmptyProfileView } from "./empty-profile-view";
import { useAuth } from '@/contexts/AuthContext';
import { notFound } from 'next/navigation';
import { japanJobTypes } from '@/lib/visa-data';
import JOBS from '@/lib/jobs.json';
import { getJobs } from '@/actions/jobs-action';
import { SearchFilters } from '@/components/job-search/search-results';

export const SuggestedJobs: React.FC<{ highlight: string | null }> = ({ highlight }) => {
    const { role, user } = useAuth();
    if (!user) {
        return notFound();
    }
    const [suggestedJobs, setSuggestedJobs] = React.useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAspirationsDialogOpen, setIsAspirationsDialogOpen] = useState(false);
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [firstLoad, setFirstLoad] = useState(false);

    if (role === 'candidate-empty-profile') {
        return <EmptyProfileView />;
    }

    const openEditAspirationsDialog = () => {
        setIsAspirationsDialogOpen(true);
    };
    const fetchSuggestedJobs = useCallback(async () => {
        const aspirations = user.aspirations;
        if (!!aspirations) {
            setIsLoadingSuggestions(true);
            const filters: SearchFilters = stringifyObject(aspirations);
            if (filters.job) {
                const visaCode = japanJobTypes.find(v => v.name === filters.visa)?.code ?? '';
                const jobCode = JOBS.find(j => j.label === filters.job && j.value.startsWith(visaCode))?.value;
                filters.job = jobCode ?? '';
            }
            const { docs: jobs, total, totalPages } = await getJobs(filters, currentPage, 12);
            setSuggestedJobs(prev => [...prev, ...jobs]);
            setTotalJobs(total);
            setTotalPage(totalPages);
            setIsLoadingSuggestions(false);
            console.log('User aspirations:', filters);
            setFirstLoad(true);
        }
    }, [user.aspirations, currentPage]);

    useEffect(() => {
        fetchSuggestedJobs();
    }, [fetchSuggestedJobs])

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setCurrentPage(prev => prev + 1);
        setIsLoadingMore(false);
    };

    return (<>
        <AccordionItem value="item-1" className={cn(
            "border-b-0 transition-all duration-500 ease-in-out",
            highlight === 'suggested' ? "ring-2 ring-accent-orange ring-offset-2 shadow-2xl rounded-lg bg-accent-orange/10" : "border rounded-lg"
        )}>
            <div className="flex items-center bg-background px-6 rounded-t-lg hover:no-underline">
                <AccordionTrigger className="flex-grow py-4 font-semibold text-base">
                    <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>Gợi ý cho bạn</span>
                        <Badge>{isLoadingSuggestions ? '...' : totalJobs}</Badge>
                    </div>
                </AccordionTrigger>
                <Button
                    id="highlight-target-button"
                    variant="default"
                    size="sm"
                    className="ml-auto flex-shrink-0"
                    onClick={(e) => { e.stopPropagation(); openEditAspirationsDialog(); }}
                >
                    <span className="hidden sm:inline">Sửa gợi ý</span>
                    <Pencil className="h-4 w-4 sm:ml-2" />
                </Button>
            </div>
            <AccordionContent className="bg-background p-6 rounded-b-lg">
                {totalJobs > 0 || !firstLoad ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {suggestedJobs.map((job) => (<JobCard key={job.id} job={job} showRecruiterName={false} showPostedTime={true} />))}
                            {isLoadingSuggestions && (
                                Array.from({ length: 4 - (suggestedJobs.length % 4) }).map((_, i) => (
                                    <Card key={i}>
                                        <CardContent className="p-4 space-y-3">
                                            <Skeleton className="h-28 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-4 w-full" />
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                        {currentPage < totalPage && (
                            <div className="text-center mt-8">
                                <Button onClick={handleLoadMore} disabled={isLoadingMore}>
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang tải...
                                        </>
                                    ) : (
                                        'Xem thêm'
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Không tìm thấy công việc nào phù hợp với hồ sơ của bạn.</p>
                        <p className="text-sm mt-2">
                            Hãy thử cập nhật{' '}
                            <button onClick={openEditAspirationsDialog} className="text-primary underline">
                                hồ sơ và nguyện vọng
                            </button>{' '}
                            của bạn.
                        </p>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>


        <EditAspirationsDialog
            isOpen={isAspirationsDialogOpen}
            onOpenChange={setIsAspirationsDialogOpen}
        />
    </>
    );
};

export default SuggestedJobs;