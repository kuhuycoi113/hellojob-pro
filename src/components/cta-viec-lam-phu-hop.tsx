
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, LogIn, UserPlus, Sparkles, Star, FastForward, ListChecks, HardHat, UserCheck, GraduationCap, PlusCircle, Pencil, BrainCircuit } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { jobData, type Job } from '@/lib/mock-data';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { matchJobsToProfile } from '@/ai/flows/match-jobs-to-profile-flow';
import type { CandidateProfile } from '@/ai/schemas';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Industry, industriesByJobType } from '@/lib/industry-data';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';
import { cn } from '@/lib/utils';
import { getJobs } from '@/actions/jobs-action';


const CTAForGuest = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <Card className="text-center py-12 px-6 shadow-lg col-span-full">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <UserPlus className="h-10 w-10 text-primary" />
        </div>
        <p className="font-semibold text-lg">Đăng ký để nhận gợi ý việc làm phù hợp</p>
        <p className="text-muted-foreground mt-2 mb-6">Tạo hồ sơ của bạn để AI của chúng tôi có thể tìm ra những cơ hội tốt nhất dành cho bạn.</p>
        <Button onClick={onLoginClick}>
            <LogIn className="mr-2 h-4 w-4" />
            Đăng nhập / Đăng ký
        </Button>
    </Card>
);

const CTAForEmptyProfile = () => {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileCreationStep, setProfileCreationStep] = useState(1);
    const [selectedVisa, setSelectedVisa] = useState<{ name: string, slug: string } | null>(null);
    const [selectedVisaDetail, setSelectedVisaDetail] = useState<string | null>(null);
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const { isLoggedIn, setRole } = useAuth();
    const [isCreateDetailOpen, setIsCreateDetailOpen] = useState(false);


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
            setRole('candidate');
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
            router.push('/dang-ky');
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
                    onClick={() => { setSelectedVisa(japanJobTypes.find(t => t.slug === 'thuc-tap-sinh-ky-nang')!); setProfileCreationStep(3); }}
                    variant="outline"
                    className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                    <HardHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-bold text-base mb-1">Thực tập sinh kỹ năng</h3>
                    <p className="text-muted-foreground text-xs">Lao động phổ thông, 18-40 tuổi.</p>
                </Button>
                <Button
                    onClick={() => { setSelectedVisa(japanJobTypes.find(t => t.slug === 'ky-nang-dac-dinh')!); setProfileCreationStep(3); }}
                    variant="outline"
                    className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
                    <UserCheck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-bold text-base mb-1">Kỹ năng đặc định</h3>
                    <p className="text-muted-foreground text-xs">Lao động có hoặc cần thi tay nghề.</p>
                </Button>
                <Button
                    onClick={() => { setSelectedVisa(japanJobTypes.find(t => t.slug === 'ky-su-tri-thuc')!); setProfileCreationStep(3); }}
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

    const VisaDetailStepDialog = () => {
        if (!selectedVisa) return null;
        const options = visaDetailsByVisaType[selectedVisa.slug] || [];

        let screenIdComment = '';
        if (selectedVisa.slug === 'thuc-tap-sinh-ky-nang') screenIdComment = '// Screen: THSN003-1';
        else if (selectedVisa.slug === 'ky-nang-dac-dinh') screenIdComment = '// Screen: THSN003-2';
        else if (selectedVisa.slug === 'ky-su-tri-thuc') screenIdComment = '// Screen: THSN003-3';

        return (
            <>
                <span className="hidden">{screenIdComment}</span>
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

    const IndustryStepDialog = () => {
        if (!selectedVisa) return null;
        const industries = industriesByJobType[selectedVisa.slug as keyof typeof industriesByJobType] || [];

        let screenIdComment = '';
        if (selectedVisa.slug === 'thuc-tap-sinh-ky-nang') screenIdComment = '// Screen: THSN004-1';
        else if (selectedVisa.slug === 'ky-nang-dac-dinh') screenIdComment = '// Screen: THSN004-2';
        else if (selectedVisa.slug === 'ky-su-tri-thuc') screenIdComment = '// Screen: THSN004-3';

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
                        <Button key={industry.slug} onClick={() => { setSelectedIndustry(industry); setProfileCreationStep(5); }} variant="outline" className="h-auto p-3 text-center transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
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
                    <Button variant="secondary" className="bg-accent-orange hover:bg-accent-orange/90 text-white" onClick={handleCreateProfileRedirect}>Lưu và xem việc làm phù hợp</Button>
                </div>
            </>
        )
    }


    const renderDialogContent = () => {
        switch (profileCreationStep) {
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
            <Card className="text-center py-12 px-6 shadow-lg col-span-full">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <UserPlus className="h-10 w-10 text-primary" />
                </div>
                <p className="font-semibold text-lg">Tạo hồ sơ để được hiển thị việc làm phù hợp</p>
                <p className="text-muted-foreground mt-2 mb-6">Hoàn thiện hồ sơ của bạn để nhận được những gợi ý việc làm phù hợp nhất từ HelloJob AI.</p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
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
                        <AlertDialogAction onClick={handleConfirmLogin}>
                            Đồng ý
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};


export function CtaViecLamPhuHop() {
    const router = useRouter();
    const { role, isLoggedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    const fetchSuggestions = useCallback(async () => {
        setIsLoading(true);
        try {
            const filters = {};
            const { docs: jobs, total, totalPages } = await getJobs(filters, null, 1, 1 * 4);
            setSuggestions(jobs);
        } catch (error) {
            console.error("Failed to fetch behavioral suggestions for CTA:", error);
            // Fallback to generic popular jobs on error
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);

    const handleLoginClick = () => {
        setIsAuthDialogOpen(true);
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)
            );
        }

        if (suggestions.length === 0) {
            // If logged in, show the empty profile CTA. If guest, show the login CTA.
            if (isLoggedIn) {
                return <CTAForEmptyProfile />;
            }
            return <CTAForGuest onLoginClick={handleLoginClick} />;
        }

        return (
            suggestions.map((item) => (
                <JobCard key={item.id} job={item} />
            ))
        );
    };

    return (
        <section id="VIECPHUHOP02" className="w-full">
            <div className="container mx-auto px-4 md:px-6">
                <div className='flex'>
                    <h2 className="text-2xl font-headline font-bold text-left mb-8">
                        <BrainCircuit className="inline-block mr-3 text-purple-500 h-8 w-8" />
                        Có thể bạn quan tâm
                    </h2>
                    <Button variant={'link'} className='ml-auto' onClick={() => router.push('/viec-lam-cua-toi?highlight=behavioral')}>Xem tất cả</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {renderContent()}
                </div>
                <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
            </div>
        </section>
    )
}
