

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Briefcase, User, MoreHorizontal, MapPin, MessageSquare, DollarSign, CalendarClock, Bookmark, Phone, LogIn } from 'lucide-react';
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
import { useChat } from '@/contexts/ChatContext';
import { MessengerIcon, ZaloIcon } from './custom-icons';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const formatCurrency = (value?: string) => {
    if (!value) return 'N/A';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const JobCard = ({ job, showRecruiterName = true, variant = 'default', showPostedTime = false, showLikes = true, showApplyButtons = false }: { job: Job, showRecruiterName?: boolean, variant?: 'default' | 'chat', showPostedTime?: boolean, showLikes?: boolean, showApplyButtons?: boolean }) => {
  const { openChat } = useChat();
  const { isLoggedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);

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
    }
     // Trigger a storage event to update other components like the "My Jobs" page
    window.dispatchEvent(new Event('storage'));
  };

  const handleApplyClick = () => {
    if (!isLoggedIn) {
        sessionStorage.setItem('postLoginRedirect', `/jobs/${job.id}`);
        setIsConfirmLoginOpen(true);
    } else {
        // Logic for logged in user to apply
        console.log("Applying for job...");
    }
  };
  
  const handleConfirmLogin = () => {
    setIsConfirmLoginOpen(false);
    setIsAuthDialogOpen(true);
  };


  const handleChatClick = () => {
    const consultant = { id: 'consultant-1', name: job.recruiter.name, avatarUrl: job.recruiter.avatar }; // Simplified user object
    // @ts-ignore
    openChat(consultant);
  };

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
        </div>
        
        <div className="flex-grow flex flex-col">
            <Link href={`/jobs/${job.id}`} className="group flex-grow">
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
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{job.workLocation}</span>
                </p>
                {showPostedTime && (
                    <p className="flex items-center gap-1.5 text-xs justify-end text-right w-full">
                        <span className="text-primary">Đăng lúc:</span>
                        <span style={ { color: '#9B999A' } }>{job.postedTime}</span>
                    </p>
                )}
            </div>

            
            <div className="mt-auto flex justify-between items-end">
                 <div className="flex items-center gap-2">
                    <Link href={`/consultant-profile/${'consultant-1'}`} className="flex-shrink-0">
                        <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-110">
                            <AvatarImage src={job.recruiter.avatar} alt={job.recruiter.name} />
                            <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleChatClick}>
                        <MessageSquare className="mr-2 h-4 w-4"/>
                        Chat
                    </Button>
                    <Button asChild variant="outline" size="icon" className="border-purple-500 hover:bg-purple-50">
                        <Link href="https://m.me/your_user_id" target="_blank">
                            <Image src="/img/Mess.svg" alt="Messenger" width={20} height={20} />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="border-blue-500 hover:bg-blue-50">
                        <Link href="https://zalo.me/your_zalo_id" target="_blank">
                            <Image src="/img/Zalo.svg" alt="Zalo" width={20} height={20} />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="border-green-500 hover:bg-green-50">
                        <Link href="tel:your_phone_number">
                            <Image src="/img/phone.svg" alt="Phone" width={20} height={20} />
                        </Link>
                    </Button>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className={cn("bg-white", isSaved && "border border-accent-orange text-accent-orange bg-background hover:bg-accent-orange/5 hover:text-accent-orange")} onClick={handleSaveJob}>
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
                                    <Link href={`/jobs/${job.id}`} className="w-full flex">
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
                 <Button size="icon" className="absolute bottom-1 right-1 h-8 w-8 bg-white/80 hover:bg-white border border-gray-200 shadow" onClick={handleSaveJob}>
                    <Bookmark className={cn("h-4 w-4", isSaved ? "text-accent-orange fill-current" : "text-gray-400")} />
                 </Button>
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
                     <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-2">
                        <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span>{job.workLocation}</span>
                        </p>
                        {showPostedTime && (
                            <p className="flex items-center gap-1.5 text-xs justify-end text-right w-full">
                                <span className="text-primary">Đăng lúc:</span>
                                <span style={ { color: '#9B999A' } }>{job.postedTime}</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <div className="p-3 border-t">
            <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Link href={`/consultant-profile/${'consultant-1'}`} className="flex-shrink-0">
                        <Avatar className="h-8 w-8 cursor-pointer">
                            <AvatarImage src={job.recruiter.avatar} alt={job.recruiter.name} />
                            <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="flex items-center gap-2">
                                <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90">
                                    <MessageSquare className="text-primary-foreground h-4 w-4"/>
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 border-purple-500 hover:bg-purple-50">
                                    <Image src="/img/Mess.svg" alt="Messenger" width={16} height={16} />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 border-blue-500 hover:bg-blue-50">
                                    <Image src="/img/Zalo.svg" alt="Zalo" width={16} height={16} />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 border-green-500 hover:bg-green-50">
                                    <Image src="/img/phone.svg" alt="Phone" width={16} height={16} />
                                </Button>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                            <div className="flex gap-2">
                                <Button size="icon" className="h-16 w-16 bg-primary hover:bg-primary/90" onClick={handleChatClick}>
                                    <MessageSquare className="h-8 w-8"/>
                                </Button>
                                <Button asChild variant="outline" size="icon" className="h-16 w-16 border-purple-500 hover:bg-purple-50">
                                    <Link href="https://m.me/your_user_id" target="_blank">
                                        <Image src="/img/Mess.svg" alt="Messenger" width={40} height={40} />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="icon" className="h-16 w-16 border-blue-500 hover:bg-blue-50">
                                    <Link href="https://zalo.me/your_zalo_id" target="_blank">
                                      <Image src="/img/Zalo.svg" alt="Zalo" width={40} height={40} />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="icon" className="h-16 w-16 border-green-500 hover:bg-green-50">
                                    <Link href="tel:your_phone_number">
                                        <Image src="/img/phone.svg" alt="Phone" width={40} height={40} />
                                    </Link>
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="flex items-center gap-2">
                    {showApplyButtons ? (
                        <>
                            <Button size="sm" className="bg-accent-orange text-white h-8" onClick={handleApplyClick}>Ứng tuyển</Button>
                        </>
                     ) : (
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
                     )}
                </div>
            </div>
        </div>
    </div>
  );

  if (variant === 'chat') {
    return <ChatLayout />;
  }

  return (
    <>
        <Card className={cn(
            "rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow duration-300",
        )}>
            <MobileLayout />
            <DesktopLayout />
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
