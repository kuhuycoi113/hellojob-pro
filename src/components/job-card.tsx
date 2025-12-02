'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, DollarSign, Star, FileText, Bookmark, X, Pencil, EyeOff } from 'lucide-react';
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
import { ContactButtons } from './contact-buttons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { SearchFilters } from './job-search/search-results';
import { consultants } from '@/lib/consultant-data';
import { cancelAppliedJob, updateProfile } from '@/actions/user-action';
import { useServerInfo } from './layout/root-provider';
import { NameAvatar } from './ui/name-avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { closeJob } from '@/actions/job-action';
import { useImagePreview } from '@/contexts/ImagePreviewContext';

// ====================================================================
// PURE UTILITIES (Trích xuất logic tính toán không cần state)
// ====================================================================

// CANHANHOA01: Function to log user interaction
const logInteraction = (job: Job, type: 'view' | 'save') => {
    try {
        const MAX_SIGNALS = 50;
        let signals: Partial<Job>[] = JSON.parse(localStorage.getItem('behavioralSignals') || '[]');
        const signal: Partial<Job> = {
            id: job.id,
            industry: job.industry,
            workLocation: job.workLocation,
            visa: formatVisa(job?.visa??null),
            title: generateBulletJobCrawl(job),
        };
        signals = [signal, ...signals.filter(s => s.id !== job.id)];
        if (signals.length > MAX_SIGNALS) {
            signals = signals.slice(0, MAX_SIGNALS);
        }
        localStorage.setItem('behavioralSignals', JSON.stringify(signals));
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error("Error logging user interaction:", error);
    }
};

// Pure function to calculate badge class
const getVisaBadgeClasses = (visa: string): string => {
    let classes = 'transition-opacity opacity-100 ';
    // Logic tương tự trong file gốc, chỉ được trích xuất ra hàm thuần túy
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
    } else if (visa === 'Kỹ sư đầu Việt') {
        classes += 'border-accent-orange/70 bg-orange-50 text-[#F2B92A]';
    } else if (visa === 'Kỹ sư đầu Nhật') {
        classes += 'border-accent-orange/70 bg-orange-50 text-[#F7B102]';
    } else if (visa?.includes("Thực tập sinh")) {
        classes += "border-accent-green/70 bg-green-50 text-accent-green";
    } else if (visa?.includes("Đặc định")) {
        classes += "border-accent-blue/70 bg-blue-50 text-accent-blue";
    } else if (visa?.includes("Kỹ sư")) {
        classes += "border-accent-orange/70 bg-orange-50 text-orange-500";
    }
    return classes;
};

// ====================================================================
// SUB-COMPONENT (Tách biệt logic hiển thị Recruiter/Admin)
// ====================================================================

const JobRecruiterInfo = ({ job, recruiter, role, isConsultantPopoverOpen, setIsConsultantPopoverOpen, showChatText = true }:
    { job: any, recruiter: any, role: string, isConsultantPopoverOpen: boolean, showChatText?: boolean, setIsConsultantPopoverOpen: (open: boolean) => void }) => {
    // Logic cho vai trò Admin
    if (role === 'admin') {
        let titleLinkGroup = "#";
        let contactLink = "#";
        switch (job.source) {
            case "ZALO": {
                contactLink = job.contact?.length ? `https://zalo.me/${job.contact}` : job.senderLink;
                titleLinkGroup = job.groupLink;
                break;
            }
            case "FACEBOOK": {
                contactLink = job.contact;
                titleLinkGroup = job.postLink ?? job.contact ?? job.groupLink;
                break;
            }
            case "SUNRISE": {
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
                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <NameAvatar fullName={job.sender} size={30} className='cursor-pointer transition-transform hover:scale-110' />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-100" side="top" align="start">
                    <div className="flex gap-2">
                        <NameAvatar fullName={job.sender} size={30} />
                        <div className="space-y-0.5">
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
            <ContactButtons contact={poster} job={job} showChatText={showChatText} />
        </>;
    }

    // Logic cho vai trò mặc định (Consultant)
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
};

// ====================================================================
// MAIN COMPONENT (Tối ưu hóa hooks và logic)
// ====================================================================

export const JobCard = ({ job, showRecruiterName = true, variant = 'grid-item', showPostedTime = false, showApplyButtons = true, appliedFilters, isSearchPage = false, showCancelApplication = false, onCancelAppliedJob }:
    { job: any, showRecruiterName?: boolean, variant?: 'list-item' | 'grid-item' | 'chat', showPostedTime?: boolean, showLikes?: boolean, showApplyButtons?: boolean, appliedFilters?: SearchFilters, isSearchPage?: boolean, showCancelApplication?: boolean, onCancelAppliedJob?: any }) => {
    const { setImagePreview } = useImagePreview();
    const { serverTime } = useServerInfo();
    const { user, setSavedJobCount, setLastAction, isApplying, applyForJob, role, setPostLoginAction } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    // 1. Trạng thái component đơn giản
    const [isClient, setIsClient] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [isConsultantPopoverOpen, setIsConsultantPopoverOpen] = useState(false);

    // 2. Các giá trị dẫn xuất (Derived Values) - Dùng useMemo
    const jobTitle = useMemo(() => generateBulletJobCrawl(job), [job]);
    const jobVisa = useMemo(() => formatVisa(job.visa), [job.visa]);
    const badgeClassName = useMemo(() => getVisaBadgeClasses(jobVisa as any), [jobVisa]);
    const postedTime = useMemo(() => convertTime(job?.time || job?.postedDate || job?.createdDate), [job]);
    const interviewDate = useMemo(() => job.interviewDay, [job.interviewDay]);
    const isExpired = useMemo(() => job?.expiredDate < serverTime, [job?.expiredDate, serverTime]);
    const feeInfo = useMemo(() => getFeeDisplayInfo(job, isSearchPage, role), [job, isSearchPage, role]);
    const feeFilterIsActive = useMemo(() => !!(appliedFilters?.netFee || appliedFilters?.netFeeNoTicket || role === 'admin'), [appliedFilters, role]);

    // Tính toán Recruiter/Consultant (chỉ chạy khi salerID thay đổi)
    const recruiter = useMemo(() => {
        const salerID = job.salerID;
        return consultants.find(c => c.id === salerID) ?? consultants[0];
    }, [job.salerID]);


    // 3. Logic Side Effect (Tách biệt khỏi logic tính toán)

    // Effect: Khởi tạo trạng thái client và Saved Job từ localStorage (chỉ chạy 1 lần)
    useEffect(() => {
        setIsClient(true);
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setIsSaved(savedJobs.includes(job.id));
    }, [job.id]);

    // Effect: Kiểm tra trạng thái ứng tuyển (chạy khi user hoặc job thay đổi)
    useEffect(() => {
        if (!!user && !!job?.id) {
            const appliedJobs = user.appliedJobs || [];
            setHasApplied(appliedJobs.includes(job.id));
        }
    }, [job?.id, user?.appliedJobs, user]);


    // 4. Handlers (Sử dụng useCallback nếu cần truyền xuống component con)
    const handleSaveJob = useCallback((e: React.MouseEvent) => {
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
            logInteraction(job, 'save');
            setSavedJobCount(prev => prev + 1);
            setLastAction('saved');
        }
        window.dispatchEvent(new Event('storage'));
    }, [job, isSaved, setSavedJobCount, setLastAction]);

    const handleApplyClick = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        await applyForJob(job, jobTitle);
    }, [job, jobTitle, applyForJob]);

    const handleCancelApplicationClick = useCallback(async (e: React.MouseEvent) => {
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
            });
        }
    }, [job.id, jobTitle, user, onCancelAppliedJob, toast]);

    const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('a, button')) {
            return;
        } // Ngăn chặn điều hướng khi hết hạn
        logInteraction(job, 'view');
        router.push(`/viec-lam/${job.id}`);
    }, [job, router, isExpired]);

    const applyButtonContent = hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển';

    // 5. Render theo variant
    if (variant === 'list-item') {
        return (
            <>
                <div id="HIENTHIVIEC01" className={cn("w-full transition-shadow duration-300 hover:shadow-lg rounded-lg border bg-card text-card-foreground", isExpired && "opacity-60 grayscale")}>
                    <div className="p-3 hover:bg-secondary/30">
                        <div className="flex flex-col items-stretch gap-4 md:flex-row">
                            <Link href={`/viec-lam/${job.id}`} className="relative h-48 w-full flex-shrink-0 md:h-40 md:w-60">
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
                            </Link>

                            <div className="flex flex-grow flex-col">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="mb-2 text-lg font-bold leading-tight line-clamp-2 hover:text-primary"><Link href={`/viec-lam/${job.id}`}>{jobTitle}</Link></h3>
                                    {role === 'admin' && <Button id="SUADON01" variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => setPostLoginAction({ type: 'QUICK_EDIT_JOB', data: job })}>
                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                    </Button>}
                                </div>
                                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                                    {isClient && (
                                        <>
                                            {job.visa && (
                                                <Badge
                                                    variant="outline"
                                                    className={badgeClassName}
                                                >
                                                    {jobVisa}
                                                </Badge>
                                            )}
                                            {job.realSalary > 0 && <Badge variant="secondary" className="border-green-200 bg-green-100 text-xs text-green-800">Thực lĩnh: {formatSalaryForDisplay(job.realSalary, jobVisa)}</Badge>}
                                            {job.basicSalary > 0 && <Badge variant="secondary" className="text-xs">Lương cơ bản: {formatSalaryForDisplay(job.basicSalary, jobVisa)}</Badge>}
                                            {feeFilterIsActive && feeInfo.shouldShow && (
                                                <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 border-red-200">
                                                    {feeInfo.text}
                                                </Badge>
                                            )}
                                            {!!job.formImage && role === 'admin' && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                setImagePreview(job.formImage)
                                                            }} className="relative flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 border-muted bg-secondary">
                                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                                {job.formImage && (
                                                                    <Star className="absolute -top-1.5 -right-1.5 h-3 w-3 text-yellow-400 fill-yellow-400" />
                                                                )}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {!!job.formImage && role === 'admin' ? (
                                                                <p>Việc làm này có form đơn hàng đẹp</p>
                                                            ) : (
                                                                <p>Việc làm này có ảnh form đơn hàng</p>
                                                            )}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
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
                                        {/* Tối ưu: Thay thế renderConsultantComponent bằng Sub-Component */}
                                        <JobRecruiterInfo
                                            job={job}
                                            recruiter={recruiter}
                                            role={role}
                                            isConsultantPopoverOpen={isConsultantPopoverOpen}
                                            setIsConsultantPopoverOpen={setIsConsultantPopoverOpen}
                                        />
                                    </div>
                                    {isClient && <div className="flex items-center gap-2">
                                        {
                                            role === 'admin' && <Button variant="outline" size="sm" className="hidden bg-white md:flex text-destructive border-destructive/50 hover:bg-destructive/5 hover:text-destructive" onClick={() => setPostLoginAction({ type: 'REQUEST_CLOSE_JOB', data: { id: job.id } })} >
                                                <EyeOff className="mr-2 h-5 w-5" />
                                                Đóng
                                            </Button>
                                        }
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
                                    <span>{postedTime ?? '...'}</span>
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
            <div id="HIENTHIVIEC03" onClick={!isExpired ? handleCardClick : undefined} className={cn("block w-full relative", isExpired ? "cursor-not-allowed" : "cursor-pointer")}>
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
                        {isClient && jobVisa && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Star className="h-3 w-3 flex-shrink-0" />
                                Visa: {jobVisa}
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
                                    Thực lĩnh: {formatSalaryForDisplay(job.realSalary, jobVisa)}
                                </span>
                            )}
                            {job.basicSalary > 0 && <span className="flex items-center gap-1 text-muted-foreground">
                                <DollarSign className="h-3 w-3 flex-shrink-0" />
                                Lương cơ bản: {formatSalaryForDisplay(job.basicSalary, jobVisa)}
                            </span>}
                        </div>
                        <p className="text-right text-[11px] mt-1">
                            <span className={cn(!isExpired && "text-primary")}>Đăng lúc:</span>
                            <span> {postedTime ?? '...'}</span>
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
                <div className={cn("group cursor-pointer")} onClick={handleCardClick}>
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
                                            {jobVisa}
                                        </Badge>
                                    )}
                                    {job.realSalary > 0 && <Badge variant="secondary" className="border-green-200 bg-green-100 px-1.5 py-0 text-xs text-green-800">Thực lĩnh: {formatSalaryForDisplay(job.realSalary, jobVisa)}</Badge>}
                                    {job.basicSalary > 0 && <Badge variant="secondary" className="px-1.5 py-0 text-xs">Lương cơ bản: {formatSalaryForDisplay(job.basicSalary, jobVisa)}</Badge>}
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
                                    {/* Tối ưu: Thay thế renderConsultantComponent bằng Sub-Component */}
                                    <JobRecruiterInfo
                                        job={job}
                                        recruiter={recruiter}
                                        role={role}
                                        isConsultantPopoverOpen={isConsultantPopoverOpen}
                                        setIsConsultantPopoverOpen={setIsConsultantPopoverOpen}
                                        showChatText={false}
                                    />
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
                                                    Bạn có chắc chắn muốn huỷ ứng tuyển công việc "{jobTitle}" không? Hành động này sẽ được ghi nhận ngay lập tức.
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
                                    <span className='text-muted-foreground'> {postedTime ?? '...'}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};