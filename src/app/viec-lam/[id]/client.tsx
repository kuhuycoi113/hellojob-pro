'use client';

import { notFound, useRouter } from 'next/navigation';
import { publicFeeLimits, controlledFeeVisas } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, CalendarDays, MapPin, Sparkles, UserCheck, FileText, Share2, Users, ClipboardCheck, Wallet, UserRound, ArrowLeft, Image as ImageIcon, Milestone, Languages, Cake, ChevronsRight, Info, Star, GraduationCap, Weight, Ruler, Dna, User, Bookmark, BrainCircuit, Loader2, LogIn, UserPlus, Pencil, FastForward, ListChecks, HardHat, PlusCircle, MoreHorizontal, Copy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { use, useState, useEffect } from 'react';
import { cn, convertTime, findVisaByVisaDetail, formatGender, formatSalaryForDisplay, formatVisa, generateBulletJobCrawl, getJobImage, getVisaBadgeClassName } from '@/lib/utils';
import { consultants } from '@/lib/consultant-data';
import { ContactButtons } from '@/components/contact-buttons';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/../contexts/AuthContext';
import { AuthDialog } from '@/components/auth-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { EditProfileDialog } from '@/app/ho-so-cua-toi/components/candidate-edit-dialog';
import type { SearchFilters } from '@/components/job-search/search-results';
import { validateProfileForApplication } from '@/lib/validators';
import { CtaViecLamTuongTu } from '@/components/cta-viec-lam-tuong-tu';
import { findSuggestedJobs, getJobByCode } from '@/actions/job-action';
import { applyJob, updateProfile } from '@/actions/user-action';
import { useServerInfo } from '@/components/layout/root-provider';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const JobDetailSection = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-xl"><Icon className="text-primary h-6 w-6" />{title}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none text-muted-foreground prose-sm md:prose-base">
            {children}
        </CardContent>
    </Card>
);

const JPY_VND_RATE = 180; // Example rate
const USD_VND_RATE = 26300; // Example rate


const formatCurrency = (value?: any, currency: 'JPY' | 'VND' | 'USD' = 'JPY') => {
    if (!value) return 'Liên hệ';
    const numericValue = typeof value === 'number' ? value : parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) return value;

    if (currency === 'VND') {
        return `${numericValue.toLocaleString('vi-VN')} VNĐ`;
    }
    if (currency === 'USD') {
        return `${numericValue.toLocaleString('en-US')} USD`;
    }
    return `${numericValue.toLocaleString('ja-JP')} yên`;
};


const convertCurrency = (value?: string, from: 'JPY' | 'USD' = 'JPY') => {
    if (!value) return null;
    const numericValue = parseInt(('' + value).replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) return null;

    const rate = from === 'JPY' ? JPY_VND_RATE : USD_VND_RATE;
    const vndValue = numericValue * rate;
    return `≈ ${vndValue.toLocaleString('vi-VN')} VNĐ`;
};

const visasForVndDisplay = [
    'Thực tập sinh 3 năm',
    'Thực tập sinh 1 năm',
    'Đặc định đi mới',
    'Kỹ sư, tri thức đầu Việt',
];

export default function JobDetailClientPage({ job, behavioralSuggestions }: { job: any, behavioralSuggestions: any[] }) {
    const { toast } = useToast();
    const { serverTime } = useServerInfo();
    const { isLoggedIn, setPostLoginAction, user, setApplicationCount, setSavedJobCount, setLastAction } = useAuth();
    const [isClient, setIsClient] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
    const [isProfileIncompleteAlertOpen, setIsProfileIncompleteAlertOpen] = useState(false);
    const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);
    const [postedTime, setPostedTime] = useState<string | null>(null);
    const [interviewDate, setInterviewDate] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setIsSaved(savedJobs.includes(job.id));
        console.log(job)
        // Safely calculate dates on the client to avoid hydration mismatch
        setPostedTime(convertTime(job?.time || job?.postedDate || job?.createdDate));

        if (!!job.interviewDay) {
            setInterviewDate(job.interviewDay);
        }
    }, []);

    useEffect(() => {
        if (!!user) {
            const appliedJobs = user.appliedJobs || [];
            setHasApplied(appliedJobs.includes(job.id));
        }
    }, [user])

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
            setSavedJobCount(prev => prev + 1);
            setLastAction('saved');
        }
        window.dispatchEvent(new Event('storage'));
    };

    const handleApplyClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isLoggedIn) {
            setPostLoginAction({ type: 'APPLY_JOB', data: { jobId: job.id, jobTitle: job.title } });
            setIsConfirmLoginOpen(true);
        } else {
            if (validateProfileForApplication(user) && !!user) {
                const appliedJobs = user.appliedJobs || [];
                appliedJobs.push(job.id);
                await applyJob(user.uid, job);
                await updateProfile(user.uid, { appliedJobs });
                user.appliedJobs = Object.assign([], appliedJobs);
                setHasApplied(true);
                setApplicationCount(prev => prev + 1);
                setLastAction('applied');
                toast({
                    title: 'Ứng tuyển thành công!',
                    description: `Hồ sơ của bạn đã được gửi cho công việc "${job.title}".`,
                    className: 'bg-green-500 text-white'
                });
            } else {
                setIsProfileIncompleteAlertOpen(true);
            }
        }
    };

    const handleConfirmLogin = () => {
        setIsConfirmLoginOpen(false);
        setIsAuthDialogOpen(true);
    };

    const handleConfirmUpdateProfile = () => {
        setIsProfileIncompleteAlertOpen(false);
        setIsProfileEditDialogOpen(true);
    };

    const handleShare = async () => {
        const shareUrl = `https://vi.hellojob.jp/viec-lam/${job.id}`;
        const shareData = {
            title: job.title,
            text: `Hãy xem công việc này trên HelloJob: ${job.title}`,
            url: shareUrl,
        };
        const copyLink = () => {
            navigator.clipboard.writeText(shareUrl);
            toast({
                title: "Đã sao chép liên kết!",
                description: "Bạn có thể dán và chia sẽ liên kết việc làm này.",
            });
        }
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log('Share cancelled by user.');
                } else {
                    console.error("Error sharing:", err);
                    copyLink();
                }
            }
        } else {
            copyLink();
        }
    };

    const getFeeDisplay = (feeValue: any | undefined, feeLabel: string) => {
        const isControlled = controlledFeeVisas.includes(job.visa || '');
        if (!feeValue) {
            return isControlled ? "Không rõ" : null;
        }
        const feeLimit = publicFeeLimits[job.visa as keyof typeof publicFeeLimits];

        const numericFee = parseInt(feeValue);
        if (isControlled && numericFee > feeLimit) {
            return "Không rõ";
        }

        return `${formatCurrency(feeValue, 'USD')} (${convertCurrency(feeValue, 'USD')})`;
    };

    const RequirementItem = ({ icon: Icon, label, value, className }: { icon: React.ElementType, label: string, value?: string | number | null, className?: string }) => {
        if (!value) return null;
        return (
            <div className={cn("flex items-start gap-3", className)}>
                <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="text-muted-foreground">{value}</p>
                </div>
            </div>
        )
    };
    if (typeof job === 'undefined') {
        return <div className="flex justify-center items-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    }

    const assignedConsultant = consultants[3];
    const applyButtonContent = hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay';

    const feeWithTuitionDisplay = getFeeDisplay(job.fee, "Phí và vé và học phí");
    const feeDisplay = getFeeDisplay(job.fee, job.visa?.includes('Thực tập sinh') ? "Phí và vé không học phí" : "Phí có vé");
    const feeNoTicketDisplay = getFeeDisplay(job.netFeeNoTicket, "Phí không vé");
    const avatar = job.avatar || getJobImage(job.job, job.career);
    const badgeClassName = getVisaBadgeClassName(job.visa);
    let isExpired = false;
    if (job.expiredDate < serverTime) {
        isExpired = true;
    }
    let annualIncome = null;
    if (job.basicSalary > 100000 && job.basicSalary < 900000) {
        annualIncome = job.basicSalary * 12;
    }

    if (!!job) {
        return (
            <>
                <div className="bg-secondary">
                    {/* {job && <JsonLdScript job={job} appliedFilters={appliedFilters} />} */}
                    <div className="container mx-auto px-4 md:px-6 py-12">
                        <div className="mb-6">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/tim-viec-lam"><ArrowLeft className="mr-2 h-4 w-4" />Quay lại trang Việc làm</Link>
                            </Button>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8 items-start">
                            {/* Main Content */}
                            <div className={cn("lg:col-span-2 space-y-6", isExpired && "grayscale")}>
                                <Card id="VLCT-HEADER" className="shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-bold font-headline">{job.title}</h1>
                                            <div id="IDVLCT01" className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white w-fit my-3">
                                                <Image src="/img/japanflag.png" alt="Japan flag" width={16} height={16} className="h-3 w-auto" />
                                                <span>{job.code}</span>
                                            </div>
                                            {isClient && job.visa && (
                                                <Badge
                                                    variant="outline"
                                                    className={cn("mt-3 w-fit", badgeClassName)}
                                                >
                                                    {formatVisa(job.visa)}
                                                </Badge>
                                            )}
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mt-3">
                                                {job.workLocation && <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.workLocation}</p>}
                                                <p className="flex items-center gap-2">
                                                    <span className="text-primary font-medium">Ngày phỏng vấn:</span>
                                                    <span>{interviewDate || "Lịch phỏng vấn linh hoạt"}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex flex-col sm:flex-row items-baseline justify-between gap-4">
                                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                {isClient ? (
                                                    <>
                                                        <Button size="lg" variant="outline" className={cn("w-full sm:w-auto text-base", isSaved ? "border-accent-orange text-accent-orange bg-accent-orange/5" : "border-gray-300")} onClick={handleSaveJob}>
                                                            <Bookmark className={cn("mr-2", isSaved && "fill-current text-accent-orange")} />
                                                            {isSaved ? 'Việc đã lưu' : 'Lưu việc làm'}
                                                        </Button>
                                                        <Button size="lg" className="w-full sm:w-auto bg-accent-orange text-white text-base" onClick={handleApplyClick} disabled={hasApplied || isExpired}>
                                                            {isExpired ? 'Đã hết hạn' : applyButtonContent}
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Skeleton className="h-11 w-full sm:w-40" />
                                                        <Skeleton className="h-11 w-full sm:w-40" />
                                                    </>
                                                )}
                                            </div>
                                            <div className="w-full text-right">
                                                <p className="text-xs text-muted-foreground flex items-center justify-end gap-2">
                                                    <span className="text-primary font-medium">Đăng lúc:</span>
                                                    <span>{postedTime || "..."}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {isExpired && (
                                            <Alert variant="destructive" className="mt-4">
                                                <Info className="h-4 w-4" />
                                                <AlertTitle className="font-bold">Việc làm đã hết hạn</AlertTitle>
                                                <AlertDescription>
                                                    Tin tuyển dụng này đã hết hạn. Bạn có thể tham khảo các việc làm tương tự bên dưới.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 font-headline text-xl"><Info className="text-primary h-6 w-6" />Thông tin cơ bản</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <RequirementItem icon={Milestone} label="Loại Visa" value={findVisaByVisaDetail(job.visa)} />
                                        <RequirementItem icon={ChevronsRight} label="Chi tiết Visa" value={job.visa} />
                                        <RequirementItem icon={Briefcase} label="Ngành nghề" value={job.job ?? job.career ?? 'Liên hệ'} />
                                        <RequirementItem icon={MapPin} label="Nơi phỏng vấn" value={job.interviewLocation ?? 'Liên hệ'} />
                                        <RequirementItem icon={User} label="Giới tính" value={job.gender ? formatGender(job.gender) : 'Liên hệ'} />
                                        <RequirementItem icon={Users} label="Số lượng" value={job.numberRecruits ? `${job.numberRecruits} người` : null} />
                                        <RequirementItem icon={Cake} label="Yêu cầu tuổi" value={job.minAge && job.maxAge ? `${job.minAge} - ${job.maxAge}` : job.minAge ? `Từ ${job.minAge}` : job.maxAge ? `Đến ${job.maxAge}` : null} />
                                        <RequirementItem icon={Languages} label="Yêu cầu ngoại ngữ" value={job.languageLevel ?? 'Không yêu cầu'} />
                                        <RequirementItem icon={CalendarDays} label="Ngày phỏng vấn" value={interviewDate ? interviewDate : 'Linh hoạt'} />
                                        <RequirementItem icon={ClipboardCheck} label="Số vòng" value={job.interviewRounds ? `${job.interviewRounds} vòng` : null} />
                                        <RequirementItem icon={Wallet} label="Phí và vé và học phí" value={feeWithTuitionDisplay ?? 'Liên hệ'} />
                                        <RequirementItem icon={Wallet} label={job.visa?.includes('Thực tập sinh') ? "Phí và vé không học phí" : "Phí có vé"} value={feeDisplay} />
                                        <RequirementItem icon={Wallet} label="Phí không vé" value={feeNoTicketDisplay ?? 'Liên hệ'} />
                                        <RequirementItem icon={Star} label="Điều kiện đặc biệt" value={job.specialConditions} />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 font-headline text-xl"><UserCheck className="text-primary h-6 w-6" />Yêu cầu chi tiết</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <RequirementItem icon={GraduationCap} label="Yêu cầu học vấn" value={job.educationLevel ?? 'Không yêu cầu'} />
                                        <RequirementItem icon={Briefcase} label="Kinh nghiệm" value={job.experience ?? 'Không yêu cầu'} />
                                        <RequirementItem icon={CalendarDays} label="Số năm kinh nghiệm" value={job.experienceYear ?? 'Không yêu cầu'} />
                                        <RequirementItem icon={Ruler} label="Chiều cao" value={job.height ?? 'Không yêu cầu'} />
                                        <RequirementItem icon={Weight} label="Cân nặng" value={job.weight ?? 'Không yêu cầu'} />
                                        <RequirementItem icon={Dna} label="Viêm gan B" value={job.vgb ?? 'Không yêu cầu'} />
                                        <RequirementItem icon={User} label="Hình xăm" value={job.haveTattoo ?? 'Không yêu cầu'} />
                                        <RequirementItem icon={ImageIcon} label="Yêu cầu thị lực" value={job.vision ?? 'Không yêu cầu'} />
                                        <RequirementItem icon={ClipboardCheck} label="Hình thức phỏng vấn" value={job.interviewFormat ?? 'Không yêu cầu'} />
                                    </CardContent>
                                </Card>

                                <JobDetailSection title="Mô tả công việc & Ghi chú" icon={FileText}>
                                    <div>
                                        <p>Mô tả chi tiết cho công việc {(job.career || job.job) && <strong>{job.job ?? job.career}, {job.workLocation}{job.numberRecruits ? `, tuyển ${job.numberRecruits} ${job.gender ? formatGender(job.gender) : 'người'}` : ''}</strong>}
                                            . Đây là cơ hội tuyệt vời để làm việc trong một môi trường chuyên nghiệp tại Nhật Bản
                                            . Công việc đòi hỏi sự cẩn thận, tỉ mỉ và trách nhiệm cao để đảm bảo chất lượng sản phẩm tốt nhất.</p>
                                        <ul>
                                            {(job.career || job.job) && <li>Chi tiết công việc: {job.job ?? job.career}.</li>}
                                            <li>Môi trường làm việc sạch sẽ, hiện đại.</li>
                                        </ul>
                                    </div>
                                </JobDetailSection>

                                <JobDetailSection title="Quyền lợi & Chế độ" icon={Sparkles}>
                                    {job.benefits && <div dangerouslySetInnerHTML={{ __html: job.benefits }} />}
                                    {!job.benefits && <div><ul><li>Hưởng đầy đủ chế độ bảo hiểm (y tế, hưu trí, thất nghiệp) theo quy định của pháp luật Nhật Bản.</li><li>Hỗ trợ chi phí nhà ở và đi lại.</li><li>Có nhiều cơ hội làm thêm giờ để tăng thu nhập.</li><li>Được đào tạo bài bản và có cơ hội phát triển, gia hạn hợp đồng lâu dài.</li><li>Thưởng 1-2 lần/năm tùy theo kết quả kinh doanh.</li></ul></div>}
                                </JobDetailSection>

                                {(job.videoUrl || job.avatar) &&
                                    <JobDetailSection title="Hình ảnh & Video công việc" icon={ImageIcon}>
                                        <div className={cn("space-y-6", isExpired && "grayscale")}>
                                            {job.videoUrl && (
                                                <div className="aspect-video">
                                                    <iframe id="VIDEOVIECLAM01" className="w-full h-full rounded-lg" src={job.videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </div>
                                            )}
                                            {!!avatar && (
                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                    <div className="relative aspect-[5/3] overflow-hidden rounded-lg border-2 border-[#9B999A]">
                                                        <Image id={job.code} src={avatar} alt={job.code} fill className="object-cover" quality={100} unoptimized />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </JobDetailSection>
                                }

                            </div>

                            {/* Sidebar */}
                            <aside className={cn("lg:col-span-1 space-y-6 lg:sticky lg:top-24", isExpired && "grayscale pointer-events-none")}>
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Mức lương</CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">Lương cơ bản</p>
                                            <p className="text-2xl font-bold text-accent-green">{formatSalaryForDisplay(job.basicSalary, formatVisa(job.visa))}</p>
                                            {job.basicSalary > 0 && <p className="text-xs text-muted-foreground">{convertCurrency(job.basicSalary, 'JPY')}</p>}
                                            {job.realSalary > 0 && (
                                                <div className="pt-2">
                                                    <p className="font-semibold text-muted-foreground">Thực lĩnh: ~{formatSalaryForDisplay(job.realSalary, formatVisa(job.visa))}</p>
                                                    {job.realSalary && <p className="text-xs text-muted-foreground">{convertCurrency(job.realSalary, 'JPY')}</p>}
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t pt-4 space-y-2 text-sm">
                                            {!!annualIncome && <p>Thu nhập năm: Khoảng <strong>{formatSalaryForDisplay(annualIncome, formatVisa(job.visa))}</strong></p>}
                                            {job.annualBonus && <p>Thưởng: <strong>{job.annualBonus}</strong></p>}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card
                                    id="MDTVV01"
                                    className="shadow-lg group hover:shadow-xl hover:border-primary transition-all"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors"><UserRound />Tư vấn viên</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/tu-van-vien/${assignedConsultant.id}`} onClick={(e) => e.stopPropagation()}>
                                                <Avatar className="h-12 w-12 cursor-pointer transition-transform hover:scale-110">
                                                    <AvatarImage src={assignedConsultant.avatarUrl} alt={assignedConsultant.name} />
                                                    <AvatarFallback>{assignedConsultant.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </Link>
                                            <div>
                                                <Link href={`/tu-van-vien/${assignedConsultant.id}`} onClick={(e) => e.stopPropagation()}>
                                                    <p className="font-semibold text-primary hover:underline">{assignedConsultant.name}</p>
                                                </Link>
                                                <p className="text-sm text-muted-foreground">{assignedConsultant.mainExpertise}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <ContactButtons contact={assignedConsultant as any} job={job} showChatText={true} />
                                        </div>
                                    </CardContent>
                                    <div className="border-t p-4 grid grid-cols-2 gap-2">
                                        <Button variant="ghost" className="text-muted-foreground text-sm" onClick={handleShare}>
                                            <Copy className="mr-2 h-4 w-4" />Giới thiệu việc làm
                                        </Button>
                                        <Button variant="ghost" className="text-muted-foreground text-sm">
                                            <Share2 className="mr-2 h-4 w-4" />Giới thiệu tư vấn viên
                                        </Button>
                                        <Button asChild variant="ghost" className="text-muted-foreground text-sm">
                                            <Link href="/tu-van-vien"><Users className="mr-2 h-4 w-4" />Tư vấn viên khác</Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="text-muted-foreground text-sm">
                                            <Link href={`/tu-van-vien/${assignedConsultant.id}`}><User className="mr-2 h-4 w-4" />Xem hồ sơ chi tiết</Link>
                                        </Button>
                                    </div>
                                </Card>
                            </aside>
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
                                <AlertDialogAction onClick={handleConfirmLogin}>Đồng ý</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={isProfileIncompleteAlertOpen} onOpenChange={setIsProfileIncompleteAlertOpen}>
                        <AlertDialogContent id="UNGTUYEN-L02-B1">
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
                        source="application"
                    />
                </div>
                <div className="space-t-20 md:space-t-28 pt-20 md:pt-28">
                    <CtaViecLamTuongTu isLoading={false} suggestions={behavioralSuggestions} />
                </div>
            </>
        );
    }

}