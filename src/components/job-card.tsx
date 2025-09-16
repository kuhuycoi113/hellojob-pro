
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Briefcase, User, MoreHorizontal, MapPin, MessageSquare, DollarSign, CalendarClock } from 'lucide-react';
import { Job } from '@/lib/mock-data';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const formatCurrency = (value?: string) => {
    if (!value) return 'N/A';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const JobCard = ({ job, showRecruiterName = true, variant = 'default', showPostedTime = false, showLikes = true }: { job: Job, showRecruiterName?: boolean, variant?: 'default' | 'chat', showPostedTime?: boolean, showLikes?: boolean }) => {

  // New Chat Layout for the chat variant
  const ChatLayout = () => (
    <Link href={`/jobs/${job.id}`} className="block w-full">
        <Card className="flex items-center p-2 gap-3 hover:bg-secondary/50 transition-colors">
            <div className="relative w-16 h-16 flex-shrink-0">
                <Image src={job.image.src} alt={job.title} fill className="object-cover rounded-md" />
            </div>
            <div className="flex-grow overflow-hidden">
                <h4 className="font-semibold text-sm truncate">{job.title}</h4>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {job.workLocation}
                </p>
                <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
                    <DollarSign className="h-3 w-3 flex-shrink-0" />
                    {formatCurrency(job.salary.basic)}
                </p>
            </div>
        </Card>
    </Link>
  );

  // Desktop layout
  const DesktopLayout = () => (
    <div className="hidden md:flex flex-row items-stretch w-full p-3 gap-4">
        <div className="relative w-32 h-32 flex-shrink-0">
            <Link href={`/jobs/${job.id}`}>
                <Image src={job.image.src} alt={job.title} fill className="object-cover rounded-lg" />
            </Link>
             <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <div className={cn("w-1.5 h-1.5 rounded-full", job.isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400')}></div>
              <span>{job.id}</span>
            </div>
            {showLikes && (
                <div className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <span>{job.likes}</span>
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                </div>
            )}
        </div>
        
        <div className="flex-grow flex flex-col">
            <Link href={`/jobs/${job.id}`} className="group">
                <h3 className="font-bold text-base mb-2 group-hover:text-primary cursor-pointer leading-tight line-clamp-2">{job.title}</h3>
            </Link>
             <div className="flex flex-wrap items-center gap-2 mb-2">
              {job.visaDetail && (
                <Badge
                    variant="outline"
                    className={cn("text-xs", {
                        "border-accent-green text-accent-green": job.visaType?.includes("Thực tập sinh"),
                        "border-accent-blue text-accent-blue": job.visaType?.includes("Kỹ năng đặc định"),
                        "border-accent-orange text-accent-orange": job.visaType?.includes("Kỹ sư, tri thức"),
                    })}
                >
                    {job.visaDetail}
                </Badge>
              )}
              {job.salary.actual && <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">Thực lĩnh: {formatCurrency(job.salary.actual)}</Badge>}
              <Badge variant="secondary" className="text-xs">Cơ bản: {formatCurrency(job.salary.basic)}</Badge>
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.workLocation}</span>
            </p>

            <div className="mt-auto flex justify-between items-end">
                 <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MessageSquare className="h-5 w-5 text-muted-foreground"/></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><User className="h-5 w-5 text-muted-foreground"/></Button>
                </div>
                 <div className="flex items-center gap-4">
                    {showPostedTime && (
                        <div className="text-xs text-right">
                            <span className="text-primary font-semibold">Đăng lúc:</span>{' '}
                            <span style={{color: '#9B999A'}}>{job.postedTime}</span>
                        </div>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-5 w-5 text-muted-foreground"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/jobs/${job.id}`} className="w-full flex">
                                    <Briefcase className="mr-2 h-4 w-4" /> Xem chi tiết
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Heart className="mr-2 h-4 w-4"/> Lưu việc làm
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    </div>
  );

  // Mobile layout
  const MobileLayout = () => (
     <div className="md:hidden flex flex-col w-full">
        <div className="flex flex-row items-stretch">
            <div className="relative w-1/3 flex-shrink-0 aspect-[4/3]">
                <Link href={`/jobs/${job.id}`}>
                    <Image src={job.image.src} alt={job.title} fill className="object-cover" />
                </Link>
                <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", job.isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400')}></div>
                <span>{job.id}</span>
                </div>
                {showLikes && (
                    <div className="absolute bottom-1 right-1 flex items-center gap-2">
                        <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <span>{job.likes}</span>
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                        </div>
                    </div>
                )}
            </div>

            <div className="w-2/3 p-3 flex-grow flex flex-col justify-between">
                <div>
                    <Link href={`/jobs/${job.id}`} className="group">
                        <h3 className="font-bold text-sm mb-2 group-hover:text-primary cursor-pointer leading-tight line-clamp-3">{job.title}</h3>
                    </Link>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {job.visaDetail && (
                        <Badge
                            variant="outline"
                            className={cn("text-xs", {
                                "border-accent-green text-accent-green": job.visaType?.includes("Thực tập sinh"),
                                "border-accent-blue text-accent-blue": job.visaType?.includes("Kỹ năng đặc định"),
                                "border-accent-orange text-accent-orange": job.visaType?.includes("Kỹ sư, tri thức"),
                            })}
                        >
                            {job.visaDetail}
                        </Badge>
                        )}
                        {job.salary.actual && <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Thực lĩnh: {formatCurrency(job.salary.actual)}</Badge>}
                        <Badge variant="secondary" className="text-xs">Cơ bản: {formatCurrency(job.salary.basic)}</Badge>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{job.workLocation}</span>
                    </p>
                </div>
            </div>
        </div>
        <div className="p-3 border-t">
             {showRecruiterName && (
                <div className="flex items-center gap-2 text-xs mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={job.recruiter.avatar} alt={job.recruiter.name} />
                    <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-semibold text-blue-600 truncate">{job.recruiter.name}</p>
                    <p className="text-muted-foreground truncate">{job.recruiter.company}</p>
                  </div>
                </div>
            )}
            <div className="flex justify-between items-center">
                 <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                        <Link href="/chat">
                            <MessageSquare className="text-primary h-5 w-5"/>
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><User className="h-5 w-5"/></Button>
                </div>
                 <div className="flex items-center gap-2">
                    {showPostedTime && (
                        <div className="text-xs text-right">
                             <span className="text-primary font-semibold">Đăng lúc:</span>{' '}
                             <span style={{color: '#9B999A'}}>{job.postedTime}</span>
                        </div>
                    )}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href={`/jobs/${job.id}`} className="w-full flex">
                                    <Briefcase className="mr-2 h-4 w-4" /> Xem chi tiết
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    </div>
  );

  if (variant === 'chat') {
    return <ChatLayout />;
  }

  return (
    <Card className="rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow duration-300">
        <MobileLayout />
        <DesktopLayout />
    </Card>
  );
};
