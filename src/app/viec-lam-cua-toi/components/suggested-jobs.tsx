'use client';
import { JobCard } from '@/components/job-card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Loader2, Pencil, Star } from 'lucide-react';
import React, { useState } from 'react';

export const SuggestedJobs: React.FC<{ highlight: string | null, isLoadingSuggestions?: boolean, setTempAspirations: any,
    setIsAspirationsDialogOpen: any, setTempDesiredIndustry: any, setSuggestionPrinciple: any, setSuggestionType: any
}> =
    ({ highlight, isLoadingSuggestions = true, setTempAspirations,
        setIsAspirationsDialogOpen, setTempDesiredIndustry, setSuggestionPrinciple, setSuggestionType }) => {
        const [suggestedJobs, setSuggestedJobs] = React.useState<any[]>([]);
        const [visibleJobsCount, setVisibleJobsCount] = useState(8);

        const [isLoadingMore, setIsLoadingMore] = useState(false);


        const openEditAspirationsDialog = () => {
            // const storedProfileRaw = localStorage.getItem('generatedCandidateProfile');
            // if (storedProfileRaw) {
            //     const profile = JSON.parse(storedProfileRaw);
            //     setTempAspirations(profile.aspirations || {});
            //     setTempDesiredIndustry(profile.desiredIndustry || '');
            // }
            // const storedPrinciple = localStorage.getItem('suggestionPrinciple');
            // if (storedPrinciple === 'salary' || storedPrinciple === 'fee' || storedPrinciple === 'company') {
            //     setSuggestionPrinciple(storedPrinciple);
            // } else {
            //     setSuggestionPrinciple(null); // Set to null if nothing is stored
            // }
            // const storedType = localStorage.getItem('suggestionType');
            // if (storedType === 'accurate' || storedType === 'related') {
            //     setSuggestionType(storedType);
            // }
            // setIsAspirationsDialogOpen(true);
        };

        const handleLoadMore = () => {
            setIsLoadingMore(true);
            setTimeout(() => {
                setVisibleJobsCount(prev => prev + 8);
                setIsLoadingMore(false);
            }, 500); // Simulate network delay
        };
        return (<AccordionItem value="item-1" className={cn(
            "border-b-0 transition-all duration-500 ease-in-out",
            highlight === 'suggested' ? "ring-2 ring-accent-orange ring-offset-2 shadow-2xl rounded-lg bg-accent-orange/10" : "border rounded-lg"
        )}>
            <div className="flex items-center bg-background px-6 rounded-t-lg hover:no-underline">
                <AccordionTrigger className="flex-grow py-4 font-semibold text-base">
                    <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>Gợi ý cho bạn</span>
                        <Badge>{isLoadingSuggestions ? '...' : suggestedJobs?.length}</Badge>
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
                {isLoadingSuggestions ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 space-y-3">
                                    <Skeleton className="h-28 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : suggestedJobs.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {suggestedJobs.slice(0, visibleJobsCount).map((job) => (<JobCard key={job.id} job={job} showRecruiterName={false} showPostedTime={true} />))}
                        </div>
                        {visibleJobsCount < suggestedJobs.length && (
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
        </AccordionItem>);
    };

export default SuggestedJobs;