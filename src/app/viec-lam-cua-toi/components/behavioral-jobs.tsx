"use client";
import { JobCard } from "@/components/job-card";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, Briefcase } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function BehavioralJobs({ }: any) {
    const [behavioralSuggestedJobs, setBehavioralSuggestedJobs] = useState<any[]>([]);
    const [isLoadingBehavioral, setIsLoadingBehavioral] = useState(true);

    return (
        <AccordionItem value="item-4" id="behavioral-suggestions" className="border rounded-lg border-b-0">
            <AccordionTrigger className="bg-background px-6 rounded-lg font-semibold text-base hover:no-underline">
                <div className="flex items-center gap-3">
                    <BrainCircuit className="h-5 w-5 text-purple-500" />
                    <span>Có thể bạn quan tâm</span>
                    <Badge variant="secondary">{isLoadingBehavioral ? '...' : behavioralSuggestedJobs.length}</Badge>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {behavioralSuggestedJobs.map((item) => (
                            <JobCard key={item.job.id} job={item.job} showRecruiterName={false} showPostedTime={true} />
                        ))}
                    </div>
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