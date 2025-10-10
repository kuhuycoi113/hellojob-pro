
'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { notFound, useSearchParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, History, FileText, Briefcase, Award, Edit, Camera, Info, PlusCircle, Trash2, ImageIcon, Phone, MessageSquare, Mail, QrCode, CheckCircle, FileSignature, HardHat, UserCheck, Globe, Users2, FastForward, ListChecks, GraduationCap, Users, UserSquare, UserCog, UserPlus, Handshake, Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn, parseMessengerInput, parseZaloInput, parseLineInput, formatPhoneNumberInput } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JpFlagIcon, EnFlagIcon, VnFlagIcon, ZaloIcon, MessengerIcon, LineIcon } from '@/components/custom-icons';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from '@/components/ui/checkbox';
import { Industry, allIndustries, industriesByJobType } from '@/lib/industry-data';
import { japanJobTypes, visaDetailsByVisaType } from '@/lib/visa-data';
import { japanRegions } from '@/lib/location-data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


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
            vi: ['thuc-tap-sinh-ky-nang', 'ky-nang-dac-dinh'],
            ja: ['thuc-tap-sinh-ky-nang', 'ky-nang-dac-dinh'],
            en: ['thuc-tap-sinh-ky-nang', 'ky-nang-dac-dinh']
        },
        visaDetail: {
            vi: ['thuc-tap-sinh-3-nam', 'dac-dinh-thuc-pham', 'dac-dinh-xay-dung'],
            ja: ['thuc-tap-sinh-3-nam', 'dac-dinh-thuc-pham', 'dac-dinh-xay-dung'],
            en: ['thuc-tap-sinh-3-nam', 'dac-dinh-thuc-pham', 'dac-dinh-xay-dung']
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
            main: { vi: [], ja: [], en: [] },
            secondary: { vi: [], ja: [], en: [] },
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
        { year: '2023', event: { vi: 'Nhận giải thưởng "Công ty phái cử uy tín của năm".', ja: '「今年の信頼できる派遣会社」賞を受賞。', en: 'Reputable Dispatch Company of the Year award.' } }
    ],
    info: {
        founded: '2010',
        size: { vi: '50 - 100 nhân viên', ja: '50～100名', en: '50 - 100 employees' },
        license: 'Số 123/LĐTBXH-GP',
        website: 'https://abc-corp.co.jp',
    },
    industries: {
        main: { vi: ['xay-dung', 'co-khi-che-tao-may-tokutei'], ja: ['xay-dung', 'co-khi-che-tao-may-tokutei'], en: ['xay-dung', 'co-khi-che-tao-may-tokutei'] },
        secondary: { vi: ['kanto'], ja: ['kanto'], en: ['kanto'] },
    },
    benefits: [
        { vi: 'Môi trường làm việc chuyên nghiệp, thân thiện.', ja: 'プロフェッショナルでフレンドリーな職場環境。', en: 'Professional and friendly working environment.' },
        { vi: 'Chế độ đãi ngộ, phúc lợi cạnh tranh.', ja: '競争力のある報酬と福利厚生制度。', en: 'Competitive salary and benefits package.' },
        { vi: 'Nhiều cơ hội đào tạo và phát triển sự nghiệp.', ja: '多くのトレーニングとキャリア開発の機会。', en: 'Many opportunities for training and career development.' },
        { vi: 'Hỗ trợ toàn diện cho người lao động tại Nhật Bản.', ja: '日本での労働者に対する包括的なサポート。', en: 'Comprehensive support for workers in Japan.' },
    ],
    valueInterest: [
        { id: 'ung-vien-chat-luong', vi: 'Ứng viên chất lượng', ja: '質の高い候補者', en: 'Quality Candidates' },
        { id: 'chi-phi-thap', vi: 'Chi phí tuyển dụng thấp nhất', ja: '最低の採用コスト', en: 'Lowest Recruitment Cost' },
    ],
};



// Initial empty state for the form
const emptyEmployerData = {
    id: 'Z000',
    name: { vi: '', ja: '', en: '' },
    type: { vi: '', ja: '', en: '' },
    visaType: { vi: [], ja: [], en: [] }, // Changed to array
    visaDetail: { vi: [], ja: [], en: [] }, // Changed to array
    industries: { main: { vi: [], ja: [], en: [] }, secondary: { vi: [], ja: [], en: [] } },
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
    benefits: [],
    valueInterest: [],
    interest: { vi: [], ja: [], en: [] }, // Add new field for Y003
};


type Language = 'vi' | 'ja' | 'en';

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
        messengerPlaceholder: 'Ví dụ: Nguyễn Văn An',
        companyNamePlaceholder: 'Ví dụ: Công ty Cổ phần ABC',
        typePlaceholder: '[Loại hình/Vai trò/Chức danh...]',
        locationPlaceholder: 'Ví dụ: Hà Nội, Việt Nam',
        industriesTitle: 'Ngành nghề & Khu vực',
        mainIndustriesLabel: 'Ngành nghề tuyển dụng chính',
        secondaryIndustriesLabel: 'Khu vực tuyển dụng chính',
        benefitsTitle: 'Phúc lợi & Môi trường',
        valueInterestTitle: 'Nghiệp vụ, giá trị quan tâm',
        interestLabel: "Nghiệp vụ quan tâm",
        valueInterestLabel: "Giá trị quan tâm",
        contactTitle: 'Thông tin liên hệ',
        registerCTA: 'Cung cấp ít nhất 1 phương thức liên hệ để',
        registerAction: 'Đăng ký',
        visaTitle: 'Loại hình và Visa',
        visaTypeLabel: 'Loại hình',
        visaDetailLabel: 'Chi tiết loại hình visa',
        messengerHelper: 'Hệ thống sẽ tự động lấy username của bạn.',
        lineLabel: 'Line',
        linePlaceholder: 'Dán link Line hoặc nhập ID của bạn',
        lineHelper: 'Hệ thống sẽ tự động lấy username của bạn.',
        notUpdated: '[Chưa có thông tin]',
        clickToUpdate: 'Nhấn để cập nhật',
        headerTitle: 'Thông tin chung',
        namePlaceholder: 'Ví dụ: Nguyễn Văn An',
        rolePlaceholder: '[Loại hình/Vai trò/Chức danh...]',
        continueButton: 'Lưu và tiếp tục',
        backButton: 'Quay lại',

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
        notUpdated: '[情報がありません]',
        clickToUpdate: 'クリックして更新',
        headerTitle: '一般情報',
        namePlaceholder: '例: グエン・ヴァン・アン',
        companyNamePlaceholder: '例: ABC株式会社',
        typePlaceholder: '[種別/役割/役職...]',
        locationPlaceholder: '例: ベトナム、ハノイ',
        industriesTitle: '業種と分野',
        mainIndustriesLabel: '主要業種',
        secondaryIndustriesLabel: '主な採用地域',
        benefitsTitle: '福利厚生と環境',
        valueInterestTitle: '業務、価値観',
        interestLabel: "関心のある業務",
        valueInterestLabel: "関心のある価値",
        contactTitle: '連絡先情報',
        registerCTA: '登録するには、少なくとも1つの連絡方法を提供してください',
        registerAction: '登録',
        visaTitle: '種別とビザ',
        visaTypeLabel: '種別',
        visaDetailLabel: 'ビザ詳細',
        rolePlaceholder: '[種別/役割/役職...]',
        continueButton: '保存して続行',
        backButton: '戻る',
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
        notUpdated: '[Not available]',
        clickToUpdate: 'Click to update',
        headerTitle: 'General Information',
        namePlaceholder: 'E.g., An Nguyen Van',
        companyNamePlaceholder: 'E.g., ABC Corporation',
        typePlaceholder: '[Type/Role/Title...]',
        locationPlaceholder: 'E.g., Hanoi, Vietnam',
        industriesTitle: 'Industries & Sectors',
        mainIndustriesLabel: 'Main Industries',
        secondaryIndustriesLabel: 'Main Recruitment Areas',
        benefitsTitle: 'Benefits & Environment',
        valueInterestTitle: 'Operations & Values',
        interestLabel: "Operations of Interest",
        valueInterestLabel: "Desired Values",
        contactTitle: 'Contact Information',
        registerCTA: 'Provide at least 1 contact method to',
        registerAction: 'Register',
        visaTitle: 'Type and Visa',
        visaTypeLabel: 'Type',
        visaDetailLabel: 'Visa Details',
        rolePlaceholder: '[Type/Role/Title...]',
        continueButton: 'Save and Continue',
        backButton: 'Back',
    }
};

const interestOptions = {
    vi: [
        { id: 'post-job', title: 'Đăng việc làm để tìm ứng viên' },
        { id: 'refer-candidate', title: 'Tìm kiếm đối tác nhân lực phù hợp' },
        { id: 'post-and-refer', title: 'Hợp tác quảng bá hệ thống đến ứng viên' },
        { id: 'refer-and-post', title: 'Hợp tác quảng bá hệ thống đến nhà tuyển dụng' },
    ],
    ja: [
        { id: 'post-job', title: '候補者を見つけるために求人を掲載する' },
        { id: 'refer-candidate', title: '適切な人材パートナーを探す' },
        { id: 'post-and-refer', title: '候補者へのシステム広報協力' },
        { id: 'refer-and-post', title: '採用担当者へのシステム広報協力' },
    ],
    en: [
        { id: 'post-job', title: 'Post jobs to find candidates' },
        { id: 'refer-candidate', title: 'Find suitable HR partners' },
        { id: 'post-and-refer', title: 'Collaborate to promote the system to candidates' },
        { id: 'refer-and-post', title: 'Collaborate to promote the system to employers' },
    ]
};

const valueInterestOptions = {
    vi: [
      { id: 'ung-vien-nhieu-nhanh', title: 'Ứng viên nhiều và nhanh nhất' },
      { id: 'ung-vien-chat-luong', title: 'Ứng viên chất lượng' },
      { id: 'viec-lam-ro-rang', title: 'Việc làm rõ ràng và chất lượng' },
      { id: 'chi-phi-thap', title: 'Chi phí tuyển dụng thấp nhất' },
      { id: 'loi-nhuan-cao', title: 'Lợi nhuận cao nhất' },
      { id: 'quan-ly-ho-tro', title: 'Dịch vụ quản lý hỗ trợ tốt nhất' },
      { id: 'cham-soc-khach-hang', title: 'Dịch vụ chăm sóc khách hàng tốt nhất' },
    ],
    ja: [
      { id: 'ung-vien-nhieu-nhanh', title: '最も多く、最も速い候補者' },
      { id: 'ung-vien-chat-luong', title: '質の高い候補者' },
      { id: 'viec-lam-ro-rang', title: '明確で質の高い求人' },
      { id: 'chi-phi-thap', title: '最低の採用コスト' },
      { id: 'loi-nhuan-cao', title: '最高の利益' },
      { id: 'quan-ly-ho-tro', title: '最高の管理サポートサービス' },
      { id: 'cham-soc-khach-hang', title: '最高の顧客ケアサービス' },
    ],
    en: [
      { id: 'ung-vien-nhieu-nhanh', title: 'Most & Fastest Candidates' },
      { id: 'ung-vien-chat-luong', title: 'Quality Candidates' },
      { id: 'viec-lam-ro-rang', title: 'Clear & Quality Jobs' },
      { id: 'chi-phi-thap', title: 'Lowest Recruitment Cost' },
      { id: 'loi-nhuan-cao', title: 'Highest Profit' },
      { id: 'quan-ly-ho-tro', title: 'Best Support Management Service' },
      { id: 'cham-soc-khach-hang', title: 'Best Customer Care Service' },
    ]
};



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

const subRoleTexts: Record<string, Record<Language, string>> = {
    'phu-trach-doi-ngoai': { vi: 'Phụ trách đối ngoại', ja: '渉外担当', en: 'External Relations' },
    'phu-trach-tuyen-dung': { vi: 'Phụ trách tuyển dụng', ja: '採用担当', en: 'Recruitment' },
    'vietnamese': { vi: 'Nhân sự người Việt', ja: 'ベトナム人事', en: 'Vietnamese Staff' },
    'japanese': { vi: 'Nhân sự người Nhật', ja: '日本人事', en: 'Japanese Staff' }
};

const interestTexts: Record<string, Record<Language, string>> = {
    'post-job': { vi: 'Đăng việc làm để tìm ứng viên', ja: '候補者を見つけるために求人を掲載する', en: 'Post jobs to find candidates' },
    'refer-candidate': { vi: 'Tìm kiếm đối tác nhân lực phù hợp', ja: '適切な人材パートナーを探す', en: 'Find suitable HR partners' },
    'post-and-refer': { vi: 'Hợp tác quảng bá hệ thống đến ứng viên', ja: '候補者へのシステム広報協力', en: 'Collaborate to promote the system to candidates' },
    'refer-and-post': { vi: 'Hợp tác quảng bá hệ thống đến nhà tuyển dụng', ja: '採用担当者へのシステム広報協力', en: 'Collaborate to promote the system to employers' },
};

const SectionCard = ({ title, icon: Icon, children, className, onEditClick, id, isConfirmationMode }: { title: string, icon: React.ElementType, children: React.ReactNode, className?: string, onEditClick?: () => void, id?: string, isConfirmationMode?: boolean }) => (
    <Card className={cn("shadow-lg", className)} id={id}>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-xl flex items-center gap-3">
                <Icon className="text-primary h-6 w-6"/>{title}
            </CardTitle>
            {onEditClick && !isConfirmationMode && (
              <Button variant="ghost" size="icon" onClick={onEditClick}><Edit className="h-4 w-4"/></Button>
            )}
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

export default function EmployerDetailPage({ isConfirmationMode = false }: { isConfirmationMode?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [employer, setEmployer] = React.useState<any | null>(null);
  const [lang, setLang] = React.useState<Language>('vi');
  const [isIndividual, setIsIndividual] = React.useState(false);
  const [displayName, setDisplayName] = React.useState('');
  const [roleText, setRoleText] = React.useState('');
  const [recruiterId, setRecruiterId] = React.useState('');
  
  const handleLangChange = (lang: Language) => {
    setLang(lang);
  };
  
  const handleContinue = () => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/nha-tuyen-dung/dang-ky/xac-nhan?${params.toString()}`);
  };

  const handleBack = () => {
      const params = new URLSearchParams(searchParams.toString());
      router.push(`/nha-tuyen-dung?${params.toString()}`);
  }

  const generateRecruiterId = (roleSlug: string): string => {
    const prefixes: { [key: string]: string } = {
        'nhan-vien-phai-cu': 'OKS',
        'nhan-vien-nhan-luc-nhat': 'NJS',
        'sending': 'OKK',
        'support': 'SKK',
        'company': 'UKG',
        'supervising-organization': 'KND',
        'paid-placement-agency': 'YSS',
        'haken': 'HAK'
    };
    const prefix = prefixes[roleSlug] || 'NTD';
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${month}${year}${randomPart}`;
  };

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const langFromParams = (params.get('lang') || 'vi') as Language;
    setLang(langFromParams);

    const roleParam = params.get('role');
    const subRoleParam = params.get('sub_role');
    const nationalityParam = params.get('nationality');
    const companyNameParam = params.get('company_name');
    const nameParam = params.get('name');
    const isIndividualRole = roleParam === 'nhan-vien-phai-cu' || roleParam === 'nhan-vien-nhan-luc-nhat';
    
    setRecruiterId(generateRecruiterId(roleParam || ''));
    setDisplayName(isIndividualRole ? (nameParam || '') : (companyNameParam || 'Nhà tuyển dụng mới'));
    setIsIndividual(isIndividualRole);

    const roleParts: string[] = [];
    const roleKey = roleParam || '';
    const subRoleKey = subRoleParam || '';
    const nationalityKey = nationalityParam || '';

    if (isIndividualRole) {
        if (roleKey === 'nhan-vien-phai-cu' && subRoleTexts[subRoleKey]) {
            roleParts.push(subRoleTexts[subRoleKey][langFromParams]);
            roleParts.push(roleTexts[roleKey][langFromParams]);
            if (companyNameParam) roleParts.push(companyNameParam);
        } else if (roleKey === 'nhan-vien-nhan-luc-nhat') {
            if (subRoleTexts[nationalityKey]) {
                roleParts.push(subRoleTexts[nationalityKey][langFromParams]);
            }
            if(roleTexts[subRoleKey]) {
                 roleParts.push(roleTexts[subRoleKey][langFromParams]);
            }
            if (companyNameParam) roleParts.push(companyNameParam);
        }
    } else if (!isIndividualRole && roleTexts[roleKey]) {
        roleParts.push(roleTexts[roleKey][langFromParams]);
    }
    
    let finalRoleText = roleParts.join(' - ');
    
    if (!finalRoleText) {
        finalRoleText = '[Loại hình/Vai trò/Chức danh...]';
    }
    setRoleText(finalRoleText);
    
    let employerData = JSON.parse(JSON.stringify(emptyEmployerData));

    employerData.name[langFromParams] = companyNameParam;
    
    const visaTypes = params.getAll('visa_type');
    if (visaTypes.length > 0) {
        employerData.visaType = { vi: visaTypes, ja: visaTypes, en: visaTypes };
    }
    
    const visaDetails = params.getAll('visa_detail');
    if (visaDetails.length > 0) {
        employerData.visaDetail = { vi: visaDetails, ja: visaDetails, en: visaDetails };
    }
    
    const industries = params.getAll('industry');
    if (industries.length > 0) {
        employerData.industries.main = { vi: industries, ja: industries, en: industries };
    }

    const locations = params.getAll('location');
    if (locations.length > 0) {
        employerData.industries.secondary = { vi: locations, ja: locations, en: locations };
    }
    
    const interests = params.getAll('interest');
    if (interests.length > 0) {
        employerData.interest = { vi: interests, ja: interests, en: interests };
    }
    
    const valueInterests = params.getAll('value_interest');
    if (valueInterests.length > 0) {
         employerData.valueInterest = valueInterests.map(id => {
            const viOption = valueInterestOptions['vi'].find(o => o.id === id);
            return {
                id: id,
                vi: viOption?.title,
                ja: valueInterestOptions['ja'].find(o => o.id === id)?.title,
                en: valueInterestOptions['en'].find(o => o.id === id)?.title
            }
        }).filter(Boolean);
    }

    setEmployer(employerData);

  }, [searchParams]);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingModule, setEditingModule] = React.useState<{title: string, field: string } | null>(null);
  const [tempContent, setTempContent] = React.useState<any>('');
  const [phoneCountry, setPhoneCountry] = React.useState('+84');
  const [zaloCountry, setZaloCountry] = React.useState('+84');
  const { toast } = useToast();
  const [errors, setErrors] = React.useState<{ email?: string; messenger?: string, line?: string }>({});

  const handleTempArrayMultiLangChange = React.useCallback((index: number, field: string, value: string) => {
    setTempContent((prev: any[]) => {
      const newArray = [...prev];
      newArray[index] = {
        ...newArray[index],
        [field]: {
          ...newArray[index][field],
          [lang]: value
        }
      };
      return newArray;
    });
  }, [lang]);

  if (!employer) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  const t = contentByLang[lang] || contentByLang['vi'];
  const headerName = displayName || (isIndividual ? `[${t.namePlaceholder}]` : `[${t.companyNamePlaceholder}]`);

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
             setErrors(prev => ({ ...prev, email: "Email không hợp lệ" }));
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
             newState.interest = { ...newState.interest, [lang]: tempContent.interest[lang] };
             newState.valueInterest = tempContent.valueInterest;
        } else if (field === 'industries') {
            newState.industries = tempContent;
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
                    <div className="space-y-2">
                        <Label>{isIndividual ? t.namePlaceholder : t.companyNamePlaceholder}</Label>
                        <Input placeholder={isIndividual ? t.namePlaceholder : t.companyNamePlaceholder} value={tempContent.name[lang] || ''} onChange={(e) => setTempContent({...tempContent, name: {...tempContent.name, [lang]: e.target.value}})} />
                    </div>
                    <div className="space-y-2"><Label>{t.typePlaceholder}</Label><Input placeholder={placeholderEmployerData.type[lang]} value={tempContent.type[lang] || ''} onChange={(e) => setTempContent({...tempContent, type: {...tempContent.type, [lang]: e.target.value}})} /></div>
                    <div className="space-y-2"><Label>{t.locationPlaceholder}</Label><Input placeholder={placeholderEmployerData.location[lang]} value={tempContent.location[lang] || ''} onChange={(e) => setTempContent({...tempContent, location: {...tempContent.location, [lang]: e.target.value}})} /></div>
                </div>
            );
        case 'about':
            return <Textarea id="DKGT_TEXTAREA" className="min-h-[150px]" placeholder={`Ví dụ: ${placeholderEmployerData.about[lang]}`} value={tempContent[lang] || ''} onChange={(e) => setTempContent({ ...tempContent, [lang]: e.target.value })} rows={8} />;
        
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
                            onChange={(e) => handleTempArrayMultiLangChange(index, 'alt', e.target.value)}
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
                            <Input placeholder={`Ví dụ: ${placeholderEmployerData.history[index]?.event[lang] || 'Thành lập công ty'}`} value={item.event[lang] || ''} onChange={(e) => handleTempArrayMultiLangChange(index, 'event', e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => removeTempArrayItem(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => addTempArrayItem('history')}><PlusCircle className="mr-2"/> Thêm mốc</Button>
                </div>
            );
        case 'info':
             return (
                <div id="DKTHONGTINDOANHNGHIEP_DIALOG" className="space-y-4">
                    <div id="DKDN_THONGTINCHUNG" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div id="DKDN_NAMTHANHLAP" className="space-y-2">
                            <Label htmlFor="founded">{t.foundedLabel}</Label>
                            <Input id="founded" placeholder={`Ví dụ: ${placeholderEmployerData.info.founded}`} value={tempContent.founded} onChange={(e) => setTempContent({...tempContent, founded: e.target.value})} />
                        </div>
                        <div id="DKDN_QUYMO" className="space-y-2">
                            <Label htmlFor="size">{t.sizeLabel}</Label>
                            <Input id="size" placeholder={`Ví dụ: ${placeholderEmployerData.info.size[lang]}`} value={tempContent.size[lang] || ''} onChange={(e) => setTempContent({...tempContent, size: {...tempContent.size, [lang]: e.target.value}})} />
                        </div>
                        <div id="DKDN_GIAYPHEP" className="space-y-2">
                            <Label htmlFor="license">{t.licenseLabel}</Label>
                            <Input id="license" placeholder={`Ví dụ: ${placeholderEmployerData.info.license}`} value={tempContent.license} onChange={(e) => setTempContent({...tempContent, license: e.target.value})} />
                        </div>
                        <div id="DKDN_WEBSITE" className="space-y-2">
                           <Label htmlFor="website">{t.websiteLabel}</Label>
                           <Input id="website" placeholder="https://example.com" value={tempContent.website} onChange={(e) => setTempContent({...tempContent, website: e.target.value})} />
                        </div>
                    </div>
                    
                    <div id="DKDN_THONGTINLIENHE" className="pt-4 border-t">
                      <h4 className="font-semibold mb-4">{t.contactTitle}</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-1 md:col-span-2" id="DKDN_EMAIL">
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
                                className={cn(errors?.email && "border-destructive")}
                              />
                               {errors?.email && <p className="text-xs text-destructive">{errors.email}</p>}
                           </div>
                          <div className="space-y-2" id="DKDN_SODIENTHOAI">
                              <Label htmlFor="phone" className="flex items-center gap-2">
                                <Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="h-4 w-4" />
                                {t.phoneLabel}
                              </Label>
                             <div className="flex items-center">
                                <Select value={phoneCountry} onValueChange={setPhoneCountry}>
                                    <SelectTrigger className="w-[120px] rounded-r-none"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+84">VN (+84)</SelectItem>
                                        <SelectItem value="+81">JP (+81)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="phone" type="tel" placeholder={phoneCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(tempContent.phone, phoneCountry)} onChange={(e) => setTempContent({...tempContent, phone: e.target.value.replace(/\D/g, '')})} />
                            </div>
                          </div>
                          <div className="space-y-2" id="DKDN_ZALO">
                              <Label htmlFor="zalo" className="flex items-center gap-2"><ZaloIcon className="h-4 w-4" />{t.zaloLabel}</Label>
                             <div className="flex items-center relative">
                                <Select value={zaloCountry} onValueChange={setZaloCountry}>
                                    <SelectTrigger className="w-[120px] rounded-r-none"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+84">VN (+84)</SelectItem>
                                        <SelectItem value="+81">JP (+81)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="zalo" type="tel" placeholder={zaloCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(tempContent.zalo, zaloCountry)} onChange={(e) => setTempContent({...tempContent, zalo: e.target.value.replace(/\D/g, '')})} />
                                <div onClick={() => {}} className="absolute right-2 cursor-pointer text-muted-foreground hover:text-primary">
                                    <QrCode className="h-5 w-5"/>
                                </div>
                            </div>
                          </div>
                          <div className="space-y-1" id="DKDN_MESSENGER">
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
                         <div className="space-y-1" id="DKDN_LINE">
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
            const currentInterest = tempContent.interest?.[lang] || [];
            const handleInterestChange = (checked: boolean, interestId: string) => {
                const newSelection = checked
                    ? [...currentInterest, interestId]
                    : currentInterest.filter((id: string) => id !== interestId);
                setTempContent({ ...tempContent, interest: { ...tempContent.interest, [lang]: newSelection }});
            };

            const currentValueInterests = Array.isArray(tempContent.valueInterest) ? tempContent.valueInterest.map((item: any) => item.id) : [];
            const handleValueInterestChange = (checked: boolean, interestId: string) => {
                let newSelection;
                if (checked) {
                    newSelection = [...currentValueInterests, interestId];
                } else {
                    newSelection = currentValueInterests.filter((id: string) => id !== interestId);
                }
                const newObjects = newSelection.map(id => ({
                    id,
                    vi: valueInterestOptions['vi'].find(o=>o.id===id)?.title,
                    ja: valueInterestOptions['ja'].find(o=>o.id===id)?.title,
                    en: valueInterestOptions['en'].find(o=>o.id===id)?.title,
                }));
                setTempContent({ ...tempContent, valueInterest: newObjects });
            };

            return (
                <div id="DKNGHIEPVUGIATRIQUANTAM_DIALOG" className="space-y-6">
                    <div id="DKNV_NGHIEPVU" className="space-y-2">
                        <Label className="font-semibold text-base">{t.interestLabel}</Label>
                        <p className="text-sm text-muted-foreground">Hãy cho chúng tôi biết mục tiêu chính của bạn để có trải nghiệm tốt nhất.</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10">
                                    <div className="flex flex-wrap gap-1">
                                        {currentInterest.length > 0 ? (
                                            currentInterest.map((id: string, index: number) => <Badge key={id} variant="secondary" className="font-normal"><span className="font-bold mr-1.5">{index + 1}.</span>{(interestOptions[lang].find(o => o.id === id))?.title}</Badge>)
                                        ) : `Chọn ${t.interestLabel}`}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>Chọn nghiệp vụ</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(interestOptions[lang] || []).map((option) => (
                                     <DropdownMenuCheckboxItem
                                        key={option.id}
                                        checked={currentInterest.includes(option.id)}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) => handleInterestChange(Boolean(checked), option.id)}
                                    >
                                        <span className="font-bold w-6 mr-2">{currentInterest.includes(option.id) ? `${currentInterest.indexOf(option.id) + 1}.` : ''}</span>
                                        {option.title}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div id="DKNV_GIATRI" className="space-y-2">
                        <Label className="font-semibold text-base">{t.valueInterestLabel}</Label>
                        <p className="text-sm text-muted-foreground">Điều gì là quan trọng nhất với bạn khi hợp tác?</p>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10">
                                    <div className="flex flex-wrap gap-1">
                                    {currentValueInterests.length > 0 ? (
                                        currentValueInterests.map((id: string, index: number) => <Badge key={id} variant="secondary" className="font-normal"><span className="font-bold mr-1.5">{index + 1}.</span>{(valueInterestOptions[lang].find(o => o.id === id))?.title}</Badge>)
                                    ) : `Chọn ${t.valueInterestLabel}`}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>Chọn giá trị (sắp xếp theo ưu tiên)</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {valueInterestOptions[lang].map((option) => (
                                     <DropdownMenuCheckboxItem
                                        key={option.id}
                                        checked={currentValueInterests.includes(option.id)}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) => handleValueInterestChange(Boolean(checked), option.id)}
                                    >
                                        <span className="font-bold w-6 mr-2">{currentValueInterests.includes(option.id) ? `${currentValueInterests.indexOf(option.id) + 1}.` : ''}</span>
                                        {option.title}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            );
        case 'visa':
            const currentVisaTypes = tempContent.visaType?.[lang] || [];
            const handleVisaTypeChange = (checked: boolean, typeSlug: string) => {
                const newSelection = checked
                    ? [...currentVisaTypes, typeSlug]
                    : currentVisaTypes.filter((slug: string) => slug !== typeSlug);

                const newVisaDetails = (tempContent.visaDetail?.[lang] || []).filter((detailSlug: string) => 
                    newSelection.some((visaSlug: string) => 
                        (visaDetailsByVisaType[visaSlug as keyof typeof visaDetailsByVisaType] || []).some(detail => detail.slug === detailSlug)
                    )
                );

                setTempContent({
                    visaType: { ...tempContent.visaType, [lang]: newSelection },
                    visaDetail: { ...tempContent.visaDetail, [lang]: newVisaDetails }
                });
            };

            const currentVisaDetails = tempContent.visaDetail?.[lang] || [];
            const handleDetailCheckboxChange = (checked: boolean, detailSlug: string) => {
                const newSelection = checked
                    ? [...currentVisaDetails, detailSlug]
                    : currentVisaDetails.filter((slug: string) => slug !== detailSlug);
                setTempContent({ ...tempContent, visaDetail: { ...tempContent.visaDetail, [lang]: newSelection } });
            };


            return (
                <div className="space-y-4">
                     <div className="space-y-2" id="DKY006">
                        <Label>{t.visaTypeLabel}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10">
                                    <div className="flex flex-wrap gap-1">
                                    {currentVisaTypes.length > 0 ? (
                                        currentVisaTypes.map((slug: string, index: number) => <Badge key={slug} variant="secondary"><span className="font-bold mr-1.5">{index + 1}.</span>{(japanJobTypes.find(t => t.slug === slug))?.name}</Badge>)
                                    ) : `Chọn ${t.visaTypeLabel}`}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>Chọn loại hình</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {japanJobTypes.map(type => (
                                    <DropdownMenuCheckboxItem
                                        key={type.slug}
                                        checked={currentVisaTypes.includes(type.slug)}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) => handleVisaTypeChange(Boolean(checked), type.slug)}
                                    >
                                       <span className="font-bold w-6 mr-2">{currentVisaTypes.includes(type.slug) ? `${currentVisaTypes.indexOf(type.slug) + 1}.` : ''}</span>
                                        {type.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                     <div className="space-y-2" id="DKY007">
                        <Label>{t.visaDetailLabel}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10" disabled={currentVisaTypes.length === 0}>
                                     <div className="flex flex-wrap gap-1">
                                        {currentVisaDetails.length > 0 ? (
                                            currentVisaDetails.map((slug: string, index: number) => {
                                                const detail = Object.values(visaDetailsByVisaType).flat().find(d => d.slug === slug);
                                                return <Badge key={slug} variant="secondary"><span className="font-bold mr-1.5">{index + 1}.</span>{detail?.name[lang] || slug}</Badge>
                                            })
                                        ) : `Chọn ${t.visaDetailLabel}`}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>Chọn chi tiết</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {currentVisaTypes.map((visaTypeSlug: string) => {
                                    const visaType = japanJobTypes.find(t => t.slug === visaTypeSlug);
                                    if (!visaType) return null;
                                    return (
                                        <DropdownMenuGroup key={visaTypeSlug}>
                                            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">{visaType.name}</DropdownMenuLabel>
                                            {(visaDetailsByVisaType[visaTypeSlug as keyof typeof visaDetailsByVisaType] || []).map((detail: any) => (
                                                <DropdownMenuCheckboxItem
                                                    key={detail.slug}
                                                    checked={currentVisaDetails.includes(detail.slug)}
                                                    onSelect={(e) => e.preventDefault()}
                                                    onCheckedChange={(checked) => handleDetailCheckboxChange(Boolean(checked), detail.slug)}
                                                >
                                                   <span className="font-bold w-6 mr-2">{currentVisaDetails.includes(detail.slug) ? `${currentVisaDetails.indexOf(detail.slug) + 1}.` : ''}</span>
                                                    {detail.name[lang]}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuGroup>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            );
        case 'industries':
            const currentIndustries = tempContent.main?.[lang] || [];
            const handleIndustryChange = (checked: boolean, industrySlug: string) => {
                const newSelection = checked
                    ? [...currentIndustries, industrySlug]
                    : currentIndustries.filter((slug: string) => slug !== industrySlug);
                setTempContent({ ...tempContent, main: { ...tempContent.main, [lang]: newSelection }});
            };
            
            const currentRegions = tempContent.secondary?.[lang] || [];
            const handleRegionChange = (checked: boolean, regionSlug: string) => {
                const newSelection = checked
                    ? [...currentRegions, regionSlug]
                    : currentRegions.filter((slug: string) => slug !== regionSlug);
                setTempContent({ ...tempContent, secondary: { ...tempContent.secondary, [lang]: newSelection }});
            };
            
            const availableIndustries = Array.from(new Map(
                (employer?.visaType?.[lang] || []).flatMap((vSlug: string) => (industriesByJobType[vSlug as keyof typeof industriesByJobType] || [])).map((item: Industry) => [item.slug, item])
            ).values());

            return (
                <div className="space-y-4">
                     <div className="space-y-2" id="DKY008">
                        <Label>{t.mainIndustriesLabel}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10" disabled={availableIndustries.length === 0}>
                                    <div className="flex flex-wrap gap-1">
                                        {currentIndustries.length > 0 ? (
                                            currentIndustries.map((slug: string, index: number) => <Badge key={slug} variant="secondary"><span className="font-bold mr-1.5">{index + 1}.</span>{(allIndustries.find(i => i.slug === slug))?.name[lang] || slug}</Badge>)
                                        ) : `Chọn ${t.mainIndustriesLabel}`}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>Chọn ngành nghề</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {availableIndustries.map(industry => (
                                     <DropdownMenuCheckboxItem
                                        key={industry.slug}
                                        checked={currentIndustries.includes(industry.slug)}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) => handleIndustryChange(Boolean(checked), industry.slug)}
                                    >
                                        <span className="font-bold w-6 mr-2">{currentIndustries.includes(industry.slug) ? `${currentIndustries.indexOf(industry.slug) + 1}.` : ''}</span>
                                        {industry.name[lang]}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                     <div className="space-y-2" id="DKY009">
                        <Label>{t.secondaryIndustriesLabel}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10">
                                     <div className="flex flex-wrap gap-1">
                                        {currentRegions.length > 0 ? (
                                            currentRegions.map((slug: string, index: number) => <Badge key={slug} variant="secondary"><span className="font-bold mr-1.5">{index + 1}.</span>{(japanRegions.find(r => r.slug === slug))?.name || slug}</Badge>)
                                        ) : `Chọn ${t.secondaryIndustriesLabel}`}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>Chọn khu vực</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {japanRegions.map(region => (
                                     <DropdownMenuCheckboxItem
                                        key={region.slug}
                                        checked={currentRegions.includes(region.slug)}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) => handleRegionChange(Boolean(checked), region.slug)}
                                    >
                                        <span className="font-bold w-6 mr-2">{currentRegions.includes(region.slug) ? `${currentRegions.indexOf(region.slug) + 1}.` : ''}</span>
                                        {region.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
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

  const getArrayValue = (field: any, fieldKey: string) => {
    const value = field?.[lang] || [];
    if (Array.isArray(value) && value.length > 0) {
      if (fieldKey === 'interest') {
          const content = value.map((id: string, index: number) => {
              const item = interestOptions[lang].find(i => i.id === id);
              return item ? (
                  <Badge key={id} variant="secondary" className="font-normal">
                      <span className="font-bold mr-1.5">{index + 1}.</span>
                      {item.title}
                  </Badge>
              ) : null;
          }).filter(Boolean);
          return <div className="flex flex-wrap gap-1 mt-1">{content}</div>;
      }
      
      const allItems = [...japanJobTypes, ...Object.values(visaDetailsByVisaType).flat(), ...allIndustries, ...japanRegions];
      
      const content = value.map((slug: string, index: number) => {
          const item: any = allItems.find((i: any) => i.slug === slug);
          let name = slug;
          if (item && 'name' in item && typeof item.name === 'object') {
            name = item.name[lang];
          }
          else if (item && 'name' in item && typeof item.name === 'string') {
             name = item.name;
          }
          return (
            <Badge key={slug} variant="secondary" className="font-normal">
              <span className="font-bold mr-1.5">{index + 1}.</span>
              {name}
            </Badge>
          );
      });
      
      return <div className="flex flex-wrap gap-1 mt-1">{content}</div>;
    }

    const editTitle = fieldKey === 'industries' ? t.industriesTitle : (fieldKey === 'interest' ? t.valueInterestTitle : t.visaTitle);
    const editField = fieldKey === 'interest' ? 'valueInterest' : (fieldKey === 'industries' ? 'industries' : 'visa');
    const editData = fieldKey === 'interest' ? { interest: employer.interest, valueInterest: employer.valueInterest } : (fieldKey === 'industries' ? employer.industries : { visaType: employer.visaType, visaDetail: employer.visaDetail });

    return <button disabled={isConfirmationMode} className="italic text-primary underline" onClick={() => handleEditClick(editTitle, editData, editField)}>{t.clickToUpdate}</button>
  };

  const getValueInterestValue = (value: any) => {
      if (Array.isArray(value) && value.length > 0) {
          const content = value.map((item: any, index: number) => {
              return <Badge key={item.id} variant="secondary" className="font-normal"><span className="font-bold mr-1.5">{index + 1}.</span>{item[lang]}</Badge>
          });
          return <div className="flex flex-wrap gap-1 mt-1">{content}</div>;
      }
      return <button disabled={isConfirmationMode} className="italic text-primary underline" onClick={() => handleEditClick(t.valueInterestTitle, { interest: employer.interest, valueInterest: employer.valueInterest }, 'valueInterest')}>{t.clickToUpdate}</button>
  };


  return (
    <>
      <div id="Y062" className="bg-secondary pb-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <Card className="shadow-2xl overflow-hidden mb-8">
              <CardHeader className="p-0 relative">
                <div className="relative w-full h-48">
                  <Image src={employer.banner} alt={`${employer.name[lang] || ''} banner`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                   {!isConfirmationMode && (
                  <Label htmlFor="banner-upload" className="absolute top-4 right-4 z-10 cursor-pointer">
                     <Button variant="secondary" size="sm" asChild>
                       <span><Camera className="mr-2 h-4 w-4" /> {t.edit}</span>
                     </Button>
                     <Input id="banner-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                  </Label>
                  )}
                </div>
                <div id="DKTHONGTINCHUNG" className="p-6 bg-card relative">
                  <div className="flex flex-col sm:flex-row items-start gap-4 -mt-24 md:-mt-20">
                      <div className="relative flex-shrink-0">
                        <Avatar id="DKTC_AVATAR" className="h-28 w-28 md:h-36 md:w-36 border-4 border-card bg-card shadow-lg">
                            <AvatarImage src={employer.logo} />
                            <AvatarFallback>{(employer.name[lang] || 'A').charAt(0)}</AvatarFallback>
                          </Avatar>
                           {!isConfirmationMode && (
                           <Label htmlFor="logo-upload" className="absolute bottom-1 right-1 cursor-pointer bg-secondary p-2 rounded-full border-2 border-card">
                              <Camera className="h-4 w-4 text-secondary-foreground" />
                           </Label>
                           )}
                           <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} disabled={isConfirmationMode}/>
                      </div>
                      <div className="flex flex-col md:flex-row flex-grow min-w-0 md:mt-16 w-full">
                          <div className="flex-grow min-w-0 text-center md:text-left mt-2 md:mt-0">
                            <h1 id="DKTC_TEN" className="text-2xl md:text-3xl font-headline font-bold">{headerName}</h1>
                            <p id="DKTC_VAITRO" className="font-semibold text-primary">{roleText}</p>
                             <p id="DKTC_DIADIEM" className="text-sm text-muted-foreground">{employer.location[lang] || `[${t.locationPlaceholder}]`}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                <Badge variant="outline">Mã đối tác: {recruiterId}</Badge>
                            </p>
                          </div>
                          <div id="DKTC_HANHDONG" className="flex items-center gap-2 mt-4 w-full justify-center md:w-auto md:mt-0 flex-shrink-0 md:ml-auto">
                              <div className="flex items-center gap-2">
                                <Tabs defaultValue={lang} onValueChange={(value) => handleLangChange(value as Language)} className="w-auto">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="vi" className="flex items-center gap-1.5 p-2 h-auto text-xs"><VnFlagIcon className="h-4 w-4" /> <span className="hidden sm:inline">Tiếng Việt</span><span className="sm:hidden">VI</span></TabsTrigger>
                                        <TabsTrigger value="ja" className="flex items-center gap-1.5 p-2 h-auto text-xs"><JpFlagIcon className="h-4 w-4" /> <span className="hidden sm:inline">日本語</span><span className="sm:hidden">JA</span></TabsTrigger>
                                        <TabsTrigger value="en" className="flex items-center gap-1.5 p-2 h-auto text-xs"><EnFlagIcon className="h-4 w-4" /> <span className="hidden sm:inline">English</span><span className="sm:hidden">EN</span></TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                {!isConfirmationMode && (<Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => handleEditClick(t.headerTitle, { name: employer.name, type: {vi: roleText}, location: employer.location }, 'header')}><Edit className="h-5 w-5"/></Button>)}
                              </div>
                          </div>
                      </div>
                      {!isConfirmationMode && (<Button variant="ghost" size="icon" className="absolute top-4 right-4 md:hidden" onClick={() => handleEditClick(t.headerTitle, { name: employer.name, type: {vi: roleText}, location: employer.location }, 'header')}><Edit className="h-5 w-5"/></Button>)}
                </div>
                </div>
              </CardHeader>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                  <SectionCard id="DKGIOITHIEU" title={t.aboutTitle} icon={FileText} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.aboutTitle, employer.about, 'about')}>
                       <p id="DKGT_NOIDUNG" className="text-sm text-muted-foreground whitespace-pre-line">{employer.about[lang] || <button disabled={isConfirmationMode} className="italic text-primary underline" onClick={() => handleEditClick(t.aboutTitle, employer.about, 'about')}>{`${t.notUpdated}, ${t.clickToUpdate}`}</button>}</p>
                       <Button id="DKGT_NUTSUA" variant="ghost" size="icon" className="absolute top-4 right-4 invisible"><Edit className="h-4 w-4"/></Button>
                  </SectionCard>
                  
                  {/* Info card for Mobile */}
                  <div className="block lg:hidden">
                    <SectionCard id="DKTHONGTINDOANHNGHIEP-mobile" title={t.infoTitle} icon={Building} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.infoTitle, employer.info, 'info')}>
                        <div className="space-y-3 text-sm">
                            <p id="DKDN_NAMTHANHLAP-mobile"><strong>{t.foundedLabel}:</strong> {employer.info.founded || t.notUpdated}</p>
                            <p id="DKDN_QUYMO-mobile"><strong>{t.sizeLabel}:</strong> {employer.info.size[lang] || t.notUpdated}</p>
                            <p id="DKDN_GIAYPHEP-mobile"><strong>{t.licenseLabel}:</strong> {employer.info.license || t.notUpdated}</p>
                            <p id="DKDN_WEBSITE-mobile"><strong>{t.websiteLabel}:</strong> <a href={employer.info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{employer.info.website || t.notUpdated}</a></p>
                        </div>
                        {hasContactInfo ? (
                            <div id="DKTHONGTINLIENHE-mobile" className="mt-6 border-t pt-4 space-y-2">
                               {employer.info.email && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_EMAIL-mobile" href={`mailto:${employer.info.email}`}><Mail className="mr-2 h-4 w-4"/>{employer.info.email}</Link></Button>}
                               {employer.info.phone && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_SODIENTHOAI-mobile" href={`tel:${employer.info.phone}`}><Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="mr-2 h-4 w-4" />{formatDisplayPhoneNumber(employer.info.phone)}</Link></Button>}
                               {employer.info.messenger && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_MESSENGER-mobile" href={`https://m.me/${employer.info.messenger}`} target="_blank" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://facebook.com/${employer.info.messenger}`}</span></Link></Button>}
                               {employer.info.zalo && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_ZALO-mobile" href={`https://zalo.me/${employer.info.zalo}`} target="_blank"><ZaloIcon className="mr-2 h-4 w-4"/>{formatDisplayPhoneNumber(employer.info.zalo)}</Link></Button>}
                               {employer.info.line && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_LINE-mobile" href={`https://line.me/ti/p/~${employer.info.line}`} target="_blank" className="flex items-center gap-2"><LineIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://line.me/ti/p/~${employer.info.line}`}</span></Link></Button>}
                            </div>
                        ) : (
                            <div id="HIENTHILIENHE03-mobile" className="mt-6 border-t pt-4">
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
                  </div>

                  <SectionCard id="DKNGHIEPVUGIATRIQUANTAM" title={t.valueInterestTitle} icon={CheckCircle} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.valueInterestTitle, { interest: employer.interest, valueInterest: employer.valueInterest }, 'valueInterest')}>
                    <div className="space-y-3 text-sm">
                        <div id="DKNV_NGHIEPVU">
                            <p className="font-semibold mb-1">{t.interestLabel}:</p>
                            {getArrayValue(employer.interest, 'interest')}
                        </div>
                        <div id="DKNV_GIATRI">
                            <p className="font-semibold mb-1">{t.valueInterestLabel}:</p>
                            {getValueInterestValue(employer.valueInterest)}
                        </div>
                    </div>
                  </SectionCard>
                  <SectionCard id="DKLICHSU" title={t.historyTitle} icon={History} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.historyTitle, employer.history, 'history')}>
                       <ul id="DKLS_DANHSACH" className="space-y-4 text-sm">
                          {employer.history.length > 0 ? employer.history.map((item: any, index: number) => (
                              <li key={index} className="relative pl-6">
                                  <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary" />
                                  <p className="font-bold text-primary mb-1">{item.year}</p>
                                  <p className="text-muted-foreground">{item.event[lang]}</p>
                              </li>
                          )) : <p className="italic text-muted-foreground">{t.notUpdated}, <button disabled={isConfirmationMode} className="underline text-primary" onClick={() => handleEditClick(t.historyTitle, employer.history, 'history')}>{t.clickToUpdate}</button>.</p>}
                      </ul>
                  </SectionCard>
                  <SectionCard id="DKHINHANH" title={t.imagesTitle} icon={ImageIcon} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.imagesTitle, employer.images, 'images')}>
                      <div id="DKHA_LUOIANH" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {employer.images.map((img: any, index: number) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                  <Image src={img.src} alt={img.alt[lang] || ''} fill className="object-cover" />
                                   {!isConfirmationMode && (<Label htmlFor={`image-upload-${index}`} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="h-6 w-6 text-white"/>
                                   </Label>)}
                                   <Input id={`image-upload-${index}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'images', index)} disabled={isConfirmationMode}/>
                                   {!isConfirmationMode && (<Button variant="destructive" size="icon" className="absolute bottom-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleDeleteImage(index); }}>
                                        <Trash2 className="h-3 w-3"/>
                                   </Button>)}
                              </div>
                          ))}
                      </div>
                  </SectionCard>
                  <SectionCard id="DKPHUCLOI" title={t.benefitsTitle} icon={Award} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.benefitsTitle, employer.benefits, 'benefits')}>
                      <ul id="DKPL_DANHSACH" className="space-y-2 text-sm">
                          {employer.benefits.length > 0 ? employer.benefits.map((benefit: any, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"/> <span className="text-muted-foreground">{benefit[lang]}</span>
                              </li>
                          )) : <p className="italic text-muted-foreground">{t.notUpdated}, <button disabled={isConfirmationMode} className="underline text-primary" onClick={() => handleEditClick(t.benefitsTitle, employer.benefits, 'benefits')}>{t.clickToUpdate}</button>.</p>}
                      </ul>
                  </SectionCard>
              </div>
              
                {/* Right Column (order-first on desktop) */}
              <div className="lg:col-start-3 lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                  <div className="hidden lg:block">
                    <SectionCard id="DKTHONGTINDOANHNGHIEP" title={t.infoTitle} icon={Building} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.infoTitle, employer.info, 'info')}>
                        <div className="space-y-3 text-sm">
                            <p id="DKDN_NAMTHANHLAP"><strong>{t.foundedLabel}:</strong> {employer.info.founded || t.notUpdated}</p>
                            <p id="DKDN_QUYMO"><strong>{t.sizeLabel}:</strong> {employer.info.size[lang] || t.notUpdated}</p>
                            <p id="DKDN_GIAYPHEP"><strong>{t.licenseLabel}:</strong> {employer.info.license || t.notUpdated}</p>
                            <p id="DKDN_WEBSITE"><strong>{t.websiteLabel}:</strong> <a href={employer.info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{employer.info.website || t.notUpdated}</a></p>
                        </div>
                        
                        {hasContactInfo ? (
                            <div id="DKTHONGTINLIENHE" className="mt-6 border-t pt-4 space-y-2">
                               {employer.info.email && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_EMAIL" href={`mailto:${employer.info.email}`}><Mail className="mr-2 h-4 w-4"/>{employer.info.email}</Link></Button>}
                               {employer.info.phone && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_SODIENTHOAI" href={`tel:${employer.info.phone}`}><Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="mr-2 h-4 w-4" />{formatDisplayPhoneNumber(employer.info.phone)}</Link></Button>}
                               {employer.info.messenger && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_MESSENGER" href={`https://m.me/${employer.info.messenger}`} target="_blank" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://facebook.com/${employer.info.messenger}`}</span></Link></Button>}
                               {employer.info.zalo && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_ZALO" href={`https://zalo.me/${employer.info.zalo}`} target="_blank"><ZaloIcon className="mr-2 h-4 w-4"/>{formatDisplayPhoneNumber(employer.info.zalo)}</Link></Button>}
                               {employer.info.line && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_LINE" href={`https://line.me/ti/p/~${employer.info.line}`} target="_blank" className="flex items-center gap-2"><LineIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://line.me/ti/p/~${employer.info.line}`}</span></Link></Button>}
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
                  </div>
                  <SectionCard id="DKLOAIHINHVISA" title={t.visaTitle} icon={FileSignature} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.visaTitle, { visaType: employer.visaType, visaDetail: employer.visaDetail }, 'visa')}>
                      <div className="space-y-3 text-sm">
                          <div id="DKLV_LOAIHINH"><strong className="block">{t.visaTypeLabel}:</strong> {getArrayValue(employer.visaType, 'visaType')}</div>
                          <div id="DKLV_CHITIETVISA"><strong className="block">{t.visaDetailLabel}:</strong> {getArrayValue(employer.visaDetail, 'visaDetail')}</div>
                      </div>
                  </SectionCard>
                  <SectionCard id="DKNGANHNGHEKHUVUC" title={t.industriesTitle} icon={Briefcase} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.industriesTitle, employer.industries, 'industries')}>
                     <div className="space-y-3 text-sm">
                          <div id="DKNK_NGANHNGHE"><strong className="block">{t.mainIndustriesLabel}:</strong> {getArrayValue(employer.industries.main, 'industries')}</div>
                          <div id="DKNK_KHUVUC"><strong className="block">{t.secondaryIndustriesLabel}:</strong> {getArrayValue(employer.industries.secondary, 'regions')}</div>
                      </div>
                  </SectionCard>
              </div>

              
            </div>
          </div>
        </div>
      </div>

       {!isConfirmationMode && (
        <div className="sticky bottom-0 z-40 bg-background/95 p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto flex justify-start gap-4">
            <Button variant="outline" size="lg" onClick={handleBack}>
                {t.backButton}
            </Button>
            <Button size="lg" className="bg-accent-orange hover:bg-accent-orange/90 text-white" onClick={handleContinue}>
                {t.continueButton}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent id={`${editingModule?.field}_DIALOG`} className="sm:max-w-2xl">
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
