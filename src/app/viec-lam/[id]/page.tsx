
'use client';

import { notFound, useRouter } from 'next/navigation';
import { jobData, type Job, publicFeeLimits } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, CalendarDays, DollarSign, Heart, MapPin, Sparkles, UserCheck, FileText, Share2, Users, ClipboardCheck, Wallet, UserRound, ArrowLeft, Video, Image as ImageIcon, Milestone, Languages, Cake, ChevronsRight, Info, Star, GraduationCap, Weight, Ruler, Dna, User, Bookmark, BrainCircuit, Loader2, LogIn, UserPlus, Pencil, FastForward, ListChecks, HardHat, PlusCircle } from 'lucide-react';
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
import { EditProfileDialog } from '@/components/candidate-edit-dialog';
import type { SearchFilters } from '@/components/job-search/search-results';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';
import { Industry, industriesByJobType } from '@/lib/industry-data';
import { JsonLdScript } from '@/components/json-ld-script';

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
const USD_VND_RATE = 26300; // Example rate


const formatCurrency = (value?: string, currency: 'JPY' | 'VND' | 'USD' = 'JPY') => {
    if (!value) return 'N/A';
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
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
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) return null;

    const rate = from === 'JPY' ? JPY_VND_RATE : USD_VND_RATE;
    const vndValue = numericValue * rate;
    return `≈ ${vndValue.toLocaleString('vi-VN')} VNĐ`;
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

const CTAForGuest = ({ title, icon: Icon, onLoginClick }: { title: string, icon: React.ElementType, onLoginClick: () => void }) => (
    <section>
        <h2 className="text-2xl font-bold font-headline mb-6"><Icon className="inline-block mr-3 text-primary h-7 w-7"/>{title}</h2>
        <Card className="text-center py-12 px-6 shadow-lg">
             <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Briefcase className="h-10 w-10 text-primary"/>
            </div>
            <p className="font-semibold text-lg">Xem gợi ý việc làm dành riêng cho bạn</p>
            <p className="text-muted-foreground mt-2 mb-6">Đăng nhập hoặc tạo hồ sơ để nhận được những gợi ý phù hợp nhất từ HelloJob AI.</p>
            <Button onClick={onLoginClick}>
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập / Đăng ký
            </Button>
        </Card>
    </section>
);

const CTAForEmptyProfile = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileCreationStep, setProfileCreationStep] = useState(1);
    const [selectedVisa, setSelectedVisa] = useState<{name: string, slug: string} | null>(null);
    const [selectedVisaDetail, setSelectedVisaDetail] = useState<string | null>(null);
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [isCreateDetailOpen, setIsCreateDetailOpen] = useState(false);
    const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const { isLoggedIn } = useAuth();

    const handleCreateProfileRedirect = () => {
        const preferences = {
          desiredVisaType: selectedVisa?.name || undefined,
          desiredVisaDetail: selectedVisaDetail || undefined,
          desiredIndustry: selectedIndustry?.name || undefined,
          desiredLocation: selectedRegion || undefined,
        };
    
        if (isLoggedIn) {
          const existingProfileRaw = localStorage.getItem('generatedCandidateProfile');
          let profile = existingProfileRaw ? JSON.parse(existingProfileRaw) : {};
          
          const updatedAspirations = { ...profile.aspirations };
          if (preferences.desiredVisaType) updatedAspirations.desiredVisaType = preferences.desiredVisaType;
          if (preferences.desiredVisaDetail) updatedAspirations.desiredVisaDetail = preferences.desiredVisaDetail;
          if (preferences.desiredLocation) updatedAspirations.desiredLocation = preferences.desiredLocation;

          profile = {
            ...profile,
            aspirations: updatedAspirations,
          };
          if (preferences.desiredIndustry) profile.desiredIndustry = preferences.desiredIndustry;
    
          localStorage.setItem('generatedCandidateProfile', JSON.stringify(profile));
          setIsDialogOpen(false);
          router.push('/viec-lam-cua-toi?highlight=suggested');
        } else {
          sessionStorage.setItem('onboardingPreferences', JSON.stringify(preferences));
          sessionStorage.setItem('postLoginRedirect', '/viec-lam-cua-toi?highlight=suggested');
          setIsDialogOpen(false);
          setIsConfirmLoginOpen(true);
        }
      };
    
    const handleConfirmLogin = () => {
        setIsConfirmLoginOpen(false);
        setIsAuthDialogOpen(true);
    };
    
    const handleCreateDetailedProfile = (method: 'ai' | 'manual') => {
        setIsCreateDetailOpen(false);
        setIsDialogOpen(false);
        if (method === 'ai') {
            router.push('/tao-ho-so-ai');
        } else {
            router.push('/ho-so-cua-toi');
        }
    };
    
    const FirstStepDialog = () => (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Chọn phương thức tạo hồ sơ</DialogTitle>
                <DialogDescription className="text-center">
                    Bạn muốn tạo hồ sơ để làm gì?
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Card onClick={() => setProfileCreationStep(2)} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                    <FastForward className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-bold text-base mb-1">Tạo nhanh</h3>
                    <p className="text-muted-foreground text-xs">Để HelloJob AI gợi ý việc làm phù hợp cho bạn ngay lập tức.</p>
                </Card>
                 <Card onClick={() => { setIsDialogOpen(false); setIsCreateDetailOpen(true); }} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                    <ListChecks className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-bold text-base mb-1">Tạo chi tiết</h3>
                    <p className="text-muted-foreground text-xs">Để hoàn thiện hồ sơ và sẵn sàng ứng tuyển vào công việc mơ ước.</p>
                </Card>
            </div>
        </>
    );

    const QuickCreateStepDialog = () => (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Chọn loại hình lao động</DialogTitle>
                <DialogDescription className="text-center">
                Hãy chọn loại hình phù hợp nhất với trình độ và mong muốn của bạn.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <Button onClick={() => { setSelectedVisa(japanJobTypes.find(t => t.slug === 'thuc-tap-sinh-ky-nang')!); setProfileCreationStep(3); }} variant="outline" className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                    <HardHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-bold text-base mb-1">Thực tập sinh kỹ năng</h3>
                    <p className="text-muted-foreground text-xs">Lao động phổ thông, 18-40 tuổi.</p>
                </Button>
                <Button onClick={() => { setSelectedVisa(japanJobTypes.find(t => t.slug === 'ky-nang-dac-dinh')!); setProfileCreationStep(3); }} variant="outline" className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                    <UserCheck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-bold text-base mb-1">Kỹ năng đặc định</h3>
                    <p className="text-muted-foreground text-xs">Lao động có hoặc cần thi tay nghề.</p>
                </Button>
                <Button onClick={() => { setSelectedVisa(japanJobTypes.find(t => t.slug === 'ky-su-tri-thuc')!); setProfileCreationStep(3); }} variant="outline" className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                    <GraduationCap className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-bold text-base mb-1">Kỹ sư, tri thức</h3>
                    <p className="text-muted-foreground text-xs">Tốt nghiệp CĐ, ĐH, có thể định cư.</p>
                </Button>
            </div>
            <Button variant="link" onClick={() => setProfileCreationStep(1)} className="mt-4 mx-auto block">Quay lại</Button>
        </>
    );
    
    const VisaDetailStepDialog = () => {
        if (!selectedVisa) return null;
        const options = visaDetailsByVisaType[selectedVisa.slug] || [];
        
        return (
            <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Chọn loại {selectedVisa.name}</DialogTitle>
                <DialogDescription className="text-center">
                Chọn loại hình chi tiết để tiếp tục.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {options.map(option => (
                    <Button key={option.name} onClick={() => { setSelectedVisaDetail(option.name); setProfileCreationStep(4); }} variant="outline" className="h-auto p-4 text-center transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center min-w-[160px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                        <h3 className="font-bold text-base mb-1">{option.name}</h3>
                        <p className="text-muted-foreground text-xs">{option.slug}</p>
                    </Button>
                ))}
            </div>
            <Button variant="link" onClick={() => setProfileCreationStep(2)} className="mt-4 mx-auto block">Quay lại</Button>
            </>
        )
    };
    
    const renderDialogContent = () => {
        switch(profileCreationStep) {
            case 1: return <FirstStepDialog />;
            case 2: return <QuickCreateStepDialog />;
            case 3: return <VisaDetailStepDialog />;
            default: return <FirstStepDialog />;
        }
    }

    return (
        <section>
            <h2 className="text-2xl font-bold font-headline mb-6"><Icon className="inline-block mr-3 text-primary h-7 w-7" />{title}</h2>
            <Card className="text-center py-12 px-6 shadow-lg">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <UserPlus className="h-10 w-10 text-primary" />
                </div>
                <p className="font-semibold text-lg">Tạo hồ sơ để được hiển thị việc làm phù hợp</p>
                <p className="text-muted-foreground mt-2 mb-6">Hoàn thiện hồ sơ của bạn để nhận được những gợi ý việc làm phù hợp nhất từ HelloJob AI.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setProfileCreationStep(1); }}>
                        <DialogTrigger asChild>
                           <Button className="bg-accent-orange hover:bg-accent-orange/90 text-white">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Tạo hồ sơ nhanh
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                           {renderDialogContent()}
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isCreateDetailOpen} onOpenChange={setIsCreateDetailOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tạo hồ sơ chi tiết
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-headline text-center">Bạn muốn tạo hồ sơ chi tiết bằng cách nào?</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <Card onClick={() => handleCreateDetailedProfile('ai')} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                                    <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <h3 className="font-bold text-base mb-1">Dùng AI</h3>
                                    <p className="text-muted-foreground text-xs">Tải lên CV, AI sẽ tự động điền thông tin.</p>
                                </Card>
                                <Card onClick={() => handleCreateDetailedProfile('manual')} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                                    <Pencil className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                    <h3 className="font-bold text-base mb-1">Thủ công</h3>
                                    <p className="text-muted-foreground text-xs">Tự điền thông tin vào biểu mẫu chi tiết.</p>
                                </Card>
                            </div>
                             <div className="mt-4 text-center">
                                <Button variant="link" onClick={() => { setIsCreateDetailOpen(false); setIsDialogOpen(true); }}>Quay lại</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </Card>
            <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
             <AlertDialog open={isConfirmLoginOpen} onOpenChange={setIsConfirmLoginOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Bạn chưa đăng nhập</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn cần có tài khoản để lưu các lựa chọn và xem việc làm phù hợp. Đi đến trang đăng ký/đăng nhập?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Từ chối</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmLogin}>Đồng ý</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    )
};


export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const { role, isLoggedIn, setPostLoginAction } = useAuth();
    const job = jobData.find(j => j.id === resolvedParams.id);
    const [isClient, setIsClient] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [profileSuggestions, setProfileSuggestions] = useState<Job[]>([]);
    const [behavioralSuggestions, setBehavioralSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingBehavioral, setIsLoadingBehavioral] = useState(true);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
    const [isProfileIncompleteAlertOpen, setIsProfileIncompleteAlertOpen] = useState(false);
    const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);
    const [postedTime, setPostedTime] = useState<string | null>(null);
    const [interviewDate, setInterviewDate] = useState<string | null>(null);
    const appliedFilters = {};


    useEffect(() => {
        setIsClient(true);
        if (job) {
            const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
            setIsSaved(savedJobs.includes(job.id));
            const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
            setHasApplied(appliedJobs.includes(job.id));

            // Safely calculate dates on the client to avoid hydration mismatch
            const today = new Date();
            const postedDate = new Date(today);
            postedDate.setDate(today.getDate() + job.postedTimeOffset);
            setPostedTime(`10:00 ${postedDate.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}`);

            const interviewFullDate = new Date(today);
            interviewFullDate.setDate(today.getDate() + job.interviewDateOffset);
            setInterviewDate(interviewFullDate.toISOString().split('T')[0]);

        }

        const fetchSuggestions = async () => {
            setIsLoading(true);
            setIsLoadingBehavioral(true);
            try {
                const storedProfile = localStorage.getItem('generatedCandidateProfile');
                const behavioralSignals = JSON.parse(localStorage.getItem('behavioralSignals') || '[]');
                
                const profile: Partial<CandidateProfile> | null = storedProfile ? JSON.parse(storedProfile) : null;

                if (isLoggedIn && profile) {
                    const profileResults = await matchJobsToProfile(profile, 'related');
                    setProfileSuggestions(profileResults.map(r => r.job).filter(j => j.id !== resolvedParams.id).slice(0, 4));
                }

                const behavioralResults = await matchJobsToProfile(profile || {}, 'related', behavioralSignals);
                setBehavioralSuggestions(behavioralResults.filter(r => r.job.id !== resolvedParams.id).slice(0, 4));

            } catch (error) {
                console.error("Failed to fetch job suggestions:", error);
            } finally {
                setIsLoading(false);
                setIsLoadingBehavioral(false);
            }
        };

        fetchSuggestions();

    }, [job, resolvedParams.id, isLoggedIn]);


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
            // logInteraction(job, 'save'); // CANHANHOA01: Log save interaction
        }
        window.dispatchEvent(new Event('storage'));
    };

    const handleApplyClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isLoggedIn) {
            sessionStorage.setItem('postLoginRedirect', `/viec-lam/${job.id}`);
            setIsConfirmLoginOpen(true);
        } else {
            const profileRaw = localStorage.getItem('generatedCandidateProfile');
            if (profileRaw) {
                const profile: CandidateProfile = JSON.parse(profileRaw);
                if (validateProfileForApplication(profile)) {
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

    const assignedConsultant = job.recruiter;
    const applyButtonContent = hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay';
    
    const getFeeDisplay = (feeValue: string | undefined, feeLabel: string) => {
        const feeLimit = publicFeeLimits[job.visaDetail as keyof typeof publicFeeLimits];
        const isControlled = controlledFeeVisas.includes(job.visaDetail || '');

        if (!feeValue) {
            return isControlled ? "Không rõ" : null;
        }

        const numericFee = parseInt(feeValue);
        if (isControlled && numericFee > feeLimit) {
            return "Không rõ";
        }
        
        return `${formatCurrency(feeValue, 'USD')} (${convertCurrency(feeValue, 'USD')})`;
    };

    const feeWithTuitionDisplay = getFeeDisplay(job.netFeeWithTuition, "Phí và vé và học phí");
    const feeDisplay = getFeeDisplay(job.netFee, job.visaDetail?.includes('Thực tập sinh') ? "Phí và vé không học phí" : "Phí có vé");
    const feeNoTicketDisplay = getFeeDisplay(job.netFeeNoTicket, "Phí không vé");

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

    return (
        <div className="bg-secondary">
            {job && <JsonLdScript job={job} appliedFilters={appliedFilters}/>}
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="mb-6">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/tim-viec-lam"><ArrowLeft className="mr-2 h-4 w-4" />Quay lại trang Việc làm</Link>
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
                                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/> <span className="text-primary">Đăng lúc:</span> {postedTime || "Đang tải..."}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isClient ? (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button size="lg" variant="outline" className={cn("w-full sm:w-auto", isSaved && "border-accent-orange text-accent-orange bg-accent-orange/5")} onClick={handleSaveJob}>
                                            <Bookmark className={cn("mr-2", isSaved && "fill-current text-accent-orange")} />
                                            {isSaved ? 'Việc đã lưu' : 'Lưu việc làm'}
                                        </Button>
                                        <Button size="lg" className="w-full sm:w-auto bg-accent-orange text-white" onClick={handleApplyClick} disabled={hasApplied}>{applyButtonContent}</Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Skeleton className="h-11 w-full sm:w-40" />
                                        <Skeleton className="h-11 w-full sm:w-40" />
                                    </div>
                                )}
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
                                <RequirementItem icon={CalendarDays} label="Ngày phỏng vấn" value={interviewDate ? new Date(interviewDate).toLocaleDateString('vi-VN') : 'Linh hoạt'}/>
                                <RequirementItem icon={ClipboardCheck} label="Số vòng" value={`${job.interviewRounds} vòng`}/>
                                <RequirementItem icon={Wallet} label="Phí và vé và học phí" value={feeWithTuitionDisplay} />
                                <RequirementItem icon={Wallet} label={job.visaDetail?.includes('Thực tập sinh') ? "Phí và vé không học phí" : "Phí có vé"} value={feeDisplay} />
                                <RequirementItem icon={Wallet} label="Phí không vé" value={feeNoTicketDisplay} />
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
                                            {job.details.images[0] && (
                                                <div className="relative aspect-[2/3] overflow-hidden rounded-lg border-2 border-[#9B999A]">
                                                    <Image id="ANHDONHANG01" src={job.details.images[0].src} alt={job.details.images[0].alt} fill className="object-cover" data-ai-hint={job.details.images[0].dataAiHint}/>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 gap-4">
                                                {job.details.images[1] && (
                                                    <div className="relative aspect-video rounded-lg overflow-hidden">
                                                        <Image id="ANHVIECLAM01" src={job.details.images[1].src} alt={job.details.images[1].alt} fill className="object-cover" data-ai-hint={job.details.images[1].dataAiHint}/>
                                                    </div>
                                                )}
                                                {job.details.images[2] && (
                                                    <div className="relative aspect-video rounded-lg overflow-hidden">
                                                        <Image id="ANHKTX01" src={job.details.images[2].src} alt={job.details.images[2].alt} fill className="object-cover" data-ai-hint={job.details.images[2].dataAiHint}/>
                                                    </div>
                                                )}
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
                                    {job.salary.basic && <p className="text-xs text-muted-foreground">{convertCurrency(job.salary.basic, 'JPY')}</p>}
                                    {job.salary.actual && (
                                        <div className="pt-2">
                                            <p className="font-semibold text-muted-foreground">Thực lĩnh: ~{formatCurrency(job.salary.actual, 'JPY')}</p>
                                            {job.salary.actual && <p className="text-xs text-muted-foreground">{convertCurrency(job.salary.actual, 'JPY')}</p>}
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
                            id="MDTVV01"
                            className="shadow-lg group hover:shadow-xl hover:border-primary transition-all"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors"><UserRound/>Tư vấn viên</CardTitle>
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
                             <div className="border-t p-4 flex flex-col items-center gap-4">
                                <div className="flex justify-center gap-2">
                                   <Button asChild variant="link" className="text-muted-foreground text-sm p-0 h-auto">
                                      <Link href="/tu-van-vien">Xem tư vấn viên khác</Link>
                                   </Button>
                                   <Button asChild variant="link" className="text-muted-foreground text-sm p-0 h-auto">
                                      <Link href={`/tu-van-vien/${assignedConsultant.id}`}>Xem hồ sơ chi tiết</Link>
                                   </Button>
                                </div>
                                <div className="flex justify-center gap-2">
                                     <Button variant="ghost" className="text-muted-foreground text-sm" onClick={handleShare}>
                                        <Share2 className="mr-2 h-4 w-4" /> Chia sẻ việc làm
                                    </Button>
                                    <Button variant="ghost" className="text-muted-foreground text-sm">
                                        <Share2 className="mr-2 h-4 w-4" /> Chia sẻ tư vấn viên
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </aside>
                </div>
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
                    
                    {role === 'guest' && (
                        <CTAForGuest title="Gợi ý cho bạn" icon={Star} onLoginClick={() => setIsAuthDialogOpen(true)} />
                    )}
                    {role === 'candidate-empty-profile' && (
                        <CTAForEmptyProfile title="Gợi ý cho bạn" icon={Star} />
                    )}
                    {role === 'candidate' && (
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
                    )}

                    {role === 'candidate' && (
                        <section id="VL001">
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
        </div>
    );
}
