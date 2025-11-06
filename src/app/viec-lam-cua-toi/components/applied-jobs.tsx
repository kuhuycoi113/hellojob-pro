"use client";
import { getJobsByIDs } from "@/actions/jobs-action";
import { JobCard } from "@/components/job-card";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Briefcase } from "lucide-react";
import React, { useEffect, useState, memo } from "react";
const MemoizedJobCard = memo(JobCard);

export default function AppliedJobs({ }: any) {
    const { user } = useAuth()
    const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
    useEffect(() => {
        if (!!user) {
            const appliedJobIDs = user.appliedJobs;
            getJobsByIDs(appliedJobIDs).then((res) => {
                setAppliedJobs(res.docs);
            });
        }
    }, []);

    return (
        <AccordionItem value="item-2" className="border rounded-lg border-b-0">
            <AccordionTrigger className="bg-background px-6 rounded-lg font-semibold text-base hover:no-underline">
                <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    <span>Việc đã ứng tuyển</span>
                    <Badge>{appliedJobs.length}</Badge>
                </div>
            </AccordionTrigger>
            <AccordionContent className="bg-background p-6 rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {appliedJobs.map((job) => (<MemoizedJobCard key={job.id} job={job} showRecruiterName={false} showPostedTime={true} />))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}