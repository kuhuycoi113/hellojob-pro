
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Briefcase, MoreHorizontal, MapPin } from 'lucide-react';
import type { Job } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JobWithApplication extends Job {
    applicationStatus?: string;
    appliedDate?: string;
}

export const JobListRow = ({ job }: { job: JobWithApplication }) => {
  return (
    <div className="flex flex-col md:flex-row items-center p-4 gap-4 border-b last:border-b-0 hover:bg-secondary/50 transition-colors">
        <Avatar className="h-12 w-12 hidden md:flex">
            <AvatarImage src={job.recruiter.avatar} alt={job.recruiter.name} />
            <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-grow w-full md:w-auto md:flex-1">
             <Link href={`/jobs/${job.id}`}>
                <p className="font-bold hover:text-primary cursor-pointer">{job.title}</p>
             </Link>
             <p className="text-sm text-muted-foreground">{job.recruiter.company}</p>
        </div>

        <div className="w-full md:w-auto md:flex-[0.7] flex items-center justify-between">
            <span className="md:hidden font-semibold">Trạng thái</span>
            <Badge variant={job.applicationStatus ? 'secondary' : 'outline'} className={job.applicationStatus ? 'bg-yellow-100 text-yellow-800' : ''}>
                {job.applicationStatus || 'Gợi ý'}
            </Badge>
        </div>
        
         <div className="w-full md:w-auto md:flex-[0.5] flex items-center justify-between">
             <span className="md:hidden font-semibold">Ngày</span>
             <span className="text-sm text-muted-foreground">{job.appliedDate || job.postedTime.split(' ')[1]}</span>
        </div>
        
        <div className="w-full md:w-auto flex justify-end gap-2">
            <Button variant="outline" size="sm">
                {job.applicationStatus ? 'Xem lại đơn' : 'Ứng tuyển'}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Heart className="mr-2 h-4 w-4"/> {job.applicationStatus === 'saved' ? 'Bỏ lưu' : 'Lưu việc làm'}
                    </DropdownMenuItem>
                     <DropdownMenuItem>
                        <Briefcase className="mr-2 h-4 w-4"/> Xem chi tiết
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  );
};
