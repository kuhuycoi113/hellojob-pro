
'use client';

import { useState, use, useEffect } from 'react';
import { notFound, useSearchParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, History, FileText, Briefcase, Award, Edit, Camera, Info, PlusCircle, Trash2, ImageIcon, Phone, MessageSquare, Mail, QrCode, CheckCircle, FileSignature } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon, ZaloIcon, MessengerIcon, LineIcon } from '@/components/custom-icons';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const employersData: { [key: string]: any } = {
    'Z000': {
        id: 'Z000',
        name: {
            vi: 'Công ty Cổ phần ABC',
            ja: 'ABC株式会社',
            en: 'ABC Corporation'
        },
        type: {
            vi: 'Công ty phái cử',
            ja: '送り出し機関',
            en: 'Dispatch Company'
        },
        visaType: {
            vi: 'Thực tập sinh & Đặc định',
            ja: '技能実習・特定技能',
            en: 'Trainee & Specified Skilled Worker'
        },
        visaDetail: {
            vi: 'TTS 3 năm, Đặc định ngành Thực phẩm',
            ja: '技能実習3年、特定技能（飲食料品製造業）',
            en: '3-Year Trainee, SSW (Food & Beverage Manufacturing)'
        },
        location: {
            vi: 'Hà Nội, Việt Nam',
            ja: 'ベトナム、ハノイ',
            en: 'Hanoi, Vietnam'
        },
        logo: '/img/viet-img/company3.png',
        banner: '/img/viet-img/anh-bia.jpg',
        
        about: {
            vi: '',
            ja: '',
            en: ''
        },
        
        images: [
            { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 1', ja: '新しい写真 1', en: 'New Photo 1' }, dataAiHint: 'new image 1' },
            { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 2', ja: '新しい写真 2', en: 'New Photo 2' }, dataAiHint: 'new image 2' },
            { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 3', ja: '新しい写真 3', en: 'New Photo 3' }, dataAiHint: 'new image 3' },
            { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 4', ja: '新しい写真 4', en: 'New Photo 4' }, dataAiHint: 'new image 4' },
        ],

        history: [
        ],

        info: {
            founded: '',
            size: { vi: '', ja: '', en: '' },
            website: '',
            license: '',
            phone: '',
            zalo: '',
            messenger: '',
            line: '',
            email: ''
        },

        industries: {
            main: { vi: '', ja: '', en: '' },
            secondary: { vi: '', ja: '', en: '' },
        },

        benefits: [
        ],
        valueInterest: [
        ],
    },
};

const placeholderEmployerData = {
    ...employersData['Z000'],
    about: {
        vi: 'Công ty phái cử ABC là một trong những đơn vị hàng đầu trong lĩnh vực cung ứng nhân lực cho thị trường Nhật Bản. Với nhiều năm kinh nghiệm, chúng tôi tự hào đã chắp cánh cho hàng ngàn ước mơ của người lao động Việt Nam...',
        ja: 'ABC派遣会社は、日本市場への人材供給分野におけるリーディングカンパニーの一つです。長年の経験により、私たちは何千人ものベトナム人労働者の夢を支援してきたことを誇りに思っています...',
        en: 'ABC Dispatch Company is one of the leading units in the field of human resource supply for the Japanese market. With many years of experience, we are proud to have helped thousands of Vietnamese workers\' dreams take flight...'
    },
    visaType: {
        vi: 'Thực tập sinh, Kỹ năng đặc định',
        ja: '技能実習、特定技能',
        en: 'Technical Intern, Specified Skilled Worker'
    },
    visaDetail: {
        vi: 'TTS 3 năm, Đặc định ngành Thực phẩm, Đặc định ngành Xây dựng',
        ja: '技能実習3年、特定技能（飲食料品）、特定技能（建設）',
        en: '3-Year Intern, SSW (Food), SSW (Construction)'
    },
    images: [
        { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 1', ja: '新しい写真 1', en: 'New Photo 1' }, dataAiHint: 'new image 1' },
        { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 2', ja: '新しい写真 2', en: 'New Photo 2' }, dataAiHint: 'new image 2' },
        { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 3', ja: '新しい写真 3', en: 'New Photo 3' }, dataAiHint: 'new image 3' },
        { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 4', ja: '新しい写真 4', en: 'New Photo 4' }, dataAiHint: 'new image 4' },
    ],
    history: [
        { year: '2010', event: { vi: 'Thành lập công ty cổ phần ABC.', ja: 'ABC株式会社設立。', en: 'Established ABC Corporation.' } },
        { year: '2015', event: { vi: 'Đạt mốc 1.000 lao động được phái cử thành công.', ja: '派遣労働者1,000人達成。', en: 'Reached the milestone of 1,000 successfully dispatched workers.' } },
        { year: '2020', event: { vi: 'Mở rộng văn phòng đại diện tại Tokyo, Nhật Bản.', ja: '東京に駐在員事務所を開設。', en: 'Opened representative office in Tokyo, Japan.' } },
        { year: '2023', event: { vi: 'Nhận giải thưởng "Công ty phái cử uy tín của năm".', ja: '「今年の信頼できる派遣会社」賞を受賞。', en: '"Reputable Dispatch Company of the Year" award.' } }
    ],
    info: {
        founded: '2010',
        size: { vi: '50 - 100 nhân viên', ja: '50～100名', en: '50 - 100 employees' },
        license: 'Số 123/LĐTBXH-GP',
        website: 'https://abc-corp.co.jp',
    },
    industries: {
        main: { vi: 'Xây dựng, Cơ khí, Nông nghiệp, Thực phẩm', ja: '建設、機械、農業、食品', en: 'Construction, Machinery, Agriculture, Food' },
        secondary: { vi: 'Dệt may, Điện tử', ja: '繊維、電子', en: 'Textiles, Electronics' },
    },
    benefits: [
        { vi: 'Môi trường làm việc chuyên nghiệp, thân thiện.', ja: 'プロフェッショナルでフレンドリーな職場環境。', en: 'Professional and friendly working environment.' },
        { vi: 'Chế độ đãi ngộ, phúc lợi cạnh tranh.', ja: '競争力のある報酬と福利厚生制度。', en: 'Competitive salary and benefits package.' },
        { vi: 'Nhiều cơ hội đào tạo và phát triển sự nghiệp.', ja: '多くのトレーニングとキャリア開発の機会。', en: 'Many opportunities for training and career development.' },
        { vi: 'Hỗ trợ toàn diện cho người lao động tại Nhật Bản.', ja: '日本での労働者に対する包括的なサポート。', en: 'Comprehensive support for workers in Japan.' },
    ],
    valueInterest: [
        { vi: 'Ứng viên nhiều và nhanh nhất', ja: '最も多く、最も速い候補者', en: 'Most & Fastest Candidates' },
        { vi: 'Ứng viên chất lượng', ja: '質の高い候補者', en: 'Quality Candidates' },
    ],
};


// Initial empty state for the form
const emptyEmployerData = {
    id: 'Z000',
    name: { vi: '', ja: '', en: '' },
    type: { vi: '', ja: '', en: '' },
    visaType: { vi: '', ja: '', en: '' },
    visaDetail: { vi: '', ja: '', en: '' },
    location: { vi: '', ja: '', en: '' },
    logo: '/img/viet-img/company3.png',
    banner: '/img/viet-img/anh-bia.jpg',
    about: { vi: '', ja: '', en: '' },
    images: [
      { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 1', ja: '新しい写真 1', en: 'New Photo 1' }, dataAiHint: 'new image 1' },
      { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 2', ja: '新しい写真 2', en: 'New Photo 2' }, dataAiHint: 'new image 2' },
      { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 3', ja: '新しい写真 3', en: 'New Photo 3' }, dataAiHint: 'new image 3' },
      { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới 4', ja: '新しい写真 4', en: 'New Photo 4' }, dataAiHint: 'new image 4' },
    ],
    history: [],
    info: { founded: '', size: { vi: '', ja: '', en: '' }, website: '', license: '', phone: '', zalo: '', messenger: '', line: '', email: '' },
    industries: { main: { vi: '', ja: '', en: '' }, secondary: { vi: '', ja: '', en: '' } },
    benefits: [],
    valueInterest: [],
};


const contentByLang = {
    vi: {
        edit: 'Sửa',
        aboutTitle: 'Giới thiệu doanh nghiệp',
        imagesTitle: 'Ảnh về doanh nghiệp',
        historyTitle: 'Lịch sử & các mốc sự kiện',
        infoTitle: 'Thông tin doanh nghiệp',
        foundedLabel: 'Năm thành lập',
        sizeLabel: 'Quy mô',
        licenseLabel: 'Giấy phép',
        websiteLabel: 'Website',
        emailLabel: 'Email liên hệ',
        phoneLabel: 'Số điện thoại',
        zaloLabel: 'Zalo',
        messengerLabel: 'Facebook Messenger',
        messengerPlaceholder: 'Dán link Facebook / Messenger hoặc username',
        messengerHelper: 'Hệ thống sẽ tự động lấy username của bạn.',
        lineLabel: 'Line',
        linePlaceholder: 'Dán link Line hoặc nhập ID của bạn',
        lineHelper: 'Hệ thống sẽ tự động lấy username của bạn.',
        notUpdated: 'Chưa có thông tin',
        clickToUpdate: 'Nhấn để cập nhật',
        headerTitle: 'Thông tin chung',
        namePlaceholder: 'Ví dụ: Công ty Cổ phần ABC',
        typePlaceholder: 'Ví dụ: Công ty phái cử',
        locationPlaceholder: 'Ví dụ: Hà Nội, Việt Nam',
        industriesTitle: 'Ngành nghề & Khu vực',
        mainIndustriesLabel: 'Ngành nghề',
        secondaryIndustriesLabel: 'Khu vực',
        benefitsTitle: 'Phúc lợi & Môi trường',
        valueInterestTitle: 'Giá trị mong muốn',
        contactTitle: 'Thông tin liên hệ',
        registerCTA: 'Cung cấp ít nhất 1 phương thức liên hệ để',
        registerAction: 'Đăng ký',
        visaTitle: 'Loại hình và Visa',
        visaTypeLabel: 'Loại hình',
        visaDetailLabel: 'Chi tiết loại hình visa',
    },
    ja: {
        edit: '編集',
        aboutTitle: '会社紹介',
        imagesTitle: '会社の写真',
        historyTitle: '沿革と主な出来事',
        infoTitle: '企業情報',
        foundedLabel: '設立年',
        sizeLabel: '従業員数',
        licenseLabel: '許可証',
        websiteLabel: 'ウェブサイト',
        emailLabel: '連絡先メールアドレス',
        phoneLabel: '電話番号',
        zaloLabel: 'Zalo',
        messengerLabel: 'Facebookメッセンジャー',
        messengerPlaceholder: 'Facebook/Messengerのリンクまたはユーザー名',
        messengerHelper: 'システムが自動的にユーザー名を取得します。',
        lineLabel: 'Line',
        linePlaceholder: 'LineのリンクまたはIDを入力してください',
        lineHelper: 'システムが自動的にユーザー名を取得します。',
        notUpdated: '情報がありません',
        clickToUpdate: 'クリックして更新',
        headerTitle: '一般情報',
        namePlaceholder: '例: ABC株式会社',
        typePlaceholder: '例: 送り出し機関',
        locationPlaceholder: '例: ベトナム、ハノイ',
        industriesTitle: '業種と分野',
        mainIndustriesLabel: '主要業種',
        secondaryIndustriesLabel: 'その他の業種',
        benefitsTitle: '福利厚生と環境',
        valueInterestTitle: '希望する価値',
        contactTitle: '連絡先情報',
        registerCTA: '登録するには、少なくとも1つの連絡方法を提供してください',
        registerAction: '登録',
        visaTitle: '種別とビザ',
        visaTypeLabel: '種別',
        visaDetailLabel: 'ビザ詳細',
    },
    en: {
        edit: 'Edit',
        aboutTitle: 'About the Company',
        imagesTitle: 'Company Photos',
        historyTitle: 'History & Milestones',
        infoTitle: 'Company Information',
        foundedLabel: 'Founded',
        sizeLabel: 'Company Size',
        licenseLabel: 'License',
        websiteLabel: 'Website',
        emailLabel: 'Contact Email',
        phoneLabel: 'Phone',
        zaloLabel: 'Zalo',
        messengerLabel: 'Facebook Messenger',
        messengerPlaceholder: 'Paste Facebook/Messenger link or username',
        messengerHelper: 'The system will automatically extract your username.',
        lineLabel: 'Line',
        linePlaceholder: 'Paste Line link or enter your ID',
        lineHelper: 'The system will automatically extract your username.',
        notUpdated: 'Not available',
        clickToUpdate: 'Click to update',
        headerTitle: 'General Information',
        namePlaceholder: 'E.g., ABC Corporation',
        typePlaceholder: 'E.g., Dispatch Company',
        locationPlaceholder: 'E.g., Hanoi, Vietnam',
        industriesTitle: 'Industries & Sectors',
        mainIndustriesLabel: 'Main Industries',
        secondaryIndustriesLabel: 'Other Industries',
        benefitsTitle: 'Benefits & Environment',
        valueInterestTitle: 'Desired Values',
        contactTitle: 'Contact Information',
        registerCTA: 'Provide at least 1 contact method to',
        registerAction: 'Register',
        visaTitle: 'Type and Visa',
        visaTypeLabel: 'Type',
        visaDetailLabel: 'Visa Details',
    }
};

type Language = keyof typeof contentByLang;

const roleTexts: Record<string, Record<Language, string>> = {
  'nhan-vien-phai-cu': { vi: 'Nhân viên phái cử', ja: '送り出し機関の社員', en: 'Sending Company Staff' },
  'nhan-vien-nhan-luc-nhat': { vi: 'Nhân viên Nhân lực Nhật', ja: '日本人材法人の社員', en: 'Japan-side HR Staff' },
  'sending': { vi: 'Công ty phái cử', ja: '送り出し機関', en: 'Sending Company' },
  'support': { vi: 'Cơ quan hỗ trợ (Shien Kikan)', ja: '支援機関', en: 'Support Organization' },
  'company': { vi: 'Xí nghiệp tiếp nhận', ja: '受け入れ企業', en: 'Accepting Company' },
  'supervising-organization': { vi: 'Nghiệp đoàn (Kumiai)', ja: '監理団体 (組合)', en: 'Supervising Organization' },
  'paid-placement-agency': { vi: 'Công ty giới thiệu có phí', ja: '有料職業紹介事業所', en: 'Paid Placement Agency' },
  'haken': { vi: 'Công ty Haken', ja: '派遣会社', en: 'Staffing Agency' },
};


const SectionCard = ({ title, icon: Icon, children, className, onEditClick }: { title: string, icon: React.ElementType, children: React.ReactNode, className?: string, onEditClick?: () => void }) => (
    <Card className={cn("shadow-lg", className)}>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-xl flex items-center gap-3">
                <Icon className="text-primary h-6 w-6"/>{title}
            </CardTitle>
            {onEditClick && (
              <Button variant="ghost" size="icon" onClick={onEditClick}>
                  <Edit className="h-4 w-4"/>
              </Button>
            )}
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

const formatPhoneNumberInput = (value: string, country: string): string => {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');

    if (country === '+84') { // Vietnam (10 digits starting with 0)
        if (cleanValue.length === 0) return '';
        if (!cleanValue.startsWith('0')) return `0${cleanValue}`.slice(0,10);
        if (cleanValue.length === 1) return `(0)`;

        const mobilePart = cleanValue.substring(1);
        if (mobilePart.length <= 3) return `(0) ${mobilePart}`;
        if (mobilePart.length <= 6) return `(0) ${mobilePart.slice(0, 3)} ${mobilePart.slice(3)}`;
        return `(0) ${mobilePart.slice(0, 3)} ${mobilePart.slice(3, 6)} ${mobilePart.slice(6, 9)}`;
    }

    if (country === '+81') { // Japan (11 digits total starting with 0)
        if (cleanValue.length === 0) return '';
        if (!cleanValue.startsWith('0')) return `0${cleanValue}`.slice(0,11);
        if (cleanValue.length === 1) return `(0)`;
        
        const mobilePart = cleanValue.substring(1); 
        if (mobilePart.length <= 2) return `(0)${mobilePart}`;
        if (mobilePart.length <= 6) return `(0)${mobilePart.slice(0,2)} ${mobilePart.slice(2, 6)}`;
        return `(0)${mobilePart.slice(0,2)} ${mobilePart.slice(2,6)} ${mobilePart.slice(6,10)}`;
    }

    return cleanValue;
};


const parseMessengerInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    try {
        if (trimmedInput.startsWith('http') || trimmedInput.includes('facebook.com') || trimmedInput.includes('m.me')) {
            const url = new URL(trimmedInput.startsWith('http') ? trimmedInput : `https://${trimmedInput}`);
            
            if (url.hostname.includes('facebook.com') || url.hostname.includes('m.facebook.com')) {
                const id = url.searchParams.get('id');
                if (id && /^\d+$/.test(id)) {
                    return id; // Return numeric ID if found in profile.php
                }
                // For vanity URLs like facebook.com/username
                const pathParts = url.pathname.split('/').filter(part => part && part !== 'profile.php' && part !== 'people');
                if (pathParts.length > 0) {
                    return pathParts[pathParts.length - 1];
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
        // Not a valid URL, treat as a potential username
        console.warn("Could not parse Messenger input as URL, treating as username:", error);
    }
    // Fallback: treat as username, remove any URL-like parts
    return trimmedInput.split('/').pop() || trimmedInput;
};

const parseZaloInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    if (trimmedInput.includes('zalo.me/')) {
        const parts = trimmedInput.split('/');
        return parts.pop()?.replace(/\D/g, '') || '';
    }
    return trimmedInput.replace(/\D/g, '');
};

const parseLineInput = (input: string): string => {
  if (!input) return '';
  const trimmedInput = input.trim();
  try {
      if (trimmedInput.startsWith('http') && trimmedInput.includes('line.me/')) {
          const url = new URL(trimmedInput);
          const pathParts = url.pathname.split('/');
          let potentialId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
          if (potentialId) {
             // Remove query parameters
             potentialId = potentialId.split('?')[0];
             // Remove leading ~ or @ if present
             return potentialId.replace(/^[~@]/, '');
          }
      }
  } catch (error) {
       console.warn("Could not parse Line input as URL, treating as ID:", error);
  }
  // Fallback to treat the whole input as an ID, removing potential URL parts and special characters
  return trimmedInput.split('/').pop()?.replace(/^[~@]/, '') || trimmedInput.replace(/^[~@]/, '');
};



export default function EmployerDetailPage() {
  const id = 'Z000';
  const searchParams = useSearchParams();
  
  const [employer, setEmployer] = useState<any | null>(null);
  const [lang, setLang] = useState<Language>('vi');
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    const langFromParams = (searchParams.get('lang') || 'vi') as Language;
    const roleFromParams = searchParams.get('role');
    setLang(langFromParams);
    setRole(roleFromParams);
    
    let employerData;
    // Set initial data based on whether there are query params
    if (Array.from(searchParams.keys()).length > 0) {
        employerData = {
          ...placeholderEmployerData,
          logo: emptyEmployerData.logo,
          banner: emptyEmployerData.banner
        };
    } else {
        employerData = placeholderEmployerData;
    }

    const finalEmployerData = { ...employerData };
    
    // Apply preferences from query params
    if (roleFromParams && roleTexts[roleFromParams]) {
        finalEmployerData.type = roleTexts[roleFromParams];
    }
    
    const visaTypes = searchParams.getAll('visa_type');
    if (visaTypes.length > 0) {
        finalEmployerData.visaType = {
            vi: visaTypes.join(', '),
            ja: visaTypes.join(', '),
            en: visaTypes.join(', ')
        };
    }
    
    const visaDetails = searchParams.getAll('visa_detail');
    if (visaDetails.length > 0) {
        finalEmployerData.visaDetail = {
            vi: visaDetails.join(', '),
            ja: visaDetails.join(', '),
            en: visaDetails.join(', ')
        };
    }
    
    const industries = searchParams.getAll('industry');
    if (industries.length > 0) {
        finalEmployerData.industries.main = {
            vi: industries.join(', '),
            ja: industries.join(', '),
            en: industries.join(', ')
        };
    }

    const locations = searchParams.getAll('location');
    if (locations.length > 0) {
        finalEmployerData.industries.secondary = {
            vi: locations.join(', '),
            ja: locations.join(', '),
            en: locations.join(', ')
        };
    }
    
    const interest = searchParams.get('interest');
    if (interest) {
         finalEmployerData.valueInterest = placeholderEmployerData.valueInterest.filter((v:any) => v.vi.toLowerCase().includes(interest.substring(0,3)));
    }


    setEmployer(finalEmployerData);

  }, [searchParams]);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<{title: string, field: string } | null>(null);
  const [tempContent, setTempContent] = useState<any>('');
  const [phoneCountry, setPhoneCountry] = useState('+84');
  const [zaloCountry, setZaloCountry] = useState('+84');
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ email?: string; messenger?: string, line?: string }>({});

  if (!employer) {
      return <div>Loading...</div>; // Or a skeleton loader
  }
  
  const t = contentByLang[lang] || contentByLang['vi'];
  const roleText = (role && roleTexts[role]) ? roleTexts[role][lang] : employer.type[lang];

  const validateEmail = (email: string) => {
    if (!email) return true; // Not required, but if present must be valid
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  };
  
  const validateField = (field: 'messenger' | 'line', value: string) => {
    if (!value) {
        setErrors(prev => ({...prev, [field]: undefined }));
        return true;
    }

    let isValid = false;
    let errorMessage = "Định dạng không hợp lệ.";

    if (field === 'messenger') {
        isValid = /^(https?:\/\/(www\.)?(facebook|m)\.com\/|m\.me\/|[\w.]{5,})/.test(value);
        errorMessage = "Vui lòng nhập link Facebook/Messenger hoặc username hợp lệ.";
    } else if (field === 'line') {
        isValid = /^(https?:\/\/line\.me\/|@?[\w.-]+)/.test(value);
        errorMessage = "Vui lòng nhập link Line hoặc Line ID hợp lệ.";
    }
    
    if (isValid) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    } else {
        setErrors(prev => ({ ...prev, [field]: errorMessage }));
    }
    return isValid;
  };

  const handleEditClick = (title: string, currentContent: any, field: string) => {
    setEditingModule({ title, field });
    setTempContent(JSON.parse(JSON.stringify(currentContent)));
    setErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingModule) return;
    
    let allValid = true;
    if (editingModule.field === 'info') {
        if (!validateEmail(tempContent.email || '')) {
             setErrors(prev => ({ ...prev, email: "Email không hợp lệ." }));
             allValid = false;
        } else {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
        if (!validateField('messenger', tempContent.messenger || '')) allValid = false;
        if (!validateField('line', tempContent.line || '')) allValid = false;
    }

    if (!allValid) {
        toast({ variant: 'destructive', title: 'Thông tin không hợp lệ', description: 'Vui lòng sửa các lỗi được hiển thị trước khi lưu.' });
        return;
    }

    setEmployer((prev: any) => {
        const newState = { ...prev };
        const { field } = editingModule;
        if (field === 'header') {
            newState.name = tempContent.name;
            newState.type = tempContent.type;
            newState.location = tempContent.location;
        } else if (field === 'info') {
            const finalInfo = { ...tempContent };
            if (finalInfo.messenger) finalInfo.messenger = parseMessengerInput(finalInfo.messenger);
            if (finalInfo.line) finalInfo.line = parseLineInput(finalInfo.line);
            if (finalInfo.zalo) finalInfo.zalo = parseZaloInput(finalInfo.zalo);
            newState[field] = finalInfo;
        } else if (field === 'visa') {
             newState.visaType = tempContent.visaType;
             newState.visaDetail = tempContent.visaDetail;
        } else if (field === 'valueInterest') {
            newState.valueInterest = tempContent.split('\n').map((item: string) => ({ vi: item, ja: item, en: item }));
        } else {
            newState[field] = tempContent;
        }
        return newState;
    });

    setIsEditDialogOpen(false);
    setEditingModule(null);
  };

  const handleTempArrayChange = (index: number, field: string, value: any) => {
    setTempContent((prev: any[]) => {
      const newArray = [...prev];
      if (typeof newArray[index] === 'object' && newArray[index] !== null && 'event' in newArray[index]) { // History object
        newArray[index] = { ...newArray[index], [field]: { ...newArray[index][field], [lang]: value } };
      } else if (typeof newArray[index] === 'object' && newArray[index] !== null && 'alt' in newArray[index]) { // Image object
         newArray[index] = { ...newArray[index], alt: { ...newArray[index].alt, [lang]: value } };
      } else if (typeof newArray[index] === 'object' && newArray[index] !== null) { // Benefits object
        newArray[index] = { ...newArray[index], [lang]: value };
      }
      return newArray;
    });
  };
  
  const addTempArrayItem = (field: string) => {
    if (field === 'history') {
      setTempContent((prev: any[]) => [...prev, { year: new Date().getFullYear().toString(), event: { vi: '', ja: '', en: '' } }]);
    } else if (field === 'benefits') {
       setTempContent((prev: any[]) => [...prev, { vi: '', ja: '', en: '' }]);
    } else if (field === 'images') {
       setTempContent((prev: any[]) => [...prev, { src: 'https://placehold.co/600x400.png', alt: { vi: 'Ảnh mới', ja: '新しい写真', en: 'New Photo' }, dataAiHint: 'new image' }]);
    }
  };

  const removeTempArrayItem = (index: number) => {
    setTempContent((prev: any[]) => prev.filter((_, i) => i !== index));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newUrl = event.target?.result as string;
        if (editingModule?.field === 'images' && index !== undefined) {
             setTempContent((prev: any[]) => {
                const newImages = [...prev];
                newImages[index].src = newUrl;
                return newImages;
            });
        } else {
            setEmployer((prev: any) => {
                const newState = JSON.parse(JSON.stringify(prev));
                 if (field === 'banner' || field === 'logo') {
                   newState[field] = newUrl;
                 } else if (field === 'images' && index !== undefined) {
                    newState.images[index].src = newUrl;
                 }
                return newState;
            });
        }
      };
      reader.readAsDataURL(file);
    }
  };

   const handleDeleteImage = (index: number) => {
        setEmployer((prev: any) => {
            const newState = JSON.parse(JSON.stringify(prev));
            newState.images[index] = placeholderEmployerData.images[index];
            return newState;
        });
    };
  
  const renderEditContent = () => {
    if (!editingModule) return <p>Chức năng đang được phát triển.</p>;

    switch(editingModule.field) {
        case 'header':
            return (
                 <div className="space-y-4">
                    <div className="space-y-2"><Label>{t.namePlaceholder}</Label><Input placeholder={placeholderEmployerData.name[lang]} value={tempContent.name[lang] || ''} onChange={(e) => setTempContent({...tempContent, name: {...tempContent.name, [lang]: e.target.value}})} /></div>
                    <div className="space-y-2"><Label>{t.typePlaceholder}</Label><Input placeholder={placeholderEmployerData.type[lang]} value={tempContent.type[lang] || ''} onChange={(e) => setTempContent({...tempContent, type: {...tempContent.type, [lang]: e.target.value}})} /></div>
                    <div className="space-y-2"><Label>{t.locationPlaceholder}</Label><Input placeholder={placeholderEmployerData.location[lang]} value={tempContent.location[lang] || ''} onChange={(e) => setTempContent({...tempContent, location: {...tempContent.location, [lang]: e.target.value}})} /></div>
                </div>
            );
        case 'about':
            return <Textarea className="min-h-[150px]" placeholder={`Ví dụ: ${placeholderEmployerData.about[lang]}`} value={tempContent[lang] || ''} onChange={(e) => setTempContent({ ...tempContent, [lang]: e.target.value })} rows={8} />;
        
        case 'images':
            return (
                <div className="space-y-4">
                    {tempContent.map((img: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                        <Label htmlFor={`dialog-image-upload-${index}`} className="relative w-20 h-20 flex-shrink-0 cursor-pointer group">
                           <Image src={img.src} alt={img.alt[lang] || ''} fill className="object-cover rounded-md"/>
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Camera className="h-6 w-6 text-white"/>
                           </div>
                           <Input id={`dialog-image-upload-${index}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'images', index)} />
                        </Label>
                        <Input 
                            placeholder={`Ví dụ: ${placeholderEmployerData.images[index]?.alt[lang] || 'Văn phòng hiện đại'}`}
                            value={img.alt[lang] || ''}
                            onChange={(e) => handleTempArrayChange(index, 'alt', e.target.value)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeTempArrayItem(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                    ))}
                    <Button variant="outline" onClick={() => addTempArrayItem('images')}><PlusCircle className="mr-2"/> Thêm ảnh</Button>
                </div>
            );

        case 'history':
            return (
                <div className="space-y-4">
                    {tempContent.map((item: any, index: number) => (
                        <div key={index} className="grid grid-cols-[80px_1fr_auto] gap-3 items-center">
                            <Input placeholder="Năm" value={item.year} onChange={(e) => { const newHistory = [...tempContent]; newHistory[index].year = e.target.value; setTempContent(newHistory); }} />
                            <Input placeholder={`Ví dụ: ${placeholderEmployerData.history[index]?.event[lang] || 'Thành lập công ty'}`} value={item.event[lang] || ''} onChange={(e) => handleTempArrayChange(index, 'event', e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => removeTempArrayItem(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => addTempArrayItem('history')}><PlusCircle className="mr-2"/> Thêm mốc</Button>
                </div>
            );
        case 'info':
             return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>{t.foundedLabel}</Label><Input placeholder={`Ví dụ: ${placeholderEmployerData.info.founded}`} value={tempContent.founded} onChange={(e) => setTempContent({...tempContent, founded: e.target.value})} /></div>
                        <div className="space-y-2"><Label>{t.sizeLabel}</Label><Input placeholder={`Ví dụ: ${placeholderEmployerData.info.size[lang]}`} value={tempContent.size[lang] || ''} onChange={(e) => setTempContent({...tempContent, size: {...tempContent.size, [lang]: e.target.value}})} /></div>
                        <div className="space-y-2"><Label>{t.licenseLabel}</Label><Input placeholder={`Ví dụ: ${placeholderEmployerData.info.license}`} value={tempContent.license} onChange={(e) => setTempContent({...tempContent, license: e.target.value})} /></div>
                        <div className="space-y-2">
                           <Label>{t.websiteLabel}</Label>
                           <Input placeholder="https://example.com" value={tempContent.website} onChange={(e) => setTempContent({...tempContent, website: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-4">{t.contactTitle}</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-1 md:col-span-2">
                              <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4"/> {t.emailLabel}</Label>
                              <Input 
                                type="email" 
                                id="email" 
                                placeholder="contact@company.com" 
                                value={tempContent.email} 
                                onChange={(e) => setTempContent({...tempContent, email: e.target.value})} 
                                onBlur={(e) => {
                                  if (!validateEmail(e.target.value)) {
                                    setErrors(prev => ({...prev, email: "Email không hợp lệ"}));
                                  } else {
                                     setErrors(prev => ({...prev, email: undefined}));
                                  }
                                }}
                                className={cn(errors.email && "border-destructive")}
                              />
                               {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                           </div>
                          <div className="space-y-2">
                              <Label htmlFor="phone" className="flex items-center gap-2">
                                <Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="h-4 w-4" />
                                {t.phoneLabel}
                              </Label>
                             <div className="flex items-center">
                                <Select value={phoneCountry} onValueChange={setPhoneCountry}>
                                    <SelectTrigger className="w-[80px] rounded-r-none"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+84">VN</SelectItem>
                                        <SelectItem value="+81">JP</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="phone" type="tel" placeholder={phoneCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(tempContent.phone, phoneCountry)} onChange={(e) => setTempContent({...tempContent, phone: e.target.value.replace(/\D/g, '')})} />
                            </div>
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="zalo" className="flex items-center gap-2"><ZaloIcon className="h-4 w-4" />{t.zaloLabel}</Label>
                             <div className="flex items-center relative">
                                <Select value={zaloCountry} onValueChange={setZaloCountry}>
                                    <SelectTrigger className="w-[80px] rounded-r-none"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+84">VN</SelectItem>
                                        <SelectItem value="+81">JP</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="zalo" type="tel" placeholder={zaloCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(tempContent.zalo, zaloCountry)} onChange={(e) => setTempContent({...tempContent, zalo: e.target.value.replace(/\D/g, '')})} />
                                <div onClick={() => {}} className="absolute right-2 cursor-pointer text-muted-foreground hover:text-primary">
                                    <QrCode className="h-5 w-5"/>
                                </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                             <Label htmlFor="messenger" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4" />{t.messengerLabel}</Label>
                            <Input
                                id="messenger"
                                placeholder={t.messengerPlaceholder}
                                value={tempContent.messenger}
                                onChange={(e) => setTempContent({...tempContent, messenger: e.target.value})}
                                onBlur={(e) => validateField('messenger', e.target.value)}
                                className={cn(errors.messenger && "border-destructive")}
                            />
                            {!errors.messenger && <p className="text-xs text-muted-foreground">{t.messengerHelper}</p>}
                            {errors.messenger && <p className="text-xs text-destructive">{errors.messenger}</p>}
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="line" className="flex items-center gap-2"><LineIcon className="h-4 w-4" />{t.lineLabel}</Label>
                            <Input
                                id="line"
                                placeholder={t.linePlaceholder}
                                value={tempContent.line}
                                onChange={(e) => setTempContent({...tempContent, line: e.target.value})}
                                onBlur={(e) => validateField('line', e.target.value)}
                                className={cn(errors.line && "border-destructive")}
                            />
                            {!errors.line && <p className="text-xs text-muted-foreground">{t.lineHelper}</p>}
                             {errors.line && <p className="text-xs text-destructive">{errors.line}</p>}
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <div className="text-sm text-muted-foreground">{t.registerCTA} <Badge className="mx-1 bg-accent-orange text-white align-middle px-1.5 py-0.5 text-xs">{t.registerAction}</Badge></div>
                      </div>
                  </div>
                </div>
             );
        case 'industries':
            return (
                <div className="space-y-4">
                    <div className="space-y-2"><Label>{t.mainIndustriesLabel}</Label><Textarea className="min-h-[40px]" placeholder={`Ví dụ: ${placeholderEmployerData.industries.main[lang]}`} value={tempContent.main[lang] || ''} onChange={(e) => setTempContent(prev => ({...prev, main: {...prev.main, [lang]: e.target.value}}))} /></div>
                    <div className="space-y-2"><Label>{t.secondaryIndustriesLabel}</Label><Textarea className="min-h-[40px]" placeholder={`Ví dụ: ${placeholderEmployerData.industries.secondary[lang]}`} value={tempContent.secondary[lang] || ''} onChange={(e) => setTempContent(prev => ({...prev, secondary: {...prev.secondary, [lang]: e.target.value}}))} /></div>
                </div>
            );
        case 'benefits':
             return (
                <div className="space-y-4">
                     {tempContent.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input placeholder={`Ví dụ: ${placeholderEmployerData.benefits[index]?.[lang] || ''}`} value={item[lang] || ''} onChange={(e) => {
                                const newBenefits = [...tempContent];
                                newBenefits[index] = {...newBenefits[index], [lang]: e.target.value};
                                setTempContent(newBenefits);
                            }} />
                             <Button variant="ghost" size="icon" onClick={() => removeTempArrayItem(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => addTempArrayItem('benefits')}><PlusCircle className="mr-2"/> Thêm phúc lợi</Button>
                </div>
             );
        case 'valueInterest':
             return (
                <div className="space-y-4">
                     {tempContent.split('\n').map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input placeholder={`Ví dụ: Ứng viên chất lượng`} value={item} onChange={(e) => {
                                const newValues = tempContent.split('\n');
                                newValues[index] = e.target.value;
                                setTempContent(newValues.join('\n'));
                            }} />
                             <Button variant="ghost" size="icon" onClick={() => {
                                 const newValues = tempContent.split('\n').filter((_:any, i:number) => i !== index);
                                 setTempContent(newValues.join('\n'));
                             }}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => setTempContent(tempContent + '\n')}><PlusCircle className="mr-2"/> Thêm giá trị</Button>
                </div>
             );
        case 'visa':
            return (
                <div className="space-y-4">
                    <div className="space-y-2"><Label>{t.visaTypeLabel}</Label><Input placeholder={placeholderEmployerData.visaType[lang]} value={tempContent.visaType[lang] || ''} onChange={(e) => setTempContent({...tempContent, visaType: {...tempContent.visaType, [lang]: e.target.value}})} /></div>
                    <div className="space-y-2"><Label>{t.visaDetailLabel}</Label><Textarea className="min-h-[60px]" placeholder={placeholderEmployerData.visaDetail[lang]} value={tempContent.visaDetail[lang] || ''} onChange={(e) => setTempContent({...tempContent, visaDetail: {...tempContent.visaDetail, [lang]: e.target.value}})} /></div>
                </div>
            );
        default:
            return <p>Chức năng này đang được phát triển.</p>;
    }
  };

  const hasContactInfo = employer.info.phone || employer.info.zalo || employer.info.messenger || employer.info.line || employer.info.email;

  const formatDisplayPhoneNumber = (phone: string) => {
      if (!phone) return '';
      // A simplified version for display only
      if (phone.length === 10 && phone.startsWith('0')) {
          return `${phone.slice(0,4)} ${phone.slice(4,7)} ${phone.slice(7)}`;
      }
      if (phone.length === 11 && phone.startsWith('0')) {
           return `${phone.slice(0,3)} ${phone.slice(3,7)} ${phone.slice(7)}`;
      }
      return phone;
  }

  return (
    <>
      <div className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <Card className="shadow-2xl overflow-hidden mb-8">
              <CardHeader className="p-0 relative">
                <div className="relative w-full h-48 md:h-64">
                  <Image src={employer.banner} alt={`${employer.name[lang] || ''} banner`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                  <Label htmlFor="banner-upload" className="absolute top-4 right-4 z-10 cursor-pointer">
                     <Button variant="secondary" size="sm" asChild>
                       <span><Camera className="mr-2 h-4 w-4" /> {t.edit}</span>
                     </Button>
                     <Input id="banner-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                  </Label>
                </div>
                <div className="p-6 bg-card">
                  <div className="flex flex-col md:flex-row gap-6 items-start -mt-24 md:-mt-20 relative">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-card bg-card shadow-lg">
                            <AvatarImage src={employer.logo} />
                            <AvatarFallback>{(employer.name[lang] || 'A').charAt(0)}</AvatarFallback>
                          </Avatar>
                           <Label htmlFor="logo-upload" className="absolute bottom-1 right-1 cursor-pointer bg-secondary p-2 rounded-full border-2 border-card">
                              <Camera className="h-4 w-4 text-secondary-foreground" />
                           </Label>
                           <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                      </div>
                      <div className="flex-grow pt-16 md:pt-20">
                          <h1 className="text-2xl md:text-3xl font-headline font-bold">{employer.name[lang] || `[${t.namePlaceholder}]`}</h1>
                          <p className="font-semibold text-primary">{roleText}</p>
                          <p className="text-sm text-muted-foreground">{employer.location[lang] || `[${t.locationPlaceholder}]`}</p>
                      </div>
                      <div className="absolute top-0 right-0 md:pt-20">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(t.headerTitle, { name: employer.name, type: employer.type, location: employer.location }, 'header')}><Edit className="h-5 w-5"/></Button>
                      </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                  <SectionCard title={t.aboutTitle} icon={FileText} onEditClick={() => handleEditClick(t.aboutTitle, employer.about, 'about')}>
                       <p className="text-muted-foreground whitespace-pre-line">{employer.about[lang] || <button className="underline text-primary" onClick={() => handleEditClick(t.aboutTitle, employer.about, 'about')}>{`${t.notUpdated}, ${t.clickToUpdate}`}</button>}</p>
                  </SectionCard>
                   <SectionCard title={t.valueInterestTitle} icon={CheckCircle} onEditClick={() => handleEditClick(t.valueInterestTitle, employer.valueInterest.map((i: any) => i.vi).join('\n'), 'valueInterest')}>
                    {employer.valueInterest?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {employer.valueInterest.map((item: any, index: number) => (
                                <Badge key={index} variant="secondary">{item[lang]}</Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="italic text-muted-foreground">{t.notUpdated}, <button className="underline text-primary" onClick={() => handleEditClick(t.valueInterestTitle, '', 'valueInterest')}>{t.clickToUpdate}</button>.</p>
                    )}
                  </SectionCard>
                  <SectionCard title={t.historyTitle} icon={History} onEditClick={() => handleEditClick(t.historyTitle, employer.history, 'history')}>
                       <ul className="space-y-4">
                          {employer.history.length > 0 ? employer.history.map((item: any, index: number) => (
                              <li key={index} className="relative pl-6">
                                  <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary" />
                                  <p className="font-bold text-primary mb-1">{item.year}</p>
                                  <p className="text-sm text-muted-foreground">{item.event[lang]}</p>
                              </li>
                          )) : <p className="italic text-muted-foreground">{t.notUpdated}, <button className="underline text-primary" onClick={() => handleEditClick(t.historyTitle, employer.history, 'history')}>{t.clickToUpdate}</button>.</p>}
                      </ul>
                  </SectionCard>
                  <SectionCard title={t.imagesTitle} icon={ImageIcon} onEditClick={() => handleEditClick(t.imagesTitle, employer.images, 'images')}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {employer.images.map((img: any, index: number) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                  <Image src={img.src} alt={img.alt[lang] || ''} fill className="object-cover" />
                                   <Label htmlFor={`image-upload-${index}`} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="h-6 w-6 text-white"/>
                                   </Label>
                                   <Input id={`image-upload-${index}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'images', index)} />
                                   <Button variant="destructive" size="icon" className="absolute bottom-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleDeleteImage(index); }}>
                                        <Trash2 className="h-3 w-3"/>
                                   </Button>
                              </div>
                          ))}
                      </div>
                  </SectionCard>
                  <SectionCard title={t.benefitsTitle} icon={Award} onEditClick={() => handleEditClick(t.benefitsTitle, employer.benefits, 'benefits')}>
                      <ul className="space-y-2 text-sm">
                          {employer.benefits.length > 0 ? employer.benefits.map((benefit: any, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>{benefit[lang]}</span>
                              </li>
                          )) : <p className="italic text-muted-foreground">{t.notUpdated}, <button className="underline text-primary" onClick={() => handleEditClick(t.benefitsTitle, employer.benefits, 'benefits')}>{t.clickToUpdate}</button>.</p>}
                      </ul>
                  </SectionCard>
              </div>
              
                {/* Right Column (order-first on desktop) */}
              <div className="lg:col-start-3 lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                  <SectionCard title={t.infoTitle} icon={Building} onEditClick={() => handleEditClick(t.infoTitle, employer.info, 'info')}>
                      <div className="space-y-3 text-sm">
                          <p><strong>{t.foundedLabel}:</strong> {employer.info.founded || '...'}</p>
                          <p><strong>{t.sizeLabel}:</strong> {employer.info.size[lang] || '...'}</p>
                          <p><strong>{t.licenseLabel}:</strong> {employer.info.license || '...'}</p>
                          <p><strong>{t.websiteLabel}:</strong> <a href={employer.info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{employer.info.website || '...'}</a></p>
                      </div>
                      {hasContactInfo ? (
                          <div id="HIENTHILIENHE04" className="mt-6 border-t pt-4 space-y-2">
                             {employer.info.email && <Button asChild variant="outline" className="w-full justify-start"><Link href={`mailto:${employer.info.email}`}><Mail className="mr-2 h-4 w-4"/>{employer.info.email}</Link></Button>}
                             {employer.info.phone && <Button asChild variant="outline" className="w-full justify-start"><Link href={`tel:${employer.info.phone}`}><Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="mr-2 h-4 w-4" />{formatDisplayPhoneNumber(employer.info.phone)}</Link></Button>}
                             {employer.info.messenger && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://m.me/${employer.info.messenger}`} target="_blank" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://facebook.com/${employer.info.messenger}`}</span></Link></Button>}
                             {employer.info.zalo && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://zalo.me/${employer.info.zalo}`} target="_blank"><ZaloIcon className="mr-2 h-4 w-4"/>{formatDisplayPhoneNumber(employer.info.zalo)}</Link></Button>}
                             {employer.info.line && <Button asChild variant="outline" className="w-full justify-start"><Link href={`https://line.me/ti/p/~${employer.info.line}`} target="_blank" className="flex items-center gap-2"><LineIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://line.me/ti/p/~${employer.info.line}`}</span></Link></Button>}
                          </div>
                      ) : (
                          <div id="HIENTHILIENHE03" className="mt-6 border-t pt-4">
                            <div className="flex justify-center gap-4 mb-3 text-muted-foreground">
                                <Image src="/img/phone.svg" alt="Phone" width={24} height={24} />
                                <ZaloIcon className="h-6 w-6" />
                                <MessengerIcon className="h-6 w-6" />
                                <LineIcon className="h-6 w-6" />
                            </div>
                            <div className="text-center text-sm">
                               <div className="text-muted-foreground">{t.registerCTA} <Badge className="mx-1 bg-accent-orange text-white align-middle px-1.5 py-0.5 text-xs">{t.registerAction}</Badge></div>
                            </div>
                          </div>
                      )}
                  </SectionCard>
                  <SectionCard title={t.visaTitle} icon={FileSignature} onEditClick={() => handleEditClick(t.visaTitle, { visaType: employer.visaType, visaDetail: employer.visaDetail }, 'visa')}>
                      <div className="space-y-3 text-sm">
                          <p><strong>{t.visaTypeLabel}:</strong> {employer.visaType[lang] || '...'}</p>
                          <p><strong>{t.visaDetailLabel}:</strong> {employer.visaDetail[lang] || '...'}</p>
                      </div>
                  </SectionCard>
                  <SectionCard title={t.industriesTitle} icon={Briefcase} onEditClick={() => handleEditClick(t.industriesTitle, employer.industries, 'industries')}>
                     <div className="space-y-3 text-sm">
                          <p><strong>{t.mainIndustriesLabel}:</strong> {employer.industries.main[lang] || '...'}</p>
                          <p><strong>{t.secondaryIndustriesLabel}:</strong> {employer.industries.secondary[lang] || '...'}</p>
                      </div>
                  </SectionCard>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingModule?.title}</DialogTitle>
             <Tabs defaultValue={lang} onValueChange={(value) => setLang(value as Language)} className="pt-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="vi" className="flex items-center gap-2"><VnFlagIcon /> Tiếng Việt</TabsTrigger>
                    <TabsTrigger value="ja" className="flex items-center gap-2"><JpFlagIcon /> 日本語</TabsTrigger>
                    <TabsTrigger value="en" className="flex items-center gap-2"><EnFlagIcon /> English</TabsTrigger>
                </TabsList>
            </Tabs>
          </DialogHeader>
           <div className="py-4 max-h-[60vh] overflow-y-auto pr-4">
              {renderEditContent()}
           </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
            </DialogClose>
             {(editingModule) && (
                <Button onClick={handleSaveChanges}>Lưu thay đổi</Button>
             )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
