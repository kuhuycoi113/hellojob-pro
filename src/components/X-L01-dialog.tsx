
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from './ui/button';
import { Card } from './ui/card';
import { FastForward, ListChecks, HardHat, UserCheck, GraduationCap, Pencil, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { Industry, industriesByJobType } from '@/lib/industry-data';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';

interface XL01DialogProps {
  children?: React.ReactNode; // Make children optional
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: number;
}

export function XL01Dialog({ children, isOpen, onOpenChange, initialStep = 1 }: XL01DialogProps) {
  const router = useRouter();
  const { role, setRole, isLoggedIn } = useAuth();
  const [profileCreationStep, setProfileCreationStep] = useState(initialStep);
  const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<{name: string, slug: string} | null>(null);
  const [selectedVisaDetail, setSelectedVisaDetail] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isCreateDetailOpen, setIsCreateDetailOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProfileCreationStep(initialStep);
    }
  }, [isOpen, initialStep]);

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
      onOpenChange(false);
      router.push('/viec-lam-cua-toi?highlight=suggested');
    } else {
      sessionStorage.setItem('onboardingPreferences', JSON.stringify(preferences));
      sessionStorage.setItem('postLoginRedirect', '/viec-lam-cua-toi?highlight=suggested');
      onOpenChange(false);
      setIsConfirmLoginOpen(true);
    }
  };

  const handleConfirmLogin = () => {
    setIsConfirmLoginOpen(false);
    setIsAuthDialogOpen(true);
  };

  const handleCreateDetailedProfile = (method: 'ai' | 'manual') => {
    setIsCreateDetailOpen(false);
    onOpenChange(false);
    if (method === 'ai') {
        router.push('/tao-ho-so-ai');
    } else {
        router.push('/dang-ky');
    }
  };

  const FirstStepDialog = () => {
    const isEditing = role === 'candidate' || role === 'candidate-full-profile';
    const titleText = isEditing ? 'Chọn phương thức sửa hồ sơ' : 'Chọn phương thức tạo hồ sơ';
    const quickActionText = isEditing ? 'Sửa nhanh' : 'Tạo nhanh';
    const detailActionText = isEditing ? 'Sửa chi tiết' : 'Tạo chi tiết';
    const screenId = isEditing ? 'SHSN001' : 'THSN001';

    return (
        <>
        {/* Screen: {screenId} */}
        <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-center">{titleText}</DialogTitle>
            <DialogDescription className="text-center">
                Bạn muốn hồ sơ của mình được xử lý như thế nào?
            </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card onClick={() => setProfileCreationStep(2)} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                <FastForward className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-base mb-1">{quickActionText}</h3>
                <p className="text-muted-foreground text-xs">Để HelloJob AI gợi ý việc làm phù hợp cho bạn ngay lập tức.</p>
            </Card>
            <Card onClick={() => { onOpenChange(false); setIsCreateDetailOpen(true); }} className="text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center">
                <ListChecks className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-bold text-base mb-1">{detailActionText}</h3>
                <p className="text-muted-foreground text-xs">Để hoàn thiện hồ sơ và sẵn sàng ứng tuyển vào công việc mơ ước.</p>
            </Card>
        </div>
        </>
    );
  };

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
      {initialStep !== 2 && (
        <Button variant="link" onClick={() => setProfileCreationStep(1)} className="mt-4 mx-auto block">Quay lại</Button>
      )}
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
    const parentVisaSlug = selectedVisa?.slug;

    if (!parentVisaSlug) return null;

    const industries = industriesByJobType[parentVisaSlug as keyof typeof industriesByJobType] || [];
    
    let screenIdComment = '';
    if (parentVisaSlug === 'thuc-tap-sinh-ky-nang') screenIdComment = '// Screen: THSN004-1';
    else if (parentVisaSlug === 'ky-nang-dac-dinh') screenIdComment = '// Screen: THSN004-2';
    else if (parentVisaSlug === 'ky-su-tri-thuc') screenIdComment = '// Screen: THSN004-3';

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
      <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) setProfileCreationStep(initialStep); }}>
          {children && <DialogTrigger asChild>{children}</DialogTrigger>}
          <DialogContent className="sm:max-w-2xl">
              {renderDialogContent()}
          </DialogContent>
      </Dialog>

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
       <Dialog open={isCreateDetailOpen} onOpenChange={setIsCreateDetailOpen}>
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
                <Button variant="link" onClick={() => { setIsCreateDetailOpen(false); onOpenChange(true); }}>Quay lại</Button>
            </div>
        </DialogContent>
      </Dialog>
      <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </>
  );
}
