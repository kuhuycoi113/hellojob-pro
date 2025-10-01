
'use client';

import * as React from 'react';
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
import { Globe, Users2, FastForward, ListChecks, HardHat, UserCheck, GraduationCap, Pencil, Sparkles, Building, Plane, Handshake, Briefcase, Users, UserSquare, UserCog, UserPlus, FileSignature, Check, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './auth-dialog';
import { Industry, industriesByJobType } from '@/lib/industry-data';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon } from './custom-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from './ui/checkbox';
import { japanRegions } from '@/lib/location-data';


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
  showLanguageSwitcher?: boolean; // Add this prop
}

const visaDetailContent = {
  'thuc-tap-sinh-ky-nang': {
    vi: {
      title: 'Chọn chương trình Thực tập sinh',
      description: 'Vui lòng chọn loại chương trình thực tập sinh phù hợp.',
      options: [
        { id: 'thuc-tap-sinh-3-nam', icon: HardHat, title: 'Thực tập sinh 3 năm', desc: 'Chương trình phổ biến nhất, làm việc tại Nhật trong 3 năm.' },
        { id: 'thuc-tap-sinh-1-nam', icon: HardHat, title: 'Thực tập sinh 1 năm', desc: 'Chương trình ngắn hạn dành cho một số ngành nghề nhất định.' },
        { id: 'thuc-tap-sinh-3-go', icon: HardHat, title: 'Thực tập sinh 3 Go', desc: 'Dành cho người đã hoàn thành TTS 3 năm và muốn quay lại.' },
      ]
    },
    ja: {
      title: '技能実習プログラムを選択',
      description: '適切な技能実習プログラムを選択してください。',
      options: [
        { id: 'thuc-tap-sinh-3-nam', icon: HardHat, title: '技能実習3年', desc: '最も一般的なプログラムで、日本で3年間働きます。' },
        { id: 'thuc-tap-sinh-1-nam', icon: HardHat, title: '技能実習1年', desc: '特定の職種向けの短期プログラム。' },
        { id: 'thuc-tap-sinh-3-go', icon: HardHat, title: '技能実習3号', desc: '3年間の技能実習を修了し、再入国を希望する方向け。' },
      ]
    },
    en: {
      title: 'Select Trainee Program',
      description: 'Please select the appropriate technical intern training program.',
      options: [
        { id: 'thuc-tap-sinh-3-nam', icon: HardHat, title: '3-Year Technical Intern', desc: 'The most common program, working in Japan for 3 years.' },
        { id: 'thuc-tap-sinh-1-nam', icon: HardHat, title: '1-Year Technical Intern', desc: 'A short-term program for specific job types.' },
        { id: 'thuc-tap-sinh-3-go', icon: HardHat, title: 'Technical Intern No. 3', desc: 'For those who have completed the 3-year program and wish to return.' },
      ]
    }
  },
  'ky-nang-dac-dinh': {
    vi: {
        title: 'Chọn loại Kỹ năng đặc định',
        description: 'Chọn chương trình Kỹ năng đặc định bạn muốn tuyển.',
        options: [
          { id: 'dac-dinh-dau-nhat', icon: Users, title: 'Đặc định đầu Nhật', desc: 'Để tuyển ứng viên ở Nhật' },
          { id: 'dac-dinh-dau-viet', icon: Plane, title: 'Đặc định đầu Việt', desc: 'Để tuyển ứng viên từ Việt Nam' },
          { id: 'dac-dinh-di-moi', icon: UserPlus, title: 'Đặc định đi mới', desc: 'Để tuyển ứng viên mới' },
        ]
    },
    ja: {
        title: '特定技能の種類を選択',
        description: '募集したい特定技能プログラムを選択してください。',
        options: [
          { id: 'dac-dinh-dau-nhat', icon: Users, title: '国内（日本在住者）', desc: '日本在住の候補者を採用' },
          { id: 'dac-dinh-dau-viet', icon: Plane, title: '国外（ベトナム在住者）', desc: 'ベトナムから候補者を採用' },
          { id: 'dac-dinh-di-moi', icon: UserPlus, title: '新規（未経験者）', desc: '新規の候補者を採用' },
        ]
    },
    en: {
        title: 'Select Specified Skilled Worker Type',
        description: 'Choose the Specified Skilled Worker program you want to recruit for.',
        options: [
          { id: 'dac-dinh-dau-nhat', icon: Users, title: 'Domestic (in Japan)', desc: 'To recruit candidates already in Japan' },
          { id: 'dac-dinh-dau-viet', icon: Plane, title: 'Overseas (in Vietnam)', desc: 'To recruit candidates from Vietnam' },
          { id: 'dac-dinh-di-moi', icon: UserPlus, title: 'New Candidates', desc: 'To recruit new candidates' },
        ]
    }
  },
  'ky-su-tri-thuc': {
    vi: {
        title: 'Chọn loại Kỹ sư, tri thức',
        description: 'Chọn chương trình Kỹ sư bạn muốn tuyển.',
        options: [
          { id: 'ky-su-tri-thuc-dau-nhat', icon: Users, title: 'Kỹ sư, tri thức đầu Nhật', desc: 'Để tuyển kỹ sư ở Nhật' },
          { id: 'ky-su-tri-thuc-dau-viet', icon: Plane, title: 'Kỹ sư, tri thức đầu Việt', desc: 'Để tuyển kỹ sư từ Việt Nam' },
        ]
    },
    ja: {
        title: '技術・人文知識・国際業務の種類を選択',
        description: '募集したいプログラムを選択してください。',
        options: [
          { id: 'ky-su-tri-thuc-dau-nhat', icon: Users, title: '国内エンジニア', desc: '日本での経験があるエンジニアを採用' },
          { id: 'ky-su-tri-thuc-dau-viet', icon: Plane, title: '国外エンジニア', desc: 'ベトナムからエンジニアを採用' },
        ]
    },
    en: {
        title: 'Select Engineer/Specialist Type',
        description: 'Choose the program you want to recruit for.',
        options: [
          { id: 'ky-su-tri-thuc-dau-nhat', icon: Users, title: 'Engineer (In Japan)', desc: 'Recruit engineers with experience in Japan' },
          { id: 'ky-su-tri-thuc-dau-viet', icon: Plane, title: 'Engineer (In Vietnam)', desc: 'Recruit engineers from Vietnam' },
        ]
    }
  }
};

const visaTypeContent = {
  vi: {
    title: 'Bạn muốn tuyển loại Visa nào?',
    description: 'Bạn có thể chọn nhiều mục. Lựa chọn đầu tiên là ưu tiên số 1.',
    description_single: 'Hãy chọn loại visa phù hợp với nhu cầu tuyển dụng của bạn.',
    options: [
      { id: 'thuc-tap-sinh-ky-nang', icon: HardHat, title: 'Thực tập sinh kỹ năng', desc: 'Tuyển dụng lao động phổ thông, chi phí thấp.', color: 'orange' },
      { id: 'ky-nang-dac-dinh', icon: UserCheck, title: 'Kỹ năng đặc định', desc: 'Tuyển dụng lao động có tay nghề, làm việc dài hạn.', color: 'blue' },
      { id: 'ky-su-tri-thuc', icon: Briefcase, title: 'Kỹ sư, tri thức', desc: 'Tuyển dụng chuyên gia có bằng cấp, chuyên môn cao.', color: 'green' },
    ]
  },
  ja: {
    title: 'どのビザタイプを募集しますか？',
    description: '複数の項目を選択できます。最初の選択が優先順位1番になります。',
    description_single: '採用ニーズに最も適したビザタイプを選択してください。',
    options: [
      { id: 'thuc-tap-sinh-ky-nang', icon: HardHat, title: '技能実習', desc: '一般労働者を低コストで採用。', color: 'orange' },
      { id: 'ky-nang-dac-dinh', icon: UserCheck, title: '特定技能', desc: '長期雇用のための熟練労働者を採用。', color: 'blue' },
      { id: 'ky-su-tri-thuc', icon: Briefcase, title: '技術・人文知識・国際業務', desc: '高度な資格と専門知識を持つ専門家を採用。', color: 'green' },
    ]
  },
  en: {
    title: 'Which Visa Type do you want to recruit?',
    description: 'You can select multiple items. The first selection is priority #1.',
    description_single: 'Please select the visa type that best suits your recruitment needs.',
    options: [
      { id: 'thuc-tap-sinh-ky-nang', icon: HardHat, title: 'Technical Intern Trainee', desc: 'Recruit general workers at a low cost.', color: 'orange' },
      { id: 'ky-nang-dac-dinh', icon: UserCheck, title: 'Specified Skilled Worker', desc: 'Recruit skilled workers for long-term employment.', color: 'blue' },
      { id: 'ky-su-tri-thuc', icon: Briefcase, title: 'Engineer/Specialist in Humanities', desc: 'Recruit highly qualified and specialized professionals.', color: 'green' },
    ]
  }
};


const industryContent = {
    vi: {
        title: "Chọn ngành nghề muốn tuyển dụng",
        description: "Lựa chọn các ngành nghề bạn muốn tuyển, sắp xếp theo thứ tự ưu tiên.",
        backButton: "Quay lại",
        continueButton: "Tiếp tục"
    },
    ja: {
        title: "募集したい業種を選択",
        description: "募集したい業種を優先順位で選択してください。",
        backButton: "戻る",
        continueButton: "続ける"
    },
    en: {
        title: "Select Industries to Recruit",
        description: "Select the industries you want to recruit for, in order of priority.",
        backButton: "Back",
        continueButton: "Continue"
    },
};

const regionContent = {
    vi: {
        title: 'Chọn khu vực làm việc',
        description: 'Lựa chọn các khu vực bạn muốn tuyển dụng, sắp xếp theo thứ tự ưu tiên.',
        backButton: 'Quay lại',
        completeButton: 'Tiếp tục'
    },
    ja: {
        title: '希望勤務地を選択',
        description: '募集したい地域を優先順位で選択してください。',
        backButton: '戻る',
        completeButton: '続ける'
    },
    en: {
        title: 'Select Work Regions',
        description: 'Choose the regions you want to recruit in, in order of priority.',
        backButton: 'Back',
        completeButton: 'Continue'
    }
};

const valueInterestContent = {
    vi: {
      title: "Bạn quan tâm đến những giá trị nào nhất?",
      description: "Hãy cho chúng tôi biết mục tiêu chính của bạn để có trải nghiệm tốt nhất. Bạn có thể chọn nhiều mục.",
      options: [
        { id: 'ung-vien-nhieu-nhanh', icon: FastForward, title: 'Ứng viên nhiều và nhanh nhất' },
        { id: 'ung-vien-chat-luong', icon: UserCheck, title: 'Ứng viên chất lượng' },
        { id: 'viec-lam-ro-rang', icon: FileSignature, title: 'Việc làm rõ ràng và chất lượng' },
        { id: 'chi-phi-thap', icon: Globe, title: 'Chi phí tuyển dụng thấp nhất' },
        { id: 'loi-nhuan-cao', icon: Users2, title: 'Lợi nhuận cao nhất' },
        { id: 'quan-ly-ho-tro', icon: Handshake, title: 'Dịch vụ quản lý hỗ trợ tốt nhất' },
        { id: 'cham-soc-khach-hang', icon: Users, title: 'Dịch vụ chăm sóc khách hàng tốt nhất' },
      ],
      backButton: 'Quay lại',
      completeButton: 'Lưu và xem chi tiết'
    },
    ja: {
      title: "どの価値観に最も関心がありますか？",
      description: "最高の体験のために、あなたの主な目標を教えてください。複数選択可能です。",
      options: [
        { id: 'ung-vien-nhieu-nhanh', icon: FastForward, title: '最も多く、最も速い候補者' },
        { id: 'ung-vien-chat-luong', icon: UserCheck, title: '質の高い候補者' },
        { id: 'viec-lam-ro-rang', icon: FileSignature, title: '明確で質の高い求人' },
        { id: 'chi-phi-thap', icon: Globe, title: '最低の採用コスト' },
        { id: 'loi-nhuan-cao', icon: Users2, title: '最高の利益' },
        { id: 'quan-ly-ho-tro', icon: Handshake, title: '最高の管理サポートサービス' },
        { id: 'cham-soc-khach-hang', icon: Users, title: '最高の顧客ケアサービス' },
      ],
      backButton: '戻る',
      completeButton: '保存して詳細を見る'
    },
    en: {
      title: 'Which values are you most interested in?',
      description: 'Tell us your main goal for the best experience. You can select multiple items.',
      options: [
        { id: 'ung-vien-nhieu-nhanh', icon: FastForward, title: 'Most & Fastest Candidates' },
        { id: 'ung-vien-chat-luong', icon: UserCheck, title: 'Quality Candidates' },
        { id: 'viec-lam-ro-rang', icon: FileSignature, title: 'Clear & Quality Jobs' },
        { id: 'chi-phi-thap', icon: Globe, title: 'Lowest Recruitment Cost' },
        { id: 'loi-nhuan-cao', icon: Users2, title: 'Highest Profit' },
        { id: 'quan-ly-ho-tro', icon: Handshake, title: 'Best Support Management Service' },
        { id: 'cham-soc-khach-hang', icon: Users, title: 'Best Customer Care Service' },
      ],
      backButton: 'Back',
      completeButton: 'Save and View Details'
    }
};

const partnerRoles = {
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



export function YL01Dialog({ 
    children, 
    isOpen, 
    onOpenChange, 
    initialStep = 1, 
    onComplete, 
    onBack,
    onLanguageChange,
    initialLang = 'vi',
    showLanguageSwitcher = true,
}: YL01DialogProps) {
  const router = useRouter();
  const { role, setRole, isLoggedIn } = useAuth();
  const [step, setStep] = React.useState(initialStep);
  const [isConfirmLoginOpen, setIsConfirmLoginOpen] = React.useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false);
  const [selectedVisa, setSelectedVisa] = React.useState<string[]>([]);
  const [selectedVisaDetail, setSelectedVisaDetail] = React.useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = React.useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = React.useState<string[]>([]);
  const [isCreateDetailOpen, setIsCreateDetailOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [selectedSubRole, setSelectedSubRole] = React.useState<string | null>(null);
  const [fullName, setFullName] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [selectedInterest, setSelectedInterest] = React.useState<string[]>([]);
  const [currentLang, setCurrentLang] = React.useState<Language>(initialLang);

  React.useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setSelectedRole(null);
      setSelectedSubRole(null);
      setFullName('');
      setCompanyName('');
      setSelectedVisa([]);
      setSelectedVisaDetail([]);
      setSelectedIndustry([]);
      setSelectedRegion([]);
      setSelectedInterest([]);
    }
  }, [isOpen, initialStep]);
  
  const handleLangChange = (lang: Language) => {
      setCurrentLang(lang);
      onLanguageChange(lang);
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        role: selectedRole,
        sub_role: selectedSubRole,
        name: fullName,
        company_name: companyName,
        interest: selectedInterest,
        visaType: selectedVisa,
        visaDetail: selectedVisaDetail,
        industry: selectedIndustry,
        location: selectedRegion,
        lang: currentLang,
      });
    }
  };

  const handleMultiSelect = (
    value: string,
    state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const currentIndex = state.indexOf(value);
    let newSelection = [...state];

    if (currentIndex === -1) {
      newSelection.push(value);
    } else {
      newSelection.splice(currentIndex, 1);
    }
    setter(newSelection);
  };

  const PartnerRoleStepDialog = () => {
        const content = {
            vi: { title: 'Bạn là ai?', description: 'Chọn vai trò phù hợp nhất với bạn để chúng tôi có thể hỗ trợ tốt hơn.' },
            ja: { title: 'あなたの役割をお選びください', description: 'より良いサポートを提供するために、あなたに最も適した役割を選択してください。' },
            en: { title: 'What is your role?', description: 'Select the role that best fits you so we can provide better support.' }
        }[currentLang];

        return (
            <>
                {/* Screen: Y001 */}
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
                    <DialogDescription className="text-center">{content.description}</DialogDescription>
                    {showLanguageSwitcher && step === 1 && (
                        <div className="flex justify-center mt-4">
                            <Tabs defaultValue={currentLang} onValueChange={(value) => handleLangChange(value as Language)}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="vi" className="flex items-center gap-1.5 p-2 h-auto text-xs"><VnFlagIcon /> Tiếng Việt</TabsTrigger>
                                    <TabsTrigger value="ja" className="flex items-center gap-1.5 p-2 h-auto text-xs"><JpFlagIcon /> 日本語</TabsTrigger>
                                    <TabsTrigger value="en" className="flex items-center gap-1.5 p-2 h-auto text-xs"><EnFlagIcon /> English</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    )}
                </DialogHeader>
                <div className="pt-6 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {partnerRoles[currentLang].map((role) => (
                            <Card 
                                key={role.id} 
                                onClick={() => { 
                                    setSelectedRole(role.id);
                                    if (role.id === 'nhan-vien-phai-cu') {
                                        setStep(2); // Y002-1
                                    } else if (role.id === 'nhan-vien-nhan-luc-nhat') {
                                        setStep(1.5); // Y001-a
                                    } else {
                                        setStep(3); // Y003 (Old Y002)
                                    }
                                }}
                                className={cn("text-center p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center", selectedRole === role.id && "ring-2 ring-primary border-primary")}
                            >
                                <role.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                                <h3 className="font-bold text-base mb-1">{role.title}</h3>
                                <p className="text-muted-foreground text-xs flex-grow">{role.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </>
        );
  }

    const JapaneseStaffNationalityStepDialog = () => {
        // Screen: Y002-2
        const content = {
            vi: { title: "Bạn là nhân viên người Việt hay người Nhật?", description: "Vui lòng chọn quốc tịch của bạn.", options: [{ id: 'vietnamese', icon: UserIcon, title: 'Nhân viên người Việt'}, { id: 'japanese', icon: UserCog, title: 'Nhân viên người Nhật'}], backButton: 'Quay lại' },
            ja: { title: "あなたはベトナム人スタッフですか、それとも日本人スタッフですか？", description: "国籍を選択してください。", options: [{ id: 'vietnamese', icon: UserIcon, title: 'ベトナム人スタッフ'}, { id: 'japanese', icon: UserCog, title: '日本人スタッフ'}], backButton: '戻る' },
            en: { title: 'Are you a Vietnamese or Japanese staff member?', description: 'Please select your nationality.', options: [{ id: 'vietnamese', icon: UserIcon, title: 'Vietnamese Staff'}, { id: 'japanese', icon: UserCog, title: 'Japanese Staff'}], backButton: 'Back' },
        }[currentLang];

        return (
             <>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
                    <DialogDescription className="text-center">{content.description}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                     {content.options.map(option => (
                         <Button 
                            key={option.id} 
                            onClick={() => { setSelectedSubRole(option.id); setStep(3); }}
                            variant="outline"
                            className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary"
                        >
                            <option.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                            <h3 className="font-bold text-lg mb-1">{option.title}</h3>
                        </Button>
                    ))}
                </div>
                <div className="text-center mt-4">
                     <Button variant="link" onClick={() => setStep(1.5)}>{content.backButton}</Button>
                </div>
            </>
        )
    }
  
  const SendingCompanySubRoleStepDialog = () => {
    // Screen: Y002-1
    const content = {
        vi: { title: "Bạn có vai trò gì ở Công ty phái cử?", description: "Vui lòng chọn vai trò cụ thể của bạn để tiếp tục.", options: [{ id: 'phu-trach-doi-ngoai', icon: Globe, title: 'Phụ trách đối ngoại'}, { id: 'phu-trach-tuyen-dung', icon: Users2, title: 'Phụ trách tuyển dụng'}], backButton: 'Quay lại', },
        ja: { title: "送り出し機関でのあなたの役割は何ですか？", description: "続けるためにあなたの具体的な役割を選択してください。", options: [{ id: 'phu-trach-doi-ngoai', icon: Globe, title: '渉外担当'}, { id: 'phu-trach-tuyen-dung', icon: Users2, title: '採用担当'}], backButton: '戻る', },
        en: { title: 'What is your role at the Sending Company?', description: 'Please select your specific role to continue.', options: [{ id: 'phu-trach-doi-ngoai', icon: Globe, title: 'External Relations'}, { id: 'phu-trach-tuyen-dung', icon: Users2, title: 'Recruitment'}], backButton: 'Back', },
    }[currentLang];

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
                <DialogDescription className="text-center">{content.description}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {content.options.map(option => (
                     <Button 
                        key={option.id} 
                        onClick={() => { setSelectedSubRole(option.id); setStep(3); }}
                        variant="outline"
                        className="h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary"
                    >
                        <option.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h3 className="font-bold text-lg mb-1">{option.title}</h3>
                    </Button>
                ))}
            </div>
            <div className="text-center mt-4">
                 <Button variant="link" onClick={() => setStep(1)}>{content.backButton}</Button>
            </div>
        </>
    )
  };

  const JapaneseHrSubRoleStepDialogFromY001_5 = () => {
    // Screen: Y001-a
    const content = {
        vi: { title: "Công ty/Pháp nhân/Tổ chức của bạn tại Nhật thuộc loại hình nào?", description: "Vui lòng chọn loại hình tổ chức bạn đang làm việc tại Nhật.", backButton: "Quay lại" },
        ja: { title: "日本の会社/法人/団体はどの種類に属しますか？", description: "日本でお勤めの組織の種類を選択してください。", backButton: "戻る" },
        en: { title: "What type of company/entity/organization do you belong to in Japan?", description: "Please select the type of organization you work for in Japan.", backButton: "Back" },
    }[currentLang];

    const organizationRoles = partnerRoles[currentLang].filter(role => !['nhan-vien-phai-cu', 'nhan-vien-nhan-luc-nhat', 'sending'].includes(role.id));

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
                <DialogDescription className="text-center">{content.description}</DialogDescription>
            </DialogHeader>
            <div className="pt-6 max-h-[60vh] overflow-y-auto">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {organizationRoles.map((role) => (
                        <Card 
                            key={role.id} 
                            onClick={() => { setSelectedSubRole(role.id); setStep(2); }}
                            className="text-center p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center"
                        >
                            <role.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                            <h3 className="font-bold text-base mb-1">{role.title}</h3>
                            <p className="text-muted-foreground text-xs flex-grow">{role.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
             <div className="text-center mt-4">
                <Button variant="link" onClick={() => setStep(1)}>{content.backButton}</Button>
            </div>
        </>
    );
  };


  const InterestStepDialog = () => {
    // Screen: Y003 (New)
    const interests = {
        vi: {
            title: "Bạn quan tâm đến điều gì?",
            description: "Hãy cho chúng tôi biết mục tiêu chính của bạn để có trải nghiệm tốt nhất.",
            options: [
                { id: 'post-job', icon: FileSignature, title: 'Đăng việc làm' },
                { id: 'refer-candidate', icon: Users2, title: 'Giới thiệu ứng viên' },
                { id: 'post-and-refer', icon: Briefcase, title: 'Đăng việc làm & Giới thiệu ứng viên' },
                { id: 'refer-and-post', icon: Handshake, title: 'Giới thiệu ứng viên & Đăng việc làm' },
            ],
            backButton: 'Quay lại',
        },
        ja: {
            title: "何に興味がありますか？",
            description: "最高の体験のために、あなたの主な目標を教えてください。",
            options: [
                { id: 'post-job', icon: FileSignature, title: '求人掲載' },
                { id: 'refer-candidate', icon: Users2, title: '候補者紹介' },
                { id: 'post-and-refer', icon: Briefcase, title: '求人掲載と候補者紹介' },
                { id: 'refer-and-post', icon: Handshake, title: '候補者紹介と求人掲載' },
            ],
            backButton: '戻る',
        },
        en: {
            title: 'What are you interested in?',
            description: 'Tell us your main goal for the best experience.',
            options: [
                { id: 'post-job', icon: FileSignature, title: 'Post a Job' },
                { id: 'refer-candidate', icon: Users2, title: 'Refer a Candidate' },
                { id: 'post-and-refer', icon: Briefcase, title: 'Post Job & Refer Candidate' },
                { id: 'refer-and-post', icon: Handshake, title: 'Refer Candidate & Post Job' },
            ],
            backButton: 'Back',
        },
    }[currentLang];

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">{interests.title}</DialogTitle>
                <DialogDescription className="text-center">{interests.description}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {interests.options.map(option => (
                    <Card
                        key={option.id}
                        onClick={() => {
                            setSelectedInterest([option.id]);
                            const isIndividual = selectedRole && ['nhan-vien-phai-cu', 'nhan-vien-nhan-luc-nhat'].includes(selectedRole);
                            const nextStep = isIndividual ? 4 : 5;
                            setStep(nextStep);
                        }}
                        className="text-center p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center"
                    >
                        <option.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h3 className="font-bold text-base">{option.title}</h3>
                    </Card>
                ))}
            </div>
            <div className="text-center mt-4">
                 <Button variant="link" onClick={() => setStep(selectedRole === 'nhan-vien-phai-cu' || selectedRole === 'nhan-vien-nhan-luc-nhat' ? 2 : 1)}>{interests.backButton}</Button>
            </div>
        </>
    )
  }

  const renderNameInputStepDialog = () => {
    const content = {
        vi: { title: "Vui lòng nhập họ tên của bạn", description: "Thông tin này sẽ được dùng để cá nhân hóa tài khoản đối tác của bạn.", label: "Họ và tên", placeholder: "Ví dụ: Nguyễn Văn An", backButton: "Quay lại", continueButton: "Tiếp tục" },
        ja: { title: "氏名を入力してください", description: "この情報はパートナーアカウントをパーソナライズするために使用されます。", label: "氏名", placeholder: "例: グエン・ヴァン・アン", backButton: "戻る", continueButton: "続ける" },
        en: { title: "Please enter your full name", description: "This information will be used to personalize your partner account.", label: "Full Name", placeholder: "E.g., An Nguyen Van", backButton: "Back", continueButton: "Continue" },
    }[currentLang];

    return (
         <>
            {/* Screen: Y004 */}
            <DialogHeader className="text-center items-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit">
                    <UserSquare className="h-8 w-8 text-primary"/>
                </div>
                <DialogTitle className="text-2xl font-headline">{content.title}</DialogTitle>
                <DialogDescription>{content.description}</DialogDescription>
            </DialogHeader>
            <div className="pt-4 max-w-sm mx-auto w-full">
                <Label htmlFor="full-name">{content.label}</Label>
                <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={content.placeholder} className="mt-2" />
            </div>
             <div className="mt-6 flex justify-center gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>{content.backButton}</Button>
                <Button onClick={() => { if (fullName.trim()) setStep(5); }} disabled={!fullName.trim()}>{content.continueButton}</Button>
            </div>
        </>
    )
  }

  const renderCompanyNameStepDialog = () => {
    const content = {
        vi: { title: "Vui lòng nhập tên Công ty/Pháp nhân/Tổ chức của bạn", description: "Thông tin này giúp chúng tôi xác thực và kết nối bạn tốt hơn.", label: "Tên công ty", placeholder: "Ví dụ: Công ty TNHH HelloJob", backButton: "Quay lại", continueButton: "Tiếp tục" },
        ja: { title: "会社名/法人名/団体名を入力してください", description: "この情報は、本人確認とより良い連携のために役立ちます。", label: "会社名", placeholder: "例: 株式会社HelloJob", backButton: "戻る", continueButton: "続ける" },
        en: { title: "Please enter your Company/Entity/Organization name", description: "This information helps us verify and connect with you better.", label: "Company Name", placeholder: "E.g., HelloJob Co., Ltd.", backButton: "Back", continueButton: "Continue" },
    }[currentLang];

    return (
         <>
            {/* Screen: Y005 */}
            <DialogHeader className="text-center items-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit">
                    <Building className="h-8 w-8 text-primary"/>
                </div>
                <DialogTitle className="text-2xl font-headline">{content.title}</DialogTitle>
                <DialogDescription>{content.description}</DialogDescription>
            </DialogHeader>
            <div className="pt-4 max-w-sm mx-auto w-full">
                <Label htmlFor="company-name">{content.label}</Label>
                <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={content.placeholder} className="mt-2" />
            </div>
             <div className="mt-6 flex justify-center gap-2">
                <Button variant="outline" onClick={() => {
                    const isIndividual = selectedRole && ['nhan-vien-phai-cu', 'nhan-vien-nhan-luc-nhat'].includes(selectedRole);
                    setStep(isIndividual ? 4 : 3);
                }}>{content.backButton}</Button>
                <Button onClick={() => { if (companyName.trim()) setStep(6); }} disabled={!companyName.trim()}>{content.continueButton}</Button>
            </div>
        </>
    )
  }
  
  const VisaTypeMultiSelectStepDialog = () => {
    const content = visaTypeContent[currentLang];
    const iconColors = {
        orange: 'text-orange-500',
        blue: 'text-blue-500',
        green: 'text-green-500',
    };
    
    return (
        <>
            {/* Screen: Y006 */}
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
                <DialogDescription className="text-center">{content.description}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {content.options.map(option => {
                    const isSelected = selectedVisa.includes(option.id);
                    const selectionOrder = isSelected ? selectedVisa.indexOf(option.id) + 1 : 0;
                    return (
                        <Card 
                            key={option.id}
                            onClick={() => handleMultiSelect(option.id, selectedVisa, setSelectedVisa)}
                            className={cn(
                                "h-auto p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[170px] min-h-[140px] whitespace-normal hover:bg-primary/10 hover:ring-2 hover:ring-primary relative",
                                isSelected && "ring-2 ring-primary border-primary bg-primary/10"
                            )}
                        >
                            {isSelected && (
                                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center font-bold">
                                    {selectionOrder}
                                </Badge>
                            )}
                            <option.icon className={cn("h-8 w-8 mx-auto mb-2", iconColors[option.color as keyof typeof iconColors])} />
                            <h3 className="font-bold text-base mb-1">{option.title}</h3>
                            <p className="text-muted-foreground text-xs">{option.desc}</p>
                        </Card>
                    );
                })}
            </div>
            <div className="flex justify-center items-center mt-4 gap-4">
                <Button variant="link" onClick={() => setStep(selectedRole && ['nhan-vien-phai-cu', 'nhan-vien-nhan-luc-nhat'].includes(selectedRole) ? 5 : 3)} className="mx-auto block">
                    {currentLang === 'ja' ? '戻る' : currentLang === 'en' ? 'Back' : 'Quay lại'}
                </Button>
                <Button onClick={() => setStep(7)} disabled={selectedVisa.length === 0}>
                    {currentLang === 'ja' ? '続ける' : currentLang === 'en' ? 'Continue' : 'Tiếp tục'}
                </Button>
            </div>
        </>
    );
  };
  
  const renderMultiSelectStepDialog = (
    stepNumber: number,
    title: string,
    description: string,
    options: { id: string; icon?: React.ElementType; title: string; desc?: string; color?: string; name: {vi: string, ja: string, en: string}}[],
    selectedItems: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    nextStep: number,
    prevStep: number,
    gridCols: string = 'md:grid-cols-3'
  ) => {
    
    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline text-center">{title}</DialogTitle>
                <DialogDescription className="text-center">{description}</DialogDescription>
            </DialogHeader>
             <div className={cn("grid grid-cols-2 pt-4 gap-4 max-h-80 overflow-y-auto", gridCols)}>
                {options.map((option) => {
                    const isSelected = selectedItems.includes(option.id);
                    const selectionOrder = isSelected ? selectedItems.indexOf(option.id) + 1 : 0;
                    return (
                        <Card
                            key={option.id}
                            onClick={() => handleMultiSelect(option.id, selectedItems, setter)}
                            className={cn("text-center p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center relative",
                                isSelected && "ring-2 ring-primary border-primary bg-primary/10"
                            )}
                        >
                             {isSelected && (
                                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center font-bold">
                                    {selectionOrder}
                                </Badge>
                            )}
                            {option.icon && <option.icon className={cn("h-8 w-8 mx-auto mb-2", option.color ? `text-${''}` : 'text-primary')} />}
                            <h3 className="font-bold text-base mb-1">{option.name[currentLang]}</h3>
                            {option.desc && <p className="text-muted-foreground text-xs flex-grow">{option.desc}</p>}
                        </Card>
                    )
                })}
            </div>
            <div className="flex justify-center items-center mt-4 gap-4">
                <Button variant="link" onClick={() => setStep(prevStep)}>Quay lại</Button>
                <Button onClick={() => setStep(nextStep)} disabled={selectedItems.length === 0}>Tiếp tục</Button>
            </div>
        </>
    );
  };
  
  const ValueInterestStepDialog = () => {
        const content = valueInterestContent[currentLang];

        return (
            <>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
                    <DialogDescription className="text-center">{content.description}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-h-80 overflow-y-auto">
                    {content.options.map(option => {
                        const isSelected = selectedInterest.includes(option.id);
                        const selectionOrder = isSelected ? selectedInterest.indexOf(option.id) + 1 : 0;
                        return (
                            <Card
                                key={option.id}
                                onClick={() => handleMultiSelect(option.id, selectedInterest, setSelectedInterest)}
                                className={cn(
                                    "text-center p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center relative",
                                    isSelected && "ring-2 ring-primary border-primary bg-primary/10"
                                )}
                            >
                                {isSelected && (
                                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center font-bold">
                                        {selectionOrder}
                                    </Badge>
                                )}
                                <option.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                                <h3 className="font-semibold text-sm">{option.title}</h3>
                            </Card>
                        )
                    })}
                </div>
                <div className="flex justify-center items-center mt-6 gap-4">
                    <Button variant="link" onClick={() => setStep(9)}>{content.backButton}</Button>
                    <Button 
                        className="bg-accent-orange text-white hover:bg-accent-orange/90"
                        onClick={handleComplete} 
                        disabled={selectedInterest.length === 0}
                    >
                        {content.completeButton}
                    </Button>
                </div>
            </>
        )
  }
  
  const renderDialogContent = () => {
    switch (step) {
        case 1: return <PartnerRoleStepDialog />;
        case 1.5: return <JapaneseHrSubRoleStepDialogFromY001_5 />;
        case 2:
            // This is the new step 2
            if (selectedRole === 'nhan-vien-phai-cu') {
                return <SendingCompanySubRoleStepDialog />; // Y002-1
            }
            if (selectedRole === 'nhan-vien-nhan-luc-nhat') {
                return <JapaneseStaffNationalityStepDialog />; // Y002-2
            }
            // Fallback to step 1 if role is not set correctly, though this shouldn't happen
            return <PartnerRoleStepDialog />;
        case 3: return <InterestStepDialog />;
        case 4: return renderNameInputStepDialog();
        case 5: return renderCompanyNameStepDialog();
        case 6: return <VisaTypeMultiSelectStepDialog />;
        case 7:
            const visaDetailOptions = selectedVisa.flatMap(vSlug => (visaDetailsByVisaType[vSlug] || []).map(o => ({...o, id: o.slug, title: o.name.vi})));
            const visaDetailContentMultiLang = {
                vi: { title: 'Chọn chi tiết loại hình visa', description: 'Bạn có thể chọn nhiều mục, lựa chọn đầu tiên là ưu tiên số 1.' },
                ja: { title: 'ビザの詳細を選択', description: '複数の項目を選択できます。最初の選択が優先順位1番になります。' },
                en: { title: 'Select Visa Details', description: 'You can select multiple items. The first selection is priority #1.' },
            };
            return renderMultiSelectStepDialog(7, visaDetailContentMultiLang[currentLang].title, visaDetailContentMultiLang[currentLang].description, visaDetailOptions, selectedVisaDetail, setSelectedVisaDetail, 8, 6, 'md:grid-cols-3');
        case 8:
            const allIndustries = Object.values(industriesByJobType).flat();
            const industryOptions = Array.from(new Map(selectedVisa.flatMap(vSlug => industriesByJobType[vSlug as keyof typeof industriesByJobType] || []).map(item => [item.slug, item])).values()).map(o => ({...o, id: o.slug, title: o.name.vi}));
            return renderMultiSelectStepDialog(8, industryContent[currentLang].title, industryContent[currentLang].description, industryOptions, selectedIndustry, setSelectedIndustry, 9, 7, 'md:grid-cols-4');
        case 9:
             const regionOptions = japanRegions.map(r => ({id: r.slug, title: r.name, name: {vi:r.name, ja: r.name, en:r.name}}));
             const content = regionContent[currentLang];
             const regionKanjiMap: { [key: string]: string } = {
              Hokkaido: '北海道',
              Tohoku: '東北',
              Kanto: '関東',
              Chubu: '中部',
              Kansai: '関西',
              Chugoku: '中国',
              Shikoku: '四国',
              Kyushu: '九州',
              Okinawa: '沖縄',
            };
             return (
                 <>
                    {/* Screen: Y009 */}
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-headline text-center">{content.title}</DialogTitle>
                        <DialogDescription className="text-center">{content.description}</DialogDescription>
                    </DialogHeader>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 max-h-80 overflow-y-auto">
                         {regionOptions.map((option) => {
                             const isSelected = selectedRegion.includes(option.id);
                             const selectionOrder = isSelected ? selectedRegion.indexOf(option.id) + 1 : 0;
                             return (
                                <Card
                                    key={option.id}
                                    onClick={() => handleMultiSelect(option.id, selectedRegion, setSelectedRegion)}
                                    className={cn(
                                        "text-center p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col items-center justify-center relative",
                                        isSelected && "ring-2 ring-primary border-primary bg-primary/10"
                                    )}
                                >
                                    {isSelected && (
                                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center font-bold">
                                            {selectionOrder}
                                        </Badge>
                                    )}
                                    <h3 className="font-bold text-base mb-1">{currentLang === 'ja' ? regionKanjiMap[option.title] : option.title}</h3>
                                </Card>
                             )
                         })}
                    </div>
                    <div className="flex justify-center items-center mt-6 gap-4">
                        <Button variant="link" onClick={() => setStep(8)}>{content.backButton}</Button>
                        <Button 
                            className="bg-accent-orange text-white hover:bg-accent-orange/90"
                            onClick={() => setStep(10)} 
                            disabled={selectedRegion.length === 0}
                        >
                            {content.completeButton}
                        </Button>
                    </div>
                </>
             );
        case 10: return <ValueInterestStepDialog />;
        default: return <PartnerRoleStepDialog />;
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) setStep(1); }}>
          {children && <DialogTrigger asChild>{children}</DialogTrigger>}
          <DialogContent className="sm:max-w-4xl">
              {renderDialogContent()}
          </DialogContent>
      </Dialog>
    </>
  );
}
