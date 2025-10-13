
'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { notFound, useSearchParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, History, FileText, Briefcase, Award, Edit, Camera, Info, PlusCircle, Trash2, ImageIcon, Phone, MessageSquare, Mail, QrCode, CheckCircle, FileSignature, HardHat, UserCheck, Globe, Users2, FastForward, ListChecks, GraduationCap, Users, UserSquare, UserCog, UserPlus, Handshake, Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn, parseMessengerInput, parseZaloInput, parseLineInput, formatPhoneNumberInput } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
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
import { visaDetailsByVisaType } from '@/lib/visa-data';
import { japanRegions } from '@/lib/location-data';
import { Skeleton } from '@/components/ui/skeleton';


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
    logo: '',
    banner: '',
    about: { vi: '', ja: '', en: '' },
    images: [],
    history: [],
    info: { founded: '', size: { vi: '', ja: '', en: '' }, website: '', license: '', phone: '', zalo: '', messenger: '', line: '', email: '' },
    benefits: [],
    valueInterest: [],
    interest: { vi: [], ja: [], en: [] }, // Add new field for Y003
};


type Language = 'vi' | 'ja' | 'en';

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

const contentByLang = {
    vi: {
        edit: 'Sửa',
        aboutTitle: 'Giới thiệu doanh nghiệp',
        imagesTitle: 'Ảnh về doanh nghiệp',
        historyTitle: 'Lịch sử & các mốc sự kiện',
        infoTitle: 'Thông tin doanh nghiệp',
        foundedLabel: 'Năm thành lập',
        foundedPlaceholder: 'Ví dụ: 2010',
        sizeLabel: 'Quy mô',
        sizePlaceholder: 'Ví dụ: 50 - 100 nhân viên',
        licenseLabel: 'Giấy phép',
        licensePlaceholder: 'Ví dụ: Số 123/LĐTBXH-GP',
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
        notUpdated: 'Chưa có thông tin.',
        clickToUpdate: 'Nhấn để cập nhật.',
        headerTitle: 'Thông tin chung',
        namePlaceholder: 'Ví dụ: Nguyễn Văn An',
        companyNamePlaceholder: 'Ví dụ: Công ty Cổ phần ABC',
        typePlaceholder: '[Loại hình/Vai trò/Chức danh...]',
        locationPlaceholder: 'Ví dụ: Hà Nội, Việt Nam',
        benefitsTitle: 'Phúc lợi & Môi trường',
        valueInterestTitle: "Nghiệp vụ & Giá trị quan tâm",
        interestLabel: "Nghiệp vụ quan tâm",
        interestDescription: "Hãy cho chúng tôi biết mục tiêu chính của bạn để có trải nghiệm tốt nhất. Bạn có thể chọn nhiều mục.",
        valueInterestLabel: "Giá trị quan tâm",
        valueInterestDescription: "Điều gì là quan trọng nhất với bạn khi hợp tác?",
        selectInterestPlaceholder: "Chọn nghiệp vụ quan tâm",
        selectValueInterestPlaceholder: "Chọn giá trị quan tâm",
        contactTitle: 'Thông tin liên hệ',
        registerCTA: 'Cung cấp ít nhất 1 phương thức liên hệ để',
        registerAction: 'Đăng ký',
        reRegisterAction: 'Đăng ký lại',
        visaTypeLabel: 'Loại hình',
        visaDetailLabel: 'Chi tiết loại hình visa',
        selectVisaTypePlaceholder: 'Chọn Loại hình',
        selectVisaDetailPlaceholder: 'Chọn Chi tiết',
        rolePlaceholder: '[Loại hình/Vai trò/Chức danh...]',
        newRecruiterPlaceholder: 'Nhà tuyển dụng mới',
        partnerIdLabel: 'Mã đối tác',
        continueButton: 'Tiếp tục',
        backButton: 'Quay lại',
        cancelButton: 'Huỷ',
        saveButton: 'Lưu thay đổi',
        examplePlaceholder: 'Ví dụ:',
        addMilestoneButton: 'Thêm mốc',
        addBenefitButton: 'Thêm phúc lợi',
        addImageButton: 'Thêm ảnh',
        selectMainIndustriesPlaceholder: "Chọn ngành nghề",
        selectSecondaryIndustriesPlaceholder: "Chọn khu vực",
        selectInterestLabel: 'Chọn nghiệp vụ',
        selectValueInterestLabel: 'Chọn giá trị (sắp xếp theo ưu tiên)',
        visaAndIndustriesTitle: "Visa, Ngành nghề & Khu vực",
        visaAndIndustriesDialogTitle: "Chỉnh sửa Visa, Ngành nghề & Khu vực",
        mainIndustriesLabel: "Ngành nghề chính",
        secondaryIndustriesLabel: "Khu vực chính",
    },
    ja: {
        edit: '編集',
        aboutTitle: '会社紹介',
        imagesTitle: '会社の写真',
        historyTitle: '沿革と主な出来事',
        infoTitle: '企業情報',
        foundedLabel: '設立年',
        foundedPlaceholder: '例：2010',
        sizeLabel: '従業員数',
        sizePlaceholder: '例：50～100名',
        licenseLabel: '許可証',
        licensePlaceholder: '例：22登-999999',
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
        notUpdated: '情報がありません。',
        clickToUpdate: 'クリックして更新。',
        headerTitle: '一般情報',
        namePlaceholder: '例: グエン・ヴァン・アン',
        companyNamePlaceholder: '例: ABC株式会社',
        typePlaceholder: '[種別/役割/役職...]',
        locationPlaceholder: '例: ベトナム、ハノイ',
        benefitsTitle: '福利厚生と環境',
        valueInterestTitle: "業務と価値観",
        interestLabel: "関心のある業務",
        interestDescription: "最高の体験のために、あなたの主な目標を教えてください。複数選択可能です。",
        valueInterestLabel: "関心のある価値",
        valueInterestDescription: "提携において最も重要なことは何ですか？",
        selectInterestPlaceholder: "関心のある業務を選択",
        selectValueInterestPlaceholder: "関心のある価値を選択",
        contactTitle: '連絡先情報',
        registerCTA: '登録するには、少なくとも1つの連絡方法を提供してください',
        registerAction: '登録',
        reRegisterAction: '再登録',
        visaTypeLabel: '種別',
        visaDetailLabel: 'ビザ詳細',
        selectVisaTypePlaceholder: '種別を選択',
        selectVisaDetailPlaceholder: '詳細を選択',
        rolePlaceholder: '[種別/役割/役職...]',
        newRecruiterPlaceholder: '新規採用担当者',
        partnerIdLabel: 'パートナーID',
        continueButton: '登録する',
        backButton: '戻る',
        cancelButton: 'キャンセル',
        saveButton: '変更を保存',
        examplePlaceholder: '例：',
        addMilestoneButton: 'マイルストーンを追加',
        addBenefitButton: '福利厚生を追加',
        addImageButton: '写真を追加',
        selectMainIndustriesPlaceholder: "業種を選択",
        selectSecondaryIndustriesPlaceholder: "地域を選択",
        selectInterestLabel: '業務を選択',
        selectValueInterestLabel: '価値観を選択 (優先順位で並べ替え)',
        visaAndIndustriesTitle: "ビザ、業種、地域",
        visaAndIndustriesDialogTitle: "ビザ、業種、地域を編集",
        mainIndustriesLabel: "主要業種",
        secondaryIndustriesLabel: "主な採用地域",
    },
    en: {
        edit: 'Edit',
        aboutTitle: 'About the Company',
        imagesTitle: 'Company Photos',
        historyTitle: 'History & Milestones',
        infoTitle: 'Company Information',
        foundedLabel: 'Founded',
        foundedPlaceholder: 'E.g., 2010',
        sizeLabel: 'Company Size',
        sizePlaceholder: 'E.g., 50 - 100 employees',
        licenseLabel: 'License',
        licensePlaceholder: 'E.g., No. 22T-999999',
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
        notUpdated: 'No information yet.',
        clickToUpdate: 'Click to update.',
        headerTitle: 'General Information',
        namePlaceholder: 'E.g., An Nguyen Van',
        companyNamePlaceholder: 'E.g., ABC Corporation',
        typePlaceholder: '[Type/Role/Title...]',
        locationPlaceholder: 'E.g., Hanoi, Vietnam',
        benefitsTitle: 'Benefits & Environment',
        valueInterestTitle: 'Operations & Values',
        interestLabel: "Operations of Interest",
        interestDescription: "Tell us your main goal for the best experience. You can select multiple items.",
        valueInterestLabel: "Desired Values",
        valueInterestDescription: "What is most important to you in a partnership?",
        selectInterestPlaceholder: "Select operations of interest",
        selectValueInterestPlaceholder: "Select desired values",
        contactTitle: 'Contact Information',
        registerCTA: 'Provide at least 1 contact method to',
        registerAction: 'Register',
        reRegisterAction: 'Re-register',
        visaTypeLabel: 'Type',
        visaDetailLabel: 'Visa Details',
        selectVisaTypePlaceholder: 'Select Type',
        selectVisaDetailPlaceholder: 'Select Details',
        rolePlaceholder: '[Type/Role/Title...]',
        newRecruiterPlaceholder: 'New Recruiter',
        partnerIdLabel: 'Partner ID',
        continueButton: 'Continue',
        backButton: 'Back',
        cancelButton: 'Cancel',
        saveButton: 'Save Changes',
        examplePlaceholder: 'E.g.,',
        addMilestoneButton: 'Add Milestone',
        addBenefitButton: 'Add Benefit',
        addImageButton: 'Thêm ảnh',
        selectMainIndustriesPlaceholder: "Select Industries",
        selectSecondaryIndustriesPlaceholder: "Select Region",
        selectInterestLabel: 'Select Operations',
        selectValueInterestLabel: 'Select Values (sort by priority)',
        visaAndIndustriesTitle: "Visa, Industry & Region",
        visaAndIndustriesDialogTitle: "Edit Visa, Industry & Region",
        mainIndustriesLabel: "Main Industries",
        secondaryIndustriesLabel: "Main Recruitment Areas",
    }
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

const localizedJapanJobTypes = [
    { name: { vi: 'Thực tập sinh kỹ năng', ja: '技能実習', en: 'Technical Intern Training' }, slug: 'thuc-tap-sinh-ky-nang' },
    { name: { vi: 'Kỹ năng đặc định', ja: '特定技能', en: 'Specified Skilled Worker' }, slug: 'ky-nang-dac-dinh' },
    { name: { vi: 'Kỹ sư, tri thức', ja: '技術・人文知識・国際業務', en: 'Engineer/Specialist' }, slug: 'ky-su-tri-thuc' }
];

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

const roleTexts: Record<string, Record<Language, string>> = {
  'nhan-vien-phai-cu': { vi: 'Nhân viên phái cử', ja: '送り出し機関の社員', en: 'Sending Company Staff' },
  'nhan-vien-nhan-luc-nhat': { vi: 'Nhân viên Nhân lực Nhật', ja: '日本人材法人の社員', en: 'Japan-side HR Staff' },
  'sending': { vi: 'Công ty phái cử', ja: '送り出し機関', en: 'Sending Company' },
  'support': { vi: 'Cơ quan hỗ trợ (Shien Kikan)', ja: '支援機関', en: 'Support Organization' },
  'company': { vi: 'Xí nghiệp tiếp nhận', ja: '受け入れ企業', en: 'Accepting Company' },
  'supervising-organization': { vi: 'Nghiệp đoàn (Kumiai)', ja: '監理団体 (組合)', en: 'Supervising Organization' },
  'paid-placement-agency': { vi: 'Công ty giới thiệu có phí', ja: '有料職業紹介事業所', en: 'Paid Employment Placement Agency' },
  'haken': { vi: 'Công ty Haken', ja: '派遣会社', en: 'Staffing Agency' },
};

const subRoleTexts: Record<string, Record<Language, string>> = {
    'phu-trach-doi-ngoai': { vi: 'Phụ trách đối ngoại', ja: '渉外担当', en: 'External Relations' },
    'phu-trach-tuyen-dung': { vi: 'Phụ trách tuyển dụng', ja: '採用担当', en: 'Recruitment' },
    'vietnamese': { vi: 'Nhân sự người Việt', ja: 'ベトナム人事', en: 'Vietnamese Staff' },
    'japanese': { vi: 'Nhân sự người Nhật', ja: '日本人事', en: 'Japanese Staff' }
};

const InfoDialog = ({ isOpen, onOpenChange, employer, lang, isConfirmationMode, onSave, onEditClick }: { isOpen: boolean; onOpenChange: (open: boolean) => void; employer: any; lang: Language; isConfirmationMode: boolean; onSave: (data: any) => void; onEditClick: () => void; }) => {
    const t = contentByLang[lang];
    const [tempInfo, setTempInfo] = useState(employer.info);
    const [phoneCountry, setPhoneCountry] = useState('+84');
    const [zaloCountry, setZaloCountry] = useState('+84');
    const [errors, setErrors] = useState<{ email?: string; messenger?: string; line?: string }>({});
    const [showContactError, setShowContactError] = useState(false);
    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTempInfo(employer.info);
        setShowContactError(false);
    }, [employer.info]);

    const handleInfoChange = (field: string, value: string) => {
        const newInfo = { ...tempInfo, [field]: value };
        setTempInfo(newInfo);
        if (value.trim() !== '') {
            setShowContactError(false);
        }
    };
    
    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateField = (field: 'messenger' | 'line', value: string) => {
        if (!value) { setErrors(prev => ({...prev, [field]: undefined })); return true; }
        let isValid = false;
        let errorMessage = "Định dạng không hợp lệ.";
        if (field === 'messenger') {
            isValid = /^(https?:\/\/(www\.)?(facebook|m)\.com\/|m\.me\/|[\w.]{5,})/.test(value);
            errorMessage = "Vui lòng nhập link Facebook/Messenger hoặc username hợp lệ.";
        } else if (field === 'line') {
            isValid = /^(https?:\/\/line\.me\/|@?[\w.-]+)/.test(value);
            errorMessage = "Vui lòng nhập link Line hoặc Line ID hợp lệ.";
        }
        setErrors(prev => ({ ...prev, [field]: isValid ? undefined : errorMessage }));
        return isValid;
    };

    const handleSave = () => {
        const hasContactInfo = tempInfo.email || tempInfo.phone || tempInfo.zalo || tempInfo.messenger || tempInfo.line;
        if (!hasContactInfo) {
            setShowContactError(true);
            errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        setShowContactError(false);

        let allValid = true;
        if (tempInfo.email && !validateEmail(tempInfo.email)) {
            setErrors(prev => ({ ...prev, email: "Email không hợp lệ" }));
            allValid = false;
        } else {
             setErrors(prev => ({ ...prev, email: undefined }));
        }
        if (!validateField('messenger', tempInfo.messenger || '')) allValid = false;
        if (!validateField('line', tempInfo.line || '')) allValid = false;

        if (!allValid) {
            return;
        }

        const finalInfo = { ...tempInfo };
        if (finalInfo.messenger) finalInfo.messenger = parseMessengerInput(finalInfo.messenger);
        if (finalInfo.line) finalInfo.line = parseLineInput(finalInfo.line);
        if (finalInfo.zalo) finalInfo.zalo = parseZaloInput(finalInfo.zalo);
        
        onSave({ ...employer, info: finalInfo });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent id="DKTHONGTINDOANHNGHIEP_DIALOG" className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t.infoTitle}</DialogTitle>
                </DialogHeader>
                <div id="DKTHONGTINDOANHNGHIEP_DIALOG" className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div id="DKDN_THONGTINCHUNG" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label id="DKDN_NAMTHANHLAP_LABEL" htmlFor="founded">{t.foundedLabel}</Label>
                            <Input id="DKDN_NAMTHANHLAP_INPUT" placeholder={t.foundedPlaceholder} value={tempInfo?.founded || ''} onChange={(e) => handleInfoChange('founded', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label id="DKDN_QUYMO_LABEL" htmlFor="size">{t.sizeLabel}</Label>
                            <Input id="DKDN_QUYMO_INPUT" placeholder={t.sizePlaceholder} value={tempInfo?.size?.[lang] || ''} onChange={(e) => {
                                const newSize = {...tempInfo.size, [lang]: e.target.value};
                                setTempInfo({...tempInfo, size: newSize});
                            }} />
                        </div>
                        <div className="space-y-2">
                            <Label id="DKDN_GIAYPHEP_LABEL" htmlFor="license">{t.licenseLabel}</Label>
                            <Input id="DKDN_GIAYPHEP_INPUT" placeholder={t.licensePlaceholder} value={tempInfo?.license || ''} onChange={(e) => handleInfoChange('license', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                           <Label id="DKDN_WEBSITE_LABEL" htmlFor="website">{t.websiteLabel}</Label>
                           <Input id="DKDN_WEBSITE_INPUT" placeholder="https://example.com" value={tempInfo?.website || ''} onChange={(e) => handleInfoChange('website', e.target.value)} />
                        </div>
                    </div>
                    
                    <div id="DKDN_THONGTINLIENHE" className="pt-4 border-t">
                      <h4 className="font-semibold mb-4">{t.contactTitle}</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-1 md:col-span-2">
                              <Label id="DKDN_EMAIL_LABEL" htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4"/> {t.emailLabel}</Label>
                              <Input 
                                type="email" 
                                id="DKDN_EMAIL_INPUT"
                                placeholder="contact@company.com" 
                                value={tempInfo?.email || ''} 
                                onChange={(e) => handleInfoChange('email', e.target.value)} 
                                onBlur={(e) => {
                                  if (e.target.value && !validateEmail(e.target.value)) {
                                    setErrors(prev => ({...prev, email: "Email không hợp lệ" }));
                                  } else {
                                     setErrors(prev => ({ ...prev, email: undefined }));
                                  }
                                }}
                                className={cn(errors?.email && "border-destructive")}
                              />
                               {errors?.email && <p className="text-xs text-destructive">{errors.email}</p>}
                           </div>
                          <div className="space-y-2">
                              <Label id="DKDN_SODIENTHOAI_LABEL" htmlFor="phone" className="flex items-center gap-2">
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
                                <Input id="DKDN_SODIENTHOAI_INPUT" type="tel" placeholder={phoneCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(tempInfo?.phone || '', phoneCountry)} onChange={(e) => handleInfoChange('phone', e.target.value.replace(/\D/g, ''))} />
                            </div>
                          </div>
                          <div className="space-y-2">
                              <Label id="DKDN_ZALO_LABEL" htmlFor="zalo" className="flex items-center gap-2"><ZaloIcon className="h-4 w-4" />{t.zaloLabel}</Label>
                             <div className="flex items-center relative">
                                <Select value={zaloCountry} onValueChange={setZaloCountry}>
                                    <SelectTrigger className="w-[80px] rounded-r-none"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+84">VN</SelectItem>
                                        <SelectItem value="+81">JP</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="DKDN_ZALO_INPUT" type="tel" placeholder={zaloCountry === '+84' ? '(0) 901 234 567' : '(0)90 1234 5678'} className="rounded-l-none" value={formatPhoneNumberInput(tempInfo?.zalo || '', zaloCountry)} onChange={(e) => handleInfoChange('zalo', e.target.value.replace(/\D/g, ''))} />
                                <div onClick={onEditClick} className="absolute right-2 cursor-pointer text-muted-foreground hover:text-primary">
                                    <QrCode className="h-5 w-5"/>
                                </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                             <Label id="DKDN_MESSENGER_LABEL" htmlFor="messenger" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4" />{t.messengerLabel}</Label>
                            <Input
                                id="DKDN_MESSENGER_INPUT"
                                placeholder={t.messengerPlaceholder}
                                value={tempInfo?.messenger || ''}
                                onChange={(e) => handleInfoChange('messenger', e.target.value)}
                                onBlur={(e) => validateField('messenger', e.target.value)}
                                className={cn(errors.messenger && "border-destructive")}
                            />
                            {!errors.messenger && <p className="text-xs text-muted-foreground">{t.messengerHelper}</p>}
                            {errors.messenger && <p className="text-xs text-destructive">{errors.messenger}</p>}
                        </div>
                         <div className="space-y-1">
                            <Label id="DKDN_LINE_LABEL" htmlFor="line" className="flex items-center gap-2"><LineIcon className="h-4 w-4" />{t.lineLabel}</Label>
                            <Input
                                id="DKDN_LINE_INPUT"
                                placeholder={t.linePlaceholder}
                                value={tempInfo?.line || ''}
                                onChange={(e) => handleInfoChange('line', e.target.value)}
                                onBlur={(e) => validateField('line', e.target.value)}
                                className={cn(errors.line && "border-destructive")}
                            />
                             {!errors.line && <p className="text-xs text-muted-foreground">{t.lineHelper}</p>}
                             {errors.line && <p className="text-xs text-destructive">{errors.line}</p>}
                        </div>
                      </div>
                      <div ref={errorRef} className={cn("mt-4 text-center text-sm p-2 rounded-md border border-transparent transition-all duration-300", showContactError && 'border-destructive ring-2 ring-destructive/40')}>
                           {(!tempInfo?.email && !tempInfo?.phone && !tempInfo?.zalo && !tempInfo?.messenger && !tempInfo?.line) && (
                              <div className="text-muted-foreground">{t.registerCTA} <Badge className="mx-1 bg-accent-orange text-white align-middle px-1.5 py-0.5 text-xs">{t.registerAction}</Badge></div>
                           )}
                      </div>
                  </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t.cancelButton}</Button>
                    <Button onClick={handleSave}>{t.saveButton}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function EmployerDetailPage({ isConfirmationMode = false }: { isConfirmationMode?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [employer, setEmployer] = React.useState<any | null>(null);
  const [lang, setLang] = React.useState<Language>('vi');
  const [isIndividual, setIsIndividual] = React.useState(false);
  const [displayName, setDisplayName] = React.useState('');
  const [roleText, setRoleText] = React.useState('');
  const [partnerId, setPartnerId] = React.useState('');
  const [isInfoDialogOpen, setIsInfoDialogOpen] = React.useState(false);
  const [showFooter, setShowFooter] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [mainContactError, setMainContactError] = React.useState(false);
  const infoCardRef = React.useRef<HTMLDivElement>(null);
  const mobileInfoCardRef = React.useRef<HTMLDivElement>(null);
  const [isUpdateMode, setIsUpdateMode] = React.useState(false);


  const t = contentByLang[lang] || contentByLang['vi'];
  const hasContactInfo = employer?.info && (employer.info.phone || employer.info.zalo || employer.info.messenger || employer.info.line || employer.info.email);

  const controlNavbar = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) { // if scroll down
        setShowFooter(false);
      } else { // if scroll up
        setShowFooter(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isMobile) {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [isMobile, lastScrollY, controlNavbar]);


  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingModule, setEditingModule] = React.useState<{title: string, field: string } | null>(null);
  const [tempContent, setTempContent] = React.useState<any>('');
  
  const [phoneCountry, setPhoneCountry] = React.useState('+84');
  const [zaloCountry, setZaloCountry] = React.useState('+84');
  const { toast } = useToast();
  const [errors, setErrors] = React.useState<{ email?: string; messenger?: string, line?: string }>({});
  
  const handleTempArrayChange = React.useCallback((index: number, field: string, value: string) => {
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
  }, [lang]);

  const getArrayValue = useCallback((value: { [key in Language]?: string[] }, context: 'interest' | 'valueInterest' | 'industries' | 'regions' | 'visaType' | 'visaDetail' ) => {
    const items = value?.[lang] || [];
    if (items.length === 0) {
      const clickHandler = () => {
          if(context === 'interest' || context === 'valueInterest') {
              handleEditClick(t.valueInterestTitle, { interest: employer.interest, valueInterest: employer.valueInterest }, 'valueInterest');
          } else {
              handleEditClick(t.visaAndIndustriesDialogTitle, { visaType: employer.visaType, visaDetail: employer.visaDetail, industries: employer.industries }, 'visaAndIndustries');
          }
      };
      return <button disabled={isConfirmationMode} className="italic text-primary underline" onClick={clickHandler}>{t.clickToUpdate}</button>
    }
    const dataMap: any = {
        industries: allIndustries,
        regions: japanRegions,
        visaType: localizedJapanJobTypes, 
        visaDetail: Object.values(visaDetailsByVisaType).flat(),
    };
    
    if (context === 'interest') {
        const interestDisplayOptions = interestOptions[lang];
        const content = items.map((slug: string, index: number) => {
            const item = interestDisplayOptions.find((i: any) => i.id === slug);
            return <Badge key={index} variant="secondary" className="font-normal"><span className="font-bold mr-1.5">{index + 1}.</span>{item?.title || slug}</Badge>;
        });
        return <div className="flex flex-wrap gap-1 mt-1">{content}</div>
    }
    
    if (context === 'valueInterest') {
        const content = employer.valueInterest.map((item: any, index: number) => {
             return <Badge key={index} variant="secondary" className="font-normal"><span className="font-bold mr-1.5">{index + 1}.</span>{item[lang] || item.vi}</Badge>
        });
        return <div className="flex flex-wrap gap-1 mt-1">{content}</div>
    }

    const content = items.map((slug: string, index: number) => {
        let item;
        let name;
        if (context === 'visaDetail') {
            item = dataMap[context]?.find((i: any) => i.slug === slug);
            name = item?.name[lang] || item?.name?.vi || slug;
        } else if (context === 'regions') {
            const region = japanRegions.find(r => r.slug === slug);
            name = lang === 'ja' ? regionKanjiMap[region?.name as keyof typeof regionKanjiMap] : region?.name;
        } else {
             item = dataMap[context]?.find((i: any) => i.slug === slug);
             name = item?.name[lang] || item?.name?.vi || item?.name || slug;
        }
        return <Badge key={index} variant="secondary" className="font-normal"><span className="font-bold mr-1.5">{index + 1}.</span>{name}</Badge>;
    });
    return <div id={
        context === 'visaType' ? 'DKLV_LOAIHINH_DISPLAY' :
        context === 'visaDetail' ? 'DKLV_CHITIETVISA_DISPLAY' :
        context === 'industries' ? 'DKNN_NGANHNGHE_DISPLAY' :
        context === 'regions' ? 'DKNN_KHUVUC_DISPLAY' : undefined
    } className="flex flex-wrap gap-1 mt-1">{content}</div>
  }, [lang, isConfirmationMode, t, employer]);
  
  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLang);
    router.replace(`/nha-tuyen-dung/dang-ky?${params.toString()}`);
  };
  
  const handleContinue = () => {
    if (!hasContactInfo) {
        setMainContactError(true);
        const refToScroll = isMobile ? mobileInfoCardRef : infoCardRef;
        refToScroll.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/nha-tuyen-dung/dang-ky/xac-nhan?${params.toString()}`);
  };

  const handleBack = () => {
      const fromPath = searchParams.get('from') || '/nha-tuyen-dung';
      router.push(fromPath);
  }

  React.useEffect(() => {
    const partnerIdParam = searchParams.get('partnerId');
    if (!partnerIdParam) {
        // Handled by page.tsx redirect
        return;
    }
    setPartnerId(partnerIdParam);

    const langFromParams = (searchParams.get('lang') || 'vi') as Language;
    setLang(langFromParams);

    const tempOnboardingDataRaw = localStorage.getItem(`onboardingData_${partnerIdParam}`);
    const existingProfileRaw = localStorage.getItem(`recruiterProfile_${partnerIdParam}`);
    
    let finalData;

    if (existingProfileRaw) {
        const existingProfile = JSON.parse(existingProfileRaw);
        if (tempOnboardingDataRaw) {
            const tempOnboardingData = JSON.parse(tempOnboardingDataRaw);
            // Merge: new data from onboarding overwrites existing data
            finalData = { ...existingProfile, ...tempOnboardingData, info: {...existingProfile.info, ...tempOnboardingData.info} };
            localStorage.setItem(`recruiterProfile_${partnerIdParam}`, JSON.stringify(finalData));
            localStorage.removeItem(`onboardingData_${partnerIdParam}`);
        } else {
            finalData = existingProfile;
        }
        setIsUpdateMode(true);
    } else if (tempOnboardingDataRaw) {
        finalData = JSON.parse(tempOnboardingDataRaw);
        localStorage.setItem(`recruiterProfile_${partnerIdParam}`, tempOnboardingDataRaw);
        localStorage.removeItem(`onboardingData_${partnerIdParam}`);
        setIsUpdateMode(false);
    } else {
        finalData = JSON.parse(JSON.stringify(emptyEmployerData));
        finalData.id = partnerIdParam;
        setIsUpdateMode(false);
    }
    
    // Ensure all nested objects exist
    finalData.name = finalData.name || { vi: '', ja: '', en: '' };
    finalData.type = finalData.type || { vi: '', ja: '', en: '' };
    finalData.location = finalData.location || { vi: '', ja: '', en: '' };
    finalData.about = finalData.about || { vi: '', ja: '', en: '' };
    finalData.info = finalData.info || { ...emptyEmployerData.info };
    finalData.info.size = finalData.info.size || { vi: '', ja: '', en: '' };
    finalData.visaType = finalData.visaType || { vi: [], ja: [], en: [] };
    finalData.visaDetail = finalData.visaDetail || { vi: [], ja: [], en: [] };
    finalData.industries = finalData.industries || { main: { vi: [], ja: [], en: [] }, secondary: { vi: [], ja: [], en: [] } };
    finalData.history = finalData.history || [];
    finalData.benefits = finalData.benefits || [];
    finalData.images = finalData.images || [];
    finalData.interest = finalData.interest || { vi: [], ja: [], en: [] };
    finalData.valueInterest = finalData.valueInterest || [];


    const isIndividualRole = finalData.role === 'nhan-vien-phai-cu' || finalData.role === 'nhan-vien-nhan-luc-nhat';
    setDisplayName(isIndividualRole ? (finalData.name || '') : (finalData.company_name || ''));
    setIsIndividual(isIndividualRole);

    const roleParts: string[] = [];
    const roleKey = finalData.role || '';
    const subRoleKey = finalData.sub_role || '';
    const nationalityKey = finalData.nationality || '';

    if (isIndividualRole) {
        if (roleKey === 'nhan-vien-phai-cu' && subRoleTexts[subRoleKey]) {
            roleParts.push(subRoleTexts[subRoleKey]?.[langFromParams] || '');
            roleParts.push(roleTexts[roleKey]?.[langFromParams] || '');
            if (finalData.company_name) roleParts.push(finalData.company_name);
        } else if (roleKey === 'nhan-vien-nhan-luc-nhat') {
            if (subRoleTexts[nationalityKey]) {
                roleParts.push(subRoleTexts[nationalityKey]?.[langFromParams] || '');
            }
            if(roleTexts[subRoleKey]) {
                 roleParts.push(roleTexts[subRoleKey]?.[langFromParams] || '');
            }
            if (finalData.company_name) roleParts.push(finalData.company_name);
        }
    } else if (!isIndividualRole && roleTexts[roleKey]) {
        roleParts.push(roleTexts[roleKey]?.[langFromParams] || '');
    }
    
    let finalRoleText = roleParts.filter(Boolean).join(' - ');
    
    if (!finalRoleText) {
        finalRoleText = t.rolePlaceholder;
    }
    setRoleText(finalRoleText);
    
    setEmployer(finalData);

}, [searchParams, t.rolePlaceholder]);

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
        if (tempContent.email && !validateEmail(tempContent.email)) {
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
        } else if (field === 'visaAndIndustries') {
             newState.visaType = tempContent.visaType;
             newState.visaDetail = tempContent.visaDetail;
             newState.industries = tempContent.industries;
        } else if (field === 'valueInterest') {
             newState.interest = { ...newState.interest, [lang]: tempContent.interest[lang] };
             newState.valueInterest = tempContent.valueInterest;
        } else {
            newState[field] = tempContent;
        }
        // After updating, save the entire profile to localStorage
        localStorage.setItem(`recruiterProfile_${partnerId}`, JSON.stringify(newState));
        return newState;
    });

    setIsEditDialogOpen(false);
    setEditingModule(null);
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
    setTempContent((prev: any[]) => prev.filter((_: any, i: number) => i !== index));
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
                localStorage.setItem(`recruiterProfile_${partnerId}`, JSON.stringify(newState));
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
            localStorage.setItem(`recruiterProfile_${partnerId}`, JSON.stringify(newState));
            return newState;
        });
    };
  
  const renderEditContent = () => {
    if (!editingModule) return <p>Chức năng đang được phát triển.</p>;
    
    // Fix: create a local multi-language `japanJobTypes` for this specific dialog.
    const localizedJapanJobTypes = [
        { name: { vi: 'Thực tập sinh kỹ năng', ja: '技能実習', en: 'Technical Intern Training' }, slug: 'thuc-tap-sinh-ky-nang' },
        { name: { vi: 'Kỹ năng đặc định', ja: '特定技能', en: 'Specified Skilled Worker' }, slug: 'ky-nang-dac-dinh' },
        { name: { vi: 'Kỹ sư, tri thức', ja: '技術・人文知識・国際業務', en: 'Engineer/Specialist' }, slug: 'ky-su-tri-thuc' }
    ];

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
            return <Textarea id="DKGT_TEXTAREA" className="min-h-[150px]" placeholder={`${t.examplePlaceholder} ${placeholderEmployerData.about[lang]}`} value={tempContent[lang] || ''} onChange={(e) => setTempContent({ ...tempContent, [lang]: e.target.value })} rows={8} />;
        
        case 'images':
            return (
                <div className="space-y-4">
                    {tempContent.map((img: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                        <Label htmlFor={`dialog-image-upload-${index}`} className="relative w-20 h-20 flex-shrink-0 cursor-pointer group">
                           <Image src={img.src} alt={img.alt?.[lang] || ''} fill className="object-cover rounded-md"/>
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Camera className="h-6 w-6 text-white"/>
                           </div>
                           <Input id={`dialog-image-upload-${index}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'images', index)} />
                        </Label>
                        <Input 
                            placeholder={`${t.examplePlaceholder} ${placeholderEmployerData.images[index]?.alt[lang] || 'Văn phòng hiện đại'}`}
                            value={img.alt?.[lang] || ''}
                            onChange={(e) => handleTempArrayChange(index, 'alt', e.target.value)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeTempArrayItem(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                    ))}
                    <Button variant="outline" onClick={() => addTempArrayItem('images')}><PlusCircle className="mr-2"/> {t.addImageButton}</Button>
                </div>
            );

        case 'history':
            return (
                <div className="space-y-4">
                    {tempContent.map((item: any, index: number) => (
                        <div key={index} className="grid grid-cols-[80px_1fr_auto] gap-3 items-center">
                            <Input placeholder={t.foundedPlaceholder} value={item.year} onChange={(e) => { const newHistory = [...tempContent]; newHistory[index].year = e.target.value; setTempContent(newHistory); }} />
                            <Input placeholder={`${t.examplePlaceholder} ${placeholderEmployerData.history[index]?.event[lang] || 'Thành lập công ty'}`} value={item.event[lang] || ''} onChange={(e) => handleTempArrayChange(index, 'event', e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => removeTempArrayItem(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => addTempArrayItem('history')}>
                        <PlusCircle className="mr-2"/> {t.addMilestoneButton}
                    </Button>
                </div>
            );
        
        case 'benefits':
             return (
                <div className="space-y-4">
                     {tempContent.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input placeholder={`${t.examplePlaceholder} ${placeholderEmployerData.benefits[index]?.[lang] || ''}`} value={item[lang] || ''} onChange={(e) => {
                                const newBenefits = [...tempContent];
                                newBenefits[index] = {...newBenefits[index], [lang]: e.target.value};
                                setTempContent(newBenefits);
                            }} />
                             <Button variant="ghost" size="icon" onClick={() => removeTempArrayItem(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => addTempArrayItem('benefits')}><PlusCircle className="mr-2"/> {t.addBenefitButton}</Button>
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
                const newObjects = newSelection.map(id => {
                    const viOption = valueInterestOptions['vi'].find(o=>o.id===id);
                    return {
                        id,
                        vi: viOption?.title,
                        ja: valueInterestOptions['ja'].find(o => o.id === id)?.title,
                        en: valueInterestOptions['en'].find(o => o.id === id)?.title
                    }
                }).filter(Boolean);
                setTempContent({ ...tempContent, valueInterest: newObjects });
            };

            return (
                <div id="DKNGHIEPVUGIATRIQUANTAM_DIALOG" className="space-y-6">
                    <div className="space-y-2">
                        <Label id="DKNV_NGHIEPVU_LABEL" className="font-semibold text-base">{t.interestLabel}</Label>
                        <p className="text-sm text-muted-foreground">{t.interestDescription}</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button id="DKNV_NGHIEPVU_BUTTON" variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10">
                                    <div className="flex flex-wrap gap-1">
                                        {currentInterest.length > 0 ? (
                                            currentInterest.map((id: string, index: number) => <Badge key={id} variant="secondary" className="font-normal"><span className="font-bold mr-1.5">{index + 1}.</span>{(interestOptions[lang].find(o => o.id === id))?.title}</Badge>)
                                        ) : t.selectInterestPlaceholder}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>{t.selectInterestLabel}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(interestOptions[lang] || []).map((option) => (
                                     <DropdownMenuCheckboxItem
                                        key={option.id}
                                        id={`DKNV_ITEM_${option.id}`}
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
                    <div className="space-y-2">
                        <Label id="DKNV_GIATRI_LABEL" className="font-semibold text-base">{t.valueInterestLabel}</Label>
                        <p className="text-sm text-muted-foreground">{t.valueInterestDescription}</p>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                                <Button id="DKNV_GIATRI_BUTTON" variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10">
                                     <div className="flex flex-wrap gap-1">
                                    {currentValueInterests.length > 0 ? (
                                        currentValueInterests.map((id: string, index: number) => <Badge key={id} variant="secondary" className="font-normal"><span className="font-bold mr-1.5">{index + 1}.</span>{(valueInterestOptions[lang].find(o => o.id === id))?.title}</Badge>)
                                    ) : t.selectValueInterestPlaceholder}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>{t.selectValueInterestLabel}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {valueInterestOptions[lang].map((option) => (
                                     <DropdownMenuCheckboxItem
                                        key={option.id}
                                        id={`DKNV_ITEM_${option.id}`}
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
        case 'visaAndIndustries':
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
                
                const newIndustries = (tempContent.industries?.main?.[lang] || []).filter((industrySlug: string) =>
                   newSelection.some((visaSlug: string) =>
                       (industriesByJobType[visaSlug as keyof typeof industriesByJobType] || []).some(ind => ind.slug === industrySlug)
                   )
                );

                setTempContent({
                    ...tempContent,
                    visaType: { ...tempContent.visaType, [lang]: newSelection },
                    visaDetail: { ...tempContent.visaDetail, [lang]: newVisaDetails },
                    industries: { ...tempContent.industries, main: { ...tempContent.industries.main, [lang]: newIndustries } }
                });
            };

            const currentVisaDetails = tempContent.visaDetail?.[lang] || [];
            const handleDetailCheckboxChange = (checked: boolean, detailSlug: string) => {
                const newSelection = checked
                    ? [...currentVisaDetails, detailSlug]
                    : currentVisaDetails.filter((slug: string) => slug !== detailSlug);
                setTempContent({ ...tempContent, visaDetail: { ...tempContent.visaDetail, [lang]: newSelection } });
            };

            const availableIndustries = Array.from(new Map(
                currentVisaTypes.flatMap((vSlug: string) => (industriesByJobType[vSlug as keyof typeof industriesByJobType] || [])).map((item: Industry) => [item.slug, item])
            ).values());
            
            const currentIndustries = tempContent.industries?.main?.[lang] || [];
            const handleIndustryChange = (checked: boolean, industrySlug: string) => {
                const newSelection = checked
                    ? [...currentIndustries, industrySlug]
                    : currentIndustries.filter((slug: string) => slug !== industrySlug);
                setTempContent({ ...tempContent, industries: { ...tempContent.industries, main: { ...tempContent.industries.main, [lang]: newSelection } } });
            };
            
            const currentRegions = tempContent.industries?.secondary?.[lang] || [];
            const handleRegionChange = (checked: boolean, regionSlug: string) => {
                const newSelection = checked
                    ? [...currentRegions, regionSlug]
                    : currentRegions.filter((slug: string) => slug !== regionSlug);
                setTempContent({ ...tempContent, industries: { ...tempContent.industries, secondary: { ...tempContent.industries.secondary, [lang]: newSelection } }});
            };

            return (
                <div className="space-y-4" id="DKVISA_NGANHNGHE_KHUVUC_DIALOG">
                     <div className="space-y-2" id="DKLV_LOAIHINH">
                        <Label id="DKLV_LOAIHINH_LABEL">{t.visaTypeLabel}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10" id="DKLV_LOAIHINH_BUTTON">
                                    <div className="flex flex-wrap gap-1">
                                    {currentVisaTypes.length > 0 ? (
                                        currentVisaTypes.map((slug: string, index: number) => {
                                            const item = localizedJapanJobTypes.find(t => t.slug === slug);
                                            const name = item?.name[lang] || slug;
                                            return <Badge key={slug} variant="secondary"><span className="font-bold mr-1.5">{index + 1}.</span>{name}</Badge>
                                        })
                                    ) : t.selectVisaTypePlaceholder}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>{t.selectVisaTypePlaceholder}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {localizedJapanJobTypes.map(type => (
                                    <DropdownMenuCheckboxItem
                                        key={type.slug}
                                        id={`DKLV_ITEM_${type.slug}`}
                                        checked={currentVisaTypes.includes(type.slug)}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) => handleVisaTypeChange(Boolean(checked), type.slug)}
                                    >
                                       <span className="font-bold w-6 mr-2">{currentVisaTypes.includes(type.slug) ? `${currentVisaTypes.indexOf(type.slug) + 1}.` : ''}</span>
                                        {type.name[lang]}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                     <div className="space-y-2" id="DKLV_CHITIETVISA">
                        <Label id="DKLV_CHITIETVISA_LABEL">{t.visaDetailLabel}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10" disabled={currentVisaTypes.length === 0} id="DKLV_CHITIETVISA_BUTTON">
                                     <div className="flex flex-wrap gap-1">
                                        {currentVisaDetails.length > 0 ? (
                                            currentVisaDetails.map((slug: string, index: number) => {
                                                const detail = Object.values(visaDetailsByVisaType).flat().find(d => d.slug === slug);
                                                return <Badge key={slug} variant="secondary"><span className="font-bold mr-1.5">{index + 1}.</span>{detail?.name[lang] || slug}</Badge>
                                            })
                                        ) : t.selectVisaDetailPlaceholder}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>{t.selectVisaDetailPlaceholder}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {currentVisaTypes.map((visaTypeSlug: string) => {
                                    const visaType = localizedJapanJobTypes.find(t => t.slug === visaTypeSlug);
                                    if (!visaType) return null;
                                    return (
                                        <DropdownMenuGroup key={visaTypeSlug}>
                                            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">{visaType.name[lang]}</DropdownMenuLabel>
                                            {(visaDetailsByVisaType[visaTypeSlug as keyof typeof visaDetailsByVisaType] || []).map((detail: any) => (
                                                <DropdownMenuCheckboxItem
                                                    key={detail.slug}
                                                    id={`DKLV_ITEM_${detail.slug}`}
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
                     <div className="space-y-2" id="DKNN_NGANHNGHE">
                        <Label id="DKNN_NGANHNGHE_LABEL">{t.mainIndustriesLabel}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10" disabled={availableIndustries.length === 0} id="DKNN_NGANHNGHE_BUTTON">
                                    <div className="flex flex-wrap gap-1">
                                        {currentIndustries.length > 0 ? (
                                            currentIndustries.map((slug: string, index: number) => <Badge key={slug} variant="secondary"><span className="font-bold mr-1.5">{index + 1}.</span>{(allIndustries.find(i => i.slug === slug))?.name[lang] || slug}</Badge>)
                                        ) : t.selectMainIndustriesPlaceholder}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>{t.selectMainIndustriesPlaceholder}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {availableIndustries.map(industry => (
                                     <DropdownMenuCheckboxItem
                                        key={industry.slug}
                                        id={`DKNN_ITEM_${industry.slug}`}
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
                     <div className="space-y-2" id="DKNN_KHUVUC">
                        <Label id="DKNN_KHUVUC_LABEL">{t.secondaryIndustriesLabel}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-auto min-h-10" id="DKNN_KHUVUC_BUTTON">
                                     <div className="flex flex-wrap gap-1">
                                        {currentRegions.length > 0 ? (
                                            currentRegions.map((slug: string, index: number) => <Badge key={slug} variant="secondary"><span className="font-bold mr-1.5">{index + 1}.</span>{lang === 'ja' ? regionKanjiMap[(japanRegions.find(r => r.slug === slug))?.name as keyof typeof regionKanjiMap] : (japanRegions.find(r => r.slug === slug))?.name || slug}</Badge>)
                                        ) : t.selectSecondaryIndustriesPlaceholder}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>{t.selectSecondaryIndustriesPlaceholder}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {japanRegions.map(region => (
                                     <DropdownMenuCheckboxItem
                                        key={region.slug}
                                        id={`DKNN_ITEM_${region.slug}`}
                                        checked={currentRegions.includes(region.slug)}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) => handleRegionChange(Boolean(checked), region.slug)}
                                    >
                                        <span className="font-bold w-6 mr-2">{currentRegions.includes(region.slug) ? `${currentRegions.indexOf(region.slug) + 1}.` : ''}</span>
                                        {lang === 'ja' ? regionKanjiMap[region.name] : region.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            );
        default:
            return <p>Chức năng đang được phát triển.</p>;
    }
  };
  
  if (!employer) {
      return (
        <div className="bg-secondary">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <Skeleton className="h-64 w-full mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
  
  const headerName = isIndividual ? (employer.name?.[lang] || `[${t.namePlaceholder}]`) : (employer.company_name || `[${t.companyNamePlaceholder}]`);
  const headerRoleText = roleText || t.rolePlaceholder;
  const continueButtonText = isUpdateMode ? t.reRegisterAction : t.registerAction;

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <div id="Y062" className="bg-secondary pb-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <Card className="shadow-2xl overflow-hidden mb-8">
              <CardHeader className="p-0 relative">
                <div className="relative w-full h-48">
                  {employer.banner && <Image src={employer.banner} alt={`${employer.name?.[lang] || ''} banner`} fill className="object-cover" />}
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
                            {employer.logo && <AvatarImage src={employer.logo} />}
                            <AvatarFallback>{(employer.name?.[lang] || 'A').charAt(0)}</AvatarFallback>
                          </Avatar>
                           {!isConfirmationMode && (
                           <Label htmlFor="logo-upload" className="absolute bottom-1 right-1 cursor-pointer bg-secondary p-2 rounded-full border-2 border-card">
                              <Camera className="h-4 w-4 text-secondary-foreground" />
                           </Label>)}
                           <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} disabled={isConfirmationMode}/>
                      </div>
                      <div className="flex flex-col md:flex-row flex-grow min-w-0 md:mt-16 w-full">
                          <div className="flex-grow min-w-0 text-center md:text-left mt-2 md:mt-0">
                            <h1 id="DKTC_TEN" className="text-2xl md:text-3xl font-headline font-bold">{headerName}</h1>
                            <p id="DKTC_VAITRO" className="font-semibold text-primary">{headerRoleText}</p>
                             <p id="DKTC_DIADIEM" className="text-sm text-muted-foreground">{employer.location?.[lang] || `[${t.locationPlaceholder}]`}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                <Badge variant="outline">{t.partnerIdLabel}: {partnerId}</Badge>
                            </p>
                          </div>
                          <div id="DKTC_HANHDONG" className="flex items-center gap-2 mt-4 w-full justify-center md:w-auto md:mt-0 flex-shrink-0 md:ml-auto">
                              <div className="flex items-center gap-2">
                                <Tabs defaultValue={lang} onValueChange={(value) => handleLangChange(value as Language)} className="w-auto">
                                    <TabsList id="DKXN_CHUYEN_NGON_NGU" className="grid w-full grid-cols-3">
                                        <TabsTrigger value="vi" className="flex items-center gap-1.5 p-2 h-auto text-xs"><VnFlagIcon /> <span className="hidden sm:inline">Tiếng Việt</span><span className="sm:hidden">VI</span></TabsTrigger>
                                        <TabsTrigger value="ja" className="flex items-center gap-1.5 p-2 h-auto text-xs"><JpFlagIcon /> <span className="hidden sm:inline">日本語</span><span className="sm:hidden">JA</span></TabsTrigger>
                                        <TabsTrigger value="en" className="flex items-center gap-1.5 p-2 h-auto text-xs"><EnFlagIcon /> <span className="hidden sm:inline">English</span><span className="sm:hidden">EN</span></TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                {!isConfirmationMode && (<DialogTrigger asChild><Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => handleEditClick(t.headerTitle, { name: employer.name, type: {vi: roleText}, location: employer.location }, 'header')}><Edit className="h-5 w-5"/></Button></DialogTrigger>)}
                              </div>
                          </div>
                      </div>
                      {!isConfirmationMode && (<DialogTrigger asChild><Button variant="ghost" size="icon" className="absolute top-4 right-4 md:hidden" onClick={() => handleEditClick(t.headerTitle, { name: employer.name, type: {vi: roleText}, location: employer.location }, 'header')}><Edit className="h-5 w-5"/></Button></DialogTrigger>)}
                </div>
                </div>
              </CardHeader>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                  <SectionCard id="DKGIOITHIEU" title={t.aboutTitle} icon={FileText} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.aboutTitle, employer.about, 'about')}>
                       <p id="DKGT_NOIDUNG" className="text-sm text-muted-foreground whitespace-pre-line">
                            {employer.about?.[lang] || (
                                <span className="italic">
                                    {t.notUpdated}{' '}
                                    <button
                                        disabled={isConfirmationMode}
                                        className="underline text-primary"
                                        onClick={() => handleEditClick(t.aboutTitle, employer.about, 'about')}
                                    >
                                        {t.clickToUpdate}
                                    </button>
                                </span>
                            )}
                        </p>
                  </SectionCard>
                  
                  {/* Info card for Mobile */}
                  <div className="block lg:hidden" ref={mobileInfoCardRef}>
                    <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
                        <SectionCard id="DKTHONGTINDOANHNGHIEP-mobile" title={t.infoTitle} icon={Building} onEditClick={isConfirmationMode ? undefined : () => setIsInfoDialogOpen(true)}>
                            <div className="space-y-3 text-sm">
                                <p><strong>{t.foundedLabel}:</strong> {employer.info?.founded || <DialogTrigger asChild><button disabled={isConfirmationMode} className="italic text-primary underline">{t.clickToUpdate}</button></DialogTrigger>}</p>
                                <p><strong>{t.sizeLabel}:</strong> {employer.info?.size?.[lang] || <DialogTrigger asChild><button disabled={isConfirmationMode} className="italic text-primary underline">{t.clickToUpdate}</button></DialogTrigger>}</p>
                                <p><strong>{t.licenseLabel}:</strong> {employer.info?.license || <DialogTrigger asChild><button disabled={isConfirmationMode} className="italic text-primary underline">{t.clickToUpdate}</button></DialogTrigger>}</p>
                                <p><strong>{t.websiteLabel}:</strong> {employer.info?.website ? <a href={employer.info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{employer.info.website}</a> : <DialogTrigger asChild><button disabled={isConfirmationMode} className="italic text-primary underline">{t.clickToUpdate}</button></DialogTrigger>}</p>
                            </div>
                            {hasContactInfo ? (
                                <div id="HIENTHILIENHE03-mobile" className="mt-6 border-t pt-4 space-y-2">
                                   {employer.info?.email && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_EMAIL-mobile" href={`mailto:${employer.info.email}`}><Mail className="mr-2 h-4 w-4"/>{employer.info.email}</Link></Button>}
                                   {employer.info?.phone && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_SODIENTHOAI-mobile" href={`tel:${employer.info.phone}`}><Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="mr-2 h-4 w-4" />{formatPhoneNumberInput(employer.info.phone, phoneCountry)}</Link></Button>}
                                   {employer.info?.messenger && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_MESSENGER-mobile" href={`https://m.me/${employer.info.messenger}`} target="_blank" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://facebook.com/${employer.info.messenger}`}</span></Link></Button>}
                                   {employer.info?.zalo && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_ZALO-mobile" href={`https://zalo.me/${employer.info.zalo}`} target="_blank"><ZaloIcon className="mr-2 h-4 w-4"/>{formatPhoneNumberInput(employer.info.zalo, zaloCountry)}</Link></Button>}
                                   {employer.info?.line && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_LINE-mobile" href={`https://line.me/ti/p/${employer.info.line}`} target="_blank" className="flex items-center gap-2"><LineIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://line.me/ti/p/${employer.info.line}`}</span></Link></Button>}
                                </div>
                            ) : (
                                <div id="HIENTHILIENHE03-mobile-error" className={cn("mt-6 border-t pt-4 text-center text-sm p-2 rounded-md border border-transparent transition-all duration-300", mainContactError && 'border-destructive ring-2 ring-destructive/40')}>
                                    <div className="text-muted-foreground">{t.registerCTA} <Badge className="mx-1 bg-accent-orange text-white align-middle px-1.5 py-0.5 text-xs">{isUpdateMode ? t.reRegisterAction : t.registerAction}</Badge></div>
                                </div>
                            )}
                        </SectionCard>
                         <InfoDialog 
                            isOpen={isInfoDialogOpen}
                            onOpenChange={setIsInfoDialogOpen}
                            employer={employer}
                            lang={lang}
                            isConfirmationMode={isConfirmationMode}
                            onSave={(data) => setEmployer(data)}
                            onEditClick={() => {}}
                        />
                    </Dialog>
                  </div>

                  <SectionCard id="DKNGHIEPVUGIATRIQUANTAM" title={t.valueInterestTitle} icon={CheckCircle} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.valueInterestTitle, { interest: employer.interest, valueInterest: employer.valueInterest }, 'valueInterest')}>
                    <div className="space-y-3 text-sm">
                        <div id="DKNV_NGHIEPVU">
                            <p id="DKNV_NGHIEPVU_LABEL" className="font-semibold mb-1">{t.interestLabel}:</p>
                            {getArrayValue(employer.interest, 'interest')}
                        </div>
                        <div id="DKNV_GIATRI">
                            <p id="DKNV_GIATRI_LABEL" className="font-semibold mb-1">{t.valueInterestLabel}:</p>
                            {getArrayValue({[lang]: employer.valueInterest.map((item:any) => item.id)}, 'valueInterest')}
                        </div>
                    </div>
                  </SectionCard>
                  <SectionCard id="DKLICHSU" title={t.historyTitle} icon={History} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.historyTitle, employer.history, 'history')}>
                       <ul id="DKLS_DANHSACH" className="space-y-4 text-sm">
                          {employer.history?.length > 0 ? employer.history.map((item: any, index: number) => (
                              <li key={index} className="relative pl-6">
                                  <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary" />
                                  <p className="font-bold text-primary mb-1">{item.year}</p>
                                  <p className="text-muted-foreground">{item.event?.[lang]}</p>
                              </li>
                          )) : <p className="italic text-muted-foreground">{t.notUpdated} <button disabled={isConfirmationMode} className="underline text-primary" onClick={() => handleEditClick(t.historyTitle, employer.history, 'history')}>{t.clickToUpdate}</button>.</p>}
                      </ul>
                  </SectionCard>
                  <SectionCard id="DKHINHANH" title={t.imagesTitle} icon={ImageIcon} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.imagesTitle, employer.images, 'images')}>
                      <div id="DKHA_LUOIANH" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {employer.images?.map((img: any, index: number) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                  {img.src && <Image src={img.src} alt={img.alt?.[lang] || ''} fill className="object-cover" />}
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
                          {employer.benefits?.length > 0 ? employer.benefits.map((benefit: any, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"/> <span className="text-muted-foreground">{benefit[lang]}</span>
                              </li>
                          )) : <p className="italic text-muted-foreground">{t.notUpdated} <button disabled={isConfirmationMode} className="underline text-primary" onClick={() => handleEditClick(t.benefitsTitle, employer.benefits, 'benefits')}>{t.clickToUpdate}</button>.</p>}
                      </ul>
                  </SectionCard>
              </div>
              
                {/* Right Column (order-first on desktop) */}
              <div className="lg:col-start-3 lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                  <div className="hidden lg:block" ref={infoCardRef}>
                    <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
                        <SectionCard id="DKTHONGTINDOANHNGHIEP" title={t.infoTitle} icon={Building} onEditClick={isConfirmationMode ? undefined : () => setIsInfoDialogOpen(true)}>
                            <div className="space-y-3 text-sm">
                                <p><strong>{t.foundedLabel}:</strong> {employer.info?.founded || <DialogTrigger asChild><button disabled={isConfirmationMode} className="italic text-primary underline">{t.clickToUpdate}</button></DialogTrigger>}</p>
                                <p><strong>{t.sizeLabel}:</strong> {employer.info?.size?.[lang] || <DialogTrigger asChild><button disabled={isConfirmationMode} className="italic text-primary underline">{t.clickToUpdate}</button></DialogTrigger>}</p>
                                <p><strong>{t.licenseLabel}:</strong> {employer.info?.license || <DialogTrigger asChild><button disabled={isConfirmationMode} className="italic text-primary underline">{t.clickToUpdate}</button></DialogTrigger>}</p>
                                <p><strong>{t.websiteLabel}:</strong> {employer.info?.website ? <a href={employer.info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{employer.info.website}</a> : <DialogTrigger asChild><button disabled={isConfirmationMode} className="italic text-primary underline">{t.clickToUpdate}</button></DialogTrigger>}</p>
                            </div>
                            {hasContactInfo ? (
                                <div id="HIENTHILIENHE03" className="mt-6 border-t pt-4 space-y-2">
                                   {employer.info?.email && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_EMAIL" href={`mailto:${employer.info.email}`}><Mail className="mr-2 h-4 w-4"/>{employer.info.email}</Link></Button>}
                                   {employer.info?.phone && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_SODIENTHOAI" href={`tel:${employer.info.phone}`}><Image src="/img/phone.svg" alt="Phone" width={20} height={20} className="mr-2 h-4 w-4" />{formatPhoneNumberInput(employer.info.phone, phoneCountry)}</Link></Button>}
                                   {employer.info?.messenger && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_MESSENGER" href={`https://m.me/${employer.info.messenger}`} target="_blank" className="flex items-center gap-2"><MessengerIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://facebook.com/${employer.info.messenger}`}</span></Link></Button>}
                                   {employer.info?.zalo && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_ZALO" href={`https://zalo.me/${employer.info.zalo}`} target="_blank"><ZaloIcon className="mr-2 h-4 w-4"/>{formatPhoneNumberInput(employer.info.zalo, zaloCountry)}</Link></Button>}
                                   {employer.info?.line && <Button asChild variant="outline" className="w-full justify-start"><Link id="DKDN_LINE" href={`https://line.me/ti/p/${employer.info.line}`} target="_blank" className="flex items-center gap-2"><LineIcon className="h-4 w-4 flex-shrink-0"/><span className="truncate">{`https://line.me/ti/p/${employer.info.line}`}</span></Link></Button>}
                                </div>
                            ) : (
                                <div id="HIENTHILIENHE03-desktop-error" className={cn("mt-6 border-t pt-4 text-center text-sm p-2 rounded-md border border-transparent transition-all duration-300", mainContactError && 'border-destructive ring-2 ring-destructive/40')}>
                                    <div className="text-muted-foreground">{t.registerCTA} <Badge className="mx-1 bg-accent-orange text-white align-middle px-1.5 py-0.5 text-xs">{isUpdateMode ? t.reRegisterAction : t.registerAction}</Badge></div>
                                </div>
                            )}
                        </SectionCard>
                         <InfoDialog 
                            isOpen={isInfoDialogOpen}
                            onOpenChange={setIsInfoDialogOpen}
                            employer={employer}
                            lang={lang}
                            isConfirmationMode={isConfirmationMode}
                            onSave={(data) => setEmployer(data)}
                            onEditClick={() => {}}
                        />
                    </Dialog>
                  </div>
                   <SectionCard id="DKVISA_NGANHNGHE_KHUVUC" title={t.visaAndIndustriesTitle} icon={Briefcase} onEditClick={isConfirmationMode ? undefined : () => handleEditClick(t.visaAndIndustriesDialogTitle, { visaType: employer.visaType, visaDetail: employer.visaDetail, industries: employer.industries }, 'visaAndIndustries')}>
                    <div className="space-y-3 text-sm">
                        <div id="DKLV_LOAIHINH"><strong>{t.visaTypeLabel}:</strong> {getArrayValue(employer.visaType, 'visaType')}</div>
                        <div id="DKLV_CHITIETVISA"><strong>{t.visaDetailLabel}:</strong> {getArrayValue(employer.visaDetail, 'visaDetail')}</div>
                        <div id="DKNN_NGANHNGHE"><strong>{t.mainIndustriesLabel}:</strong> {getArrayValue(employer.industries.main, 'industries')}</div>
                        <div id="DKNN_KHUVUC"><strong>{t.secondaryIndustriesLabel}:</strong> {getArrayValue(employer.industries.secondary, 'regions')}</div>
                    </div>
                </SectionCard>
              </div>

              
            </div>
          </div>
        </div>
      </div>

       {!isConfirmationMode && (
        <div id="DANGKY_NTD_FOOTER" className={cn(
          "sticky bottom-0 z-40 bg-background/95 p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)] transition-transform duration-300",
          showFooter && isMobile ? "translate-y-0" : "translate-y-full md:translate-y-0"
        )}>
          <div className="container mx-auto flex justify-start gap-4">
            <Button variant="outline" size="lg" onClick={handleBack}>
                {t.backButton}
            </Button>
            <Button size="lg" className={cn("bg-accent-orange hover:bg-accent-orange/90 text-white", isUpdateMode ? "bg-accent-green hover:bg-accent-green/90": "")} onClick={handleContinue}>
                {continueButtonText}
            </Button>
          </div>
        </div>
      )}

      <DialogContent id={`${editingModule?.field}_DIALOG`} className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{editingModule?.title}</DialogTitle>
        </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto pr-4">
            {renderEditContent()}
          </div>
        <DialogFooter>
          <DialogClose asChild>
              <Button variant="outline">{t.cancelButton}</Button>
          </DialogClose>
            {(editingModule) && (
              <Button onClick={handleSaveChanges}>{t.saveButton}</Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
