
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
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Globe, Users2, FastForward, ListChecks, HardHat, UserCheck, GraduationCap, Pencil, Sparkles, Building, Plane, Handshake, Briefcase, Users, UserSquare, UserCog, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { Industry, industriesByJobType } from '@/lib/industry-data';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon } from './custom-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


type Language = 'vi' | 'ja' | 'en';

interface YL01DialogProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: number;
  onComplete?: (preferences: any) => void;
  onBack?: () => void;
  onLanguageChange: (lang: Language) => void;
  initialLang?: Language;
}

const roleTexts: Record<string, Record<Language, string>> = {
  'nhan-vien-phai-cu': { vi: 'Nhân viên phái cử', ja: '送り出し機関の社員', en: 'Sending Company Staff' },
  'nhan-vien-nhan-luc-nhat': { vi: 'Nhân viên Nhân lực Nhật', ja: '日本人材法人の社員', en: 'Japan-side HR Staff' },
  'sending': { vi: 'Công ty phái cử', ja: '送り出し機関', en: 'Sending Company' },
  'support': { vi: 'Cơ quan hỗ trợ (Shien Kikan)', ja: '支援機関', en: 'Support Organization' },
  'company': { vi: 'Xí nghiệp tiếp nhận', ja: '受け入れ企業', en: 'Accepting Company' },
  'supervising-organization': { vi: 'Nghiệp đoàn (Kumiai)', ja: '監理団体 (組合)', en: 'Supervising Organization' },
  'paid-placement-agency': { vi: 'Công ty giới thiệu có phí (Yuryo Shokai)', ja: '有料職業紹介事業所', en: 'Paid Placement Agency' },
  'haken': { vi: 'Công ty Haken', ja: '派遣会社', en: 'Staffing Agency' },
};


export function YL01Dialog({ 
    children, 
    isOpen, 
    onOpenChange, 
    initialStep = 1, 
    onComplete, 
    onBack,
    onLanguageChange,
    initialLang = 'vi'
}: YL01DialogProps) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>(initialLang);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setSelectedRole(null);
    }
  }, [isOpen, initialStep]);
  
  const handleLangChange = (lang: Language) => {
      setCurrentLang(lang);
      onLanguageChange(lang);
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    if (roleId === 'nhan-vien-phai-cu') {
      setStep(2); // Move to sub-role selection
    } else {
      navigateToEmployerPage(roleId);
    }
  };

  const handleSubRoleSelect = (subRoleId: string) => {
    if (selectedRole) {
      navigateToEmployerPage(selectedRole, subRoleId);
    }
  };

  const navigateToEmployerPage = (roleId: string, subRoleId?: string) => {
    const params = new URLSearchParams();
    params.set('role', roleId);
    params.set('lang', currentLang);
    if (subRoleId) {
      params.set('sub_role', subRoleId);
    }
    router.push(`/nha-tuyen-dung/Z000?${params.toString()}`);
    onOpenChange(false); // Close the dialog after navigation
  };


  const PartnerRoleStepDialog = () => {
        const roles = {
            vi: [
                { id: 'nhan-vien-phai-cu', icon: UserSquare, title: 'Nhân viên phái cử', desc: 'Nhân viên tuyển dụng/đối ngoại của Công ty XKLĐ.' },
                { id: 'nhan-vien-nhan-luc-nhat', icon: UserCog, title: 'Nhân viên Nhân lực Nhật', desc: 'Nhân viên tại Nghiệp đoàn, Shien, Shokai, Haken.' },
                { id: 'sending', icon: Plane, title: 'Công ty phái cử', desc: 'Tuyển và phái cử lao động từ Việt Nam.' },
                { id: 'support', icon: UserCheck, title: 'Cơ quan hỗ trợ (Shien Kikan)', desc: 'Hỗ trợ các công ty và người lao động.' },
                { id: 'company', icon: Building, title: 'Xí nghiệp tiếp nhận', desc: 'Trực tiếp tuyển dụng và sử dụng lao động.' },
                { id: 'supervising-organization', icon: Handshake, title: 'Nghiệp đoàn (Kumiai)', desc: 'Quản lý và hỗ trợ thực tập sinh.' },
                { id: 'paid-placement-agency', icon: Users, title: 'Công ty giới thiệu có phí (Yuryo Shokai)', desc: 'Cung cấp dịch vụ giới thiệu việc làm có tính phí.' },
                { id: 'haken', icon: Briefcase, title: 'Công ty Haken', desc: 'Cung cấp dịch vụ phái cử lao động tạm thời.' },
            ],
            ja: [
                { id: 'nhan-vien-phai-cu', icon: UserSquare, title: '送り出し機関の社員', desc: '送り出し機関の採用・渉外担当者。' },
                { id: 'nhan-vien-nhan-luc-nhat', icon: UserCog, title: '日本人材法人の社員', desc: '監理団体、支援機関、職業紹介所、派遣会社の社員。' },
                { id: 'sending', icon: Plane, title: '送り出し機関', desc: 'ベトナムから労働者を募集・派遣する。' },
                { id: 'support', icon: UserCheck, title: '支援機関', desc: '企業と労働者を支援する。' },
                { id: 'company', icon: Building, title: '受け入れ企業', desc: '労働者を直接雇用・使用する。' },
                { id: 'supervising-organization', icon: Handshake, title: '監理団体 (組合)', desc: '技能実習生を管理・支援する。' },
                { id: 'paid-placement-agency', icon: Users, title: '有料職業紹介事業所', desc: '有料の職業紹介サービスを提供する。' },
                { id: 'haken', icon: Briefcase, title: '派遣会社', desc: '一時的な労働者派遣サービスを提供する。' },
            ],
            en: [
                { id: 'nhan-vien-phai-cu', icon: UserSquare, title: 'Sending Company Staff', desc: 'Recruitment/external affairs staff of a sending company.' },
                { id: 'nhan-vien-nhan-luc-nhat', icon: UserCog, title: 'Japan-side HR Staff', desc: 'Staff at a supervising, support, placement, or staffing agency.' },
                { id: 'sending', icon: Plane, title: 'Sending Company', desc: 'Recruit and dispatch workers from Vietnam.' },
                { id: 'support', icon: UserCheck, title: 'Support Organization (Shien Kikan)', desc: 'Support companies and workers.' },
                { id: 'company', icon: Building, title: 'Accepting Company', desc: 'Directly recruit and employ workers.' },
                { id: 'supervising-organization', icon: Handshake, title: 'Supervising Organization (Kumiai)', desc: 'Manage and support technical interns.' },
                { id: 'paid-placement-agency', icon: Users, title: 'Paid Employment Placement Agency', desc: 'Provide paid job placement services.' },
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
                                    onClick={() => handleRoleSelect(role.id)}
                                    className={cn("text-center p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center")}
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
  };

  const SubRoleStepDialog = () => {
    const content = {
        vi: {
            title: "Bạn có vai trò gì ở Công ty phái cử?",
            description: "Vui lòng chọn vai trò cụ thể của bạn để tiếp tục.",
            options: [
                { id: 'phu-trach-doi-ngoai', icon: Globe, title: 'Phụ trách đối ngoại'},
                { id: 'phu-trach-tuyen-dung', icon: Users2, title: 'Phụ trách tuyển dụng'},
            ],
            backButton: 'Quay lại',
        },
        ja: {
            title: "送り出し機関でのあなたの役割は何ですか？",
            description: "続けるためにあなたの具体的な役割を選択してください。",
            options: [
                { id: 'phu-trach-doi-ngoai', icon: Globe, title: '渉外担当'},
                { id: 'phu-trach-tuyen-dung', icon: Users2, title: '採用担当'},
            ],
            backButton: '戻る',
        },
        en: {
            title: 'What is your role at the Sending Company?',
            description: 'Please select your specific role to continue.',
            options: [
                { id: 'phu-trach-doi-ngoai', icon: Globe, title: 'External Relations'},
                { id: 'phu-trach-tuyen-dung', icon: Users2, title: 'Recruitment'},
            ],
            backButton: 'Back',
        },
    }[currentLang];

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
                <DialogDescription className="text-center">{content.description}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {content.options.map(option => (
                     <Card 
                        key={option.id} 
                        onClick={() => handleSubRoleSelect(option.id)}
                        className="text-center p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center"
                    >
                        <option.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h3 className="font-bold text-lg mb-1">{option.title}</h3>
                    </Card>
                ))}
            </div>
            <div className="text-center mt-4">
                 <Button variant="link" onClick={() => setStep(1)}>{content.backButton}</Button>
            </div>
        </>
    )
  }

  const renderDialogContent = () => {
    switch (step) {
      case 1: return <PartnerRoleStepDialog />;
      case 2: return <SubRoleStepDialog />;
      default: return <PartnerRoleStepDialog />;
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) setStep(1); }}>
          {children && <DialogTrigger asChild>{children}</DialogTrigger>}
          <DialogContent className="sm:max-w-4xl" id="Y001_Y002_Y003-1">
              {renderDialogContent()}
          </DialogContent>
      </Dialog>
    </>
  );
}
