

'use client';

import { useState, useEffect, use } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, Cake, Dna, Edit, GraduationCap, MapPin, Phone, School, User, Award, Languages, Star, FileDown, Video, Image as ImageIcon, PlusCircle, Trash2, RefreshCw, X, Camera, MessageSquare, Facebook, Contact, UserCog, Trophy, PlayCircle, LogOut, Wallet, Target, Milestone, FilePen, Globe, ChevronDown, Loader2, Send, FileArchive, Eye, Link2, Share2, FileType, FileJson, FileSpreadsheet, FileCode, FileText, Sheet, ArrowRightLeft, CalendarIcon, Ruler, QrCode, Info } from 'lucide-react';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import type { CandidateProfile } from '@/ai/schemas';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { translateProfile } from '@/ai/flows/translate-profile-flow';
import type { TranslateProfileInput } from '@/ai/schemas/translate-profile-schema';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon, ZaloIcon, MessengerIcon, LineIcon } from '@/components/custom-icons';
import { industriesByJobType } from '@/lib/industry-data';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { locations } from '@/lib/location-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EditProfileDialog } from '@/components/candidate-edit-dialog';


type MediaItem = {
  src: string;
  thumbnail?: string; 
  alt: string;
  "data-ai-hint": string;
};

type EnrichedCandidateProfile = CandidateProfile & { 
  avatarUrl?: string;
  videos: MediaItem[];
  images: MediaItem[];
};

type Language = 'vi' | 'ja' | 'en';

type ProfilesByLang = {
    vi: EnrichedCandidateProfile | null;
    ja: Partial<EnrichedCandidateProfile> | null;
    en: Partial<EnrichedCandidateProfile> | null;
}

const translations = {
    vi: {
        personalInfo: "Thông tin cá nhân",
        dateOfBirth: "Ngày sinh",
        gender: "Giới tính",
        height: "Chiều cao",
        weight: "Cân nặng",
        tattoo: "Hình xăm",
        hepatitisB: "Viêm gan B",
        japaneseProficiency: "Năng lực tiếng Nhật",
        englishProficiency: "Năng lực tiếng Anh",
        documentsSection: "Hồ sơ/Giấy tờ",
        vietnamDocs: "Giấy tờ Việt Nam",
        japanDocs: "Giấy tờ Nhật Bản",
        otherDocs: "Giấy tờ nước ngoài/Du học",
        aspirations: "Nguyện vọng",
        desiredIndustry: "Ngành nghề",
        desiredJobDetail: "Công việc chi tiết",
        desiredVisaType: "Loại Visa",
        desiredVisaDetail: "Chi tiết loại hình visa mong muốn",
        desiredLocation: "Địa điểm",
        desiredSalary: "Lương cơ bản",
        desiredNetSalary: "Thực lĩnh",
        financialAbility: "Khả năng tài chính",
        interviewLocation: "Nơi phỏng vấn",
        specialAspirations: "Yêu cầu khác",
        about: "Giới thiệu bản thân",
        workExperience: "Kinh nghiệm làm việc",
        education: "Học vấn",
        skillsAndInterests: "Kỹ năng & Lĩnh vực",
        skills: "Kỹ năng",
        interests: "Lĩnh vực quan tâm",
        certifications: "Chứng chỉ & Giải thưởng",
        notes: "Ghi chú",
        videos: "Video",
        bodyPhotos: "Ảnh hình thể",
        noInfo: "Chưa có thông tin.",
        clickToUpdate: "Nhấn vào đây để cập nhật",
    },
    ja: {
        personalInfo: "個人情報",
        dateOfBirth: "生年月日",
        gender: "性別",
        height: "身長",
        weight: "体重",
        tattoo: "刺青",
        hepatitisB: "B型肝炎",
        japaneseProficiency: "日本語能力",
        englishProficiency: "英語能力",
        documentsSection: "書類・証明書",
        vietnamDocs: "ベトナムの書類",
        japanDocs: "日本の書類",
        otherDocs: "外国の書類・留学",
        aspirations: "希望条件",
        desiredIndustry: "希望職種",
        desiredJobDetail: "具体的な仕事内容",
        desiredVisaType: "希望ビザ",
        desiredVisaDetail: "ビザ詳細",
        desiredLocation: "希望勤務地",
        desiredSalary: "希望基本給",
        desiredNetSalary: "希望手取り",
        financialAbility: "経済的能力",
        interviewLocation: "面接地",
        specialAspirations: "その他の希望",
        about: "自己紹介",
        workExperience: "職務経歴",
        education: "学歴",
        skillsAndInterests: "スキル・興味分野",
        skills: "スキル",
        interests: "興味分野",
        certifications: "資格・受賞歴",
        notes: "備考",
        videos: "ビデオ",
        bodyPhotos: "体型写真",
        noInfo: "情報がありません。",
        clickToUpdate: "ここをクリックして更新",
    },
    en: {
        personalInfo: "Personal Information",
        dateOfBirth: "Date of Birth",
        gender: "Gender",
        height: "Height",
        weight: "Weight",
        tattoo: "Tattoo Status",
        hepatitisB: "Hepatitis B",
        japaneseProficiency: "Japanese Proficiency",
        englishProficiency: "English Proficiency",
        documentsSection: "Documents & Paperwork",
        vietnameseDocs: "Vietnamese Documents",
        japanDocs: "Japanese Documents",
        otherDocs: "Overseas/Study Abroad Docs",
        aspirations: "Aspirations",
        desiredIndustry: "Desired Industry",
        desiredJobDetail: "Detailed Job",
        desiredVisaType: "Desired Visa Type",
        desiredVisaDetail: "Visa Detail",
        desiredLocation: "Desired Location",
        desiredSalary: "Desired Basic Salary",
        desiredNetSalary: "Desired Net Salary",
        financialAbility: "Financial Ability",
        interviewLocation: "Interview Location",
        specialAspirations: "Other Aspirations",
        about: "About Me",
        workExperience: "Work Experience",
        education: "Education",
        skillsAndInterests: "Skills & Interests",
        skills: "Skills",
        interests: "Interests",
        certifications: "Certifications & Awards",
        notes: "Notes",
        videos: "Videos",
        bodyPhotos: "Body Photos",
        noInfo: "No information yet.",
        clickToUpdate: "Click here to update",
    }
}


const emptyCandidate: EnrichedCandidateProfile = {
    name: 'Lê Thị An',
    headline: 'Kỹ sư Cơ khí với 2 năm kinh nghiệm',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    about: 'Là một kỹ sư cơ khí năng động và ham học hỏi với 2 năm kinh nghiệm trong lĩnh vực thiết kế và vận hành máy móc công nghiệp. Có khả năng sử dụng thành thạo AutoCAD, SolidWorks và có kiến thức nền tảng về hệ thống CNC. Mong muốn tìm kiếm một cơ hội làm việc tại Nhật Bản để phát triển kỹ năng chuyên môn và đóng góp vào sự thành công của công ty.',
    education: [
        { school: 'Đại học Bách Khoa TP.HCM', degree: 'Kỹ sư Cơ khí', gradYear: 2022 },
        { school: 'Trung tâm tiếng Nhật Sakura', degree: 'Chứng chỉ N3', gradYear: 2023 }
    ],
    experience: [
        { company: 'Công ty TNHH Cơ khí Chính xác ABC', role: 'Kỹ sư Vận hành', period: '08/2022 - Hiện tại', description: 'Chịu trách nhiệm vận hành và bảo trì dây chuyền máy phay CNC. Lập trình và tối ưu hóa các chương trình gia công. Đảm bảo chất lượng sản phẩm đầu ra.' },
    ],
    personalInfo: {
      birthYear: 2000,
      gender: 'Nữ',
      phone: '0901234567',
      japaneseProficiency: 'Tiếng Nhật N3',
      englishProficiency: 'Giao tiếp cơ bản',
      dateOfBirth: '2000-05-15',
      height: '160',
      weight: '50',
      tattooStatus: 'Không có',
      hepatitisBStatus: 'Không viêm gan B',
      messenger: 'lethian.2000',
      zalo: '0901234567',
      line: 'lethian.line',
    },
    aspirations: {
        desiredLocation: 'Osaka',
        desiredSalary: '220000',
        desiredNetSalary: '180000',
        desiredVisaType: 'Thực tập sinh kỹ năng',
        desiredVisaDetail: 'Thực tập sinh 3 năm',
        desiredJobDetail: 'Vận hành máy CNC',
        financialAbility: 'Không yêu cầu',
        interviewLocation: 'Thành phố Hồ Chí Minh',
        specialAspirations: 'Mong muốn có nhiều cơ hội làm thêm giờ và được hỗ trợ đào tạo chuyên sâu về kỹ năng quản lý.',
    },
    notes: 'Đã có kinh nghiệm phỏng vấn với công ty Nhật 2 lần, mong muốn tìm đơn hàng bay nhanh trong vòng 3 tháng tới. Có thể đóng phí ngay.',
    interests: ['Cơ khí', 'Tự động hóa', 'Sản xuất'],
    skills: ['Vận hành máy CNC', 'AutoCAD', 'SolidWorks', 'Làm việc nhóm', 'Giải quyết vấn đề'],
    certifications: ['Chứng chỉ JLPT N3', 'Chứng chỉ An toàn lao động'],
    documents: {
        vietnam: ['Xác nhận cư trú', 'Xác nhận dân sự', 'Căn cước mặt trước', 'Căn cước mặt sau', 'Hộ chiếu mặt trước', 'Hộ chiếu mặt sau', 'Giấy khám sức khỏe', 'Bằng học vấn', 'Xác nhận tình trạng hôn nhân', 'Giấy tờ khác'],
        japan: ['Thẻ ngoại kiều mặt trước', 'Thẻ ngoại kiều mặt sau', 'Ảnh CV gốc mặt trước', 'Ảnh CV gốc mặt sau', 'Giấy kết thúc 3 năm mặt trước', 'Giấy kết thúc 3 năm mặt sau', 'Chứng chỉ tokutei', 'Chứng chỉ tiếng Nhật', 'Giấy Shiteisho', 'Giấy đánh giá Hyokachoso', 'Giấy tờ khác'],
        other: ['Thẻ ID', 'Bằng ngoại ngữ', 'Sổ tiết kiệm', 'Xác nhận công việc người bảo lãnh 1', 'Xác nhận công việc người bảo lãnh 2', 'Thẻ ID người bảo lãnh 1', 'Thẻ ID người bảo lãnh 2', 'Giấy tờ khác'],
    },
    desiredIndustry: 'Cơ khí, Chế tạo máy',
    avatarUrl: undefined,
    videos: [
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Giới thiệu bản thân', "data-ai-hint": 'self introduction video' },
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Tay nghề 1', "data-ai-hint": 'skill demonstration' },
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Tay nghề 2', "data-ai-hint": 'welding skill' },
    ],
    images: [
      { src: 'https://placehold.co/400x600.png', alt: 'Ảnh trước', "data-ai-hint": 'front view portrait' },
      { src: 'https://placehold.co/400x600.png', alt: 'Ảnh trái', "data-ai-hint": 'left side portrait' },
      { src: 'https://placehold.co/400x600.png', alt: 'Ảnh phải', "data-ai-hint": 'right side portrait' },
      { src: 'https://placehold.co/400x600.png', alt: 'Toàn thân trước', "data-ai-hint": 'full body front' },
      { src: 'https://placehold.co/400x600.png', alt: 'Toàn thân trái', "data-ai-hint": 'full body left' },
      { src: 'https://placehold.co/400x600.png', alt: 'Toàn thân phải', "data-ai-hint": 'full body right' },
    ],
};


const commonSkills = ['Vận hành máy CNC', 'AutoCAD', 'Kiểm tra chất lượng', 'Làm việc nhóm', 'Giải quyết vấn đề', 'Tiếng Anh giao tiếp'];
const commonInterests = ['Cơ khí', 'Điện tử', 'IT', 'Logistics', 'Dệt may', 'Chế biến thực phẩm'];

const allIndustries = Object.values(industriesByJobType).flat().filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i);

const parseMessengerInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    try {
        if (trimmedInput.startsWith('http') || trimmedInput.startsWith('www.')) {
            const url = new URL(trimmedInput.startsWith('http') ? trimmedInput : `https://${trimmedInput}`);
            
            if (url.hostname.includes('facebook.com') || url.hostname.includes('m.facebook.com')) {
                if (url.pathname.includes('profile.php')) {
                    const id = url.searchParams.get('id');
                    if (id) return id;
                }
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                    const lastPart = pathParts[pathParts.length - 1];
                    // Avoid returning generic paths
                    if (lastPart !== 'profile.php' && lastPart !== 'home.php') {
                        return lastPart;
                    }
                }
            }
             if (url.hostname.includes('m.me')) {
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                     return pathParts[pathParts.length - 1];
                }
            }
        }
    } catch (error) {
        console.warn("Could not parse input as URL, treating as username:", error);
    }
    // Fallback: remove any potential URL parts and treat as username
    return trimmedInput.split('/').pop() || trimmedInput;
};

const parseZaloInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    if (trimmedInput.includes('zalo.me/')) {
        const parts = trimmedInput.split('/');
        return parts.pop()?.replace(/\D/g, '') || '';
    }
    // Keep only numbers
    return trimmedInput.replace(/\D/g, '');
};

const parseLineInput = (input: string): string => {
    if (!input) return '';
    return input.trim();
};


const EditDialog = ({
  children,
  title,
  onSave,
  renderContent,
  description,
  candidate,
  dialogId,
}: {
  children: React.ReactNode;
  title: string;
  onSave: (updatedCandidate: EnrichedCandidateProfile) => void;
  renderContent: (
    tempData: EnrichedCandidateProfile,
    handleTempChange: (
      section: keyof EnrichedCandidateProfile | 'personalInfo' | 'aspirations' | 'documents',
      ...args: any[]
    ) => void
  ) => React.ReactNode;
  description?: string;
  candidate: EnrichedCandidateProfile;
  dialogId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempCandidate, setTempCandidate] = useState<EnrichedCandidateProfile>(candidate);

  useEffect(() => {
    if (isOpen) {
      setTempCandidate(JSON.parse(JSON.stringify(candidate)));
    }
  }, [isOpen, candidate]);

  const handleSave = () => {
    onSave(tempCandidate);
    setIsOpen(false);
  };

  const handleTempChange = (
    section: keyof EnrichedCandidateProfile | 'personalInfo' | 'aspirations' | 'documents',
    ...args: any[]
  ) => {
    setTempCandidate(prev => {
      const newCandidate = { ...prev! };

      if (section === 'personalInfo' || section === 'aspirations') {
        const [field, value] = args;
        
        if (section === 'personalInfo' && field === 'messenger') {
             newCandidate[section] = { ...newCandidate[section]!, [field]: parseMessengerInput(value) };
        } else if (section === 'personalInfo' && field === 'zalo') {
            newCandidate[section] = { ...newCandidate[section]!, [field]: parseZaloInput(value) };
        } else if (section === 'personalInfo' && field === 'line') {
             newCandidate[section] = { ...newCandidate[section]!, [field]: parseLineInput(value) };
        } else {
             // @ts-ignore
             newCandidate[section] = { ...newCandidate[section], [field]: value };
        }

        if (section === 'aspirations' && field === 'desiredVisaType') {
            newCandidate.aspirations!.desiredVisaDetail = '';
            newCandidate.aspirations!.desiredJobDetail = ''; 
        }
        if (section === 'aspirations' && field === 'desiredIndustry') {
            newCandidate.aspirations!.desiredJobDetail = '';
        }
      } else if (section === 'documents') {
          const [docType, index, value] = args;
          // @ts-ignore
          newCandidate.documents[docType][index] = value;
      } else if (['experience', 'education'].includes(section)) {
        const [index, field, value] = args;
        // @ts-ignore
        newCandidate[section][index][field] = value;
      } else if (section === 'certifications') {
         const [index, value] = args;
         newCandidate.certifications[index] = value;
      } else if (['skills', 'interests'].includes(section)) {
          const [value, isAdding] = args;
          // @ts-ignore
          const currentValues = newCandidate[section];
          // @ts-ignore
          newCandidate[section] = isAdding
              ? [...currentValues, value]
              : currentValues.filter((item: string) => item !== value);
      } else {
        const [value] = args;
        // @ts-ignore
        newCandidate[section] = value;
      }

      return newCandidate;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" id={dialogId}>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          {renderContent(tempCandidate, handleTempChange)}
        </div>
        <DialogFooter>
           <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
            </DialogClose>
          <Button type="submit" onClick={handleSave} className="bg-primary text-white">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};



const formatYen = (value?: string | number) => {
    if (value === null || value === undefined || value === '') return 'Chưa cập nhật';
    
    const numericValue = typeof value === 'string' 
        ? parseInt(value.replace(/[^0-9]/g, ''), 10)
        : value;
        
    if (isNaN(numericValue)) return value;
    return `${numericValue.toLocaleString('ja-JP')} yên`;
};

const visaDetailsByVisaType: { [key: string]: string[] } = {
    'Thực tập sinh kỹ năng': ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Thực tập sinh 3 Go'],
    'Kỹ năng đặc định': ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'],
    'Kỹ sư, tri thức': ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật']
};
const visaTypes = Object.keys(visaDetailsByVisaType);


export default function CandidateProfilePage() {
  const { toast } = useToast();
  const { role } = useAuth();
  const [profileByLang, setProfileByLang] = useState<ProfilesByLang>({ vi: null, ja: null, en: null });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('vi');
  const [isSendOptionsOpen, setIsSendOptionsOpen] = useState(false);
  const [languageToSend, setLanguageToSend] = useState('');
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);


  useEffect(() => {
    let isNew = false;
    let profileToLoad: EnrichedCandidateProfile;

    const storedProfile = localStorage.getItem('generatedCandidateProfile');
    const isCandidateWithEmptyProfile = role === 'candidate-empty-profile';
    
    if (isCandidateWithEmptyProfile) {
        isNew = true;
    } else if (storedProfile) {
        try {
            const parsedProfile = JSON.parse(storedProfile);
            isNew = !parsedProfile.name && !parsedProfile.headline && !parsedProfile.about;
        } catch {
            isNew = true;
        }
    } else {
        isNew = true;
    }
    
    const defaultImages: MediaItem[] = [
      { src: 'https://placehold.co/400x600.png', alt: 'Ảnh trước', "data-ai-hint": 'front view portrait' },
      { src: 'https://placehold.co/400x600.png', alt: 'Ảnh trái', "data-ai-hint": 'left side portrait' },
      { src: 'https://placehold.co/400x600.png', alt: 'Ảnh phải', "data-ai-hint": 'right side portrait' },
      { src: 'https://placehold.co/400x600.png', alt: 'Toàn thân trước', "data-ai-hint": 'full body front' },
      { src: 'https://placehold.co/400x600.png', alt: 'Toàn thân trái', "data-ai-hint": 'full body left' },
      { src: 'https://placehold.co/400x600.png', alt: 'Toàn thân phải', "data-ai-hint": 'full body right' },
    ];
    
    const defaultVideos: MediaItem[] = [
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Giới thiệu bản thân', "data-ai-hint": 'self introduction video' },
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Tay nghề 1', "data-ai-hint": 'skill demonstration' },
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Tay nghề 2', "data-ai-hint": 'welding skill' },
    ];

    if (isNew) {
        const newEmptyProfile = JSON.parse(JSON.stringify(emptyCandidate));
        Object.keys(newEmptyProfile).forEach(key => {
            if (typeof newEmptyProfile[key] === 'string') newEmptyProfile[key] = '';
            if (Array.isArray(newEmptyProfile[key])) newEmptyProfile[key] = [];
            if (key === 'personalInfo' || key === 'aspirations' || key === 'documents') {
                if (newEmptyProfile[key]) {
                    Object.keys(newEmptyProfile[key]).forEach(subKey => newEmptyProfile[key][subKey] = '');
                }
            }
        });
         profileToLoad = {
             ...newEmptyProfile,
             name: 'Ứng viên mới',
             avatarUrl: undefined,
             videos: defaultVideos,
             images: defaultImages
         };
    } else {
      try {
        const parsedProfile = JSON.parse(storedProfile!);
        profileToLoad = {
          ...emptyCandidate,
          ...parsedProfile,
          personalInfo: { ...emptyCandidate.personalInfo, ...parsedProfile.personalInfo },
          aspirations: { ...emptyCandidate.aspirations, ...parsedProfile.aspirations },
          documents: { ...emptyCandidate.documents, ...parsedProfile.documents },
          avatarUrl: parsedProfile.avatarUrl || undefined,
          videos: (parsedProfile.videos && parsedProfile.videos.length > 0) ? parsedProfile.videos : defaultVideos,
          images: (parsedProfile.images && parsedProfile.images.length > 0) ? parsedProfile.images : defaultImages,
        };
      } catch (error) {
        console.error("Failed to parse candidate profile from localStorage", error);
        profileToLoad = { ...emptyCandidate, videos: defaultVideos, images: defaultImages };
        isNew = true;
      }
    }
    setProfileByLang({ vi: profileToLoad, ja: null, en: null });
    setIsNewProfile(isNew);
  }, [role]);

  const handleSave = (updatedCandidate: EnrichedCandidateProfile) => {
    setProfileByLang({ vi: updatedCandidate, ja: null, en: null });
    setCurrentLang('vi');
    setIsNewProfile(false);
  };

  useEffect(() => {
    if (profileByLang.vi && role === 'candidate') {
      localStorage.setItem('generatedCandidateProfile', JSON.stringify(profileByLang.vi));
    }
  }, [profileByLang.vi, role]);


  const handleLanguageChange = async (lang: Language) => {
    if (lang === currentLang) return;
    
    if (profileByLang[lang]) {
        setCurrentLang(lang);
        return;
    }
    
    if (!profileByLang.vi) return;

    setIsTranslating(true);
    try {
        const input: TranslateProfileInput = {
            profile: profileByLang.vi,
            targetLanguage: lang === 'ja' ? 'Japanese' : 'English',
        };
        const translatedProfile = await translateProfile(input);
        
        setProfileByLang(prev => ({
            ...prev,
            [lang]: translatedProfile,
        }));
        setCurrentLang(lang);

    } catch (error) {
        console.error("Translation failed:", error);
        toast({
            variant: "destructive",
            title: "Dịch thất bại",
            description: "Đã có lỗi xảy ra khi dịch hồ sơ. Vui lòng thử lại."
        });
    } finally {
        setIsTranslating(false);
    }
  };

  const getDisplayedProfile = (): EnrichedCandidateProfile | null => {
    const { vi, ja, en } = profileByLang;
    if (!vi) return null;

    const baseProfile = vi;
    const translatedProfile = profileByLang[currentLang];
    
    if (currentLang === 'vi' || !translatedProfile) {
        return baseProfile;
    }

    const mergeDeep = (target: any, source: any): any => {
        const output = { ...target };
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = mergeDeep(target[key], source[key]);
                } else if (Array.isArray(source[key])) {
                     if (key === 'skills' || key === 'interests' || key === 'certifications' || key === 'documents') {
                        Object.assign(output, { [key]: source[key] });
                    } else if (key === 'education' || key === 'experience') {
                        const targetArray = target[key] || [];
                        const sourceArray = source[key] || [];
                        output[key] = targetArray.map((item: any, index: number) => {
                            if (sourceArray[index]) {
                                return mergeDeep(item, sourceArray[index]);
                            }
                            return item;
                        });
                    }
                } else if (source[key] !== undefined && source[key] !== null) {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    };

    const isObject = (item: any) => {
        return (item && typeof item === 'object' && !Array.isArray(item));
    };

    return mergeDeep(baseProfile, translatedProfile) as EnrichedCandidateProfile;
};
  
  const candidate = getDisplayedProfile();
  const t = translations[currentLang];


  if (!candidate) {
      return (
        <div className="bg-secondary">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    <Card className="shadow-2xl overflow-hidden">
                        <CardHeader className="p-0">
                            <Skeleton className="h-32 bg-gray-300" />
                            <div className="p-6 flex flex-col md:flex-row items-center md:items-end -mt-16">
                                <Skeleton className="h-32 w-32 rounded-full border-4 border-background bg-gray-400" />
                                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left space-y-2">
                                    <Skeleton className="h-8 w-64" />
                                    <Skeleton className="h-6 w-80" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Skeleton className="h-96 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      );
  }
  
  const handleMediaChange = (type: 'avatar' | 'image', e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (file && profileByLang.vi) {
      const reader = new FileReader();
      reader.onload = () => {
        const newUrl = reader.result as string;
        const newProfile = JSON.parse(JSON.stringify(profileByLang.vi));
        if (type === 'avatar') {
            newProfile.avatarUrl = newUrl;
        } else if (type === 'image' && index !== undefined) {
            newProfile.images[index].src = newUrl;
        }
        setProfileByLang({ vi: newProfile, ja: null, en: null });
        setCurrentLang('vi');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (section: 'experience' | 'education' | 'certifications' | 'documents', docType?: 'vietnam' | 'japan' | 'other') => {
      if (!profileByLang.vi) return;
      const newProfile = JSON.parse(JSON.stringify(profileByLang.vi));
      if (section === 'experience') {
          newProfile.experience.push({ company: '', role: '', period: '', description: '' });
      } else if (section === 'education') {
          newProfile.education.push({ school: '', degree: '', gradYear: new Date().getFullYear() });
      } else if (section === 'certifications') {
          newProfile.certifications.push('');
      } else if (section === 'documents' && docType) {
          if (!newProfile.documents) {
              newProfile.documents = { vietnam: [], japan: [], other: [] };
          }
          newProfile.documents[docType].push('');
      }
      setProfileByLang({ vi: newProfile, ja: null, en: null });
      setCurrentLang('vi');
  };

  const handleRemoveItem = (
      section: 'experience' | 'education' | 'certifications' | 'skills' | 'interests' | 'documents',
      indexOrValue: number | string,
      docType?: 'vietnam' | 'japan' | 'other'
  ) => {
      if (!profileByLang.vi) return;
      const newProfile = JSON.parse(JSON.stringify(profileByLang.vi));
      if (section === 'skills' || section === 'interests') {
          // @ts-ignore
          newProfile[section] = newProfile[section].filter(item => item !== indexOrValue);
      } else if (section === 'documents' && docType && typeof indexOrValue === 'number') {
         // @ts-ignore
         newProfile.documents[docType].splice(indexOrValue, 1);
      } else if (typeof indexOrValue === 'number') {
          // @ts-ignore
          newProfile[section].splice(indexOrValue, 1);
      }
      setProfileByLang({ vi: newProfile, ja: null, en: null });
      setCurrentLang('vi');
  };

  const handleAddNewChip = (field: 'skills' | 'interests') => {
    if (!profileByLang.vi) return;
    const valueToAdd = field === 'skills' ? newSkill.trim() : newInterest.trim();
    if (valueToAdd && !profileByLang.vi[field].includes(valueToAdd)) {
        const newProfile = {
            ...profileByLang.vi,
            [field]: [...profileByLang.vi[field], valueToAdd],
        };
      setProfileByLang({ vi: newProfile, ja: null, en: null });
      setCurrentLang('vi');
      if (field === 'skills') {
        setNewSkill('');
      } else {
        setNewInterest('');
      }
    }
  };


  const renderAboutEdit = (tempCandidate: EnrichedCandidateProfile, handleTempChange: Function) => (
    <Textarea
      value={tempCandidate.about}
      onChange={e => handleTempChange('about', e.target.value)}
      rows={6}
    />
  );

  const renderNotesEdit = (tempCandidate: EnrichedCandidateProfile, handleTempChange: Function) => (
    <Textarea
      value={tempCandidate.notes}
      onChange={e => handleTempChange('notes', e.target.value)}
      rows={4}
      placeholder="Ghi chú về nguyện vọng, khả năng tài chính, thời gian có thể đi..."
    />
  );

  const renderExperienceEdit = (tempCandidate: EnrichedCandidateProfile, handleTempChange: Function) => (
    <div className="space-y-6">
      {tempCandidate.experience.map((exp, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-2 relative">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">Kinh nghiệm #{index + 1}</h4>
            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('experience', index)}>
              <Trash2 className="h-4 w-4 text-destructive"/>
            </Button>
          </div>
          <Label>Vai trò</Label>
          <Input value={exp.role} onChange={e => handleTempChange('experience', index, 'role', e.target.value)} />
          <Label>Công ty</Label>
          <Input value={exp.company} onChange={e => handleTempChange('experience', index, 'company', e.target.value)} />
          <Label>Thời gian</Label>
          <Input value={exp.period} onChange={e => handleTempChange('experience', index, 'period', e.target.value)} />
          <Label>Mô tả</Label>
          <Textarea value={exp.description} onChange={e => handleTempChange('experience', index, 'description', e.target.value)} />
        </div>
      ))}
      <Button variant="outline" className="w-full" onClick={() => handleAddItem('experience')}>
        <PlusCircle className="mr-2"/> Thêm kinh nghiệm
      </Button>
    </div>
  );

  const renderEducationEdit = (tempCandidate: EnrichedCandidateProfile, handleTempChange: Function) => (
    <div className="space-y-6">
      {tempCandidate.education.map((edu, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-2 relative">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">Học vấn #{index + 1}</h4>
            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('education', index)}>
              <Trash2 className="h-4 w-4 text-destructive"/>
            </Button>
          </div>
          <Label>Trường</Label>
          <Input value={edu.school} onChange={e => handleTempChange('education', index, 'school', e.target.value)} />
          <Label>Chuyên ngành</Label>
          <Input value={edu.degree} onChange={e => handleTempChange('education', index, 'degree', e.target.value)} />
          <Label>Năm tốt nghiệp</Label>
          <Input type="number" value={edu.gradYear} onChange={e => handleTempChange('education', index, 'gradYear', parseInt(e.target.value))} />
        </div>
      ))}
      <Button variant="outline" className="w-full" onClick={() => handleAddItem('education')}>
        <PlusCircle className="mr-2"/> Thêm học vấn
      </Button>
    </div>
  );

  const renderSkillsInterestsEdit = (tempCandidate: EnrichedCandidateProfile, handleTempChange: Function) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-bold">Kỹ năng</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {tempCandidate.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="pr-1">
              {skill}
              <button onClick={() => handleRemoveItem('skills', skill)} className="ml-2 rounded-full hover:bg-destructive/80 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {commonSkills.filter(s => !tempCandidate.skills.includes(s)).map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox id={`skill-${skill}`} onCheckedChange={(checked) => handleTempChange('skills', skill, checked)} checked={tempCandidate.skills.includes(skill)}/>
              <Label htmlFor={`skill-${skill}`} className="text-sm font-normal cursor-pointer">{skill}</Label>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Thêm kỹ năng khác..." />
          <Button onClick={() => handleAddNewChip('skills')}>Thêm</Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-bold">Lĩnh vực quan tâm</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {tempCandidate.interests.map((interest) => (
            <Badge key={interest} className="bg-accent-blue text-white pr-1">
              {interest}
              <button onClick={() => handleRemoveItem('interests', interest)} className="ml-2 rounded-full hover:bg-destructive/80 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {commonInterests.filter(i => !tempCandidate.interests.includes(i)).map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox id={`interest-${interest}`} onCheckedChange={(checked) => handleTempChange('interests', interest, checked)} checked={tempCandidate.interests.includes(interest)}/>
              <Label htmlFor={`interest-${interest}`} className="text-sm font-normal cursor-pointer">{interest}</Label>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input value={newInterest} onChange={e => setNewInterest(e.target.value)} placeholder="Thêm lĩnh vực khác..." />
          <Button onClick={() => handleAddNewChip('interests')}>Thêm</Button>
        </div>
      </div>
    </div>
  );

  const renderCertificationsEdit = (tempCandidate: EnrichedCandidateProfile, handleTempChange: Function) => (
    <div className="space-y-6">
      {tempCandidate.certifications.map((cert, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-2 relative">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor={`cert-${index}`}>Chứng chỉ #{index + 1}</Label>
            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('certifications', index)}>
              <Trash2 className="h-4 w-4 text-destructive"/>
            </Button>
          </div>
          <Input id={`cert-${index}`} value={cert} onChange={(e) => handleTempChange('certifications', index, e.target.value)} />
        </div>
      ))}
      <Button variant="outline" className="w-full" onClick={() => handleAddItem('certifications')}>
        <PlusCircle className="mr-2"/> Thêm chứng chỉ
      </Button>
    </div>
  );

  const renderDocumentsEdit = (tempCandidate: EnrichedCandidateProfile, handleTempChange: Function) => (
    <div className="space-y-6">
        <div>
            <h4 className="font-bold mb-2">Giấy tờ Việt Nam</h4>
            {(tempCandidate.documents?.vietnam || []).map((doc, index) => (
                 <div key={index} className="flex items-center gap-2 mb-2">
                    <Input value={doc} onChange={(e) => handleTempChange('documents', 'vietnam', index, e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('documents', index, 'vietnam')}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                 </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => handleAddItem('documents', 'vietnam')}><PlusCircle className="mr-2 h-4 w-4"/> Thêm</Button>
        </div>
         <div>
            <h4 className="font-bold mb-2">Giấy tờ Nhật Bản</h4>
            {(tempCandidate.documents?.japan || []).map((doc, index) => (
                 <div key={index} className="flex items-center gap-2 mb-2">
                    <Input value={doc} onChange={(e) => handleTempChange('documents', 'japan', index, e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('documents', index, 'japan')}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                 </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => handleAddItem('documents', 'japan')}><PlusCircle className="mr-2 h-4 w-4"/> Thêm</Button>
        </div>
         <div>
            <h4 className="font-bold mb-2">Giấy tờ nước ngoài / Du học</h4>
            {(tempCandidate.documents?.other || []).map((doc, index) => (
                 <div key={index} className="flex items-center gap-2 mb-2">
                    <Input value={doc} onChange={(e) => handleTempChange('documents', 'other', index, e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('documents', index, 'other')}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                 </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => handleAddItem('documents', 'other')}><PlusCircle className="mr-2 h-4 w-4"/> Thêm</Button>
        </div>
    </div>
  );

  const renderAspirationsEdit = (tempCandidate: EnrichedCandidateProfile, handleTempChange: Function) => {
    
    const [basicSalaryCurrency, setBasicSalaryCurrency] = useState<'JPY' | 'VND'>('JPY');
    const [netSalaryCurrency, setNetSalaryCurrency] = useState<'JPY' | 'VND'>('JPY');
    const [financialAbilityCurrency, setFinancialAbilityCurrency] = useState<'JPY' | 'VND' | 'USD'>('USD');
    const JPY_VND_RATE = 165;
    const USD_VND_RATE = 25000;
  
    const availableIndustries = tempCandidate.aspirations?.desiredVisaType
      ? industriesByJobType[tempCandidate.aspirations.desiredVisaType as keyof typeof industriesByJobType] || allIndustries
      : allIndustries;
      
    const selectedIndustryData = availableIndustries.find(ind => ind.name === tempCandidate.desiredIndustry);
    const availableJobDetails = selectedIndustryData ? selectedIndustryData.keywords : [];

    const getPlaceholder = (field: 'basic' | 'net' | 'financial', currency: 'JPY' | 'VND' | 'USD') => {
      let range;
      let rate = 1;
      let currencySymbol = 'yên';
      let locale = 'ja-JP';

      if (field === 'financial') {
        range = {min: 0, max: 4000};
        rate = currency === 'USD' ? 1 : USD_VND_RATE;
        currencySymbol = currency === 'USD' ? '$' : 'VNĐ';
        locale = currency === 'USD' ? 'en-US' : 'vi-VN';
      } else {
        const salaryRanges: { [key: string]: { min: number; max: number } } = {
          'Thực tập sinh kỹ năng': { min: 120000, max: 500000 },
          'Kỹ năng đặc định': { min: 150000, max: 1500000 },
          'Kỹ sư, tri thức': { min: 160000, max: 10000000 },
          'Default': { min: 100000, max: 10000000 }
        };
        const { min, max } = salaryRanges[tempCandidate.aspirations?.desiredVisaType || 'Default'];
        range = {
            min: field === 'basic' ? min : Math.floor(min * 0.8),
            max: field === 'basic' ? max : Math.floor(max * 0.85),
        };
        rate = currency === 'JPY' ? 1 : JPY_VND_RATE;
        currencySymbol = currency === 'JPY' ? 'yên' : 'VNĐ';
        locale = currency === 'JPY' ? 'ja-JP' : 'vi-VN';
      }
      
      const minDisplay = (range.min * rate).toLocaleString(locale);
      const maxDisplay = (range.max * rate).toLocaleString(locale);

      return `${minDisplay} - ${maxDisplay} ${currencySymbol}`;
    };

    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'desiredSalary' | 'desiredNetSalary' | 'financialAbility', currency: 'JPY' | 'VND' | 'USD') => {
        const rawValue = e.target.value;
        const numericValue = parseInt(rawValue.replace(/[,.]/g, ''), 10);

        if (isNaN(numericValue)) {
            handleTempChange('aspirations', field, '');
            return;
        }

        let valueInYen;
        if (field === 'financialAbility') {
            valueInYen = currency === 'VND' ? Math.round(numericValue / USD_VND_RATE) : numericValue;
        } else {
            valueInYen = currency === 'VND' ? Math.round(numericValue / JPY_VND_RATE) : numericValue;
        }
        
        handleTempChange('aspirations', field, String(valueInYen));
    };

    const getDisplayValue = (field: 'desiredSalary' | 'desiredNetSalary' | 'financialAbility', currency: 'JPY' | 'VND' | 'USD') => {
        const rawValue = tempCandidate.aspirations?.[field];
        if (!rawValue || isNaN(parseInt(rawValue, 10))) return '';
        
        const numericValue = parseInt(rawValue, 10);
        let displayValue;
        let locale;

        if (field === 'financialAbility') {
             displayValue = currency === 'VND' ? Math.round(numericValue * USD_VND_RATE) : numericValue;
             locale = currency === 'VND' ? 'vi-VN' : 'en-US';
        } else {
            displayValue = currency === 'VND' ? Math.round(numericValue * JPY_VND_RATE) : numericValue;
            locale = currency === 'VND' ? 'vi-VN' : 'ja-JP';
        }
        
        return displayValue.toLocaleString(locale);
    }
    
    const getConvertedSalaryDisplay = (field: 'desiredSalary' | 'desiredNetSalary' | 'financialAbility', currency: 'JPY' | 'VND' | 'USD') => {
        const rawValue = tempCandidate.aspirations?.[field];
        if (!rawValue) return '';
        let numericValue = parseInt(rawValue, 10);
        if (isNaN(numericValue)) return '';

        let rate, targetCurrency, locale, currencySymbol;

        if (field === 'financialAbility') {
            rate = USD_VND_RATE;
            targetCurrency = currency === 'USD' ? 'VND' : 'USD';
            locale = targetCurrency === 'VND' ? 'vi-VN' : 'en-US';
            currencySymbol = targetCurrency === 'VND' ? 'VNĐ' : '$';
        } else {
            rate = JPY_VND_RATE;
            targetCurrency = currency === 'JPY' ? 'VND' : 'JPY';
            locale = targetCurrency === 'VND' ? 'vi-VN' : 'ja-JP';
            currencySymbol = targetCurrency === 'VND' ? 'VNĐ' : 'yên';
        }
        
        const convertedValue = targetCurrency === 'VND' ? Math.round(numericValue * rate) : Math.round(numericValue / rate);
        
        return `≈ ${convertedValue.toLocaleString(locale)} ${currencySymbol}`;
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại visa mong muốn</Label>
              <Select value={tempCandidate.aspirations?.desiredVisaType || ''} onValueChange={value => handleTempChange('aspirations', 'desiredVisaType', value)}>
                <SelectTrigger><SelectValue placeholder="Chọn loại visa" /></SelectTrigger>
                <SelectContent>
                  {visaTypes.map(vt => <SelectItem key={vt} value={vt}>{vt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label>Chi tiết loại hình visa mong muốn</Label>
              <Select value={tempCandidate.aspirations?.desiredVisaDetail || ''} onValueChange={value => handleTempChange('aspirations', 'desiredVisaDetail', value)} disabled={!tempCandidate.aspirations?.desiredVisaType}>
                <SelectTrigger><SelectValue placeholder="Chọn chi tiết" /></SelectTrigger>
                <SelectContent>
                    {(visaDetailsByVisaType[tempCandidate.aspirations?.desiredVisaType || ''] || []).map(vd => <SelectItem key={vd} value={vd}>{vd}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ngành nghề mong muốn</Label>
              <Select value={tempCandidate.desiredIndustry} onValueChange={value => {
                handleTempChange('desiredIndustry', value);
                handleTempChange('aspirations', 'desiredJobDetail', '');
              }} disabled={!tempCandidate.aspirations?.desiredVisaType}>
                <SelectTrigger><SelectValue placeholder="Chọn ngành nghề" /></SelectTrigger>
                <SelectContent>
                  {availableIndustries.map(ind => <SelectItem key={ind.slug} value={ind.name}>{ind.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
                <Label>Công việc chi tiết mong muốn</Label>
                <Select
                    value={tempCandidate.aspirations?.desiredJobDetail || ''}
                    onValueChange={value => handleTempChange('aspirations', 'desiredJobDetail', value)}
                    disabled={!tempCandidate.desiredIndustry || availableJobDetails.length === 0}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn công việc chi tiết" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableJobDetails.length > 0 ? (
                            availableJobDetails.map(job => (
                                <SelectItem key={job} value={job}>{job}</SelectItem>
                            ))
                        ) : (
                            <SelectItem value="none" disabled>Không có lựa chọn</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Địa điểm mong muốn</Label>
                <Select value={tempCandidate.aspirations?.desiredLocation || ''} onValueChange={value => handleTempChange('aspirations', 'desiredLocation', value)}>
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
            <div />
            
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="desired-salary">Lương cơ bản mong muốn/tháng</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="desired-salary"
                        type="text"
                        value={getDisplayValue('desiredSalary', basicSalaryCurrency)}
                        onChange={(e) => handleSalaryChange(e, 'desiredSalary', basicSalaryCurrency)}
                        placeholder={getPlaceholder('basic', basicSalaryCurrency)}
                        className="flex-grow"
                    />
                    <Select value={basicSalaryCurrency} onValueChange={(value) => setBasicSalaryCurrency(value as 'JPY' | 'VND')}>
                        <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="JPY">Yên</SelectItem><SelectItem value="VND">VNĐ</SelectItem></SelectContent>
                    </Select>
                </div>
                {tempCandidate.aspirations?.desiredSalary && (
                    <p className="text-xs text-muted-foreground">{getConvertedSalaryDisplay('desiredSalary', basicSalaryCurrency)}</p>
                )}
            </div>

            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="desired-net-salary">Thực lĩnh mong muốn/tháng</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="desired-net-salary"
                        type="text"
                        value={getDisplayValue('desiredNetSalary', netSalaryCurrency)}
                        onChange={(e) => handleSalaryChange(e, 'desiredNetSalary', netSalaryCurrency)}
                        placeholder={getPlaceholder('net', netSalaryCurrency)}
                        className="flex-grow"
                    />
                     <Select value={netSalaryCurrency} onValueChange={(value) => setNetSalaryCurrency(value as 'JPY' | 'VND')}>
                        <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="JPY">Yên</SelectItem><SelectItem value="VND">VNĐ</SelectItem></SelectContent>
                    </Select>
                </div>
                 {tempCandidate.aspirations?.desiredNetSalary && (
                    <p className="text-xs text-muted-foreground">{getConvertedSalaryDisplay('desiredNetSalary', netSalaryCurrency)}</p>
                )}
            </div>
            
            {['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Đặc định đầu Việt', 'Kỹ sư, tri thức đầu Việt'].includes(tempCandidate.aspirations?.desiredVisaDetail || '') && (
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="financial-ability">Khả năng tài chính</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="financial-ability"
                            type="text"
                            value={getDisplayValue('financialAbility', financialAbilityCurrency)}
                            onChange={(e) => handleSalaryChange(e, 'financialAbility', financialAbilityCurrency)}
                            placeholder={getPlaceholder('financial', financialAbilityCurrency)}
                            className="flex-grow"
                        />
                         <Select value={financialAbilityCurrency} onValueChange={(value) => setFinancialAbilityCurrency(value as 'USD' | 'VND')}>
                            <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="VND">VNĐ</SelectItem></SelectContent>
                        </Select>
                    </div>
                     {tempCandidate.aspirations?.financialAbility && (
                        <p className="text-xs text-muted-foreground">{getConvertedSalaryDisplay('financialAbility', financialAbilityCurrency)}</p>
                    )}
                </div>
            )}

            {['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Đặc định đầu Việt', 'Kỹ sư, tri thức đầu Việt'].includes(tempCandidate.aspirations?.desiredVisaDetail || '') && (
              <div className="space-y-2">
                <Label>Tìm việc, phỏng vấn, tuyển tại</Label>
                <Select value={tempCandidate.aspirations?.interviewLocation || ''} onValueChange={value => handleTempChange('aspirations', 'interviewLocation', value)}>
                  <SelectTrigger><SelectValue placeholder="Chọn địa điểm" /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Việt Nam</SelectLabel>
                      {locations['Việt Nam'].map(l=><SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Nhật Bản</SelectLabel>
                      {locations['Phỏng vấn tại Nhật Bản'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
             <div className="md:col-span-2 space-y-2">
              <Label>Nguyện vọng đặc biệt</Label>
              <Textarea value={tempCandidate.aspirations?.specialAspirations} onChange={e => handleTempChange('aspirations', 'specialAspirations', e.target.value)} />
            </div>
        </div>
      );
  }


  const MainEditDialogContent = (tempCandidate: EnrichedCandidateProfile, handleTempChange: Function) => {
    return (
        <div className="space-y-4">
            <div className="text-center">
                <Image src="https://placehold.co/100x100.png" alt="AI Assistant" width={80} height={80} data-ai-hint="friendly robot mascot" className="mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center space-y-2 border-2 border-accent-orange" onClick={() => setIsProfileEditDialogOpen(true)}>
                    <h4 className="font-bold text-accent-orange">Cá nhân</h4>
                    <User className="h-12 w-12 text-gray-300" />
                    <p className="text-sm text-muted-foreground">(Thông tin cơ bản)</p>
                </Button>
                 <EditDialog
                    title="Chỉnh sửa Kinh nghiệm & Học vấn"
                    onSave={handleSave}
                    renderContent={(temp, handleChange) => (
                        <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-4">
                            <h3 className="font-bold text-lg">Kinh nghiệm</h3>
                            {renderExperienceEdit(temp, handleChange)}
                            <h3 className="font-bold text-lg mt-4">Học vấn</h3>
                            {renderEducationEdit(temp, handleChange)}
                        </div>
                    )}
                    candidate={profileByLang.vi!}
                >
                    <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-shadow border-2 border-accent-green">
                        <h4 className="font-bold text-accent-green">Sự nghiệp</h4>
                        <Briefcase className="h-12 w-12 text-gray-300 mx-auto my-2" />
                        <p className="text-sm text-muted-foreground">(Kinh nghiệm, học vấn)</p>
                    </Card>
                </EditDialog>
                
                 <EditDialog
                    title="Chỉnh sửa Nguyện vọng"
                    onSave={handleSave}
                    renderContent={renderAspirationsEdit}
                    candidate={profileByLang.vi!}
                >
                    <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-shadow border-2 border-accent-blue">
                        <h4 className="font-bold text-accent-blue">Nguyện vọng</h4>
                         <Target className="h-12 w-12 text-gray-300 mx-auto my-2" />
                        <p className="text-sm text-muted-foreground">(Lương, địa điểm...)</p>
                    </Card>
                </EditDialog>
            </div>
            <p className="text-center mt-4 text-muted-foreground">Để <span className="text-primary font-semibold">Nhà tuyển dụng</span> hiểu rõ về bạn, hãy <span className="text-accent-green font-semibold">Cập nhật thông tin</span>.</p>
        </div>
      )
  };
  
    const MediaCarousel = ({ items, title }: { items: MediaItem[], title: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-xl flex items-center"><Video className="mr-3 text-primary"/> {title}</CardTitle>
          <Button variant="ghost" size="icon"><PlusCircle className="h-5 w-5"/></Button>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full" opts={{align: "start", loop: true}}>
            <CarouselContent className="-ml-2 md:-ml-4">
                {items.slice(0, 6).map((item, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-[30%] md:basis-1/3 lg:basis-1/4">
                       <div className="relative group overflow-hidden rounded-lg aspect-[9/16] cursor-pointer">
                            <Image src={item.thumbnail || item.src} alt={item.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={item['data-ai-hint']} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle className="h-12 w-12 text-white/80 drop-shadow-lg" />
                            </div>
                            <div className="absolute bottom-2 left-2 text-white text-xs font-semibold drop-shadow-md p-1 bg-black/40 rounded">
                                {item.alt}
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </Carousel>
      </CardContent>
    </Card>
  );

  const BodyPhotosCarousel = ({items, onImageChange}: {items: MediaItem[], onImageChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-xl flex items-center"><ImageIcon className="mr-3 text-primary"/> {t.bodyPhotos}</CardTitle>
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon"><PlusCircle className="h-5 w-5"/></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật ảnh hình thể</DialogTitle>
                        <DialogDescription>Tải lên các ảnh theo yêu cầu để hoàn thiện hồ sơ.</DialogDescription>
                    </DialogHeader>
                </DialogContent>
             </Dialog>
        </CardHeader>
        <CardContent>
            <Carousel className="w-full" opts={{align: "start"}}>
                <CarouselContent className="-ml-2 md:-ml-4">
                    {items.map((item, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
                           <div className="space-y-2">
                                <div className="relative group aspect-[3/4] rounded-lg overflow-hidden border">
                                     <Image src={item.src} alt={item.alt} fill className="object-cover" data-ai-hint={item['data-ai-hint']} />
                                     <Label htmlFor={`image-upload-${index}`} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="h-8 w-8 text-white"/>
                                     </Label>
                                     <Input id={`image-upload-${index}`} type="file" className="hidden" accept="image/*" onChange={(e) => onImageChange(e, index)} />
                                </div>
                                <p className="text-center text-sm font-semibold text-muted-foreground">{item.alt}</p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        </CardContent>
    </Card>
  )

  const SendOptionsDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
    
    const handleSendToConsultant = () => {
        toast({
            title: "Đã gửi hồ sơ!",
            description: `Hồ sơ ${languageToSend} của bạn đã được gửi tới các tư vấn viên phù hợp.`,
            className: "bg-green-500 text-white"
        });
        onOpenChange(false);
    };

    const handleGetShareLink = () => {
        const link = `${window.location.origin}/ho-so-cua-toi/public/${candidate?.name.toLowerCase().replace(/\s/g, '-')}`;
        navigator.clipboard.writeText(link);
        toast({
            title: "Đã sao chép đường dẫn!",
            description: "Bạn có thể gửi đường dẫn này cho người khác.",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Gửi hồ sơ</DialogTitle>
                    <DialogDescription>
                        Chọn cách bạn muốn chia sẻ hồ sơ này.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Button onClick={handleSendToConsultant} className="w-full justify-start h-auto p-4" variant="outline">
                        <UserCog className="mr-4 h-6 w-6 text-primary"/>
                        <div>
                            <p className="font-semibold text-base">Gửi cho tư vấn viên</p>
                            <p className="text-xs text-muted-foreground text-left">Hồ sơ của bạn sẽ được gửi đến các tư vấn viên phù hợp trong hệ thống.</p>
                        </div>
                    </Button>
                    <Button onClick={handleGetShareLink} className="w-full justify-start h-auto p-4" variant="outline">
                        <Link2 className="mr-4 h-6 w-6 text-green-500"/>
                        <div>
                            <p className="font-semibold text-base">Lấy đường dẫn chia sẻ</p>
                            <p className="text-xs text-muted-foreground text-left">Tạo một đường dẫn công khai để gửi hồ sơ cho bất kỳ ai.</p>
                        </div>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
  
  const SendProfileDialog = () => {
    const handleSendClick = (lang: string) => {
        setLanguageToSend(lang);
        setIsSendOptionsOpen(true);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="hidden sm:inline-flex"><Send/> Gửi hồ sơ</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Bạn muốn gửi hồ sơ theo ngôn ngữ nào?</DialogTitle>
                    <DialogDescription>
                        Chọn một ngôn ngữ để gửi hồ sơ này cho nhà tuyển dụng.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                            <VnFlagIcon className="w-8 h-6 rounded-sm"/>
                            <span className="font-semibold">Tiếng Việt</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4"/>Xem trước</Button>
                            <Button size="sm" onClick={() => handleSendClick('Tiếng Việt')}><Send className="mr-2 h-4 w-4"/>Gửi</Button>
                        </div>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                            <JpFlagIcon className="w-8 h-6 rounded-sm"/>
                            <span className="font-semibold">Tiếng Nhật</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4"/>Xem trước</Button>
                            <Button size="sm" onClick={() => handleSendClick('Tiếng Nhật')}><Send className="mr-2 h-4 w-4"/>Gửi</Button>
                        </div>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                            <EnFlagIcon className="w-8 h-6 rounded-sm"/>
                            <span className="font-semibold">Tiếng Anh</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4"/>Xem trước</Button>
                            <Button size="sm" onClick={() => handleSendClick('Tiếng Anh')}><Send className="mr-2 h-4 w-4"/>Gửi</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
  };
  
    const DownloadProfileDialog = ({children}: {children: React.ReactNode}) => (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Tải hồ sơ xuống</DialogTitle>
                    <DialogDescription>
                        Chọn định dạng bạn muốn tải xuống.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    <Card className="hover:bg-secondary cursor-pointer">
                        <CardContent className="p-4 flex items-center gap-4">
                            <FileCode className="h-10 w-10 text-blue-500 shrink-0"/>
                            <div>
                                <p className="font-semibold">Dạng HTML</p>
                                <p className="text-xs text-muted-foreground">Tải xuống như giao diện Web.</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="hover:bg-secondary cursor-pointer">
                         <CardContent className="p-4 flex items-center gap-4">
                            <FileText className="h-10 w-10 text-red-500 shrink-0"/>
                            <div>
                                <p className="font-semibold">Dạng PDF</p>
                                <p className="text-xs text-muted-foreground">Lý tưởng để gửi qua email hoặc in ấn.</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="hover:bg-secondary cursor-pointer">
                         <CardContent className="p-4 flex items-center gap-4">
                            <FileType className="h-10 w-10 text-sky-600 shrink-0"/>
                            <div>
                                <p className="font-semibold">Dạng Docx</p>
                                <p className="text-xs text-muted-foreground">Dễ dàng chỉnh sửa bằng Microsoft Word.</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="hover:bg-secondary cursor-pointer">
                         <CardContent className="p-4 flex items-center gap-4">
                            <Sheet className="h-10 w-10 text-green-600 shrink-0"/>
                            <div>
                                <p className="font-semibold">Dạng Excel</p>
                                <p className="text-xs text-muted-foreground">Phù hợp để quản lý và phân tích dữ liệu.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )

  const editButtonText = isNewProfile ? 'Tạo hồ sơ' : 'Sửa hồ sơ';

  const formatPhoneNumber = (phone: string | undefined): string => {
    if (!phone) return 'Chưa cập nhật';
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.length === 9) { // Assumes VN mobile without leading 0
        return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
    }
    if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) { // VN Mobile
        return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
    }
    if (cleanPhone.length === 11 && (cleanPhone.startsWith('0') || cleanPhone.startsWith('81'))) { // JP Mobile
         return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 7)} ${cleanPhone.slice(7)}`;
    }
    return phone; // Fallback
  }

  const PersonalInfoCard = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl flex items-center"><UserCog className="mr-3 text-primary"/> {t.personalInfo}</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsProfileEditDialogOpen(true)}>
            <Edit className="h-4 w-4"/>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p><strong>{t.dateOfBirth}:</strong> {candidate.personalInfo.dateOfBirth ? format(new Date(candidate.personalInfo.dateOfBirth), 'dd/MM/yyyy') : 'Chưa cập nhật'}</p>
        <p><strong>{t.gender}:</strong> {candidate.personalInfo.gender}</p>
        <p><strong>{t.height}:</strong> {candidate.personalInfo.height} cm</p>
        <p><strong>{t.weight}:</strong> {candidate.personalInfo.weight} kg</p>
        <p><strong>{t.tattoo}:</strong> {candidate.personalInfo.tattooStatus}</p>
        <p><strong>{t.hepatitisB}:</strong> {candidate.personalInfo.hepatitisBStatus}</p>
        <p><strong>{t.japaneseProficiency}:</strong> {candidate.personalInfo.japaneseProficiency}</p>
        <p><strong>{t.englishProficiency}:</strong> {candidate.personalInfo.englishProficiency}</p>
      </CardContent>
      <CardContent>
        <div className="space-y-2">
            {candidate.personalInfo.phone && <Button asChild variant="outline" className="w-full justify-start"><Link href={`tel:${candidate.personalInfo.phone}`}><Phone className="mr-2"/>{formatPhoneNumber(candidate.personalInfo.phone)}</Link></Button>}
            {candidate.personalInfo.messenger && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://m.me/${candidate.personalInfo.messenger}`} target="_blank"><MessengerIcon className="mr-2 h-4 w-4"/>{candidate.personalInfo.messenger}</Link></Button>}
            {candidate.personalInfo.zalo && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://zalo.me/${candidate.personalInfo.zalo}`} target="_blank"><ZaloIcon className="mr-2 h-4 w-4"/>{formatPhoneNumber(candidate.personalInfo.zalo)}</Link></Button>}
            {candidate.personalInfo.line && <Button asChild variant="outline" className="w-full justify-start"><Link href={candidate.personalInfo.line} target="_blank"><LineIcon className="mr-2 h-4 w-4"/>{candidate.personalInfo.line}</Link></Button>}
        </div>
      </CardContent>
    </Card>
  );


  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl overflow-hidden">
             <CardHeader className="p-0">
               <div className="bg-gradient-to-tr from-primary to-accent h-32" />
                 <div className="p-6 flex flex-col md:flex-row items-center md:items-end -mt-16">
                 <div className="relative group">
                     <Avatar className="h-32 w-32 border-4 border-background bg-background shadow-lg">
                      <AvatarImage src={candidate.avatarUrl || undefined} alt={candidate.name} data-ai-hint="professional headshot" className="object-cover" />
                      <AvatarFallback>{candidate.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor="avatar-upload" className="absolute bottom-1 right-1 cursor-pointer bg-black/50 text-white p-2 rounded-full group-hover:bg-black/70 transition-colors">
                        <Camera className="h-5 w-5" />
                        <span className="sr-only">Change avatar</span>
                    </Label>
                    <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleMediaChange('avatar', e)}/>
                 </div>
                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <h1 className="text-3xl font-headline font-bold">{candidate.name}</h1>
                  <p className="text-muted-foreground">{candidate.headline}</p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                    <MapPin className="h-4 w-4" /> {candidate.location}
                  </p>
                </div>
                 <div className="md:ml-auto mt-4 md:mt-0 flex items-center gap-2">
                    <DownloadProfileDialog>
                        <Button variant="outline" size="icon" className="sm:hidden"><FileDown/></Button>
                    </DownloadProfileDialog>
                    <DownloadProfileDialog>
                         <Button variant="outline" className="hidden sm:inline-flex"><FileDown/> Tải hồ sơ</Button>
                    </DownloadProfileDialog>

                     
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="sm:hidden"><Send/></Button>
                        </DialogTrigger>
                        <DialogContent><SendProfileDialog /></DialogContent>
                     </Dialog>
                     <SendProfileDialog />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" disabled={isTranslating}>
                           {isTranslating ? <Loader2 className="h-5 w-5 animate-spin" /> :
                            currentLang === 'vi' ? <VnFlagIcon className="w-6 h-6 rounded-full object-cover"/> :
                            currentLang === 'ja' ? <JpFlagIcon className="w-6 h-6 rounded-full object-cover"/> :
                            <EnFlagIcon className="w-6 h-6 rounded-full object-cover"/>
                           }
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleLanguageChange('vi')}><VnFlagIcon className="w-5 h-5 mr-2"/>Tiếng Việt</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleLanguageChange('ja')}><JpFlagIcon className="w-5 h-5 mr-2"/>日本語</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleLanguageChange('en')}><EnFlagIcon className="w-5 h-5 mr-2"/>English</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                     <EditDialog
                        title="Hoàn thiện hồ sơ"
                        onSave={handleSave}
                        renderContent={MainEditDialogContent}
                        description="Chọn một mục dưới đây để cập nhật hoặc hoàn thiện thông tin hồ sơ của bạn."
                        candidate={profileByLang.vi!} 
                     >
                        <Button variant="outline" size="icon" className="sm:hidden"><Edit /></Button>
                     </EditDialog>
                     <EditDialog
                        title="Hoàn thiện hồ sơ"
                        onSave={handleSave}
                        renderContent={MainEditDialogContent}
                        description="Chọn một mục dưới đây để cập nhật hoặc hoàn thiện thông tin hồ sơ của bạn."
                        candidate={profileByLang.vi!}
                     >
                         <Button variant="outline" className="hidden sm:inline-flex"><Edit /> {editButtonText}</Button>
                     </EditDialog>
                 </div>
              </div>
            </CardHeader>
            
            {/* Mobile Personal Info Card */}
            <div className="p-6 pt-0 lg:hidden">
              <PersonalInfoCard />
            </div>

            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><User className="mr-3 text-primary"/>{t.about}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Giới thiệu bản thân"
                        onSave={handleSave}
                        renderContent={renderAboutEdit}
                        candidate={profileByLang.vi!}
                        description="Viết một đoạn giới thiệu ngắn về bản thân, kỹ năng và mục tiêu nghề nghiệp của bạn."
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </EditDialog>
                  </CardHeader>
                  <CardContent>
                    {candidate.about ? (
                      <p className="text-muted-foreground whitespace-pre-line">{candidate.about}</p>
                    ) : (
                      <div className="text-muted-foreground">
                        <span>{t.noInfo}</span>
                        <EditDialog title="Chỉnh sửa Giới thiệu bản thân" onSave={handleSave} renderContent={renderAboutEdit} candidate={profileByLang.vi!}>
                            <button className="text-primary hover:underline">{t.clickToUpdate}</button>
                        </EditDialog>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {candidate.videos.length > 0 && <MediaCarousel items={candidate.videos} title={t.videos} />}
                
                {candidate.images.length > 0 && <BodyPhotosCarousel items={candidate.images} onImageChange={(e, index) => handleMediaChange('image', e, index)} />}


                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><Briefcase className="mr-3 text-primary"/>{t.workExperience}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Kinh nghiệm làm việc"
                        onSave={handleSave}
                        renderContent={renderExperienceEdit}
                        candidate={profileByLang.vi!}
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                     </EditDialog>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {candidate.experience.length > 0 ? candidate.experience.map((exp, index) => (
                        <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                            <h4 className="font-bold">{exp.role}</h4>
                            <p className="font-semibold text-sm text-primary">{exp.company}</p>
                            <p className="text-xs text-muted-foreground mb-1">{exp.period}</p>
                            <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </div>
                    )) : (
                        <div className="text-muted-foreground">
                           <span>{t.noInfo}</span>
                            <EditDialog title="Chỉnh sửa Kinh nghiệm làm việc" onSave={handleSave} renderContent={renderExperienceEdit} candidate={profileByLang.vi!}>
                               <button className="text-primary hover:underline">{t.clickToUpdate}</button>
                            </EditDialog>
                        </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><GraduationCap className="mr-3 text-primary"/>{t.education}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Học vấn"
                        onSave={handleSave}
                        renderContent={renderEducationEdit}
                        candidate={profileByLang.vi!}
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </EditDialog>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {candidate.education.length > 0 ? candidate.education.map((edu, index) => (
                        <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                            <p className="font-semibold flex items-center gap-2"><School className="h-4 w-4"/> {edu.school}</p>
                            <p className="text-muted-foreground ml-6">Chuyên ngành: {edu.degree}</p>
                            <p className="text-muted-foreground ml-6">Tốt nghiệp năm: {edu.gradYear}</p>
                        </div>
                     )) : (
                        <div className="text-muted-foreground">
                            <span>{t.noInfo}</span>
                            <EditDialog title="Chỉnh sửa Học vấn" onSave={handleSave} renderContent={renderEducationEdit} candidate={profileByLang.vi!}>
                                <button className="text-primary hover:underline">{t.clickToUpdate}</button>
                            </EditDialog>
                        </div>
                     )}
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><FilePen className="mr-3 text-primary"/>{t.notes}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Ghi chú"
                        onSave={handleSave}
                        renderContent={renderNotesEdit}
                        candidate={profileByLang.vi!}
                        description="Thêm bất kỳ ghi chú hoặc thông tin bổ sung nào về nguyện vọng, hoàn cảnh của bạn."
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </EditDialog>
                  </CardHeader>
                  <CardContent>
                    {candidate.notes ? (
                      <p className="text-muted-foreground whitespace-pre-line">{candidate.notes}</p>
                    ) : (
                      <div className="text-muted-foreground">
                        <span>{t.noInfo}</span>
                        <EditDialog title="Chỉnh sửa Ghi chú" onSave={handleSave} renderContent={renderNotesEdit} candidate={profileByLang.vi!}>
                            <button className="text-primary hover:underline">{t.clickToUpdate}</button>
                        </EditDialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-6">
                {/* Desktop Personal Info Card */}
                 <div className="hidden lg:block">
                  <PersonalInfoCard />
                </div>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><Target className="mr-3 text-primary"/> {t.aspirations}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Nguyện vọng"
                        onSave={handleSave}
                        renderContent={renderAspirationsEdit}
                        candidate={profileByLang.vi!}
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </EditDialog>
                  </CardHeader>
                   <CardContent className="space-y-3 text-sm">
                        <p><strong>{t.desiredVisaType}:</strong> {candidate.aspirations?.desiredVisaType}</p>
                        <p><strong>{t.desiredVisaDetail}:</strong> {candidate.aspirations?.desiredVisaDetail}</p>
                        <p><strong>{t.desiredIndustry}:</strong> {candidate.desiredIndustry}</p>
                        <p><strong>{t.desiredJobDetail}:</strong> {candidate.aspirations?.desiredJobDetail}</p>
                        <p><strong>{t.desiredLocation}:</strong> {candidate.aspirations?.desiredLocation}</p>
                        <p><strong>{t.desiredSalary}:</strong> {formatYen(candidate.aspirations?.desiredSalary)}</p>
                        <p><strong>{t.desiredNetSalary}:</strong> {formatYen(candidate.aspirations?.desiredNetSalary)}</p>
                        {['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Đặc định đầu Việt', 'Kỹ sư, tri thức đầu Việt'].includes(candidate.aspirations?.desiredVisaDetail || '') && (
                            <p><strong>{t.financialAbility}:</strong> {candidate.aspirations?.financialAbility}</p>
                        )}
                        <p><strong>{t.interviewLocation}:</strong> {candidate.aspirations?.interviewLocation}</p>
                        <p><strong>{t.specialAspirations}:</strong> {candidate.aspirations?.specialAspirations}</p>
                  </CardContent>
                </Card>

                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><Star className="mr-3 text-primary"/> {t.skillsAndInterests}</CardTitle>
                    <EditDialog
                        title="Chỉnh sửa Kỹ năng & Lĩnh vực"
                        description="Chọn các mục có sẵn hoặc thêm mới để làm nổi bật hồ sơ của bạn."
                        onSave={handleSave}
                        renderContent={renderSkillsInterestsEdit}
                        candidate={profileByLang.vi!}
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </EditDialog>
                  </CardHeader>
                  <CardContent>
                     <h4 className="font-semibold mb-2 text-sm">{t.skills}</h4>
                     <div className="flex flex-wrap gap-2 mb-4">
                        {candidate.skills.length > 0 ? candidate.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>) : 
                        <div className="text-muted-foreground text-sm">
                            <span>{t.noInfo}</span>
                            <EditDialog title="Chỉnh sửa Kỹ năng & Lĩnh vực" description="Chọn các mục có sẵn hoặc thêm mới để làm nổi bật hồ sơ của bạn." onSave={handleSave} renderContent={renderSkillsInterestsEdit} candidate={profileByLang.vi!}>
                               <button className="text-primary hover:underline">{t.clickToUpdate}</button>
                            </EditDialog>
                        </div>}
                     </div>
                     <h4 className="font-semibold mb-2 text-sm">{t.interests}</h4>
                     <div className="flex flex-wrap gap-2">
                        {candidate.interests.length > 0 ? candidate.interests.map(interest => <Badge key={interest} className="bg-accent-blue text-white">{interest}</Badge>) : 
                        <div className="text-muted-foreground text-sm">
                            <span>{t.noInfo}</span>
                             <EditDialog title="Chỉnh sửa Kỹ năng & Lĩnh vực" description="Chọn các mục có sẵn hoặc thêm mới để làm nổi bật hồ sơ của bạn." onSave={handleSave} renderContent={renderSkillsInterestsEdit} candidate={profileByLang.vi!}>
                                <button className="text-primary hover:underline">{t.clickToUpdate}</button>
                            </EditDialog>
                        </div>}
                     </div>
                  </CardContent>
                </Card>
                
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><FileArchive className="mr-3 text-primary"/> {t.documentsSection}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Hồ sơ/Giấy tờ"
                        onSave={handleSave}
                        renderContent={renderDocumentsEdit}
                        candidate={profileByLang.vi!}
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </EditDialog>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2 text-sm">{t.vietnamDocs}</h4>
                        {candidate.documents?.vietnam?.length > 0 ? (
                             <div className="flex flex-wrap gap-2">{candidate.documents.vietnam.map(doc => <Badge key={doc} variant="secondary">{doc}</Badge>)}</div>
                        ) : (<p className="text-sm text-muted-foreground">{t.noInfo}</p>)}
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2 text-sm">{t.japanDocs}</h4>
                        {candidate.documents?.japan?.length > 0 ? (
                             <div className="flex flex-wrap gap-2">{candidate.documents.japan.map(doc => <Badge key={doc} variant="secondary">{doc}</Badge>)}</div>
                        ) : (<p className="text-sm text-muted-foreground">{t.noInfo}</p>)}
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2 text-sm">{t.otherDocs}</h4>
                        {candidate.documents?.other?.length > 0 ? (
                             <div className="flex flex-wrap gap-2">{candidate.documents.other.map(doc => <Badge key={doc} variant="secondary">{doc}</Badge>)}</div>
                        ) : (<p className="text-sm text-muted-foreground">{t.noInfo}</p>)}
                    </div>
                  </CardContent>
                </Card>

                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><Award className="mr-3 text-primary"/> {t.certifications}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Chứng chỉ & Giải thưởng"
                        onSave={handleSave}
                        renderContent={renderCertificationsEdit}
                        candidate={profileByLang.vi!}
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </EditDialog>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     {candidate.certifications.length > 0 ? candidate.certifications.map((cert, index) => (
                         <p key={index} className="text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-muted-foreground"/>{cert}</p>
                     )) : 
                     <div className="text-muted-foreground text-sm">
                        <span>{t.noInfo}</span>
                        <EditDialog title="Chỉnh sửa Chứng chỉ & Giải thưởng" onSave={handleSave} renderContent={renderCertificationsEdit} candidate={profileByLang.vi!}>
                            <button className="text-primary hover:underline">{t.clickToUpdate}</button>
                        </EditDialog>
                    </div>}
                  </CardContent>
                </Card>

                 <Button className="w-full bg-accent-green hover:bg-accent-green/90 text-white"><FileDown/> Tải CV (.pdf)</Button>
                 <div className="text-center pt-4">
                    <Button variant="link" className="text-muted-foreground text-sm" onClick={() => { /* Handle logout */ }}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        Đăng xuất
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <SendOptionsDialog open={isSendOptionsOpen} onOpenChange={setIsSendOptionsOpen} />
      <EditProfileDialog 
        isOpen={isProfileEditDialogOpen} 
        onOpenChange={setIsProfileEditDialogOpen} 
        onSaveSuccess={() => {
            toast({
                title: 'Cập nhật thành công!',
                description: 'Thông tin của bạn đã được lưu.',
                className: 'bg-green-500 text-white'
            });
            // Force a re-render to ensure UI consistency after saving
            const updatedProfile = localStorage.getItem('generatedCandidateProfile');
            if (updatedProfile) {
                setProfileByLang(prev => ({ ...prev, vi: JSON.parse(updatedProfile) }));
            }
        }}
    />
    </div>
  );
}

