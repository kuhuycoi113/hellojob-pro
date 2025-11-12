'use client';
import { JobCard } from '@/components/job-card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Loader2, Pencil, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { EditAspirationsDialog } from './edit-aspirations-dialog';
import { CandidateProfile } from '@/ai/schemas';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EmptyProfileView } from "./empty-profile-view";
import { visaDetailsByVisaType } from "@/lib/visa-data";
import { industriesByJobType } from "@/lib/industry-data";
import { useAuth } from '@/contexts/AuthContext';
import { notFound } from 'next/navigation';
import { updateProfile } from '@/actions/user-action';

export const SuggestedJobs: React.FC<{ highlight: string | null }> = ({ highlight }) => {
    const { role, user } = useAuth();
    if (!user) {
        return notFound();
    }
    const [suggestedJobs, setSuggestedJobs] = React.useState<any[]>([]);
    const [visibleJobsCount, setVisibleJobsCount] = useState(8);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

    const [isAspirationsDialogOpen, setIsAspirationsDialogOpen] = useState(false);

    if (role === 'candidate-empty-profile') {
        return <EmptyProfileView />;
    }


    const openEditAspirationsDialog = () => {
        setIsAspirationsDialogOpen(true);
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleJobsCount(prev => prev + 8);
            setIsLoadingMore(false);
        }, 500); // Simulate network delay
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
        </AccordionItem>


        <EditAspirationsDialog
            isOpen={isAspirationsDialogOpen}
            onOpenChange={setIsAspirationsDialogOpen}
        />
    </>
    );
};

export default SuggestedJobs;