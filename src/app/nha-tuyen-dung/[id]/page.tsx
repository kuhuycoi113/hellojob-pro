
'use client';

import { useState, use, useEffect } from 'react';
import { notFound, useSearchParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, History, FileText, Briefcase, Award, Edit, Camera, Info, PlusCircle, Trash2, ImageIcon, Phone, MessageSquare, Mail, QrCode, CheckCircle } from 'lucide-react';
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
        location: {
            vi: 'Hà Nội, Việt Nam',
            ja: 'ベトナム、ハノイ',
            en: 'Hanoi, Vietnam'
        },
        logo: '/img/favi2.png',
        banner: 'https://picsum.photos/seed/company-banner/1200/400',
        
        about: {
            vi: 'Công ty phái cử ABC là một trong những đơn vị hàng đầu trong lĩnh vực cung ứng nhân lực cho thị trường Nhật Bản. Với nhiều năm kinh nghiệm, chúng tôi tự hào đã chắp cánh cho hàng ngàn ước mơ của người lao động Việt Nam...',
            ja: 'ABC株式会社は、日本市場への人材供給分野におけるリーディングカンパニーの一つです。...',
            en: 'ABC Corporation is a leading company in supplying labor to the Japanese market. ...'
        },
        
        images: [
            { src: 'https://placehold.co/600x400.png?text=Ảnh+mới', alt: { vi: 'Văn phòng làm việc', ja: 'オフィス', en: 'Office Space' }, dataAiHint: 'modern office interior' },
            { src: 'https://placehold.co/600x400.png?text=Ảnh+mới', alt: { vi: 'Hoạt động đội nhóm', ja: 'チーム活動', en: 'Team Activity' }, dataAiHint: 'team building activity' },
            { src: 'https://placehold.co/600x400.png?text=Ảnh+mới', alt: { vi: 'Lễ ký kết hợp tác', ja: 'パートナーシップ調印式', en: 'Partnership Signing Ceremony' }, dataAiHint: 'partnership signing ceremony' },
            { src: 'https://placehold.co/600x400.png?text=Ảnh+mới', alt: { vi: 'Đào tạo nhân viên', ja: '従業員研修', en: 'Employee Training' }, dataAiHint: 'employee training session' },
        ],

        history: [
            { year: '2010', event: { vi: 'Thành lập công ty cổ phần ABC.', ja: 'ABC株式会社設立。', en: 'Established ABC Corporation.' } },
            { year: '2015', event: { vi: 'Nhận giấy phép hoạt động dịch vụ đưa người lao động Việt Nam đi làm việc ở nước ngoài.', ja: 'ベトナム人労働者を海外に派遣するサービス活動許可を取得。', en: 'Received license to operate services for sending Vietnamese workers abroad.' } },
        ],

        info: {
            founded: '2010',
            size: { vi: '50 - 100 nhân viên', ja: '50～100名', en: '50 - 100 employees' },
            website: 'https://abc-corp.co.jp',
            license: 'Số 123/LĐTBXH-GP',
            phone: '',
            zalo: '',
            messenger: '',
            line: '',
            email: ''
        },

        industries: {
            main: { vi: 'Xây dựng, Cơ khí, Nông nghiệp, Thực phẩm', ja: '建設、機械、農業、食品', en: 'Construction, Machinery, Agriculture, Food' },
            secondary: { vi: 'Điều dưỡng, Dệt may, Điện tử', ja: '介護、繊維、電子', en: 'Nursing, Textile, Electronics' },
        },

        benefits: [
            { vi: 'Hỗ trợ đào tạo tiếng Nhật và kỹ năng chuyên môn trước khi bay.', ja: '渡航前の日本語・専門スキル研修をサポート。', en: 'Support for Japanese language and professional skills training before departure.' },
            { vi: 'Cam kết chi phí minh bạch, rõ ràng, không phát sinh chi phí ẩn.', ja: '透明性の高い明確な費用、隠れたコストなしを約束。', en: 'Commitment to transparent, clear costs with no hidden fees.' },
        ]
    },
};

const placeholderEmployerData = {
    ...employersData['Z000'],
    images: [
        { alt: { vi: 'Văn phòng làm việc', ja: 'オフィス', en: 'Office Space' } },
        { alt: { vi: 'Hoạt động đội nhóm', ja: 'チーム活動', en: 'Team Activity' } },
        { alt: { vi: 'Lễ ký kết hợp tác', ja: 'パートナーシップ調印式', en: 'Partnership Signing Ceremony' } },
        { alt: { vi: 'Đào tạo nhân viên', ja: '従業員研修', en: 'Employee Training' } },
    ],
    history: [
        { event: { vi: 'Thành lập công ty.', ja: '会社設立。', en: 'Company established.' } },
        { event: { vi: 'Đạt mốc 1000 lao động được phái cử.', ja: '派遣労働者1000人達成。', en: 'Reached 1000 dispatched workers.' } },
    ],
    info: {
        founded: '2010',
        size: { vi: '50 - 100 nhân viên', ja: '50～100名', en: '50 - 100 employees' },
        license: '123/LĐTBXH-GP',
    },
    industries: {
        main: { vi: 'Xây dựng, Cơ khí', ja: '建設、機械', en: 'Construction, Machinery' },
        secondary: { vi: 'Thực phẩm, Nông nghiệp', ja: '食品、農業', en: 'Food, Agriculture' },
    },
    benefits: [
        { vi: 'Hỗ trợ đào tạo tiếng Nhật.', ja: '日本語研修をサポート。', en: 'Japanese language training support.' },
    ]
};


// Initial empty state for the form
const emptyEmployerData = {
    id: 'Z000',
    name: { vi: '', ja: '', en: '' },
    type: { vi: '', ja: '', en: '' },
    location: { vi: '', ja: '', en: '' },
    logo: '/img/favi2.png',
    banner: 'https://placehold.co/1200x400.png?text=Tải+lên+ảnh+bìa',
    about: { vi: '', ja: '', en: '' },
    images: [
      { src: 'https://placehold.co/600x400.png?text=Ảnh+mới', alt: { vi: '', ja: '', en: '' }, dataAiHint: 'new image 1' },
      { src: 'https://placehold.co/600x400.png?text=Ảnh+mới', alt: { vi: '', ja: '', en: '' }, dataAiHint: 'new image 2' },
      { src: 'https://placehold.co/600x400.png?text=Ảnh+mới', alt: { vi: '', ja: '', en: '' }, dataAiHint: 'new image 3' },
      { src: 'https://placehold.co/600x400.png?text=Ảnh+mới', alt: { vi: '', ja: '', en: '' }, dataAiHint: 'new image 4' },
    ],
    history: [],
    info: { founded: '', size: { vi: '', ja: '', en: '' }, website: '', license: '', phone: '', zalo: '', messenger: '', line: '', email: '' },
    industries: { main: { vi: '', ja: '', en: '' }, secondary: { vi: '', ja: '', en: '' } },
    benefits: []
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
        industriesTitle: 'Ngành nghề & Lĩnh vực',
        mainIndustriesLabel: 'Ngành nghề chính',
        secondaryIndustriesLabel: 'Ngành nghề khác',
        benefitsTitle: 'Phúc lợi & Môi trường',
        contactTitle: 'Thông tin liên hệ',
        registerCTA: 'Cung cấp ít nhất 1 phương thức liên hệ để',
        registerAction: 'Đăng ký',
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
        contactTitle: '連絡先情報',
        registerCTA: '登録するには、少なくとも1つの連絡方法を提供してください',
        registerAction: '登録',
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
        contactTitle: 'Contact Information',
        registerCTA: 'Provide at least 1 contact method to',
        registerAction: 'Register',
    }
};

type Language = keyof typeof contentByLang;

const roleTexts: Record<string, Record<Language, string>> = {
  haken_staff: { vi: 'Nhân viên phái cử', ja: '送り出し機関の社員', en: 'Sending Company Staff' },
  jp_hr_staff: { vi: 'Nhân viên Nhân lực Nhật', ja: '日本人材法人の社員', en: 'Japan-side HR Staff' },
  dispatch: { vi: 'Công ty phái cử', ja: '送り出し機関', en: 'Sending Company' },
  support: { vi: 'Cơ quan hỗ trợ (Shien Kikan)', ja: '支援機関', en: 'Support Organization' },
  enterprise: { vi: 'Xí nghiệp tiếp nhận', ja: '受け入れ企業', en: 'Accepting Company' },
  union: { vi: 'Nghiệp đoàn (Kumiai)', ja: '監理団体 (組合)', en: 'Supervising Organization' },
  shokai: { vi: 'Công ty giới thiệu có phí', ja: '有料職業紹介事業所', en: 'Paid Placement Agency' },
  haken: { vi: 'Công ty Haken', ja: '派遣会社', en: 'Staffing Agency' },
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


export default function EmployerDetailPage({ params: paramsProp }: { params: { id: string } }) {
  const params = use(paramsProp);
  const searchParams = useSearchParams();
  const id = params.id;

  const employerData = employersData[id];
  
  const [lang, setLang] = useState<Language>('vi');
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    if (!employerData) {
        notFound();
    }
    const langFromParams = (searchParams.get('lang') || 'vi') as Language;
    setLang(langFromParams);
    
    const roleFromParams = searchParams.get('role');
    setRole(roleFromParams);
  }, [id, employerData, searchParams]);

  if (!employerData) {
    // This will be caught by the useEffect above, but as a safeguard:
    return null;
  }
  
  const [employer, setEmployer] = useState({ ...employerData });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<{title: string, field: string } | null>(null);
  const [tempContent, setTempContent] = useState<any>('');
  const [phoneCountry, setPhoneCountry] = useState('+84');
  const [zaloCountry, setZaloCountry] = useState('+84');
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ email?: string; messenger?: string, line?: string }>({});
  
  const t = contentByLang[lang] || contentByLang['vi'];
  const roleText = role && roleTexts[role] ? roleTexts[role][lang] : employer.type[lang];

  const validateField = (field: 'messenger' | 'line' | 'email', value: string) => {
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
    } else if (field === 'email') {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        errorMessage = "Vui lòng nhập địa chỉ email hợp lệ.";
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
    
    // Validate all fields before saving
    let allValid = true;
    if (editingModule.field === 'info') {
        if (!validateField('email', tempContent.email || '')) allValid = false;
        if (!validateField('messenger', tempContent.messenger || '')) allValid = false;
        if (!validateField('line', tempContent.line || '')) allValid = false;
    }

    if (!allValid) {
        toast({ variant: 'destructive', title: 'Thông tin không hợp lệ', description: 'Vui lòng sửa các lỗi được hiển thị trước khi lưu.' });
        return;
    }

    setEmployer(prev => {
        const newState = { ...prev };
        const { field } = editingModule;
        if (field === 'header') {
            newState.name = tempContent.name;
            newState.type = tempContent.type;
            newState.location = tempContent.location;
        } else {
            // @ts-ignore
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
       setTempContent((prev: any[]) => [...prev, { src: 'https://placehold.co/600x400.png?text=Ảnh+mới', alt: { vi: '', ja: '', en: '' }, dataAiHint: 'new image' }]);
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
            setEmployer(prev => {
                const newState = JSON.parse(JSON.stringify(prev));
                 if (field === 'banner' || field === 'logo') {
                   newState[field] = newUrl;
                 }
                return newState;
            });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const renderEditContent = () => {
    if (!editingModule) return <p>Chức năng đang được phát triển.</p>;

    switch(editingModule.field) {
        case 'header':
            return (
                 <div className="space-y-4">
                    <div className="space-y-2"><Label>Tên công ty</Label><Input placeholder={t.namePlaceholder} value={tempContent.name[lang] || ''} onChange={(e) => setTempContent({...tempContent, name: {...tempContent.name, [lang]: e.target.value}})} /></div>
                    <div className="space-y-2"><Label>Loại hình</Label><Input placeholder={t.typePlaceholder} value={tempContent.type[lang] || ''} onChange={(e) => setTempContent({...tempContent, type: {...tempContent.type, [lang]: e.target.value}})} /></div>
                    <div className="space-y-2"><Label>Địa điểm</Label><Input placeholder={t.locationPlaceholder} value={tempContent.location[lang] || ''} onChange={(e) => setTempContent({...tempContent, location: {...tempContent.location, [lang]: e.target.value}})} /></div>
                </div>
            );
        case 'about':
            return <Textarea className="min-h-[150px]" placeholder={`Ví dụ: ${placeholderEmployerData.about[lang]}`} value={tempContent[lang] || ''} onChange={(e) => setTempContent({...tempContent, [lang]: e.target.value})} rows={8} />;
        
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
                            <Input placeholder={`Ví dụ: ${placeholderEmployerData.history[index]?.event[lang] || ''}`} value={item.event[lang] || ''} onChange={(e) => handleTempArrayChange(index, 'event', e.target.value)} />
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
                                onBlur={(e) => validateField('email', e.target.value)}
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
                       <p className="text-muted-foreground whitespace-pre-line">{employer.about[lang] || <>{t.notUpdated}, <button className="underline text-primary" onClick={() => handleEditClick(t.aboutTitle, employer.about, 'about')}>{t.clickToUpdate}</button>.</>}</p>
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
                              </div>
                          ))}
                      </div>
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
              </div>
              
              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
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
                  <SectionCard title={t.industriesTitle} icon={Briefcase} onEditClick={() => handleEditClick(t.industriesTitle, employer.industries, 'industries')}>
                     <div className="space-y-3 text-sm">
                          <p><strong>{t.mainIndustriesLabel}:</strong> {employer.industries.main[lang] || '...'}</p>
                          <p><strong>{t.secondaryIndustriesLabel}:</strong> {employer.industries.secondary[lang] || '...'}</p>
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
                  <Button size="lg" className="w-full" onClick={() => console.log("Saving data:", employer)}>Lưu thay đổi</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingModule?.title}</DialogTitle>
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
