

'use client';

import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Bookmark, Star, Eye, List, LayoutGrid, PlusCircle, Edit, LogIn, UserPlus, Loader2, Sparkles, HardHat, UserCheck, GraduationCap, FastForward, ListChecks, ChevronLeft, ChevronRight, Pencil, X, ThumbsUp, TrendingUp, ShieldCheck } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { jobData, type Job } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { JobListRow } from '@/components/job-list-row';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileViewersDialog } from '@/components/profile-viewers-dialog';
import { StatCard } from '@/components/dashboard/stat-card';
import { JobStatsChart } from '@/components/dashboard/job-stats-chart';
import { ProgressTracker } from '@/components/progress-tracker';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { matchJobsToProfile } from '@/ai/flows/match-jobs-to-profile-flow';
import { type CandidateProfile } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthDialog } from '@/components/auth-dialog';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Industry, industriesByJobType } from '@/lib/industry-data';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { locations } from '@/lib/location-data';


const aspirations = [
    { id: 1, title: 'Kỹ sư cơ khí, Osaka', salary: '220,000 JPY', type: 'Kỹ sư' },
    { id: 2, title: 'Chế biến thực phẩm, Tokyo', salary: '180,000 JPY', type: 'Tokutei' },
];

const appliedJobs = jobData.slice(0, 3).map(job => ({ ...job, applicationStatus: 'NTD đã xem', appliedDate: '2024-07-20' }));
const savedJobs = jobData.slice(2, 5);


const viewers = [
  { name: 'A', src: 'https://placehold.co/40x40.png?text=A' },
  { name: 'B', src: 'https://placehold.co/40x40.png?text=B' },
  { name: 'C', src: 'https://placehold.co/40x40.png?text=C' },
  { name: 'D', src: 'https://placehold.co/40x40.png?text=D' },
  { name: 'E', src: 'https://placehold.co/40x40.png?text=E' },
  { name: 'F', src: 'https://placehold.co/40x40.png?text=F' },
];

const EmptyProfileView = () => {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileCreationStep, setProfileCreationStep] = useState(1);
    const [selectedVisaType, setSelectedVisaType] = useState<string | null>(null);
    const [selectedVisaDetail, setSelectedVisaDetail] = useState<string | null>(null);
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const [selectedJob, setSelectedJob] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const { isLoggedIn } = useAuth();
    const [isCreateDetailOpen, setIsCreateDetailOpen] = useState(false);


    const handleCreateProfileRedirect = () => {
        const preferences = {
          desiredVisaType: selectedVisaType || undefined,
          desiredVisaDetail: selectedVisaDetail || undefined,
          desiredIndustry: selectedIndustry?.name || undefined,
          desiredLocation: selectedRegion || undefined,
        };
    
        if (isLoggedIn) {
          console.log("Applying preferences for logged in user:", preferences);
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
          router.push('/jobs?highlight=suggested');
        } else {
          sessionStorage.setItem('onboardingPreferences', JSON.stringify(preferences));
          sessionStorage.setItem('postLoginRedirect', '/jobs?highlight=suggested');
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
            router.push('/ai-profile');
        } else {
            router.push('/register');
        }
    };
    
    const FirstStepDialog = () => (
        <>
        {/* Screen: THSN001 */}
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
            {/* Screen: THSN002 */}
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Chọn loại hình lao động</DialogTitle>
                <DialogDescription className="text-center">
                Hãy chọn loại hình phù hợp nhất với trình độ và mong muốn của bạn.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Button 
                onClick={() => { setSelectedVisaType('Thực tập sinh kỹ năng'); setProfileCreationStep(3); }} 
                variant="outline" 
                className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                <HardHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-bold text-base mb-1">Thực tập sinh kỹ năng</h3>
                <p className="text-muted-foreground text-xs">Lao động phổ thông, 18-40 tuổi.</p>
            </Button>
            <Button 
                onClick={() => { setSelectedVisaType('Kỹ năng đặc định'); setProfileCreationStep(3); }}
                variant="outline" 
                className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                <UserCheck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-bold text-base mb-1">Kỹ năng đặc định</h3>
                <p className="text-muted-foreground text-xs">Lao động có hoặc cần thi tay nghề.</p>
            </Button>
            <Button 
                onClick={() => { setSelectedVisaType('Kỹ sư, tri thức'); setProfileCreationStep(3); }}
                variant="outline" 
                className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                <GraduationCap className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-bold text-base mb-1">Kỹ sư, tri thức</h3>
                <p className="text-muted-foreground text-xs">Tốt nghiệp CĐ, ĐH, có thể định cư.</p>
            </Button>
            </div>
            <Button variant="link" onClick={() => setProfileCreationStep(1)} className="mt-4 mx-auto block">Quay lại</Button>
        </>
    );

    const visaDetailsOptions: { [key: string]: { label: string, description: string }[] } = {
        'Thực tập sinh kỹ năng': [
          { label: 'Thực tập sinh 3 năm', description: 'Chương trình phổ thông nhất' },
          { label: 'Thực tập sinh 1 năm', description: 'Chương trình ngắn hạn' },
          { label: 'Thực tập sinh 3 Go', description: 'Dành cho người có kinh nghiệm' },
        ],
        'Kỹ năng đặc định': [
          { label: 'Đặc định đầu Nhật', description: 'Dành cho người đang ở Nhật' },
          { label: 'Đặc định đầu Việt', description: 'Dành cho người ở Việt Nam' },
          { label: 'Đặc định đi mới', description: 'Lần đầu đăng ký' },
        ],
        'Kỹ sư, tri thức': [
          { label: 'Kỹ sư đầu Nhật', description: 'Dành cho kỹ sư đang ở Nhật' },
          { label: 'Kỹ sư đầu Việt', description: 'Dành cho kỹ sư ở Việt Nam' },
        ],
    };
    
    const VisaDetailStepDialog = () => {
        if (!selectedVisaType) return null;
        const options = visaDetailsOptions[selectedVisaType];
        
        let screenIdComment = '';
        if (selectedVisaType === 'Thực tập sinh kỹ năng') screenIdComment = '// Screen: THSN003-1';
        else if (selectedVisaType === 'Kỹ năng đặc định') screenIdComment = '// Screen: THSN003-2';
        else if (selectedVisaType === 'Kỹ sư, tri thức') screenIdComment = '// Screen: THSN003-3';
        
        return (
            <>
            <span className="hidden">{screenIdComment}</span>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Chọn loại {selectedVisaType}</DialogTitle>
                <DialogDescription className="text-center">
                Chọn loại hình chi tiết để tiếp tục.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {options.map(option => (
                    <Button key={option.label} onClick={() => { setSelectedVisaDetail(option.label); setProfileCreationStep(4); }} variant="outline" className="h-auto p-4 text-center transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center min-w-[160px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                        <h3 className="font-bold text-base mb-1">{option.label}</h3>
                        <p className="text-muted-foreground text-xs">{option.description}</p>
                    </Button>
                ))}
            </div>
            <Button variant="link" onClick={() => setProfileCreationStep(2)} className="mt-4 mx-auto block">Quay lại</Button>
            </>
        )
    };

    const IndustryStepDialog = () => {
        if (!selectedVisaType) return null;
        const industries = industriesByJobType[selectedVisaType as keyof typeof industriesByJobType] || [];
        
        let screenIdComment = '';
        if (selectedVisaType === 'Thực tập sinh kỹ năng') screenIdComment = '// Screen: THSN004-1';
        else if (selectedVisaType === 'Kỹ năng đặc định') screenIdComment = '// Screen: THSN004-2';
        else if (selectedVisaType === 'Kỹ sư, tri thức') screenIdComment = '// Screen: THSN004-3';

        return (
            <>
                <span className="hidden">{screenIdComment}</span>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline text-center">Chọn ngành nghề mong muốn</DialogTitle>
                    <DialogDescription className="text-center">
                        Lựa chọn ngành nghề bạn quan tâm nhất để chúng tôi gợi ý việc làm chính xác hơn.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-h-80 overflow-y-auto">
                    {industries.map(industry => (
                        <Button key={industry.slug} onClick={() => {setSelectedIndustry(industry); setProfileCreationStep(5);}} variant="outline" className="h-auto p-3 text-center transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                            <p className="font-semibold text-sm">{industry.name}</p>
                        </Button>
                    ))}
                </div>
                <Button variant="link" onClick={() => setProfileCreationStep(3)} className="mt-4 mx-auto block">Quay lại</Button>
            </>
        );
    };

    const japanRegions = ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu', 'Okinawa'];

    const RegionStepDialog = () => {
        return (
             <>
                {/* Screen: THSN005 */}
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline text-center">Chọn khu vực làm việc</DialogTitle>
                    <DialogDescription className="text-center">
                        Lựa chọn khu vực bạn muốn làm việc tại Nhật Bản.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 max-h-80 overflow-y-auto">
                     {japanRegions.map(region => (
                        <Button 
                            key={region} 
                            variant="outline"
                            onClick={() => setSelectedRegion(region)} 
                            className={cn(
                                "h-auto p-3 text-center transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary",
                                selectedRegion === region ? "ring-2 ring-primary border-primary bg-primary/10" : ""
                            )}
                        >
                            <p className="font-semibold text-sm">{region}</p>
                        </Button>
                    ))}
                </div>
                <div className="flex justify-center items-center mt-4 gap-4">
                    <Button variant="link" onClick={() => setProfileCreationStep(4)}>Quay lại</Button>
                    <Button variant="secondary" className="bg-accent-orange hover:bg-accent-orange/90 text-white" onClick={handleCreateProfileRedirect}>Lưu và xem việc phù hợp</Button>
                </div>
            </>
        )
    }

    const renderDialogContent = () => {
        switch(profileCreationStep) {
            case 1: return <FirstStepDialog />;
            case 2: return <QuickCreateStepDialog />;
            case 3: return <VisaDetailStepDialog />;
            case 4: return <IndustryStepDialog />;
            case 5: return <RegionStepDialog />;
            default: return <FirstStepDialog />;
        }
    }

    return (
        <>
            <div className="text-center md:text-left mb-8">
                <h1 className="text-3xl font-bold font-headline">Tạo hồ sơ để được hiển thị việc làm phù hợp</h1>
                <p className="text-muted-foreground mt-1">
                    Hoàn thiện hồ sơ của bạn để nhận được những gợi ý việc làm phù hợp nhất từ HelloJob AI.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
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
            </div>
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
                    <AlertDialogAction onClick={handleConfirmLogin}>
                        Đồng ý
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
};


const LoggedInView = () => {
    const { role } = useAuth();
    const [isViewersDialogOpen, setIsViewersDialogOpen] = useState(false);
    const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const [visibleJobsCount, setVisibleJobsCount] = useState(8);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isAspirationsDialogOpen, setIsAspirationsDialogOpen] = useState(false);
    const [tempAspirations, setTempAspirations] = useState<Partial<CandidateProfile['aspirations']>>({});
    const [tempDesiredIndustry, setTempDesiredIndustry] = useState('');
    const [forceUpdate, setForceUpdate] = useState(0); // State to trigger re-fetch

    // Always keep the 'Gợi ý' accordion open and highlighted
    const [openAccordion, setOpenAccordion] = useState<string | undefined>('item-1');
    const [isHighlighted, setIsHighlighted] = useState(true);

    const fetchSuggestedJobs = useCallback(async () => {
        setIsLoadingSuggestions(true);
        try {
            const storedProfile = localStorage.getItem('generatedCandidateProfile');
            if (storedProfile) {
                const profile: Partial<CandidateProfile> = JSON.parse(storedProfile);
                const matchResults = await matchJobsToProfile(profile);
                const jobs = matchResults.map(result => result.job);
                setSuggestedJobs(jobs);
            } else {
                setSuggestedJobs(jobData.slice(0, 20)); // Fallback
            }
        } catch (error) {
            console.error("Failed to fetch suggested jobs:", error);
            setSuggestedJobs(jobData.slice(0, 20)); // Fallback on error
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, []);

    useEffect(() => {
        if (role === 'candidate-empty-profile') {
            setIsLoadingSuggestions(false);
            return;
        }
        fetchSuggestedJobs();
    }, [role, fetchSuggestedJobs, forceUpdate]);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleJobsCount(prev => prev + 8);
            setIsLoadingMore(false);
        }, 500); // Simulate network delay
    };

    const openEditAspirationsDialog = () => {
        const storedProfileRaw = localStorage.getItem('generatedCandidateProfile');
        if (storedProfileRaw) {
            const profile = JSON.parse(storedProfileRaw);
            setTempAspirations(profile.aspirations || {});
            setTempDesiredIndustry(profile.desiredIndustry || '');
        }
        setIsAspirationsDialogOpen(true);
    };

    const handleSaveAspirations = () => {
        const storedProfileRaw = localStorage.getItem('generatedCandidateProfile');
        let profile = storedProfileRaw ? JSON.parse(storedProfileRaw) : {};
        profile = {
            ...profile,
            aspirations: tempAspirations,
            desiredIndustry: tempDesiredIndustry,
        };
        localStorage.setItem('generatedCandidateProfile', JSON.stringify(profile));
        setIsAspirationsDialogOpen(false);
        setForceUpdate(prev => prev + 1); // Trigger a re-fetch
    };

    if (role === 'candidate-empty-profile') {
        return <EmptyProfileView />;
    }
    
    const visaDetailsOptions: { [key: string]: string[] } = {
        'Thực tập sinh kỹ năng': ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Thực tập sinh 3 Go'],
        'Kỹ năng đặc định': ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'],
        'Kỹ sư, tri thức': ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư đầu Nhật'],
    };
    const visaTypes = Object.keys(visaDetailsOptions);
    const availableIndustries = tempAspirations.desiredVisaType ? (industriesByJobType[tempAspirations.desiredVisaType as keyof typeof industriesByJobType] || []) : Object.values(industriesByJobType).flat();

    return (
        <>
        <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl font-bold font-headline">Trang quản lý việc làm</h1>
            <p className="text-muted-foreground mt-1">Quản lý toàn bộ hành trình tìm việc của bạn tại một nơi duy nhất.</p>
        </div>
         {/* Main Content */}
        <div className="w-full mb-8">
            <Accordion 
                type="single" 
                collapsible 
                className="w-full" 
                value={openAccordion}
                onValueChange={setOpenAccordion}
            >
                <AccordionItem value="item-1" className={cn(
                    "transition-all duration-1000 ease-out",
                    isHighlighted ? "ring-2 ring-offset-2 ring-yellow-400 shadow-2xl rounded-lg" : ""
                )}>
                    <div className="flex items-center bg-background px-6 rounded-t-lg hover:no-underline">
                        <AccordionTrigger className="flex-grow py-4 font-semibold text-base">
                            <div className="flex items-center gap-3">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <span>Gợi ý cho bạn</span>
                                <Badge>{isLoadingSuggestions ? '...' : suggestedJobs.length}</Badge>
                            </div>
                        </AccordionTrigger>
                         <Button variant="ghost" size="sm" className="ml-auto flex-shrink-0" onClick={(e) => { e.stopPropagation(); openEditAspirationsDialog(); }}>
                            Sửa gợi ý
                            <Pencil className="h-4 w-4 ml-2"/>
                        </Button>
                    </div>
                    <AccordionContent className="bg-background p-6 rounded-b-lg">
                       {isLoadingSuggestions ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Card key={i}>
                                        <CardContent className="p-4 space-y-3">
                                            <Skeleton className="h-28 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-4 w-full" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                       ) : suggestedJobs.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {suggestedJobs.slice(0, visibleJobsCount).map((job) => ( <JobCard key={job.id} job={job} showRecruiterName={false} /> ))}
                                </div>
                                {visibleJobsCount < suggestedJobs.length && (
                                    <div className="text-center mt-8">
                                        <Button onClick={handleLoadMore} disabled={isLoadingMore}>
                                            {isLoadingMore ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang tải...
                                                </>
                                            ) : (
                                                'Xem thêm'
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                       ) : (
                           <div className="text-center py-8 text-muted-foreground">
                             <p>Không tìm thấy công việc nào phù hợp với hồ sơ của bạn.</p>
                             <p className="text-sm mt-2">Hãy thử cập nhật <Link href="/candidate-profile" className="text-primary underline">hồ sơ và nguyện vọng</Link> của bạn.</p>
                           </div>
                       )}
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-2">
                    <AccordionTrigger className="bg-background px-6 rounded-t-lg font-semibold text-base hover:no-underline mt-4">
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                            <span>Việc đã ứng tuyển</span>
                            <Badge>{appliedJobs.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-background p-6 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {appliedJobs.map((job) => ( <JobCard key={job.id} job={job} showRecruiterName={false} /> ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger className="bg-background px-6 rounded-t-lg font-semibold text-base hover:no-underline mt-4">
                        <div className="flex items-center gap-3">
                            <Bookmark className="h-5 w-5 text-red-500" />
                            <span>Việc đã lưu</span>
                            <Badge>{savedJobs.length}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-background p-6 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {savedJobs.map((job) => ( <JobCard key={job.id} job={job} showRecruiterName={false} /> ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Job phù hợp/tuần" value="12" change="+5.2%" />
            <StatCard title="Job phù hợp/tháng" value="48" change="+8.1%" />
            <StatCard title="Job cùng ngành nghề" value="315" />
            <StatCard title="Lượt xem hồ sơ" value={viewers.length} change="+12" />
        </div>
        
        {/* Progress Tracker */}
        <div className="mb-8">
            <h2 className="text-xl font-bold font-headline mb-4">Tiến độ của bạn</h2>
            <ProgressTracker />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <JobStatsChart />
            <div className="lg:col-span-1">
                {/* Aspirations Section */}
                <div className="mb-8">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold font-headline">Nguyện vọng tìm việc</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {aspirations.map(asp => (
                            <Card key={asp.id} className="shadow-lg">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <Badge className="mb-1">{asp.type}</Badge>
                                        <p className="font-bold">{asp.title}</p>
                                        <p className="text-sm text-green-600 font-semibold">{asp.salary}</p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                         <Card className="shadow-lg border-dashed flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer min-h-[100px]">
                            <CardContent className="p-4 text-center">
                               <PlusCircle className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                               <p className="font-semibold text-sm">Thêm nguyện vọng</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                 <Card 
                    className="shadow-lg md:col-span-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => setIsViewersDialogOpen(true)}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nhà tuyển dụng đã xem hồ sơ</CardTitle>
                        <Eye className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{viewers.length}</div>
                        <div className="flex items-center mt-2">
                            <div className="flex -space-x-2 overflow-hidden">
                                {viewers.slice(0, 5).map((viewer, index) => (
                                    <Avatar key={index} className="inline-block h-6 w-6 border-2 border-background">
                                        <AvatarImage src={viewer.src} />
                                        <AvatarFallback>{viewer.name}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            {viewers.length > 5 && (
                               <span className="text-xs font-semibold text-muted-foreground ml-3">+{viewers.length - 5}</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <ProfileViewersDialog isOpen={isViewersDialogOpen} onClose={() => setIsViewersDialogOpen(false)} />
        <Dialog open={isAspirationsDialogOpen} onOpenChange={setIsAspirationsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sửa điều kiện gợi ý</DialogTitle>
                    <DialogDescription>
                        Thay đổi các nguyện vọng để nhận được gợi ý việc làm phù hợp hơn.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Loại visa mong muốn</Label>
                        <Select
                            value={tempAspirations.desiredVisaType || ''}
                            onValueChange={value => setTempAspirations(prev => ({ ...prev, desiredVisaType: value, desiredVisaDetail: '' }))}
                        >
                            <SelectTrigger><SelectValue placeholder="Chọn loại visa" /></SelectTrigger>
                            <SelectContent>
                                {visaTypes.map(vt => <SelectItem key={vt} value={vt}>{vt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Chi tiết visa</Label>
                        <Select
                            value={tempAspirations.desiredVisaDetail || ''}
                            onValueChange={value => setTempAspirations(prev => ({ ...prev, desiredVisaDetail: value }))}
                            disabled={!tempAspirations.desiredVisaType}
                        >
                            <SelectTrigger><SelectValue placeholder="Chọn chi tiết" /></SelectTrigger>
                            <SelectContent>
                                {(visaDetailsOptions[tempAspirations.desiredVisaType || ''] || []).map(vd => <SelectItem key={vd} value={vd}>{vd}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Ngành nghề mong muốn</Label>
                        <Select
                            value={tempDesiredIndustry}
                            onValueChange={value => setTempDesiredIndustry(value)}
                            disabled={!tempAspirations.desiredVisaType}
                        >
                            <SelectTrigger>
                                {tempDesiredIndustry ? tempDesiredIndustry : <span className="text-muted-foreground">Chọn ngành nghề</span>}
                            </SelectTrigger>
                            <SelectContent>
                                {availableIndustries.map(ind => <SelectItem key={ind.slug} value={ind.name}>{ind.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Địa điểm mong muốn</Label>
                        <Select
                            value={tempAspirations.desiredLocation || ''}
                            onValueChange={value => setTempAspirations(prev => ({ ...prev, desiredLocation: value }))}
                        >
                            <SelectTrigger><SelectValue placeholder="Chọn địa điểm" /></SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                <SelectItem value="all">Tất cả Nhật Bản</SelectItem>
                                {Object.entries(locations['Nhật Bản']).map(([region, prefectures]) => (
                                    <SelectGroup key={region}>
                                        <SelectLabel>{region}</SelectLabel>
                                        <SelectItem value={region}>Toàn bộ vùng {region}</SelectItem>
                                        {(prefectures as string[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogClose asChild>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Hủy</Button>
                        <Button onClick={handleSaveAspirations}>Lưu và tìm lại</Button>
                    </div>
                </DialogClose>
            </DialogContent>
        </Dialog>
    </>
    )
}

const LoggedOutView = () => {
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    return (
        <>
        <div className="flex items-center justify-center text-center py-20">
            <Card className="max-w-2xl p-8 shadow-2xl">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Briefcase className="h-12 w-12 text-primary"/>
                    </div>
                    <CardTitle className="text-3xl font-headline">Quản lý việc làm của bạn</CardTitle>
                    <CardDescription className="text-base pt-2">
                        Đăng nhập để xem các công việc được gợi ý riêng cho bạn, theo dõi các đơn đã ứng tuyển và quản lý các việc làm đã lưu.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => setIsAuthDialogOpen(true)} size="lg">
                        <LogIn className="mr-2"/>Đăng ký / Đăng nhập
                    </Button>
                </CardContent>
            </Card>
        </div>
        <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </>
    )
}

const FloatingPrioritySelector = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // Show after 2 seconds

    const closeTimer = setTimeout(() => {
      setIsClosing(true);
      const highlightButton = document.getElementById('highlight-target-button');
      if (highlightButton) {
        highlightButton.classList.add('animate-pulse', 'ring-2', 'ring-yellow-400');
        setTimeout(() => {
            highlightButton.classList.remove('animate-pulse', 'ring-2', 'ring-yellow-400');
        }, 1500)
      }
    }, 7000); // Start closing after 7 seconds (2 to show + 5 to display)

    const hideTimer = setTimeout(() => {
        setIsVisible(false);
    }, 7500); // Completely hide after animation

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
        ref={cardRef}
        className={cn(
            "fixed bottom-24 left-4 z-50 transition-all duration-500",
            isClosing ? "opacity-0 scale-50 -translate-y-1/2 translate-x-[20vw]" : "opacity-100 scale-100",
            "animate-in slide-in-from-bottom"
        )}
    >
        <Card className="shadow-2xl w-full max-w-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span>Bạn có muốn ưu tiên tìm việc theo?</span>
                    <Button
                        ref={buttonRef}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsClosing(true)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start" onClick={() => setIsClosing(true)}>
                    <TrendingUp className="mr-2 text-green-500" /> Lương tốt
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setIsClosing(true)}>
                    <ThumbsUp className="mr-2 text-blue-500" /> Phí thấp
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setIsClosing(true)}>
                    <ShieldCheck className="mr-2 text-orange-500" /> Công ty uy tín
                </Button>
            </CardContent>
        </Card>
    </div>
  );
};


function JobsDashboardPageContent() {
    const { role } = useAuth();
    const isLoggedIn = role === 'candidate' || role === 'candidate-empty-profile';
  
    return (
      <div className="bg-secondary min-h-screen">
        <div className="container mx-auto px-2 md:px-4 py-8">
          {isLoggedIn ? <LoggedInView /> : <LoggedOutView />}
        </div>
        {role === 'candidate' && <FloatingPrioritySelector />}
      </div>
    );
}


export default function JobsDashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <JobsDashboardPageContent />
        </Suspense>
    )
}
