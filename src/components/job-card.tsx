
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Briefcase, User, MoreHorizontal, MapPin, MessageSquare, DollarSign, CalendarClock, Bookmark, Phone, LogIn, Star, FileText } from 'lucide-react';
import { Job, publicFeeLimits } from '@/lib/mock-data';
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
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { CandidateProfile } from '@/ai/schemas';
import { EditProfileDialog } from './candidate-edit-dialog';
import type { SearchFilters } from './job-search/search-results';


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

const validateProfileForApplication = (profile: CandidateProfile): boolean => {
    if (!profile || !profile.personalInfo) return false;

    const { name, personalInfo } = profile;
    const { gender, height, weight, tattooStatus, hepatitisBStatus, phone, zalo, messenger, line } = personalInfo;

    const hasRequiredPersonalInfo = name && gender && height && weight && tattooStatus && hepatitisBStatus;
    const hasContactInfo = phone || zalo || messenger || line;

    return !!hasRequiredPersonalInfo && !!hasContactInfo;
};

// List of visa details that have special fee handling
const controlledFeeVisas = [
  'Thực tập sinh 3 năm',
  'Thực tập sinh 1 năm',
  'Đặc định đi mới',
  'Kỹ sư, tri thức đầu Việt',
  'Đặc định đầu Việt'
];


export const JobCard = ({ job, showRecruiterName = true, variant = 'grid-item', showPostedTime = false, showLikes = true, showApplyButtons = false, appliedFilters }: { job: Job, showRecruiterName?: boolean, variant?: 'list-item' | 'grid-item' | 'chat', showPostedTime?: boolean, showLikes?: boolean, showApplyButtons?: boolean, appliedFilters?: SearchFilters }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
  const [isConsultantPopoverOpen, setIsConsultantPopoverOpen] = useState(false);
  const [isProfileIncompleteAlertOpen, setIsProfileIncompleteAlertOpen] = useState(false);
  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);
  const [postedTime, setPostedTime] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(savedJobs.includes(job.id));
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setHasApplied(appliedJobs.includes(job.id));

    // Safely calculate postedTime on the client to avoid hydration mismatch
    const today = new Date();
    const postedDate = new Date(today);
    postedDate.setDate(today.getDate() + job.postedTimeOffset);
    setPostedTime(`10:00 ${postedDate.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}`);

  }, [job.id, job.postedTimeOffset]);

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
    // CHUCNANGUNGTUYEN01 & UNGTUYEN-L01 & UNGTUYEN-L05 & UNGTUYEN-L06: Start of apply functionality
    if (!isLoggedIn) {
        sessionStorage.setItem('postLoginRedirect', `/viec-lam/${job.id}`);
        setIsConfirmLoginOpen(true);
    } else {
        const profileRaw = localStorage.getItem('generatedCandidateProfile');
        if (profileRaw) {
            const profile: CandidateProfile = JSON.parse(profileRaw);
            if (validateProfileForApplication(profile)) {
                // Mark as applied
                const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
                appliedJobs.push(job.id);
                localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
                setHasApplied(true);
                toast({
                    title: 'Ứng tuyển thành công!',
                    description: `Hồ sơ của bạn đã được gửi cho công việc "${job.title}".`,
                    className: 'bg-green-500 text-white'
                });
            } else {
                setIsProfileIncompleteAlertOpen(true);
            }
        } else {
             setIsProfileIncompleteAlertOpen(true);
        }
    }
    // CHUCNANGUNGTUYEN01 & UNGTUYEN-L01 & UNGTUYEN-L05 & UNGTUYEN-L06: End of apply functionality
  };
  
  const handleConfirmLogin = () => {
    setIsConfirmLoginOpen(false);
    setIsAuthDialogOpen(true);
  };

  const handleConfirmUpdateProfile = () => {
    setIsProfileIncompleteAlertOpen(false);
    setIsProfileEditDialogOpen(true);
  };
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only navigate if the click target is not an interactive element
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    logInteraction(job, 'view');
    router.push(`/viec-lam/${job.id}`);
  };

  const applyButtonContent = hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển';

  const getFeeDisplayInfo = () => {
      const { visaDetail, netFee, netFeeNoTicket, netFeeWithTuition } = job;
      const feeLimit = publicFeeLimits[visaDetail as keyof typeof publicFeeLimits];
      const isControlledVisa = controlledFeeVisas.includes(visaDetail || '');

      const visasForVnd = ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Đặc định đi mới', 'Kỹ sư, tri thức đầu Việt'];
      const visasForUsd = ['Đặc định đầu Việt'];

      let feeValue: number | undefined;
      let feeLabel: string | undefined;

      if (netFeeWithTuition) {
          feeValue = parseInt(netFeeWithTuition);
          feeLabel = 'Phí và vé và học phí';
      } else if (netFee) {
          feeValue = parseInt(netFee);
          feeLabel = (visaDetail?.includes('Thực tập sinh')) ? 'Phí và vé không học phí' : 'Phí có vé';
      } else if (netFeeNoTicket) {
          feeValue = parseInt(netFeeNoTicket);
          feeLabel = 'Phí không vé';
      }
      
      if (!feeLabel || feeValue === undefined) {
          return { shouldShow: isControlledVisa, text: `${feeLabel || 'Phí'}: Không rõ` };
      }
      
      if (isControlledVisa && feeValue > feeLimit) {
          return { shouldShow: true, text: `${feeLabel}: Không rõ` };
      }

      if (visasForVnd.includes(visaDetail || '')) {
          const USD_VND_RATE = 26300;
          const vndValue = feeValue * USD_VND_RATE;
          const valueInMillions = vndValue / 1000000;
          const formattedVnd = valueInMillions.toLocaleString('vi-VN', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1
          });
          return { shouldShow: true, text: `Phí: ~${formattedVnd.replace('.',',')}tr` };
      }
      
      if (visasForUsd.includes(visaDetail || '')) {
         return { shouldShow: true, text: `${feeLabel}: $${formatCurrency(String(feeValue))}` };
      }

      // Default fallback for other controlled visas or if logic doesn't match
      return { shouldShow: true, text: `${feeLabel}: $${formatCurrency(String(feeValue))}` };
  };


  const feeInfo = getFeeDisplayInfo();
  const feeFilterIsActive = !!(appliedFilters?.netFee || appliedFilters?.netFeeNoTicket);

  if (variant === 'list-item') {
     return (
        <>
            <div id="HIENTHIVIEC01" className="w-full transition-shadow duration-300 hover:shadow-lg rounded-lg cursor-pointer border bg-card text-card-foreground" onClick={handleCardClick}>
                <div className="p-3 hover:bg-secondary/30">
                    <div className="flex flex-col items-stretch gap-4 md:flex-row">
                         <div className="relative h-48 w-full flex-shrink-0 md:h-40 md:w-60">
                            <Image src={job.image.src} alt={job.title} fill className="rounded-lg object-cover" />
                            <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                            <Image src="/img/japanflag.png" alt="Japan flag" width={12} height={12} className="h-3 w-auto" />
                            <span>{job.id}</span>
                            </div>
                            {isClient && <Button variant="outline" size="icon" className="absolute right-1.5 top-1.5 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white md:hidden" onClick={handleSaveJob}>
                                <Bookmark className={cn("h-4 w-4", isSaved ? "text-accent-orange fill-current" : "text-gray-400")} />
                            </Button>}
                        </div>
                        
                        <div className="flex flex-grow flex-col">
                            <h3 className="mb-2 text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary">{job.title}</h3>
                             <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
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
                                {job.salary.actual && <Badge variant="secondary" className="border-green-200 bg-green-100 text-xs text-green-800">Thực lĩnh: {formatCurrency(job.salary.actual)} JPY</Badge>}
                                <Badge variant="secondary" className="text-xs">Cơ bản: {formatCurrency(job.salary.basic)} JPY</Badge>
                                {feeFilterIsActive && feeInfo.shouldShow && (
                                    <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 border-red-200">
                                        {feeInfo.text}
                                    </Badge>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    <span>{job.workLocation}</span>
                                </p>
                            </div>
                            
                            <div className="mt-auto flex flex-wrap items-end justify-between gap-y-2 pt-2">
                                <div className="flex items-center gap-1">
                                    <Popover open={isConsultantPopoverOpen} onOpenChange={setIsConsultantPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <div onMouseEnter={() => setIsConsultantPopoverOpen(true)} onMouseLeave={() => setIsConsultantPopoverOpen(false)}>
                                                <Link href={`/tu-van-vien/${job.recruiter.id}`} className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-110">
                                                        <AvatarImage src={job.recruiter.avatarUrl} alt={job.recruiter.name} />
                                                        <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                </Link>
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80" side="top" align="start">
                                            <div className="flex gap-4">
                                            <Avatar className="h-16 w-16">
                                                    <AvatarImage src={job.recruiter.avatarUrl} alt={job.recruiter.name} />
                                                    <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">{job.recruiter.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {job.recruiter.mainExpertise}
                                                </p>
                                                <Button asChild size="sm" variant="link" className="h-auto p-0">
                                                    <Link href={`/tu-van-vien/${job.recruiter.id}`}>Xem hồ sơ</Link>
                                                </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <ContactButtons contact={job.recruiter as any} job={job} showChatText={true} />
                                </div>
                                {isClient && <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className={cn("hidden bg-white md:flex border-gray-300", isSaved && "border border-accent-orange bg-background text-accent-orange hover:bg-accent-orange/5 hover:text-accent-orange")} onClick={handleSaveJob}>
                                        <Bookmark className={cn("mr-2 h-5 w-5", isSaved ? "fill-current text-accent-orange" : "text-gray-400")} />
                                        Lưu
                                    </Button>
                                    {showApplyButtons && <Button size="sm" className="bg-accent-orange text-white" onClick={handleApplyClick} disabled={hasApplied}>{applyButtonContent}</Button>}
                                </div>}
                            </div>
                        </div>
                    </div>
                     {showPostedTime && (
                        <div className="w-full px-3 pb-1">
                            <p className="flex items-center justify-end gap-1.5 text-right w-full" style={{ fontSize: '11px', color: '#9B999A' }}>
                                <span className='text-primary'>Đăng lúc:</span>
                                <span>{postedTime ? postedTime.split(' ')[1] : '...'}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
            <AlertDialog open={isConfirmLoginOpen} onOpenChange={setIsConfirmLoginOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Bạn chưa đăng nhập</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn cần đăng nhập để ứng tuyển, bạn có muốn đăng nhập không?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Để sau</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmLogin}>
                        Đồng ý
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
             <AlertDialog open={isProfileIncompleteAlertOpen} onOpenChange={setIsProfileIncompleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hồ sơ của bạn chưa hoàn thiện</AlertDialogTitle>
                        <AlertDialogDescription>
                            Để có thể ứng tuyển, bạn cần cập nhật đủ thông tin cá nhân và cung cấp ít nhất một phương thức liên lạc (SĐT, Zalo...). Bạn có muốn cập nhật hồ sơ ngay bây giờ không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Để sau</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmUpdateProfile}>Đồng ý, cập nhật</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <EditProfileDialog 
                isOpen={isProfileEditDialogOpen} 
                onOpenChange={setIsProfileEditDialogOpen} 
                onSaveSuccess={() => {
                    toast({
                        title: 'Cập nhật thành công!',
                        description: 'Thông tin của bạn đã được lưu. Giờ bạn có thể ứng tuyển.',
                        className: 'bg-green-500 text-white'
                    });
                }}
            />
        </>
     );
  }

  if (variant === 'chat') {
    return (
        <div id="HIENTHIVIEC03" onClick={() => router.push(`/viec-lam/${job.id}`)} className="block w-full cursor-pointer">
            <Card className="flex items-start p-3 gap-3 hover:bg-secondary/50 transition-colors">
                <div className="relative w-20 h-20 flex-shrink-0">
                    <Image src={job.image.src} alt={job.title} fill className="object-cover rounded-md" />
                </div>
                <div className="flex-grow overflow-hidden space-y-1">
                    <h4 className="font-semibold text-sm leading-tight line-clamp-2">{job.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3 flex-shrink-0"/>
                        Mã: {job.id}
                    </p>
                     <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 flex-shrink-0"/>
                        Visa: {job.visaDetail}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {job.workLocation}
                    </p>
                    <div className="text-xs font-semibold flex flex-wrap gap-x-3 gap-y-1 pt-1">
                         {job.salary.actual && (
                            <span className="flex items-center gap-1 text-green-600">
                                <DollarSign className="h-3 w-3 flex-shrink-0" />
                                Thực lĩnh: ~{formatCurrency(job.salary.actual)} JPY
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-3 w-3 flex-shrink-0" />
                            Lương: {formatCurrency(job.salary.basic)} JPY
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
  }

  // Default variant: 'grid-item'
  return (
    <>
        <Card id="HIENTHIVIEC02" className={cn("flex h-full flex-col overflow-hidden rounded-lg border border-border shadow-sm transition-shadow duration-300 hover:shadow-lg")}>
             <div className="group cursor-pointer" onClick={handleCardClick}>
                <div className="relative aspect-video w-full">
                     <Image src={job.image.src} alt={job.title} fill className="object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Image src="/img/japanflag.png" alt="Japan flag" width={12} height={12} className="h-3 w-auto" />
                        <span>{job.id}</span>
                      </div>
                      {isClient && <Button variant="outline" size="icon" className="absolute right-1.5 top-1.5 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={handleSaveJob}>
                        <Bookmark className={cn("h-4 w-4", isSaved ? "text-accent-orange fill-current" : "text-gray-400")} />
                      </Button>}
                </div>
                <div className="flex flex-grow flex-col p-3">
                    <h3 className="mb-2 h-10 text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary">{job.title}</h3>
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {job.visaDetail && (
                        <Badge
                            variant="outline"
                            className={cn("px-1.5 py-0 text-xs", {
                                "border-accent-green/70 bg-green-50 text-accent-green": job.visaType?.includes("Thực tập sinh"),
                                "border-accent-blue/70 bg-blue-50 text-accent-blue": job.visaType?.includes("Kỹ năng đặc định"),
                                "border-accent-orange/70 bg-orange-50 text-orange-500": job.visaType?.includes("Kỹ sư, tri thức"),
                            })}
                        >
                            {job.visaDetail}
                        </Badge>
                        )}
                        {job.salary.actual && <Badge variant="secondary" className="border-green-200 bg-green-100 px-1.5 py-0 text-xs text-green-800">Thực lĩnh: {formatCurrency(job.salary.actual)} JPY</Badge>}
                        <Badge variant="secondary" className="px-1.5 py-0 text-xs">Cơ bản: {formatCurrency(job.salary.basic)} JPY</Badge>
                    </div>
                     <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span>{job.workLocation}</span>
                    </div>

                    <div className="mt-auto">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                             <div className="flex items-center gap-1">
                                <Link href={`/tu-van-vien/${job.recruiter.id}`} className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-110">
                                        <AvatarImage src={job.recruiter.avatarUrl} alt={job.recruiter.name} />
                                        <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <ContactButtons contact={job.recruiter as any} job={job} />
                            </div>
                            {isClient && <Button size="sm" className="bg-accent-orange text-white" onClick={handleApplyClick} disabled={hasApplied}>{applyButtonContent}</Button>}
                        </div>
                        {showPostedTime && (
                             <p className="mt-1 text-right text-xs">
                                <span className='text-primary'>Đăng lúc:</span>
                                <span className='text-muted-foreground'> {postedTime ? postedTime.split(' ')[1] : '...'}</span>
                            </p>
                        )}
                    </div>
                </div>
             </div>
        </Card>
        <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        <AlertDialog open={isConfirmLoginOpen} onOpenChange={setIsConfirmLoginOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Bạn chưa đăng nhập</AlertDialogTitle>
                <AlertDialogDescription>
                    Bạn cần đăng nhập để ứng tuyển, bạn có muốn đăng nhập không?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Để sau</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmLogin}>
                    Đồng ý
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={isProfileIncompleteAlertOpen} onOpenChange={setIsProfileIncompleteAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hồ sơ của bạn chưa hoàn thiện</AlertDialogTitle>
                    <AlertDialogDescription>
                        Để có thể ứng tuyển, bạn cần cập nhật đủ thông tin cá nhân và cung cấp ít nhất một phương thức liên lạc (SĐT, Zalo...). Bạn có muốn cập nhật hồ sơ ngay bây giờ không?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Để sau</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmUpdateProfile}>Đồng ý, cập nhật</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
         <EditProfileDialog 
            isOpen={isProfileEditDialogOpen} 
            onOpenChange={setIsProfileEditDialogOpen} 
            onSaveSuccess={() => {
                toast({
                    title: 'Cập nhật thành công!',
                    description: 'Thông tin của bạn đã được lưu. Giờ bạn có thể ứng tuyển.',
                    className: 'bg-green-500 text-white'
                });
            }}
        />
    </>
  );
};
