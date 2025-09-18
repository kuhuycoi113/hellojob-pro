
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Briefcase, User, MoreHorizontal, MapPin, MessageSquare, DollarSign, CalendarClock, Bookmark, Phone, LogIn, Star } from 'lucide-react';
import { Job } from '@/lib/mock-data';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { ContactButtons } from './contact-buttons';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';


const formatCurrency = (value?: string) => {
    if (!value) return 'N/A';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// CANHANHOA01: Function to log user interaction
const logInteraction = (job: Job, type: 'view' | 'save') => {
    try {
        const MAX_SIGNALS = 50; // Limit the number of signals to keep it manageable
        let signals: Partial<Job>[] = JSON.parse(localStorage.getItem('behavioralSignals') || '[]');

        // Create a signal object with only relevant properties
        const signal: Partial<Job> = {
            id: job.id,
            industry: job.industry,
            workLocation: job.workLocation,
            visaType: job.visaType,
            visaDetail: job.visaDetail,
            title: job.title,
            // We can add salary later if needed for more complex logic
        };

        // Add the new signal to the front and remove duplicates by job id
        signals = [signal, ...signals.filter(s => s.id !== job.id)];
        
        // Trim the array to the max limit
        if (signals.length > MAX_SIGNALS) {
            signals = signals.slice(0, MAX_SIGNALS);
        }

        localStorage.setItem('behavioralSignals', JSON.stringify(signals));
         // Trigger a storage event to update other components like the "My Jobs" page
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error("Error logging user interaction:", error);
    }
};


export const JobCard = ({ job, showRecruiterName = true, variant = 'grid-item', showPostedTime = false, showLikes = true, showApplyButtons = false }: { job: Job, showRecruiterName?: boolean, variant?: 'list-item' | 'grid-item' | 'chat', showPostedTime?: boolean, showLikes?: boolean, showApplyButtons?: boolean }) => {
  const { isLoggedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
  const [isConsultantPopoverOpen, setIsConsultantPopoverOpen] = useState(false);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(savedJobs.includes(job.id));
  }, [job.id]);

  const handleSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (isSaved) {
      const newSavedJobs = savedJobs.filter((id: string) => id !== job.id);
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      setIsSaved(false);
    } else {
      savedJobs.push(job.id);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setIsSaved(true);
      logInteraction(job, 'save'); // CANHANHOA01: Log save interaction
    }
     // Trigger a storage event to update other components like the "My Jobs" page
    window.dispatchEvent(new Event('storage'));
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // CHUCNANGUNGTUYEN01: Start of apply functionality
    if (!isLoggedIn) {
        sessionStorage.setItem('postLoginRedirect', `/jobs/${job.id}`);
        setIsConfirmLoginOpen(true);
    } else {
        // Logic for logged in user to apply
        console.log("Applying for job...");
    }
    // CHUCNANGUNGTUYEN01: End of apply functionality
  };
  
  const handleConfirmLogin = () => {
    setIsConfirmLoginOpen(false);
    setIsAuthDialogOpen(true);
  };
  
  // CANHANHOA01: Add handler to log view interaction
  const handleCardClick = () => {
      logInteraction(job, 'view');
  };

  if (variant === 'list-item') {
     return (
        <Card id="HIENTHIVIEC01" className="flex flex-col w-full p-3 gap-4 border border-border hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col md:flex-row items-stretch gap-4">
                <div className="relative w-full md:w-40 h-40 md:h-auto flex-shrink-0">
                    <Link href={`/jobs/${job.id}`} onClick={handleCardClick}>
                        <Image src={job.image.src} alt={job.title} fill className="object-cover rounded-lg" />
                    </Link>
                    <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Image src="/img/japanflag.png" alt="Japan flag" width={12} height={12} className="h-3 w-auto" />
                    <span>{job.id}</span>
                    </div>
                    <Button variant="outline" size="icon" className="absolute top-1.5 right-1.5 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={handleSaveJob}>
                        <Bookmark className={cn("h-4 w-4", isSaved ? "text-accent-orange fill-current" : "text-gray-400")} />
                    </Button>
                </div>
                
                <div className="flex-grow flex flex-col">
                    <Link href={`/jobs/${job.id}`} className="group flex-grow" onClick={handleCardClick}>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary cursor-pointer leading-tight line-clamp-2">{job.title}</h3>
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
                    <div className="text-sm text-muted-foreground">
                        <p className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>{job.workLocation}</span>
                        </p>
                    </div>

                    
                    <div className="mt-auto pt-2 flex justify-between items-end">
                        <div className="flex items-center gap-2">
                            <Popover open={isConsultantPopoverOpen} onOpenChange={setIsConsultantPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <div onMouseEnter={() => setIsConsultantPopoverOpen(true)} onMouseLeave={() => setIsConsultantPopoverOpen(false)}>
                                        <Link href={`/consultant-profile/${job.recruiter.id}`} className="flex-shrink-0">
                                            <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-110">
                                                <AvatarImage src={job.recruiter.avatar} alt={job.recruiter.name} />
                                                <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </Link>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80" side="top" align="start">
                                    <div className="flex gap-4">
                                    <Avatar className="h-16 w-16">
                                            <AvatarImage src={job.recruiter.avatar} alt={job.recruiter.name} />
                                            <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                        <h4 className="text-sm font-semibold">{job.recruiter.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {job.recruiter.mainExpertise}
                                        </p>
                                        <Button asChild size="sm" variant="link" className="p-0 h-auto">
                                            <Link href={`/consultant-profile/${job.recruiter.id}`}>Xem hồ sơ</Link>
                                        </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <ContactButtons contact={job.recruiter} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className={cn("bg-white hidden md:flex", isSaved && "border border-accent-orange text-accent-orange bg-background hover:bg-accent-orange/5 hover:text-accent-orange")} onClick={handleSaveJob}>
                                <Bookmark className={cn("h-5 w-5 mr-2", isSaved ? "text-accent-orange fill-current" : "text-gray-400")} />
                                Lưu
                            </Button>
                            {showApplyButtons ? (
                                <Button size="sm" className="bg-accent-orange text-white" onClick={handleApplyClick}>Ứng tuyển</Button>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-5 w-5 text-muted-foreground"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/jobs/${job.id}`} className="w-full flex" onClick={handleCardClick}>
                                                <Briefcase className="mr-2 h-4 w-4" /> Xem chi tiết
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </div>
            </div>
             {showPostedTime && (
                <div className="w-full mt-2">
                    <p className="flex items-center gap-1.5 text-xs justify-end text-right w-full">
                        <span className="text-primary">Đăng lúc:</span>
                        <span style={ { color: '#9B999A' } }>{job.postedTime}</span>
                    </p>
                </div>
            )}
        </Card>
     );
  }

  if (variant === 'chat') {
    return (
        <Link href={`/jobs/${job.id}`} className="block w-full" onClick={handleCardClick}>
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
  }

  // Default variant: 'grid-item'
  return (
    <>
        <Card id="HIENTHIVIEC02" className={cn("rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow duration-300 h-full flex flex-col")}>
             <Link href={`/jobs/${job.id}`} className="group" onClick={handleCardClick}>
                <div className="relative w-full aspect-video">
                     <Image src={job.image.src} alt={job.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Image src="/img/japanflag.png" alt="Japan flag" width={12} height={12} className="h-3 w-auto" />
                        <span>{job.id}</span>
                      </div>
                      <Button variant="outline" size="icon" className="absolute bottom-2 right-2 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={handleSaveJob}>
                        <Bookmark className={cn("h-4 w-4", isSaved ? "text-accent-orange fill-current" : "text-gray-400")} />
                      </Button>
                </div>
             </Link>
             <div className="p-3 flex-grow flex flex-col">
                <Link href={`/jobs/${job.id}`} className="group flex-grow" onClick={handleCardClick}>
                    <h3 className="font-bold text-sm mb-2 group-hover:text-primary cursor-pointer leading-tight line-clamp-2 h-10">{job.title}</h3>
                </Link>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                    {job.visaDetail && (
                    <Badge
                        variant="outline"
                        className={cn("text-xs px-1.5 py-0", {
                            "border-accent-green/70 text-accent-green bg-green-50": job.visaType?.includes("Thực tập sinh"),
                            "border-accent-blue/70 text-accent-blue bg-blue-50": job.visaType?.includes("Kỹ năng đặc định"),
                            "border-accent-orange/70 text-accent-orange bg-orange-50": job.visaType?.includes("Kỹ sư, tri thức"),
                        })}
                    >
                        {job.visaDetail}
                    </Badge>
                    )}
                    {job.salary.actual && <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-green-100 text-green-800">Thực lĩnh: {formatCurrency(job.salary.actual)}</Badge>}
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">Cơ bản: {formatCurrency(job.salary.basic)}</Badge>
                </div>
                 <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span>{job.workLocation}</span>
                </div>

                <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <Link href={`/consultant-profile/${job.recruiter.id}`} className="flex-shrink-0">
                            <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-110">
                                <AvatarImage src={job.recruiter.avatar} alt={job.recruiter.name} />
                                <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <ContactButtons contact={job.recruiter} />
                    </div>
                    {/* CHUCNANGUNGTUYEN01 */}
                    <Button size="sm" className="bg-accent-orange text-white" onClick={handleApplyClick}>Ứng tuyển</Button>
                </div>
             </div>
        </Card>
        <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        <AlertDialog open={isConfirmLoginOpen} onOpenChange={setIsConfirmLoginOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Bạn chưa đăng nhập</AlertDialogTitle>
                <AlertDialogDescription>
                    Bạn cần có tài khoản để ứng tuyển. Đi đến trang đăng ký/đăng nhập?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Từ chối</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmLogin}>
                    Đồng ý
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
};
