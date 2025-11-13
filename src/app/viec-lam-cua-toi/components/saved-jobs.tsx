'use client'
import { getJobsByIDs } from '@/actions/jobs-action';
import { JobCard } from '@/components/job-card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';
import React, { useEffect, memo } from "react";
const MemoizedJobCard = memo(JobCard);

export const SavedJobs = ({ highlight }: { highlight: string | null }) => {
    const [savedJobs, setSavedJobs] = React.useState<any[]>([]);

    const { user } = useAuth()
    useEffect(() => {
        if (!!user) {
            const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
            getJobsByIDs(savedJobIds).then((res) => {
                setSavedJobs(res.docs);
            });
        }
    }, []);
    return (
        <AccordionItem value="item-3" className={cn(
            "border-b-0 transition-all duration-500 ease-in-out",
            highlight === 'saved' ? "ring-2 ring-accent-orange ring-offset-2 shadow-2xl rounded-lg bg-accent-orange/10" : "border rounded-lg"
        )}>
            <AccordionTrigger className="bg-background px-6 rounded-lg font-semibold text-base hover:no-underline">
                <div className="flex items-center gap-3">
                    <Bookmark className="h-5 w-5 text-red-500" />
                    <span>Việc đã lưu</span>
                    <Badge>{savedJobs.length}</Badge>
                </div>
            </AccordionTrigger>
            <AccordionContent className="bg-background p-6 rounded-b-lg">
                {savedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedJobs.map((job) => (<MemoizedJobCard key={job.id} job={job} showRecruiterName={false} showPostedTime={true} />))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Bạn chưa lưu công việc nào.</p>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}