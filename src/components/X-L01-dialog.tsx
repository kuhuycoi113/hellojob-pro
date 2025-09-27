
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
import { FastForward, ListChecks, HardHat, UserCheck, GraduationCap, Pencil, Sparkles, Building, Plane, Handshake, Briefcase, Users, UserSquare, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { Industry, industriesByJobType } from '@/lib/industry-data';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon } from './custom-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


type Language = 'vi' | 'ja' | 'en';

interface XL01DialogProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: number;
  onComplete?: (preferences: any) => void;
  onBack?: () => void;
  onLanguageChange: (lang: Language) => void;
  initialLang?: Language;
}

export function XL01Dialog({ 
    children, 
    isOpen, 
    onOpenChange, 
    initialStep = 1, 
    onComplete, 
    onBack,
    onLanguageChange,
    initialLang = 'vi'
}: XL01DialogProps) {
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
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>(initialLang);

  useEffect(() => {
    if (isOpen) {
      setProfileCreationStep(initialStep);
    }
  }, [isOpen, initialStep]);
  
  const handleLangChange = (lang: Language) => {
      setCurrentLang(lang);
      onLanguageChange(lang);
  }

  const handleComplete = () => {
    const preferences = {
      role: selectedRole,
      desiredVisaType: selectedVisa?.name || undefined,
      desiredVisaDetail: selectedVisaDetail || undefined,
      desiredIndustry: selectedIndustry?.name || undefined,
      desiredLocation: selectedRegion || undefined,
    };

    if (onComplete) {
      onComplete(preferences);
    }
  };

  const PartnerRoleStepDialog = () => {
        const roles = {
            vi: [
                { id: 'haken_staff', icon: UserSquare, title: 'Nhân viên phái cử', desc: 'Nhân viên tuyển dụng/đối ngoại của Công ty XKLĐ.' },
                { id: 'jp_hr_staff', icon: UserCog, title: 'Nhân viên Nhân lực Nhật', desc: 'Nhân viên tại Nghiệp đoàn, Shien, Shokai, Haken.' },
                { id: 'dispatch', icon: Plane, title: 'Công ty phái cử', desc: 'Tuyển và phái cử lao động từ Việt Nam.' },
                { id: 'support', icon: UserCheck, title: 'Cơ quan hỗ trợ (Shien Kikan)', desc: 'Hỗ trợ các công ty và người lao động.' },
                { id: 'enterprise', icon: Building, title: 'Xí nghiệp tiếp nhận', desc: 'Trực tiếp tuyển dụng và sử dụng lao động.' },
                { id: 'union', icon: Handshake, title: 'Nghiệp đoàn (Kumiai)', desc: 'Quản lý và hỗ trợ thực tập sinh.' },
                { id: 'shokai', icon: Users, title: 'Công ty giới thiệu có phí (Yuryo Shokai)', desc: 'Cung cấp dịch vụ giới thiệu việc làm có tính phí.' },
                { id: 'haken', icon: Briefcase, title: 'Công ty Haken', desc: 'Cung cấp dịch vụ phái cử lao động tạm thời.' },
            ],
            ja: [
                { id: 'haken_staff', icon: UserSquare, title: '送り出し機関の社員', desc: '送り出し機関の採用・渉外担当者。' },
                { id: 'jp_hr_staff', icon: UserCog, title: '日本人材法人の社員', desc: '監理団体、支援機関、職業紹介所、派遣会社の社員。' },
                { id: 'dispatch', icon: Plane, title: '送り出し機関', desc: 'ベトナムから労働者を募集・派遣する。' },
                { id: 'support', icon: UserCheck, title: '支援機関', desc: '企業と労働者を支援する。' },
                { id: 'enterprise', icon: Building, title: '受け入れ企業', desc: '労働者を直接雇用・使用する。' },
                { id: 'union', icon: Handshake, title: '監理団体 (組合)', desc: '技能実習生を管理・支援する。' },
                { id: 'shokai', icon: Users, title: '有料職業紹介事業所', desc: '有料の職業紹介サービスを提供する。' },
                { id: 'haken', icon: Briefcase, title: '派遣会社', desc: '一時的な労働者派遣サービスを提供する。' },
            ],
            en: [
                { id: 'haken_staff', icon: UserSquare, title: 'Sending Company Staff', desc: 'Recruitment/external affairs staff of a sending company.' },
                { id: 'jp_hr_staff', icon: UserCog, title: 'Japan-side HR Staff', desc: 'Staff at a supervising, support, placement, or staffing agency.' },
                { id: 'dispatch', icon: Plane, title: 'Sending Company', desc: 'Recruit and dispatch workers from Vietnam.' },
                { id: 'support', icon: UserCheck, title: 'Support Organization (Shien Kikan)', desc: 'Support companies and workers.' },
                { id: 'enterprise', icon: Building, title: 'Accepting Company', desc: 'Directly recruit and employ workers.' },
                { id: 'union', icon: Handshake, title: 'Supervising Organization (Kumiai)', desc: 'Manage and support technical interns.' },
                { id: 'shokai', icon: Users, title: 'Paid Employment Placement Agency', desc: 'Provide paid job placement services.' },
                { id: 'haken', icon: Briefcase, title: 'Temporary Staffing Agency (Haken)', desc: 'Provide temporary worker dispatch services.' },
            ],
        };

        const dialogTitles = { vi: 'Bạn là ai?', ja: 'あなたの役割をお選びください', en: 'What is your role?' };
        const dialogDescriptions = { vi: 'Chọn vai trò phù hợp nhất với bạn để chúng tôi có thể hỗ trợ tốt hơn.', ja: 'より良いサポートを提供するために、あなたに最も適した役割を選択してください。', en: 'Select the role that best fits you so we can provide better support.' };

        return (
            <>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline text-center">{dialogTitles[currentLang]}</DialogTitle>
                    <DialogDescription className="text-center">{dialogDescriptions[currentLang]}</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue={currentLang} onValueChange={(value) => handleLangChange(value as Language)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="vi" className="flex items-center gap-2"><VnFlagIcon /> Tiếng Việt</TabsTrigger>
                        <TabsTrigger value="ja" className="flex items-center gap-2"><JpFlagIcon /> 日本語</TabsTrigger>
                        <TabsTrigger value="en" className="flex items-center gap-2"><EnFlagIcon /> English</TabsTrigger>
                    </TabsList>
                    <div className="pt-6 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {roles[currentLang].map((role) => (
                                <Card 
                                    key={role.id} 
                                    onClick={() => { setSelectedRole(role.id); setProfileCreationStep(2); }}
                                    className={cn("text-center p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center", selectedRole === role.id && "ring-2 ring-primary border-primary")}
                                >
                                    <role.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                                    <h3 className="font-bold text-base mb-1">{role.title}</h3>
                                    <p className="text-muted-foreground text-xs flex-grow">{role.desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </Tabs>
            </>
        );
  }

  const QuickCreateStepDialog = () => (
    <>
      {/* Screen: THSN002 */}
      <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center">Chọn loại hình lao động</DialogTitle>
          <DialogDescription className="text-center">
            Hãy chọn loại hình phù hợp nhất với mong muốn sử dụng lao động của bạn.
          </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Button 
            onClick={() => { setSelectedVisa(japanJobTypes.find(t => t.slug === 'thuc-tap-sinh-ky-nang')!); setProfileCreationStep(3); }} 
            variant="outline" 
            className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
            <HardHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Thực tập sinh kỹ năng</h3>
            <p className="text-muted-foreground text-xs">Tuyển dụng lao động phổ thông, chi phí thấp.</p>
        </Button>
        <Button 
            onClick={() => { setSelectedVisa(japanJobTypes.find(t => t.slug === 'ky-nang-dac-dinh')!); setProfileCreationStep(3); }}
            variant="outline" 
            className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
            <UserCheck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Kỹ năng đặc định</h3>
            <p className="text-muted-foreground text-xs">Tuyển dụng lao động có tay nghề, làm việc dài hạn.</p>
        </Button>
        <Button 
            onClick={() => { setSelectedVisa(japanJobTypes.find(t => t.slug === 'ky-su-tri-thuc')!); setProfileCreationStep(3); }}
            variant="outline" 
            className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary">
            <GraduationCap className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Kỹ sư, tri thức</h3>
            <p className="text-muted-foreground text-xs">Tuyển dụng chuyên gia có bằng cấp, chuyên môn cao.</p>
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
            <DialogDescription className="text-center">Chọn loại hình chi tiết để tiếp tục.</DialogDescription>
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
    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Chọn ngành nghề mong muốn</DialogTitle>
                <DialogDescription className="text-center">Lựa chọn ngành nghề bạn quan tâm nhất.</DialogDescription>
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
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">Chọn khu vực làm việc</DialogTitle>
                <DialogDescription className="text-center">Lựa chọn khu vực bạn muốn làm việc tại Nhật Bản.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 max-h-80 overflow-y-auto">
                 {japanRegions.map(region => (
                    <Button 
                        key={region} 
                        variant="outline"
                        onClick={() => { setSelectedRegion(region); handleComplete(); }}
                        className={cn("h-auto p-3 text-center transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary", selectedRegion === region ? "ring-2 ring-primary border-primary bg-primary/10" : "")}
                    >
                        <p className="font-semibold text-sm">{region}</p>
                    </Button>
                ))}
            </div>
            <div className="flex justify-center items-center mt-4 gap-4">
                <Button variant="link" onClick={() => setProfileCreationStep(4)}>Quay lại</Button>
            </div>
        </>
    )
  }

  const renderDialogContent = () => {
    switch (profileCreationStep) {
      case 1: return <PartnerRoleStepDialog />;
      case 2: return <QuickCreateStepDialog />;
      case 3: return <VisaDetailStepDialog />;
      case 4: return <IndustryStepDialog />;
      case 5: return <RegionStepDialog />;
      default: return <PartnerRoleStepDialog />;
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) setProfileCreationStep(1); }}>
          {children && <DialogTrigger asChild>{children}</DialogTrigger>}
          <DialogContent className="sm:max-w-4xl">
              {renderDialogContent()}
          </DialogContent>
      </Dialog>
    </>
  );
}
