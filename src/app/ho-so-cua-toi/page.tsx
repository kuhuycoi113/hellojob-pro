
'use client';

import { useState, useEffect, use } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, Cake, Dna, Edit, GraduationCap, MapPin, Phone, School, User, Award, Languages, Star, FileDown, Video, Image as ImageIcon, PlusCircle, Trash2, RefreshCw, X, Camera, MessageSquare, Facebook, Contact, UserCog, Trophy, PlayCircle, LogOut, Wallet, Target, Milestone, FilePen, Globe, ChevronDown, Loader2, Send, FileArchive, Eye, Link2, Share2, FileType, FileJson, FileSpreadsheet, FileCode, FileText, Sheet, ArrowRightLeft, CalendarIcon, Ruler, QrCode, Info, UploadCloud } from 'lucide-react';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { JpFlagIcon, EnFlagIcon, VnFlagIcon, ZaloIcon, MessengerIcon, LineIcon, PdfIcon } from '@/components/custom-icons';
import { industriesByJobType } from '@/lib/industry-data';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { locations } from '@/lib/location-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EditProfileDialog } from '@/components/candidate-edit-dialog';
import { validateProfileForApplication } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';


type MediaItem = {
  src: string;
  thumbnail?: string; 
  alt: string;
  "data-ai-hint": string;
};

type DocumentName = {
  vi: string;
  ja?: string;
  en?: string;
};

type DocumentItem = {
  name: DocumentName;
  url?: string; // Data URL of the uploaded file
  isDefault?: boolean; // Flag to identify default documents
  fileType?: 'pdf' | 'image'; // Track the file type
};

type EnrichedCandidateProfile = Omit<CandidateProfile, 'documents'> & { 
  avatarUrl?: string;
  videos: MediaItem[];
  images: MediaItem[];
  documents?: {
    vietnam?: DocumentItem[];
    japan?: DocumentItem[];
    other?: DocumentItem[];
  }
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
        japanDocs: "Giầy tờ Nhật Bản",
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
        noInfo: "Chưa cập nhật",
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
      messenger: 'gu.en.beto.2025',
      zalo: '0901234567',
      line: 'zFsBmqsCMn',
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
        specialAspirations: ['Mong muốn có nhiều cơ hội làm thêm giờ', 'Được hỗ trợ đào tạo chuyên sâu'],
    },
    notes: 'Đã có kinh nghiệm phỏng vấn với công ty Nhật 2 lần, mong muốn tìm đơn hàng bay nhanh trong vòng 3 tháng tới. Có thể đóng phí ngay.',
    interests: ['Cơ khí', 'Tự động hóa', 'Sản xuất'],
    skills: ['Vận hành máy CNC', 'AutoCAD', 'SolidWorks', 'Làm việc nhóm', 'Giải quyết vấn đề'],
    certifications: ['Chứng chỉ JLPT N3', 'Chứng chỉ An toàn lao động'],
    documents: {
        vietnam: ['Xác nhận cư trú', 'Xác nhận dân sự', 'Căn cước mặt trước', 'Căn cước mặt sau', 'Hộ chiếu mặt trước', 'Hộ chiếu mặt sau', 'Giấy khám sức khỏe', 'Bằng học vấn', 'Xác nhận tình trạng hôn nhân', 'Giấy tờ khác'].map(name => ({name: {vi: name}, isDefault: true})),
        japan: ['Thẻ ngoại kiều mặt trước', 'Thẻ ngoại kiều mặt sau', 'Ảnh CV gốc mặt trước', 'Ảnh CV gốc mặt sau', 'Giấy kết thúc 3 năm mặt trước', 'Giấy kết thúc 3 năm mặt sau', 'Chứng chỉ tokutei', 'Chứng chỉ tiếng Nhật', 'Giấy Shiteisho', 'Giấy đánh giá Hyokachoso', 'Giấy tờ khác'].map(name => ({name: {vi: name}, isDefault: true})),
        other: ['Thẻ ID', 'Bằng ngoại ngữ', 'Sổ tiết kiệm', 'Xác nhận công việc người bảo lãnh 1', 'Xác nhận công việc người bảo lãnh 2', 'Thẻ ID người bảo lãnh 1', 'Thẻ ID người bảo lãnh 2', 'Giấy tờ khác'].map(name => ({name: {vi: name}, isDefault: true})),
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

const allIndustries = Object.values(industriesByJobType).flat().filter((v,i,a)=>a.findIndex(t=>(t.name.vi === v.name.vi))===i);

const formatYen = (value?: string) => {
    if (!value) return 'N/A';
    
    const numericValue = typeof value === 'string' 
        ? parseInt(value.replace(/[^0-9]/g, ''), 10)
        : value;
        
    if (isNaN(numericValue)) return 'N/A';
    return `${numericValue.toLocaleString('ja-JP')} yên`;
};

const visaDetailsByVisaType: { [key: string]: string[] } = {
    'Thực tập sinh kỹ năng': ['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Thực tập sinh 3 Go'],
    'Kỹ năng đặc định': ['Đặc định đầu Việt', 'Đặc định đầu Nhật', 'Đặc định đi mới'],
    'Kỹ sư, tri thức': ['Kỹ sư, tri thức đầu Việt', 'Kỹ sư, tri thức đầu Nhật']
};
const visaTypes = Object.keys(visaDetailsByVisaType);


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
);

const EditDialog = ({
  children,
  title,
  onSave,
  renderContent,
  description,
  candidate,
  dialogId,
  footerContent,
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
  footerContent?: React.ReactNode;
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
        if (!prev) return null;
        const newCandidate = { ...prev };

        if (section === 'personalInfo' || section === 'aspirations') {
            const [field, value] = args;
             // @ts-ignore
            newCandidate[section] = { ...newCandidate[section], [field]: value };
        } else if (section === 'documents') {
            const [docType, index, value] = args;
            // @ts-ignore
            newCandidate.documents[docType][index] = value;
        } else if (['experience', 'education', 'certifications'].includes(section)) {
            const [index, field, value] = args;
            if (field) {
                // @ts-ignore
                newCandidate[section][index][field] = value;
            } else {
                // For simple arrays like certifications
                // @ts-ignore
                newCandidate[section][index] = value;
            }
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
            {footerContent && <div>{footerContent}</div>}
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


export default function CandidateProfilePage() {
  const { toast } = useToast();
  const { role, profileName, profileHeadline, avatarUrl } = useAuth();
  const [profileByLang, setProfileByLang] = useState<ProfilesByLang>({ vi: null, ja: null, en: null });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('vi');
  const [isSendOptionsOpen, setIsSendOptionsOpen] = useState(false);
  const [languageToSend, setLanguageToSend] = useState('');
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState('japan');
  const isMobile = useIsMobile();
  const [isAddDocDialogOpen, setIsAddDocDialogOpen] = useState(false);
  const [currentDocTypeToAdd, setCurrentDocTypeToAdd] = useState<'vietnam' | 'japan' | 'other' | null>(null);
  const [newDocName, setNewDocName] = useState<DocumentName>({ vi: '', ja: '', en: '' });
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [newDocFilePreview, setNewDocFilePreview] = useState<string | null>(null);
  const [expandedGrids, setExpandedGrids] = useState({ vietnam: false, japan: false, other: false });
  const [lastDocumentsState, setLastDocumentsState] = useState<EnrichedCandidateProfile['documents'] | null>(null);


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
            if (key === 'personalInfo' || key === 'aspirations') {
                if (newEmptyProfile[key]) {
                    Object.keys(newEmptyProfile[key]).forEach(subKey => {
                         if (subKey === 'birthYear') {
                             newEmptyProfile[key][subKey] = new Date().getFullYear() - 18;
                         } else {
                            newEmptyProfile[key][subKey] = '';
                         }
                    });
                }
            }
             if (key === 'documents') {
                if (newEmptyProfile[key]) {
                    Object.keys(newEmptyProfile[key]).forEach(docType => {
                        newEmptyProfile[key][docType] = newEmptyProfile[key][docType].map((doc: any) => typeof doc === 'string' ? {name: {vi: doc}, isDefault: true} : {...doc, isDefault: true})
                    });
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

        // Normalize documents structure
        if (parsedProfile.documents) {
             Object.keys(parsedProfile.documents).forEach(docType => {
                if (Array.isArray(parsedProfile.documents[docType])) {
                    parsedProfile.documents[docType] = parsedProfile.documents[docType].map((doc: any) => {
                        if (typeof doc === 'string') return { name: { vi: doc } };
                        if (typeof doc.name === 'string') return { ...doc, name: { vi: doc.name } };
                        return doc;
                    });
                }
            });
        }

        profileToLoad = {
          ...emptyCandidate,
          ...parsedProfile,
          personalInfo: { ...emptyCandidate.personalInfo, ...parsedProfile.personalInfo },
          aspirations: { ...emptyCandidate.aspirations, ...parsedProfile.aspirations },
          documents: parsedProfile.documents ? parsedProfile.documents : emptyCandidate.documents,
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
    if (profileByLang.vi && (role === 'candidate' || role === 'candidate-full-profile')) {
      localStorage.setItem('generatedCandidateProfile', JSON.stringify(profileByLang.vi));
      // Manually trigger a storage event so the header updates
      window.dispatchEvent(new Event('storage'));
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
        const profileToTranslate = { ...profileByLang.vi };
        if (typeof profileToTranslate.personalInfo.birthYear === 'string' && profileToTranslate.personalInfo.birthYear === '') {
             profileToTranslate.personalInfo.birthYear = new Date().getFullYear() - 18;
        }

        const input: TranslateProfileInput = {
            profile: profileToTranslate as CandidateProfile,
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
                     if (key === 'skills' || key === 'interests' || key === 'certifications' || key === 'specialAspirations') {
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
  const notUpdatedText = <span className="text-muted-foreground italic">{t.noInfo}</span>;


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
  
  const handleMediaChange = (type: 'avatar' | 'image' | 'document', e: React.ChangeEvent<HTMLInputElement>, index?: number, docType?: 'vietnam' | 'japan' | 'other') => {
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
        } else if (type === 'document' && docType && index !== undefined) {
            if (!newProfile.documents) newProfile.documents = {};
            if (!newProfile.documents[docType]) newProfile.documents[docType] = [];
            newProfile.documents[docType][index].url = newUrl;
            newProfile.documents[docType][index].fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
        }

        setProfileByLang({ vi: newProfile, ja: null, en: null });
        setCurrentLang('vi');
        
        localStorage.setItem('generatedCandidateProfile', JSON.stringify(newProfile));
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (section: 'experience' | 'education' | 'certifications' | 'documents', docType: 'vietnam' | 'japan' | 'other', newDoc?: DocumentItem) => {
      if (!profileByLang.vi) return;
      const newProfile = JSON.parse(JSON.stringify(profileByLang.vi));
      if (section === 'experience') {
          newProfile.experience.push({ company: '', role: '', period: '', description: '' });
      } else if (section === 'education') {
          newProfile.education.push({ school: '', degree: '', gradYear: new Date().getFullYear() });
      } else if (section === 'certifications') {
          newProfile.certifications.push('');
      } else if (section === 'documents' && docType && newDoc) {
          if (!newProfile.documents) {
              newProfile.documents = { vietnam: [], japan: [], other: [] };
          }
          if (!newProfile.documents[docType]) {
              newProfile.documents[docType] = [];
          }
          newProfile.documents[docType].push(newDoc);
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

  const handleOpenAddDocDialog = (docType: 'vietnam' | 'japan' | 'other') => {
    setCurrentDocTypeToAdd(docType);
    setNewDocName({ vi: '', ja: '', en: '' });
    setNewDocFile(null);
    setNewDocFilePreview(null);
    setIsAddDocDialogOpen(true);
  };

  const handleAddNewDocument = () => {
      if (newDocName.vi.trim() && newDocFilePreview && currentDocTypeToAdd) {
          handleAddItem('documents', currentDocTypeToAdd, { 
              name: newDocName, 
              url: newDocFilePreview, 
              isDefault: false,
              fileType: newDocFile?.type.startsWith('image/') ? 'image' : 'pdf'
          });
          setIsAddDocDialogOpen(false);
          setExpandedGrids(prev => ({...prev, [currentDocTypeToAdd]: true }));
      } else {
          toast({
              variant: "destructive",
              title: "Thông tin chưa đủ",
              description: "Vui lòng nhập tên Tiếng Việt và tải lên tệp cho giấy tờ.",
          });
      }
  };

   const handleNewDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewDocFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewDocFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRestoreDocuments = () => {
        if (!profileByLang.vi) return;
        const currentDocs = profileByLang.vi.documents;
        setLastDocumentsState(JSON.parse(JSON.stringify(currentDocs))); // Save current state for undo

        const defaultDocs = emptyCandidate.documents || { vietnam: [], japan: [], other: [] };
        const newDocs: EnrichedCandidateProfile['documents'] = { vietnam: [], japan: [], other: [] };

        for (const type of ['vietnam', 'japan', 'other'] as const) {
            const restoredDocsForType: DocumentItem[] = [];
            const defaultDocNames = new Set(defaultDocs[type]?.map(d => d.name.vi));

            // 1. Preserve default docs with uploaded images
            defaultDocs[type]?.forEach(defaultDoc => {
                const currentDoc = currentDocs?.[type]?.find(d => d.name.vi === defaultDoc.name.vi);
                if (currentDoc && currentDoc.url) {
                    restoredDocsForType.push(currentDoc);
                } else {
                    restoredDocsForType.push(defaultDoc);
                }
            });

            // 2. Preserve user-added docs with uploaded images
            currentDocs?.[type]?.forEach(currentDoc => {
                if (!defaultDocNames.has(currentDoc.name.vi) && currentDoc.url) {
                     restoredDocsForType.push(currentDoc);
                }
            });
            
            newDocs[type] = restoredDocsForType;
        }

        const newProfile = { ...profileByLang.vi, documents: newDocs };
        setProfileByLang({ vi: newProfile, ja: null, en: null });
        setCurrentLang('vi');

        toast({
            title: "Khôi phục thành công!",
            description: "Danh sách giấy tờ đã được khôi phục.",
            action: (
              <Button variant="ghost" onClick={handleUndoRestore}>Hoàn tác</Button>
            ),
        });
    };

    const handleUndoRestore = () => {
        if (lastDocumentsState && profileByLang.vi) {
            const newProfile = { ...profileByLang.vi, documents: lastDocumentsState };
            setProfileByLang({ vi: newProfile, ja: null, en: null });
            setCurrentLang('vi');
            setLastDocumentsState(null); // Clear undo state
            toast({
                title: "Đã hoàn tác!",
                description: "Danh sách giấy tờ đã được quay lại như cũ.",
            });
        }
    };

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

  const PersonalInfoCard = () => {
    const { phone, zalo, messenger, line } = candidate.personalInfo;
    const hasContactInfo = !!(phone || zalo || messenger || line);
    const missingFields = validateProfileForApplication(candidate);
    const hasMissingFields = missingFields.length > 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center"><UserCog className="mr-3 text-primary"/> {t.personalInfo}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsProfileEditDialogOpen(true)}>
                    <Edit className="h-4 w-4"/>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p><strong>{t.dateOfBirth}:</strong> {candidate.personalInfo.dateOfBirth ? format(new Date(candidate.personalInfo.dateOfBirth), 'dd/MM/yyyy') : notUpdatedText}</p>
                <p><strong>{t.gender}:</strong> {candidate.personalInfo.gender || notUpdatedText}</p>
                <p><strong>{t.height}:</strong> {candidate.personalInfo.height && parseInt(candidate.personalInfo.height) > 0 ? `${candidate.personalInfo.height} cm` : notUpdatedText}</p>
                <p><strong>{t.weight}:</strong> {candidate.personalInfo.weight && parseInt(candidate.personalInfo.weight) > 0 ? `${candidate.personalInfo.weight} kg` : notUpdatedText}</p>
                <p><strong>{t.tattoo}:</strong> {candidate.personalInfo.tattooStatus || notUpdatedText}</p>
                <p><strong>{t.hepatitisB}:</strong> {candidate.personalInfo.hepatitisBStatus || notUpdatedText}</p>
                <p><strong>{t.japaneseProficiency}:</strong> {candidate.personalInfo.japaneseProficiency || notUpdatedText}</p>
                <p><strong>{t.englishProficiency}:</strong> {candidate.personalInfo.englishProficiency || notUpdatedText}</p>
            </CardContent>
            <CardContent>
                {hasContactInfo ? (
                    <div className="space-y-2">
                        {phone && <Button asChild variant="outline" className="w-full justify-start"><Link href={`tel:${phone}`}><Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="mr-2 h-4 w-4" />{formatPhoneNumber(phone)}</Link></Button>}
                        {messenger && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://m.me/${messenger}`} target="_blank" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://facebook.com/${messenger}`}</span></Link></Button>}
                        {zalo && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://zalo.me/${zalo}`} target="_blank"><ZaloIcon className="mr-2 h-4 w-4"/>{formatPhoneNumber(zalo)}</Link></Button>}
                        {line && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://line.me/ti/p/~${line}`} target="_blank" className="flex items-center gap-2"><LineIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://line.me/ti/p/~${line}`}</span></Link></Button>}
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="flex justify-center gap-4 mb-3 text-muted-foreground">
                            <Image src="/img/phone.svg" alt="Phone" width={24} height={24} />
                            <ZaloIcon className="h-6 w-6" />
                            <MessengerIcon className="h-6 w-6" />
                            <LineIcon className="h-6 w-6" />
                        </div>
                        <div className="text-sm text-muted-foreground mt-4 text-center">
                          Cung cấp ít nhất một phương thức liên hệ để <Badge className="mx-1 bg-accent-orange text-white align-middle px-1.5 py-0.5 text-xs">Ứng tuyển</Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
  }
  
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
    return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl overflow-hidden">
             <CardHeader className="p-0">
               <div className="bg-gradient-to-tr from-primary to-accent h-32" />
                 <div className="p-6 flex flex-col md:flex-row items-center md:items-end -mt-16">
                 <div className="relative group">
                     <Avatar id="PROFILEAVATAR01" className="h-32 w-32 border-4 border-background bg-background shadow-lg">
                      <AvatarImage id="PROFILEAVATAR03" src={avatarUrl || undefined} alt={candidate.name} data-ai-hint="professional headshot" className="object-cover" />
                      <AvatarFallback>{candidate.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor="avatar-upload" className="absolute bottom-1 right-1 cursor-pointer bg-black/50 text-white p-2 rounded-full group-hover:bg-black/70 transition-colors">
                        <Camera className="h-5 w-5" />
                        <span className="sr-only">Change avatar</span>
                    </Label>
                    <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleMediaChange('avatar', e)}/>
                 </div>
                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <h1 className="text-3xl font-headline font-bold">{profileName || 'Chưa có tên'}</h1>
                  <p className="text-muted-foreground">{profileHeadline || 'Cập nhật hồ sơ của bạn'}</p>
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
                            currentLang === 'vi' ? <VnFlagIcon className="w-4 h-4 rounded-sm object-cover"/> :
                            currentLang === 'ja' ? <JpFlagIcon className="w-4 h-4 rounded-sm object-cover"/> :
                            <EnFlagIcon className="w-4 h-4 rounded-sm object-cover"/>
                           }
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleLanguageChange('vi')}><VnFlagIcon className="w-4 h-4 mr-2"/>Tiếng Việt</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleLanguageChange('ja')}><JpFlagIcon className="w-4 h-4 mr-2"/>日本語</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleLanguageChange('en')}><EnFlagIcon className="w-4 h-4 mr-2"/>English</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="icon" className="sm:hidden" onClick={() => setIsProfileEditDialogOpen(true)}><Edit /></Button>
                    <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setIsProfileEditDialogOpen(true)}><Edit /> {editButtonText}</Button>
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
                        renderContent={(temp, handleChange) => <Textarea value={temp.about} onChange={e => handleChange('about', e.target.value)} rows={6}/>}
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
                        <span>{notUpdatedText}</span>
                        <EditDialog title="Chỉnh sửa Giới thiệu bản thân" onSave={handleSave} renderContent={(temp, handleChange) => <Textarea value={temp.about} onChange={e => handleChange('about', e.target.value)} rows={6}/>} candidate={profileByLang.vi!}>
                            <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
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
                        renderContent={(temp, handleChange) => (
                            <div className="space-y-6">
                            {temp.experience.map((exp, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold">Kinh nghiệm #{index + 1}</h4>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('experience', index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </div>
                                <Label>Vai trò</Label><Input value={exp.role} onChange={e => handleChange('experience', index, 'role', e.target.value)} />
                                <Label>Công ty</Label><Input value={exp.company} onChange={e => handleChange('experience', index, 'company', e.target.value)} />
                                <Label>Thời gian</Label><Input value={exp.period} onChange={e => handleChange('experience', index, 'period', e.target.value)} />
                                <Label>Mô tả</Label><Textarea value={exp.description} onChange={e => handleChange('experience', index, 'description', e.target.value)} />
                                </div>
                            ))}
                            <Button variant="outline" className="w-full" onClick={() => handleAddItem('experience', 'vietnam', undefined)}><PlusCircle className="mr-2"/> Thêm kinh nghiệm</Button>
                            </div>
                        )}
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
                           <span>{notUpdatedText}</span>
                            <EditDialog title="Chỉnh sửa Kinh nghiệm làm việc" onSave={handleSave} renderContent={(temp, handleChange) => (
                                <div className="space-y-6">
                                {temp.experience.map((exp, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold">Kinh nghiệm #{index + 1}</h4>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('experience', index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                    </div>
                                    <Label>Vai trò</Label><Input value={exp.role} onChange={e => handleChange('experience', index, 'role', e.target.value)} />
                                    <Label>Công ty</Label><Input value={exp.company} onChange={e => handleChange('experience', index, 'company', e.target.value)} />
                                    <Label>Thời gian</Label><Input value={exp.period} onChange={e => handleChange('experience', index, 'period', e.target.value)} />
                                    <Label>Mô tả</Label><Textarea value={exp.description} onChange={e => handleChange('experience', index, 'description', e.target.value)} />
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full" onClick={() => handleAddItem('experience', 'vietnam', undefined)}><PlusCircle className="mr-2"/> Thêm kinh nghiệm</Button>
                                </div>
                            )} candidate={profileByLang.vi!}>
                               <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
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
                        renderContent={(temp, handleChange) => (
                            <div className="space-y-6">
                                {temp.education.map((edu, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold">Học vấn #{index + 1}</h4>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('education', index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                        <Label>Trường</Label><Input value={edu.school} onChange={e => handleChange('education', index, 'school', e.target.value)} />
                                        <Label>Chuyên ngành</Label><Input value={edu.degree} onChange={e => handleChange('education', index, 'degree', e.target.value)} />
                                        <Label>Năm tốt nghiệp</Label><Input type="number" value={edu.gradYear} onChange={e => handleChange('education', index, 'gradYear', parseInt(e.target.value))} />
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full" onClick={() => handleAddItem('education', 'vietnam', undefined)}><PlusCircle className="mr-2"/> Thêm học vấn</Button>
                            </div>
                        )}
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
                            <span>{notUpdatedText}</span>
                            <EditDialog title="Chỉnh sửa Học vấn" onSave={handleSave} renderContent={(temp, handleChange) => (
                                <div className="space-y-6">
                                    {temp.education.map((edu, index) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold">Học vấn #{index + 1}</h4>
                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('education', index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                            </div>
                                            <Label>Trường</Label><Input value={edu.school} onChange={e => handleChange('education', index, 'school', e.target.value)} />
                                            <Label>Chuyên ngành</Label><Input value={edu.degree} onChange={e => handleChange('education', index, 'degree', e.target.value)} />
                                            <Label>Năm tốt nghiệp</Label><Input type="number" value={edu.gradYear} onChange={e => handleChange('education', index, 'gradYear', parseInt(e.target.value))} />
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full" onClick={() => handleAddItem('education', 'vietnam', undefined)}><PlusCircle className="mr-2"/> Thêm học vấn</Button>
                                </div>
                            )} candidate={profileByLang.vi!}>
                                <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                            </EditDialog>
                        </div>
                     )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><FileArchive className="mr-3 text-primary"/> {t.documentsSection}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Hồ sơ/Giấy tờ"
                        onSave={handleSave}
                        renderContent={(temp, handleChange) => (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold mb-2">Giấy tờ Việt Nam</h4>
                                    {(temp.documents?.vietnam || []).map((doc, index) => (
                                        <div key={index} className="flex items-center gap-2 mb-2">
                                            <Input value={doc.name.vi} onChange={(e) => handleChange('documents', 'vietnam', index, { ...doc, name: {...doc.name, vi: e.target.value} })} />
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('documents', index, 'vietnam')}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => handleOpenAddDocDialog('vietnam')}><PlusCircle className="mr-2 h-4 w-4"/> Thêm</Button>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Giấy tờ Nhật Bản</h4>
                                    {(temp.documents?.japan || []).map((doc, index) => (
                                        <div key={index} className="flex items-center gap-2 mb-2">
                                            <Input value={doc.name.vi} onChange={(e) => handleChange('documents', 'japan', index, { ...doc, name: {...doc.name, vi: e.target.value} })} />
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('documents', index, 'japan')}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => handleOpenAddDocDialog('japan')}><PlusCircle className="mr-2 h-4 w-4"/> Thêm</Button>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Giấy tờ nước ngoài / Du học</h4>
                                    {(temp.documents?.other || []).map((doc, index) => (
                                        <div key={index} className="flex items-center gap-2 mb-2">
                                            <Input value={doc.name.vi} onChange={(e) => handleChange('documents', 'other', { ...doc, name: {...doc.name, vi: e.target.value} })} />
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('documents', index, 'other')}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => handleOpenAddDocDialog('other')}><PlusCircle className="mr-2 h-4 w-4"/> Thêm</Button>
                                </div>
                            </div>
                        )}
                        candidate={profileByLang.vi!}
                        footerContent={
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost"><RefreshCw className="mr-2 h-4 w-4" />Khôi phục danh sách</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Xác nhận khôi phục?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Những giấy tờ đã bị xoá sẽ được khôi phục về danh sách ban đầu. Các giấy tờ bạn đã thêm (nếu có ảnh) và các ảnh đã tải lên sẽ được giữ nguyên. Bạn có muốn tiếp tục?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleRestoreDocuments}>Đồng ý</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        }
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </EditDialog>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="japan" value={activeDocTab} onValueChange={setActiveDocTab} className="w-full">
                      <TabsList className={cn("w-full", isMobile ? "flex justify-between" : "grid grid-cols-3")}>
                        <TabsTrigger 
                            value="vietnam" 
                            className={cn("doc-tab-vn flex-1 md:flex-auto", isMobile && activeDocTab !== 'vietnam' && "flex-shrink basis-0")}
                        >
                           {isMobile ? (activeDocTab === 'vietnam' ? t.vietnamDocs : 'Việt Nam') : t.vietnamDocs}
                        </TabsTrigger>
                        <TabsTrigger 
                            value="japan" 
                            className={cn("doc-tab-jp flex-1 md:flex-auto", isMobile && activeDocTab !== 'japan' && "flex-shrink basis-0")}
                        >
                           {isMobile ? (activeDocTab === 'japan' ? t.japanDocs : 'Nhật Bản') : t.japanDocs}
                        </TabsTrigger>
                        <TabsTrigger 
                            value="other" 
                            className={cn("doc-tab-other flex-1 md:flex-auto", isMobile && activeDocTab !== 'other' && "flex-shrink basis-0")}
                        >
                           {isMobile ? (activeDocTab === 'other' ? t.otherDocs : 'Du học') : t.otherDocs}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="vietnam" className="pt-4">
                        {(candidate.documents?.vietnam?.length || 0) > 0 ? (
                             <DocumentGrid 
                                documents={candidate.documents!.vietnam!} 
                                docType="vietnam" 
                                handleMediaChange={handleMediaChange} 
                                onAddClick={handleOpenAddDocDialog}
                                onRemoveClick={handleRemoveItem as any}
                                isExpanded={expandedGrids.vietnam}
                                setIsExpanded={(expanded) => setExpandedGrids(prev => ({...prev, vietnam: expanded}))}
                             />
                        ) : (<p className="text-sm text-muted-foreground py-4 text-center">{notUpdatedText}</p>)}
                      </TabsContent>
                      <TabsContent value="japan" className="pt-4">
                         {(candidate.documents?.japan?.length || 0) > 0 ? (
                             <DocumentGrid 
                                documents={candidate.documents!.japan!} 
                                docType="japan" 
                                handleMediaChange={handleMediaChange} 
                                onAddClick={handleOpenAddDocDialog}
                                onRemoveClick={handleRemoveItem as any}
                                isExpanded={expandedGrids.japan}
                                setIsExpanded={(expanded) => setExpandedGrids(prev => ({...prev, japan: expanded}))}
                             />
                        ) : (<p className="text-sm text-muted-foreground py-4 text-center">{notUpdatedText}</p>)}
                      </TabsContent>
                       <TabsContent value="other" className="pt-4">
                         {(candidate.documents?.other?.length || 0) > 0 ? (
                            <DocumentGrid 
                                documents={candidate.documents!.other!} 
                                docType="other" 
                                handleMediaChange={handleMediaChange} 
                                onAddClick={handleOpenAddDocDialog}
                                onRemoveClick={handleRemoveItem as any}
                                isExpanded={expandedGrids.other}
                                setIsExpanded={(expanded) => setExpandedGrids(prev => ({...prev, other: expanded}))}
                            />
                        ) : (<p className="text-sm text-muted-foreground py-4 text-center">{notUpdatedText}</p>)}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><FilePen className="mr-3 text-primary"/>{t.notes}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Ghi chú"
                        onSave={handleSave}
                        renderContent={(temp, handleChange) => <Textarea value={temp.notes || ''} onChange={e => handleChange('notes', e.target.value)} rows={4} placeholder="Ghi chú về nguyện vọng, khả năng tài chính, thời gian có thể đi..."/>}
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
                        <span>{notUpdatedText}</span>
                        <EditDialog title="Chỉnh sửa Ghi chú" onSave={handleSave} renderContent={(temp, handleChange) => <Textarea value={temp.notes || ''} onChange={e => handleChange('notes', e.target.value)} rows={4} placeholder="Ghi chú về nguyện vọng, khả năng tài chính, thời gian có thể đi..."/>} candidate={profileByLang.vi!}>
                            <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
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
                        renderContent={(temp, handleChange) => (
                           <div className="space-y-4">
                               {/* Render aspirations fields here */}
                           </div>
                        )}
                        candidate={profileByLang.vi!}
                    >
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </EditDialog>
                  </CardHeader>
                   <CardContent className="space-y-3 text-sm">
                        <p><strong>{t.desiredVisaType}:</strong> {candidate.aspirations?.desiredVisaType || notUpdatedText}</p>
                        <p><strong>{t.desiredVisaDetail}:</strong> {candidate.aspirations?.desiredVisaDetail || notUpdatedText}</p>
                        <p><strong>{t.desiredIndustry}:</strong> {candidate.desiredIndustry || notUpdatedText}</p>
                        <p><strong>{t.desiredJobDetail}:</strong> {candidate.aspirations?.desiredJobDetail || notUpdatedText}</p>
                        <p><strong>{t.desiredLocation}:</strong> {candidate.aspirations?.desiredLocation || notUpdatedText}</p>
                        <p><strong>{t.desiredSalary}:</strong> {formatYen(candidate.aspirations?.desiredSalary)}</p>
                        <p><strong>{t.desiredNetSalary}:</strong> {formatYen(candidate.aspirations?.desiredNetSalary)}</p>
                        {['Thực tập sinh 3 năm', 'Thực tập sinh 1 năm', 'Đặc định đầu Việt', 'Kỹ sư, tri thức đầu Việt'].includes(candidate.aspirations?.desiredVisaDetail || '') && (
                            <p><strong>{t.financialAbility}:</strong> {candidate.aspirations?.financialAbility || notUpdatedText}</p>
                        )}
                        <p><strong>{t.interviewLocation}:</strong> {candidate.aspirations?.interviewLocation || notUpdatedText}</p>
                        <div className="space-y-1">
                            <p><strong>{t.specialAspirations}:</strong></p>
                            {candidate.aspirations?.specialAspirations && (
                                Array.isArray(candidate.aspirations.specialAspirations) && candidate.aspirations.specialAspirations.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.aspirations.specialAspirations.map(aspiration => (
                                            <Badge key={aspiration} variant="secondary">{aspiration}</Badge>
                                        ))}
                                    </div>
                                ) : (
                                    typeof candidate.aspirations.specialAspirations === 'string' && candidate.aspirations.specialAspirations ? (
                                        <p className="text-muted-foreground">{candidate.aspirations.specialAspirations}</p>
                                    ) : (
                                        notUpdatedText
                                    )
                                )
                            )}
                        </div>
                  </CardContent>
                </Card>

                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><Star className="mr-3 text-primary"/> {t.skillsAndInterests}</CardTitle>
                    <EditDialog
                        title="Chỉnh sửa Kỹ năng & Lĩnh vực"
                        description="Chọn các mục có sẵn hoặc thêm mới để làm nổi bật hồ sơ của bạn."
                        onSave={handleSave}
                        renderContent={(temp, handleChange) => (
                           <div className="space-y-6">
                               <div className="space-y-2">
                                <Label className="font-bold">Kỹ năng</Label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                {temp.skills.map((skill) => (<Badge key={skill} variant="secondary" className="pr-1">{skill}<button onClick={() => handleRemoveItem('skills', skill)} className="ml-2 rounded-full hover:bg-destructive/80 p-0.5"><X className="h-3 w-3" /></button></Badge>))}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {commonSkills.filter(s => !temp.skills.includes(s)).map((skill) => (<div key={skill} className="flex items-center space-x-2"><Checkbox id={`skill-${skill}`} onCheckedChange={(checked) => handleChange('skills', skill, checked)} checked={temp.skills.includes(skill)}/><Label htmlFor={`skill-${skill}`} className="text-sm font-normal cursor-pointer">{skill}</Label></div>))}
                                </div>
                                <div className="flex gap-2 mt-2">
                                <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Thêm kỹ năng khác..." /><Button onClick={() => handleAddNewChip('skills')}>Thêm</Button>
                                </div>
                            </div>
                           </div>
                        )}
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
                            <span>{notUpdatedText}</span>
                            <EditDialog title="Chỉnh sửa Kỹ năng & Lĩnh vực" description="Chọn các mục có sẵn hoặc thêm mới để làm nổi bật hồ sơ của bạn." onSave={handleSave} renderContent={(temp, handleChange) => (
                               <div></div>
                            )} candidate={profileByLang.vi!}>
                               <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                            </EditDialog>
                        </div>}
                     </div>
                     <h4 className="font-semibold mb-2 text-sm">{t.interests}</h4>
                     <div className="flex flex-wrap gap-2">
                        {candidate.interests.length > 0 ? candidate.interests.map(interest => <Badge key={interest} className="bg-accent-blue text-white">{interest}</Badge>) : 
                        <div className="text-muted-foreground text-sm">
                            <span>{notUpdatedText}</span>
                             <EditDialog title="Chỉnh sửa Kỹ năng & Lĩnh vực" description="Chọn các mục có sẵn hoặc thêm mới để làm nổi bật hồ sơ của bạn." onSave={handleSave} renderContent={(temp, handleChange) => (
                                <div></div>
                             )} candidate={profileByLang.vi!}>
                                <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                            </EditDialog>
                        </div>}
                     </div>
                  </CardContent>
                </Card>
                
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center"><Award className="mr-3 text-primary"/> {t.certifications}</CardTitle>
                     <EditDialog
                        title="Chỉnh sửa Chứng chỉ & Giải thưởng"
                        onSave={handleSave}
                        renderContent={(temp, handleChange) => (
                            <div className="space-y-6">
                            {temp.certifications.map((cert, index) => (<div key={index} className="p-4 border rounded-lg space-y-2 relative"><div className="flex justify-between items-center mb-2"><Label htmlFor={`cert-${index}`}>Chứng chỉ #{index + 1}</Label><Button variant="ghost" size="icon" onClick={() => handleRemoveItem('certifications', index)}><Trash2 className="h-4 w-4 text-destructive"/></Button></div><Input id={`cert-${index}`} value={cert} onChange={(e) => handleChange('certifications', index, null, e.target.value)} /></div>))}
                            <Button variant="outline" className="w-full" onClick={() => handleAddItem('certifications', 'vietnam', undefined)}><PlusCircle className="mr-2"/> Thêm chứng chỉ</Button>
                            </div>
                        )}
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
                        <span>{notUpdatedText}</span>
                        <EditDialog title="Chỉnh sửa Chứng chỉ & Giải thưởng" onSave={handleSave} renderContent={(temp, handleChange) => (
                            <div/>
                        )} candidate={profileByLang.vi!}>
                            <button className="text-primary hover:underline ml-1">{t.clickToUpdate}</button>
                        </EditDialog>
                    </div>}
                  </CardContent>
                </Card>

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
    <Dialog open={isAddDocDialogOpen} onOpenChange={setIsAddDocDialogOpen}>
        <DialogContent className="sm:max-w-xl" id="THEMGIAYTO01">
            <DialogHeader>
                <DialogTitle>Thêm giấy tờ mới</DialogTitle>
                <DialogDescription>
                    Đặt tên cho giấy tờ và tải lên tệp (PDF hoặc ảnh) tương ứng.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <Tabs defaultValue="vi" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="vi" className="doc-lang-tab-vi">Tiếng Việt</TabsTrigger>
                    <TabsTrigger value="ja" className="doc-lang-tab-ja">Tiếng Nhật</TabsTrigger>
                    <TabsTrigger value="en" className="doc-lang-tab-en">Tiếng Anh</TabsTrigger>
                  </TabsList>
                  <TabsContent value="vi" className="pt-2">
                     <Input 
                        id="doc-name-vi" 
                        value={newDocName.vi}
                        onChange={e => setNewDocName(prev => ({...prev, vi: e.target.value}))}
                        placeholder="VD: Sơ yếu lý lịch"
                    />
                  </TabsContent>
                   <TabsContent value="ja" className="pt-2">
                     <Input 
                        id="doc-name-ja" 
                        value={newDocName.ja || ''}
                        onChange={e => setNewDocName(prev => ({...prev, ja: e.target.value}))}
                        placeholder="例: 履歴書"
                    />
                  </TabsContent>
                   <TabsContent value="en" className="pt-2">
                     <Input 
                        id="doc-name-en" 
                        value={newDocName.en || ''}
                        onChange={e => setNewDocName(prev => ({...prev, en: e.target.value}))}
                        placeholder="E.g., Resume"
                    />
                  </TabsContent>
                </Tabs>
                
                <div className="space-y-2">
                    <Label>Tệp giấy tờ</Label>
                    <Label
                        htmlFor="zalo-qr-file-input"
                        className="relative flex flex-col items-center justify-center w-full h-48 px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer border-border hover:border-primary transition-colors bg-secondary/50"
                    >
                        {newDocFilePreview ? (
                            newDocFile?.type.startsWith('image/') ? (
                                <Image
                                    src={newDocFilePreview}
                                    alt="Xem trước"
                                    fill
                                    className="object-contain rounded-md"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <PdfIcon className="w-16 h-16" />
                                    <p className="mt-2 text-sm font-semibold">{newDocFile?.name}</p>
                                </div>
                            )
                        ) : (
                            <div className="space-y-2 text-center">
                                <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground" />
                                <p className="font-semibold text-foreground">
                                Nhấp hoặc kéo thả file vào đây
                                </p>
                                <p className="text-xs text-muted-foreground">PDF, PNG, JPG</p>
                            </div>
                        )}
                        <Input
                            id="zalo-qr-file-input"
                            type="file"
                            className="sr-only"
                            accept="application/pdf,image/png,image/jpeg"
                            onChange={handleNewDocFileChange}
                        />
                    </Label>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Hủy</Button>
                </DialogClose>
                <Button onClick={handleAddNewDocument}>Lưu giấy tờ</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </div>
  );
}

const DocumentGrid = ({
  documents,
  docType,
  handleMediaChange,
  onAddClick,
  onRemoveClick,
  isExpanded,
  setIsExpanded,
}: {
  documents: DocumentItem[];
  docType: 'vietnam' | 'japan' | 'other';
  handleMediaChange: (type: 'document', e: React.ChangeEvent<HTMLInputElement>, index: number, docType: 'vietnam' | 'japan' | 'other') => void;
  onAddClick: (docType: 'vietnam' | 'japan' | 'other') => void;
  onRemoveClick: (section: 'documents', index: number, docType: 'vietnam' | 'japan' | 'other') => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}) => {
  const visibleCount = isExpanded ? documents.length : 8;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {documents.slice(0, visibleCount).map((doc, index) => (
          <Card key={index} className="group relative">
            <CardContent className="p-2 flex flex-col items-center justify-center aspect-square">
              {doc.url ? (
                  <Link href={doc.url} target="_blank" className="w-full h-full flex items-center justify-center">
                      {doc.fileType === 'pdf' ? (
                          <PdfIcon className="w-12 h-12"/>
                      ): (
                          <Image src={doc.url} alt={doc.name.vi} fill className="object-contain p-2"/>
                      )}
                  </Link>
              ) : (
                <div className="text-center text-muted-foreground">
                    <UploadCloud className="w-8 h-8 mx-auto mb-2"/>
                    <p className="text-xs">Tải lên</p>
                </div>
              )}
               <Label htmlFor={`doc-upload-${docType}-${index}`} className="absolute inset-0 cursor-pointer bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Camera className="h-8 w-8 text-white"/>
               </Label>
               <Input id={`doc-upload-${docType}-${index}`} type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleMediaChange('document', e, index, docType)} />
               {!doc.isDefault && (
                 <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onRemoveClick('documents', index, docType)}>
                    <X className="h-4 w-4"/>
                 </Button>
               )}
            </CardContent>
            <p className="text-center text-xs font-semibold text-muted-foreground p-2 truncate">{doc.name.vi}</p>
          </Card>
        ))}
         <Card className="border-dashed flex items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-colors" onClick={() => onAddClick(docType)}>
             <div className="text-center text-muted-foreground">
                 <PlusCircle className="w-8 h-8 mx-auto mb-2"/>
                 <p className="text-xs font-semibold">Thêm giấy tờ</p>
             </div>
        </Card>
      </div>
       {documents.length > 8 && (
        <div className="text-center mt-4">
          <Button variant="link" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </Button>
        </div>
      )}
    </div>
  )
};
