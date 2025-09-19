

'use client';

import { notFound, useRouter } from 'next/navigation';
import { jobData, type Job } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, CalendarDays, DollarSign, Heart, MapPin, Sparkles, UserCheck, FileText, Share2, Users, ClipboardCheck, Wallet, UserRound, ArrowLeft, Video, Image as ImageIcon, Milestone, Languages, Cake, ChevronsRight, Info, Star, GraduationCap, Weight, Ruler, Dna, User, Bookmark, BrainCircuit, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { use, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { consultants } from '@/lib/consultant-data';
import { ContactButtons } from '@/components/contact-buttons';
import { matchJobsToProfile } from '@/ai/flows/match-jobs-to-profile-flow';
import type { CandidateProfile } from '@/ai/schemas';
import { JobCard } from '@/components/job-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
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

const JobDetailSection = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-xl"><Icon className="text-primary h-6 w-6"/>{title}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none text-muted-foreground prose-sm md:prose-base">
            {children}
        </CardContent>
    </Card>
);

const JPY_VND_RATE = 180; // Example rate

const formatCurrency = (value?: string, currency: 'JPY' | 'VND' = 'JPY') => {
    if (!value) return 'N/A';
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) return value;
    
    if (currency === 'VND') {
        return `${numericValue.toLocaleString('vi-VN')} VNĐ`;
    }
    return `${numericValue.toLocaleString('ja-JP')} yên`;
};

const convertToVnd = (jpyValue?: string) => {
    if (!jpyValue) return null;
    const numericValue = parseInt(jpyValue.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) return null;
    const vndValue = numericValue * JPY_VND_RATE;
    return `≈ ${vndValue.toLocaleString('vi-VN')} VNĐ`;
};


export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const { role, isLoggedIn } = useAuth();
    const job = jobData.find(j => j.id === resolvedParams.id);
    const [isSaved, setIsSaved] = useState(false);
    const [profileSuggestions, setProfileSuggestions] = useState<Job[]>([]);
    const [behavioralSuggestions, setBehavioralSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingBehavioral, setIsLoadingBehavioral] = useState(true);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);

    useEffect(() => {
        if (job) {
            const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
            setIsSaved(savedJobs.includes(job.id));
        }

        const fetchSuggestions = async () => {
            setIsLoading(true);
            setIsLoadingBehavioral(true);
            try {
                const storedProfile = localStorage.getItem('generatedCandidateProfile');
                const behavioralSignals = JSON.parse(localStorage.getItem('behavioralSignals') || '[]');
                
                const profile: Partial<CandidateProfile> | null = storedProfile ? JSON.parse(storedProfile) : null;

                // Fetch profile-based suggestions
                if (profile) {
                    const profileResults = await matchJobsToProfile(profile, 'related');
                    setProfileSuggestions(profileResults.map(r => r.job).filter(j => j.id !== resolvedParams.id).slice(0, 4));
                }

                // Fetch behavior-based suggestions if signals exist
                if (behavioralSignals.length > 0) {
                    const behavioralResults = await matchJobsToProfile(profile || {}, 'related', behavioralSignals);
                    setBehavioralSuggestions(behavioralResults.filter(r => r.job.id !== resolvedParams.id).slice(0, 4));
                }

            } catch (error) {
                console.error("Failed to fetch job suggestions:", error);
            } finally {
                setIsLoading(false);
                setIsLoadingBehavioral(false);
            }
        };

        fetchSuggestions();

    }, [job, resolvedParams.id]);


    if (!job) {
        notFound();
    }
    
    const handleSaveJob = () => {
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

    const handleShare = async () => {
        const shareData = {
          title: job.title,
          text: `Hãy xem công việc này trên HelloJob: ${job.title}`,
          url: window.location.href,
        };
        const copyLink = () => {
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Đã sao chép liên kết!",
                description: "Bạn có thể dán và chia sẻ liên kết này.",
            });
        }
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (err: any) {
             // Check if the error is an AbortError, which occurs when the user cancels the share dialog.
            if (err.name === 'AbortError') {
                // Silently ignore user cancellation
                console.log('Share cancelled by user.');
            } else {
                console.error("Error sharing:", err);
                // Fallback to copying the link for other errors
                copyLink();
            }
          }
        } else {
          // Fallback for desktop or browsers that don't support the API
          copyLink();
        }
    };

    const assignedConsultant = job.recruiter;

    const RequirementItem = ({ icon: Icon, label, value, className }: { icon: React.ElementType, label: string, value?: string | number, className?: string }) => {
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

    return (
        <div className="bg-secondary">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="mb-6">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/jobs"><ArrowLeft className="mr-2 h-4 w-4" />Quay lại trang Việc làm</Link>
                    </Button>
                </div>
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <h1 className="text-2xl md:text-3xl font-bold font-headline">{job.title}</h1>
                                <p className="flex items-center gap-2 text-xs bg-white px-2 py-1 rounded-md w-fit mb-3">
                                    <Image src="/img/japanflag.png" alt="Japan flag" width={16} height={16} className="h-4 w-4"/>
                                    <span className="text-primary">Mã việc làm: <span className="text-[#FF1400]">{job.id}</span></span>
                                </p>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {job.workLocation}</p>
                                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/> <span className="text-primary">Đăng lúc:</span> {job.postedTime}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" variant="outline" className={cn("w-full sm:w-auto", isSaved && "border-accent-orange text-accent-orange bg-accent-orange/5")} onClick={handleSaveJob}>
                                        <Bookmark className={cn("mr-2", isSaved && "fill-current text-accent-orange")} />
                                        {isSaved ? 'Việc đã lưu' : 'Lưu việc làm'}
                                    </Button>
                                    <Button size="lg" className="w-full sm:w-auto bg-accent-orange text-white" onClick={handleApplyClick}>Ứng tuyển ngay</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 font-headline text-xl"><Info className="text-primary h-6 w-6"/>Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <RequirementItem icon={Milestone} label="Loại Visa" value={job.visaType}/>
                                <RequirementItem icon={ChevronsRight} label="Chi tiết Visa" value={job.visaDetail}/>
                                <RequirementItem icon={Briefcase} label="Ngành nghề" value={job.industry}/>
                                <RequirementItem icon={MapPin} label="Nơi phỏng vấn" value={job.interviewLocation}/>
                                <RequirementItem icon={User} label="Giới tính" value={job.gender}/>
                                <RequirementItem icon={Users} label="Số lượng" value={`${job.quantity} người`}/>
                                <RequirementItem icon={Cake} label="Yêu cầu tuổi" value={job.ageRequirement}/>
                                <RequirementItem icon={Languages} label="Yêu cầu ngoại ngữ" value={job.languageRequirement}/>
                                <RequirementItem icon={CalendarDays} label="Ngày phỏng vấn" value={job.interviewDate}/>
                                <RequirementItem icon={ClipboardCheck} label="Số vòng" value={`${job.interviewRounds} vòng`}/>
                                <RequirementItem icon={Wallet} label="Mức phí" value={job.netFee}/>
                                <RequirementItem icon={Star} label="Điều kiện đặc biệt" value={job.specialConditions}/>
                            </CardContent>
                        </Card>
                        
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 font-headline text-xl"><UserCheck className="text-primary h-6 w-6"/>Yêu cầu chi tiết</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <RequirementItem icon={GraduationCap} label="Yêu cầu học vấn" value={job.educationRequirement}/>
                                <RequirementItem icon={Briefcase} label="Kinh nghiệm" value={job.experienceRequirement}/>
                                <RequirementItem icon={CalendarDays} label="Số năm kinh nghiệm" value={job.yearsOfExperience}/>
                                <RequirementItem icon={Ruler} label="Chiều cao" value={job.heightRequirement}/>
                                <RequirementItem icon={Weight} label="Cân nặng" value={job.weightRequirement}/>
                                {job.hepatitisBRequirement === 'Không nhận viêm gan B' && (
                                    <RequirementItem icon={Dna} label="Viêm gan B" value={job.hepatitisBRequirement}/>
                                )}
                                <RequirementItem icon={User} label="Hình xăm" value={job.tattooRequirement}/>
                                <RequirementItem icon={ImageIcon} label="Yêu cầu thị lực" value={job.visionRequirement}/>
                                <RequirementItem icon={ClipboardCheck} label="Hình thức phỏng vấn" value={job.interviewFormat}/>
                            </CardContent>
                        </Card>

                        <JobDetailSection title="Mô tả công việc & Ghi chú" icon={FileText}>
                            <div dangerouslySetInnerHTML={{ __html: job.details.description }} />
                        </JobDetailSection>

                         <JobDetailSection title="Quyền lợi & Chế độ" icon={Sparkles}>
                             <div dangerouslySetInnerHTML={{ __html: job.details.benefits }} />
                        </JobDetailSection>

                        { (job.details.videoUrl || (job.details.images && job.details.images.length > 0)) &&
                           <JobDetailSection title="Hình ảnh & Video công việc" icon={ImageIcon}>
                                <div className="space-y-6">
                                    {job.details.videoUrl && (
                                        <div className="aspect-video">
                                            <iframe id="VIDEOVIECLAM01" className="w-full h-full rounded-lg" src={job.details.videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                        </div>
                                    )}
                                    {job.details.images && job.details.images.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative aspect-[2/3] overflow-hidden rounded-lg border-2 border-[#9B999A]">
                                                <Image id="ANHDONHANG01" src={job.details.images[0].src} alt={job.details.images[0].alt} fill className="object-cover" data-ai-hint={job.details.images[0].dataAiHint}/>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="relative aspect-video rounded-lg overflow-hidden">
                                                    <Image id="ANHVIECLAM01" src={job.details.images[1].src} alt={job.details.images[1].alt} fill className="object-cover" data-ai-hint={job.details.images[1].dataAiHint}/>
                                                </div>
                                                <div className="relative aspect-video rounded-lg overflow-hidden">
                                                    <Image id="ANHKTX01" src={job.details.images[2].src} alt={job.details.images[2].alt} fill className="object-cover" data-ai-hint={job.details.images[2].dataAiHint}/>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </JobDetailSection>
                        }

                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                        <Card className="shadow-lg">
                            <CardHeader>
                               <CardTitle className="text-lg">Mức lương</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Lương cơ bản</p>
                                    <p className="text-2xl font-bold text-accent-green">{formatCurrency(job.salary.basic, 'JPY')}</p>
                                    {job.salary.basic && <p className="text-xs text-muted-foreground">{convertToVnd(job.salary.basic)}</p>}
                                    {job.salary.actual && (
                                        <div className="pt-2">
                                            <p className="font-semibold text-muted-foreground">Thực lĩnh: ~{formatCurrency(job.salary.actual, 'JPY')}</p>
                                            {job.salary.actual && <p className="text-xs text-muted-foreground">{convertToVnd(job.salary.actual)}</p>}
                                        </div>
                                    )}
                               </div>
                               <div className="border-t pt-4 space-y-2 text-sm">
                                   {job.salary.annualIncome && <p>Thu nhập năm: <strong>{job.salary.annualIncome}</strong></p>}
                                   {job.salary.annualBonus && <p>Thưởng: <strong>{job.salary.annualBonus}</strong></p>}
                               </div>
                            </CardContent>
                        </Card>
                        <Card 
                            className="shadow-lg group hover:shadow-xl hover:border-primary transition-all cursor-pointer"
                            onClick={(e) => {
                                // Only navigate if the click is directly on the card and not on an interactive element inside
                                if ((e.target as HTMLElement).closest('a, button')) return;
                                router.push(`/consultant-profile/${assignedConsultant.id}`);
                            }}
                        >
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors"><UserRound/>Tư vấn viên</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={assignedConsultant.avatar} alt={assignedConsultant.name} />
                                        <AvatarFallback>{assignedConsultant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-primary">{assignedConsultant.name}</p>
                                        <p className="text-sm text-muted-foreground">{assignedConsultant.mainExpertise}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <ContactButtons contact={assignedConsultant} />
                                </div>
                            </CardContent>
                            <div className="border-t p-4 flex justify-center">
                                <Button variant="ghost" className="text-muted-foreground text-sm" onClick={handleShare}>
                                    <Share2 className="mr-2 h-4 w-4"/>Chia sẻ tin này
                                </Button>
                            </div>
                        </Card>
                    </aside>
                </div>
                 {/* Suggestions Section */}
                <div className="mt-16 pt-12 border-t space-y-12">
                    <section id="behavioral-suggestions">
                        <h2 className="text-2xl font-bold font-headline mb-6"><BrainCircuit className="inline-block mr-3 text-primary h-7 w-7"/>Có thể bạn quan tâm</h2>
                        {isLoadingBehavioral ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                 {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)}
                            </div>
                        ) : behavioralSuggestions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {behavioralSuggestions.map((item) => (
                                    <JobCard key={item.job.id} job={item.job} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Không có gợi ý nào. Hãy xem thêm các công việc khác để chúng tôi hiểu bạn hơn!</p>
                        )}
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold font-headline mb-6"><Star className="inline-block mr-3 text-primary h-7 w-7"/>Gợi ý cho bạn</h2>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)}
                            </div>
                        ) : profileSuggestions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {profileSuggestions.map((job) => <JobCard key={job.id} job={job} />)}
                            </div>
                        ) : (
                             <p className="text-muted-foreground">Không có gợi ý nào dựa trên hồ sơ của bạn. Hãy cập nhật hồ sơ để nhận gợi ý tốt hơn.</p>
                        )}
                    </section>

                    {role === 'candidate' && (
                        <section id="VL001">
                            {/* This is the empty module for future design */}
                        </section>
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
                    <AlertDialogCancel>Từ chối</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmLogin}>
                        Đồng ý
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
