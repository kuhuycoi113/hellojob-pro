
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, DollarSign, Star, FileText, Bookmark, X } from 'lucide-react';
import { Job } from '@/lib/mock-data';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn, convertTime, formatSalaryForDisplay, formatVisa, generateBulletJobCrawl, getFeeDisplayInfo, getJobImage } from '@/lib/utils';
import Link from 'next/link';
import { useAuth, User } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { ContactButtons } from './contact-buttons';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { EditProfileDialog } from '../app/ho-so-cua-toi/components/candidate-edit-dialog';
import type { SearchFilters } from './job-search/search-results';
import { consultants } from '@/lib/consultant-data';
import { applyJob, cancelAppliedJob, updateProfile } from '@/actions/user-action';
import { validateProfileForApplication } from '@/lib/validators';
import { useServerInfo } from './layout/root-provider';
import { NameAvatar } from './ui/name-avatar';


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
            visa: formatVisa(job?.visa),
            title: generateBulletJobCrawl(job),
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

// List of visa details that have special fee handling


export const JobCard = ({ job, showRecruiterName = true, variant = 'grid-item', showPostedTime = false, showLikes = true, showApplyButtons = true, appliedFilters, isSearchPage = false, showCancelApplication = false, onCancelAppliedJob }:
    { job: any, showRecruiterName?: boolean, variant?: 'list-item' | 'grid-item' | 'chat', showPostedTime?: boolean, showLikes?: boolean, showApplyButtons?: boolean, appliedFilters?: SearchFilters, isSearchPage?: boolean, showCancelApplication?: boolean, onCancelAppliedJob?: any }) => {
    const { serverTime } = useServerInfo()
    const { user, setSavedJobCount, setLastAction, isApplying, applyForJob, role } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [isConsultantPopoverOpen, setIsConsultantPopoverOpen] = useState(false);
    const [postedTime, setPostedTime] = useState<string | null>(null);
    const [interviewDate, setInterviewDate] = useState<string | null>(null);
    const [badgeClassName, setBadgeClassName] = useState<string>('opacity-0');
    const [jobTitle, _setJobTitle] = useState(generateBulletJobCrawl(job));
    const [recruiter, _setRecruiter] = useState<any>(() => {
        const salerID = job.salerID;
        let rec = consultants.find(c => c.id === salerID) ?? consultants[0];
        return rec;
    });

    useEffect(() => {
        setIsClient(true);
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setIsSaved(savedJobs.includes(job.id));

        // Safely calculate dates on the client to avoid hydration mismatch
        setPostedTime(convertTime(job?.time || job?.postedDate || job?.createdDate));
        setInterviewDate(job.interviewDay);

        // Safely calculate badge class names on client
        let classes = 'transition-opacity opacity-100 ';
        const visa = formatVisa(job.visa);
        if (visa === 'Thực tập sinh 1 năm') {
            classes += 'border-accent-green/70 bg-green-50 text-[#BDCF58]';
        } else if (visa === 'Thực tập sinh 3 Go') {
            classes += 'border-accent-green/70 bg-green-50 text-[#AFCC11]';
        } else if (visa === 'Đặc định đầu Nhật') {
            classes += 'border-accent-blue/70 bg-blue-50 text-[#009BDA]';
        } else if (visa === 'Đặc định đầu Việt') {
            classes += 'border-accent-blue/60 bg-blue-40 text-[#19A6DF]';
        } else if (visa === 'Đặc định đi mới') {
            classes += 'text-[#40B5E4]';
        } else if (visa === 'Kỹ sư, tri thức đầu Việt') {
            classes += 'border-accent-orange/70 bg-orange-50 text-[#F2B92A]';
        } else if (visa === 'Kỹ sư, tri thức đầu Nhật') {
            classes += 'border-accent-orange/70 bg-orange-50 text-[#F7B102]';
        } else if (visa?.includes("Thực tập sinh")) {
            classes += "border-accent-green/70 bg-green-50 text-accent-green";
        } else if (visa?.includes("Kỹ năng đặc định")) {
            classes += "border-accent-blue/70 bg-blue-50 text-accent-blue";
        } else if (visa?.includes("Kỹ sư, tri thức")) {
            classes += "border-accent-orange/70 bg-orange-50 text-orange-500";
        }
        setBadgeClassName(classes);

    }, [job.id, job.postedDate, job.interviewDate, formatVisa(job.visa)]);
    useEffect(() => {
        if (!!user && !!job?.id) {
            const appliedJobs = user.appliedJobs || [];
            setHasApplied(appliedJobs.includes(job.id));
        }
    }, [job?.id, user?.appliedJobs]);

    const handleSaveJob = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        if (isSaved) {
            const newSavedJobs = savedJobs.filter((id: string) => id !== job.id);
            localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
            setIsSaved(false);
            setSavedJobCount(prev => (prev - 1) < 0 ? 0 : prev - 1);
        } else {
            savedJobs.push(job.id);
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
            setIsSaved(true);
            logInteraction(job, 'save'); // CANHANHOA01: Log save interaction
            setSavedJobCount(prev => prev + 1);
            setLastAction('saved');
        }
        // Trigger a storage event to update other components like the "My Jobs" page
        window.dispatchEvent(new Event('storage'));
    };

    const handleApplyClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        await applyForJob(job, jobTitle);
    };

    const handleCancelApplicationClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!!user) {
            const appliedJobs: any[] = [...(user.appliedJobs || [])];
            const appliedJobIndex = appliedJobs.indexOf(job.id);
            if (appliedJobIndex > -1) {
                appliedJobs.splice(appliedJobIndex, 1);
            }
            await cancelAppliedJob(user.uid, job.id);
            await updateProfile(user.uid, { appliedJobs });
            user.appliedJobs = [...appliedJobs];
            if (!!onCancelAppliedJob) {
                onCancelAppliedJob();
            }
            toast({
                title: 'Hủy ứng tuyển thành công!',
                description: `Lịch sử ứng tuyển của bạn cho công việc "${jobTitle}" đã được thu hồi.`
                // className: 'bg-green-500 text-white'
            });
        }
        // if (!isLoggedIn) {
        //     setPostLoginAction({ type: 'APPLY_JOB', data: { jobId: job.id, jobTitle: jobTitle, job } });
        //     setIsConfirmLoginOpen(true);
        // } else {
        //     const missingFields = validateProfileForApplication(user);
        //     if (missingFields?.length === 0 && !!user) {
        //         const appliedJobs = user.appliedJobs || [];
        //         appliedJobs.push(job.id);
        //         await applyJob(user.uid, job);
        //         await updateProfile(user.uid, { appliedJobs });
        //         user.appliedJobs = Object.assign([], appliedJobs);
        //         setHasApplied(true);
        //         setApplicationCount(prev => prev + 1);
        //         setLastAction('applied');
        //         toast({
        //             title: 'Ứng tuyển thành công!',
        //             description: `Hồ sơ của bạn đã được gửi cho công việc "${jobTitle}".`,
        //             className: 'bg-green-500 text-white'
        //         });
        //     } else {
        //         setIsProfileIncompleteAlertOpen(true);
        //     }
        // }
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
    const feeInfo = getFeeDisplayInfo(job, isSearchPage, role);
    const feeFilterIsActive = !!(appliedFilters?.netFee || appliedFilters?.netFeeNoTicket || role === 'admin');
    let isExpired = false;
    if (job.expiredDate < serverTime) {
        isExpired = true;
    }
    const renderConsultantComponent = () => {
        switch (role) {
            case 'admin': {
                let secondColor = "#3B5998";
                let titleLinkGroup = "#";
                let contactLink = "#";
                switch (job.source) {
                    case "ZALO": {
                        secondColor = "#0068FF";
                        if (job.contact?.length) {
                            contactLink = `https://zalo.me/${job.contact}`;
                        } else {
                            contactLink = job.senderLink;
                        }
                        titleLinkGroup = job.groupLink;
                        break;
                    }
                    case "FACEBOOK": {
                        secondColor = "#3B5998";
                        // titleLinkGroup = candidate?.contact ?? candidate?.postLink ?? candidate?.groupLink;
                        contactLink = job.contact;
                        titleLinkGroup = job.postLink ?? job.contact ?? job.groupLink;
                        break;
                    }
                    case "SUNRISE": {
                        secondColor = "#AFC536";
                        titleLinkGroup = job.contact;
                        break;
                    }
                }
                const poster = {
                    groupName: job.groupName,
                    groupLink: titleLinkGroup,
                    zalo: contactLink
                };
                return <>
                    <Popover open={isConsultantPopoverOpen} onOpenChange={setIsConsultantPopoverOpen}>
                        <PopoverTrigger asChild>
                            {/* <div onMouseEnter={() => setIsConsultantPopoverOpen(true)} onMouseLeave={() => setIsConsultantPopoverOpen(false)}> */}
                            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                <NameAvatar fullName={job.sender} size={30} className='cursor-pointer transition-transform hover:scale-110' />
                            </div>
                            {/* </div> */}
                        </PopoverTrigger>
                        <PopoverContent className="w-80" side="top" align="start">
                            <div className="flex gap-4">
                                <NameAvatar fullName={job.sender} size={16} />
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">{job.sender}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {job.groupName}
                                    </p>
                                    {(contactLink || titleLinkGroup) && <Button asChild size="sm" variant="link" className="h-auto p-0">
                                        <Link href={contactLink ?? titleLinkGroup} target='_blank'>Thử truy cập</Link>
                                    </Button>}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <ContactButtons contact={poster} job={job} showChatText={true} />
                </>;
            } default: {
                return <>
                    <Popover open={isConsultantPopoverOpen} onOpenChange={setIsConsultantPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Link href={`/tu-van-vien/${recruiter.id}`} className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-110">
                                    <AvatarImage src={recruiter.avatarUrl} alt={recruiter.name} />
                                    <AvatarFallback>{recruiter.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Link>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" side="top" align="start">
                            <div className="flex gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={recruiter.avatarUrl} alt={recruiter.name} />
                                    <AvatarFallback>{recruiter.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">{recruiter.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {recruiter.mainExpertise}
                                    </p>
                                    <Button asChild size="sm" variant="link" className="h-auto p-0">
                                        <Link href={`/tu-van-vien/${recruiter.id}`}>Xem hồ sơ</Link>
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <ContactButtons contact={recruiter} job={job} showChatText={true} />
                </>;
            }
        }
    }
    if (variant === 'list-item') {
        return (
            <>
                <div id="HIENTHIVIEC01" className={cn("w-full transition-shadow duration-300 hover:shadow-lg rounded-lg cursor-pointer border bg-card text-card-foreground", isExpired && "opacity-60 grayscale cursor-not-allowed")} onClick={handleCardClick}>
                    <div className="p-3 hover:bg-secondary/30">
                        <div className="flex flex-col items-stretch gap-4 md:flex-row">
                            <div className="relative h-48 w-full flex-shrink-0 md:h-40 md:w-60">
                                <Image src={job.avatar || getJobImage(job.job, job.career)} unoptimized alt={jobTitle} fill sizes='100%' className="rounded-lg object-cover" />
                                {isExpired && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                        <Badge variant="destructive" className="text-base px-4 py-2">Đã hết hạn</Badge>
                                    </div>
                                )}
                                <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                                    <Image src="/img/japanflag.png" alt="Japan flag" width={12} height={12} className="h-3 w-auto" />
                                    <span>{job.code}</span>
                                </div>
                                {isClient && <Button variant="outline" size="icon" className="absolute right-1.5 top-1.5 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white md:hidden" onClick={handleSaveJob}>
                                    <Bookmark className={cn("h-4 w-4", isSaved ? "text-accent-orange fill-current" : "text-gray-400")} />
                                </Button>}
                                {
                                    role === 'admin' &&
                                    <div className='absolute left-0 bottom-0' style={{
                                        overflow: 'auto',
                                        fontSize: '11px',
                                        padding: '5px',
                                        borderRadius: '5px 5px 0 0',
                                        maxHeight: 'calc(100% - 50px)',
                                        backgroundColor: 'rgba(255,255,255,.9)'
                                    }}>
                                        {job.aiContent ?? job.baseContent}
                                    </div>
                                }
                            </div>

                            <div className="flex flex-grow flex-col">
                                <h3 className="mb-2 text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary">{jobTitle}</h3>
                                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                                    {isClient && (
                                        <>
                                            {job.visa && (
                                                <Badge
                                                    variant="outline"
                                                    className={badgeClassName}
                                                >
                                                    {formatVisa(job.visa)}
                                                </Badge>
                                            )}
                                            {job.realSalary > 0 && <Badge variant="secondary" className="border-green-200 bg-green-100 text-xs text-green-800">Thực lĩnh: {formatSalaryForDisplay(job.realSalary, formatVisa(job.visa))}</Badge>}
                                            {job.basicSalary > 0 && <Badge variant="secondary" className="text-xs">Lương cơ bản: {formatSalaryForDisplay(job.basicSalary, formatVisa(job.visa))}</Badge>}
                                            {feeFilterIsActive && feeInfo.shouldShow && (
                                                <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 border-red-200">
                                                    {feeInfo.text}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p className="flex items-center gap-1.5">
                                        <span className="text-primary">Ngày phỏng vấn:</span>
                                        <span>{interviewDate || "Liên hệ"}</span>
                                    </p>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p className="items-center gap-1.5 line-clamp-1">
                                        <MapPin className="h-4 w-4 flex-shrink-0 inline mr-1" />
                                        <span>{job.workLocation?.length ? job.workLocation : "Liên hệ"}</span>
                                    </p>
                                </div>

                                <div className="mt-auto flex flex-wrap items-end justify-between gap-y-2 pt-2">
                                    <div className="flex items-center gap-1">
                                        {renderConsultantComponent()}
                                    </div>
                                    {isClient && <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className={cn("hidden bg-white md:flex border-gray-300", isSaved && "border border-accent-orange bg-background text-accent-orange hover:bg-accent-orange/5 hover:text-accent-orange")} onClick={handleSaveJob}>
                                            <Bookmark className={cn("mr-2 h-5 w-5", isSaved ? "fill-current text-accent-orange" : "text-gray-400")} />
                                            Lưu
                                        </Button>
                                        {showApplyButtons && <Button size="sm" className="bg-accent-orange text-white" onClick={handleApplyClick} disabled={hasApplied || isExpired || isApplying}>{applyButtonContent}</Button>}
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
            </>
        );
    }

    if (variant === 'chat') {
        return (
            <div id="HIENTHIVIEC03" onClick={!isExpired ? () => router.push(`/viec-lam/${job.id}`) : undefined} className={cn("block w-full relative", isExpired ? "cursor-not-allowed" : "cursor-pointer")}>
                <Card className={cn(
                    "flex items-start p-3 gap-3 transition-colors",
                    !isExpired && "hover:bg-secondary/50" // Only apply hover effect when not expired
                )}>
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <Image src={job.avatar || getJobImage(job.job, job.career)} unoptimized alt={jobTitle} fill className={cn("object-cover rounded-md", isExpired && "grayscale")} />
                    </div>
                    <div className={cn("flex-grow overflow-hidden space-y-1", isExpired && "text-muted-foreground")}>
                        <h4 className={cn("font-semibold text-sm leading-tight line-clamp-2", !isExpired && "text-foreground")}>{jobTitle}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3 flex-shrink-0" />
                            Mã: {job.code}
                        </p>
                        {isClient && formatVisa(job.visa) && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Star className="h-3 w-3 flex-shrink-0" />
                                Visa: {formatVisa(job.visa)}
                            </p>
                        )}
                        <div className="text-xs text-muted-foreground">
                            <p className="flex items-center gap-1.5">
                                <span className={cn(!isExpired && "text-primary")}>Ngày PV:</span>
                                <span>{interviewDate || "N/A"}</span>
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground items-center gap-1 line-clamp-1">
                            <MapPin className="h-3 w-3 flex-shrink-0 inline mr-1" />
                            {job.workLocation?.length ? job.workLocation : 'Liên hệ'}
                        </p>
                        <div className="text-xs font-semibold flex flex-wrap gap-x-3 gap-y-1 pt-1">
                            {job.realSalary > 0 && (
                                <span className={cn("flex items-center gap-1", !isExpired && "text-green-600")}>
                                    <DollarSign className="h-3 w-3 flex-shrink-0" />
                                    Thực lĩnh: {formatSalaryForDisplay(job.realSalary, formatVisa(job.visa))}
                                </span>
                            )}
                            {job.basicSalary > 0 && <span className="flex items-center gap-1 text-muted-foreground">
                                <DollarSign className="h-3 w-3 flex-shrink-0" />
                                Lương cơ bản: {formatSalaryForDisplay(job.basicSalary, formatVisa(job.visa))}
                            </span>}
                        </div>
                        <p className="text-right text-[11px] mt-1">
                            <span className={cn(!isExpired && "text-primary")}>Đăng lúc:</span>
                            <span> {postedTime ? postedTime.split(' ')[1] : '...'}</span>
                        </p>
                    </div>
                </Card>
                {isExpired && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                        <span className="font-bold text-white text-base px-4 py-1 rounded-full">Đã hết hạn</span>
                    </div>
                )}
            </div>
        );
    }

    // Default variant: 'grid-item'
    return (
        <>
            <Card id="HIENTHIVIEC02" className={cn("flex h-full flex-col overflow-hidden rounded-lg border border-border shadow-sm transition-shadow duration-300", isExpired && "grayscale")}>
                <div className={cn("group cursor-pointer", isExpired && "cursor-not-allowed")} onClick={handleCardClick}>
                    <div className="relative aspect-video w-full">
                        <Image src={job.avatar || getJobImage(job.job, job.career)} unoptimized alt={jobTitle} fill className="object-cover transition-transform group-hover:scale-105" />
                        {isExpired && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Badge variant="destructive" className="text-base px-4 py-2">Đã hết hạn</Badge>
                            </div>
                        )}
                        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                            <Image src="/img/japanflag.png" alt="Japan flag" width={12} height={12} className="h-3 w-auto" />
                            <span>{job.code}</span>
                        </div>
                        {isClient && <Button variant="outline" size="icon" className="absolute right-1.5 top-1.5 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={handleSaveJob}>
                            <Bookmark className={cn("h-4 w-4", isSaved ? "text-accent-orange fill-current" : "text-gray-400")} />
                        </Button>}
                    </div>
                    <div className={cn("flex flex-grow flex-col p-3", isExpired && "opacity-60")}>
                        <h3 className="mb-2 h-10 text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary">{jobTitle}</h3>
                        <div className="mb-2 flex flex-wrap items-start gap-x-1 gap-y-1" style={{ height: '42px' }}>
                            {isClient && (
                                <>
                                    {job.visa && (
                                        <Badge
                                            variant="outline"
                                            className={badgeClassName}
                                        >
                                            {formatVisa(job.visa)}
                                        </Badge>
                                    )}
                                    {job.realSalary > 0 && <Badge variant="secondary" className="border-green-200 bg-green-100 px-1.5 py-0 text-xs text-green-800">Thực lĩnh: {formatSalaryForDisplay(job.realSalary, formatVisa(job.visa))}</Badge>}
                                    {job.basicSalary > 0 && <Badge variant="secondary" className="px-1.5 py-0 text-xs">Lương cơ bản: {formatSalaryForDisplay(job.basicSalary, formatVisa(job.visa))}</Badge>}
                                </>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            <p className="flex items-center gap-1.5">
                                <span className="text-primary">Ngày phỏng vấn:</span>
                                <span>{interviewDate || "Liên hệ"}</span>
                            </p>
                        </div>
                        <div className="my-2 items-center gap-1 text-xs text-muted-foreground line-clamp-1">
                            <MapPin className="h-3 w-3 flex-shrink-0 inline mr-1" />
                            <span>{job.workLocation?.length ? job.workLocation : 'Liên hệ'}</span>
                        </div>

                        <div className="mt-auto">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                {showRecruiterName && <div className="flex items-center gap-1">
                                    <Link href={`/tu-van-vien/${recruiter.id}`} className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-110">
                                            <AvatarImage src={recruiter.avatarUrl} alt={recruiter.name} />
                                            <AvatarFallback>{recruiter.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <ContactButtons contact={recruiter as any} job={job} />
                                </div>}
                                {isClient && showApplyButtons && <Button size="sm" className="bg-accent-orange text-white" onClick={handleApplyClick} disabled={hasApplied || isExpired || isApplying}>{applyButtonContent}</Button>}
                                {hasApplied && showCancelApplication &&
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "bg-transparent text-muted-foreground",
                                                    "border-destructive text-destructive hover:bg-destructive/10"
                                                )}
                                                size="sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <X className="mr-1 h-4 w-4" />Huỷ ứng tuyển
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent id="XNHUT001" onClick={(e) => e.stopPropagation()}>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Xác nhận huỷ ứng tuyển?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bạn có chắc chắn muốn huỷ ứng tuyển công việc "{job.title}" không? Hành động này sẽ được ghi nhận ngay lập tức.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Để sau</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleCancelApplicationClick}>Đồng ý</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                }
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
        </>
    );
};
