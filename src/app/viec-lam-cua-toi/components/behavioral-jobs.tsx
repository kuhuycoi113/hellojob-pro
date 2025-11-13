"use client";
import { getJobs } from "@/actions/jobs-action";
import { JobCard } from "@/components/job-card";
import { SearchFilters } from "@/components/job-search/search-results";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BrainCircuit, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function BehavioralJobs({ highlight }: { highlight: string | null }) {
    const router = useRouter();
    const [behavioralSuggestedJobs, setBehavioralSuggestedJobs] = useState<any[]>([]);
    const [isLoadingBehavioral, setIsLoadingBehavioral] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const fetchSuggestedJobs = useCallback(async () => {
        setIsLoadingBehavioral(true);
        const filters: SearchFilters = {};
        const { docs: jobs, total, totalPages } = await getJobs(filters, 1, currentPage * 12);
        setBehavioralSuggestedJobs(jobs);
        setTotalJobs(total);
        setTotalPage(totalPages);
        setIsLoadingBehavioral(false);
        console.log('User aspirations:', filters);
    }, [currentPage]);

    useEffect(() => {
        fetchSuggestedJobs();
    }, [fetchSuggestedJobs])

    return (
        
        <AccordionItem value="item-4" id="behavioral-suggestions" className={cn(
            "border-b-0 transition-all duration-500 ease-in-out",
            highlight === 'behavioral' ? "ring-2 ring-accent-orange ring-offset-2 shadow-2xl rounded-lg bg-accent-orange/10" : "border rounded-lg"
        )}>
            <AccordionTrigger className="bg-background px-6 rounded-lg font-semibold text-base hover:no-underline">
                <div className="flex items-center gap-3">
                    <BrainCircuit className="h-5 w-5 text-purple-500" />
                    <span>Có thể bạn quan tâm</span>
                    <Badge variant="secondary">{isLoadingBehavioral ? '...' : totalJobs}</Badge>
                </div>
            </AccordionTrigger>
            <AccordionContent className="bg-background p-6 rounded-b-lg">
                {isLoadingBehavioral ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}><CardContent className="p-4 space-y-3"><Skeleton className="h-28 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
                        ))}
                    </div>
                ) : behavioralSuggestedJobs.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {behavioralSuggestedJobs.map((item) => (
                                <JobCard key={item.id} job={item} showRecruiterName={false} showPostedTime={true} />
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Button onClick={() => router.push('/tim-viec-lam')} variant={'link'}>
                                Xem thêm
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Hãy xem và lưu một vài công việc để chúng tôi có thể gợi ý tốt hơn cho bạn!</p>
                        <Button asChild variant="link" className="mt-2"><Link href="/viec-lam">Bắt đầu tìm kiếm</Link></Button>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}