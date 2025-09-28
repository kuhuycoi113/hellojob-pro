
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, History, FileText, Briefcase, Award, Edit, Camera, CheckCircle, Info, PlusCircle, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock data with multi-language support
const mockEmployerData = {
  id: 'tvc-corporation',
  name: {
    vi: 'Công ty Cổ phần TVC',
    ja: 'TVC株式会社',
    en: 'TVC Corporation'
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
  dataAiHint: 'company logo',
  banner: 'https://placehold.co/1200x400.png?text=Banner',
  dataAiHintBanner: 'modern office building',
  
  about: {
    vi: 'Công ty phái cử TVC là một trong những đơn vị hàng đầu trong lĩnh vực cung ứng nhân lực cho thị trường Nhật Bản. Với nhiều năm kinh nghiệm, chúng tôi tự hào đã chắp cánh cho hàng ngàn ước mơ của người lao động Việt Nam, mang đến những cơ hội việc làm chất lượng và một lộ trình phát triển sự nghiệp bền vững. TVC cam kết minh bạch, tận tâm và luôn đồng hành cùng ứng viên trên mọi chặng đường.',
    ja: 'TVC株式会社は、日本市場への人材供給分野におけるリーディングカンパニーの一つです。長年の経験により、私たちは何千人ものベトナム人労働者の夢を支援し、質の高い雇用機会と持続可能なキャリアパスを提供してきたことを誇りに思っています。TVCは透明性、献身性を約束し、常に候補者と共に歩んでいきます。',
    en: 'TVC Corporation is a leading company in supplying labor to the Japanese market. With many years of experience, we are proud to have supported thousands of Vietnamese workers\' dreams, providing quality job opportunities and a sustainable career development path. TVC is committed to transparency, dedication, and always accompanying candidates on their journey.'
  },
  
  images: [
    { src: 'https://placehold.co/600x400.png?text=Ảnh+1', alt: { vi: 'Văn phòng làm việc', ja: 'オフィス', en: 'Office Space' }, dataAiHint: 'modern office interior' },
    { src: 'https://placehold.co/600x400.png?text=Ảnh+2', alt: { vi: 'Hoạt động đội nhóm', ja: 'チーム活動', en: 'Team Activity' }, dataAiHint: 'team building activity' },
    { src: 'https://placehold.co/600x400.png?text=Ảnh+3', alt: { vi: 'Lễ ký kết hợp tác', ja: 'パートナーシップ調印式', en: 'Partnership Signing Ceremony' }, dataAiHint: 'partnership signing ceremony' },
    { src: 'https://placehold.co/600x400.png?text=Ảnh+4', alt: { vi: 'Đào tạo nhân viên', ja: '従業員研修', en: 'Employee Training' }, dataAiHint: 'employee training session' },
  ],

  history: [
    { year: '2010', event: { vi: 'Thành lập công ty cổ phần TVC.', ja: 'TVC株式会社設立。', en: 'Established TVC Corporation.' } },
    { year: '2015', event: { vi: 'Nhận giấy phép hoạt động dịch vụ đưa người lao động Việt Nam đi làm việc ở nước ngoài.', ja: 'ベトナム人労働者を海外に派遣するサービス活動許可を取得。', en: 'Received license to operate services for sending Vietnamese workers abroad.' } },
    { year: '2019', event: { vi: 'Hợp tác với hơn 50 nghiệp đoàn và xí nghiệp lớn tại Nhật Bản.', ja: '日本の50以上の組合や大手企業と協力。', en: 'Partnered with over 50 major unions and companies in Japan.' } },
    { year: '2023', event: { vi: 'Đạt mốc 5,000 lao động được phái cử thành công sang Nhật Bản làm việc.', ja: '日本への5,000人目の労働者の派遣成功を達成。', en: 'Successfully dispatched 5,000 workers to work in Japan.' } },
  ],

  info: {
    founded: '2010',
    size: {
        vi: '50 - 100 nhân viên',
        ja: '50～100名',
        en: '50 - 100 employees'
    },
    website: 'https://tvc-corp.co.jp',
    license: 'Số 123/LĐTBXH-GP',
  },

  industries: {
    main: {
        vi: 'Xây dựng, Cơ khí, Nông nghiệp, Thực phẩm',
        ja: '建設、機械、農業、食品',
        en: 'Construction, Machinery, Agriculture, Food'
    },
    secondary: {
        vi: 'Điều dưỡng, Dệt may, Điện tử',
        ja: '介護、繊維、電子',
        en: 'Nursing, Textile, Electronics'
    },
  },

  benefits: [
    { vi: 'Hỗ trợ đào tạo tiếng Nhật và kỹ năng chuyên môn trước khi bay.', ja: '渡航前の日本語・専門スキル研修をサポート。', en: 'Support for Japanese language and professional skills training before departure.' },
    { vi: 'Cam kết chi phí minh bạch, rõ ràng, không phát sinh chi phí ẩn.', ja: '透明性の高い明確な費用、隠れたコストなしを約束。', en: 'Commitment to transparent, clear costs with no hidden fees.' },
    { vi: 'Hỗ trợ cộng đồng người Việt tại Nhật, giải quyết các vấn đề phát sinh.', ja: '在日ベトナム人コミュニティを支援し、発生した問題を解決。', en: 'Support the Vietnamese community in Japan and resolve any arising issues.' },
    { vi: 'Tư vấn lộ trình phát triển sự nghiệp sau khi hoàn thành hợp đồng.', ja: '契約完了後のキャリア開発ロードマップをコンサルティング。', en: 'Consulting on career development roadmaps after contract completion.' },
    { vi: 'Nhiều chương trình hỗ trợ vay vốn cho người lao động.', ja: '労働者向けの多くのローン支援プログラム。', en: 'Many loan support programs for workers.' },
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
        sizeLabel: 'Quy mô',
        licenseLabel: 'Giấy phép',
        websiteLabel: 'Website',
        industriesTitle: 'Ngành nghề & Lĩnh vực',
        mainIndustriesLabel: 'Ngành nghề chính',
        secondaryIndustriesLabel: 'Ngành nghề khác',
        benefitsTitle: 'Phúc lợi & Môi trường'
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
        industriesTitle: '業種と分野',
        mainIndustriesLabel: '主要業種',
        secondaryIndustriesLabel: 'その他の業種',
        benefitsTitle: '福利厚生と環境'
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
        industriesTitle: 'Industries & Sectors',
        mainIndustriesLabel: 'Main Industries',
        secondaryIndustriesLabel: 'Other Industries',
        benefitsTitle: 'Benefits & Environment'
    }
};

type Language = keyof typeof contentByLang;

const SectionCard = ({ title, icon: Icon, children, className, onEditClick }: { title: string, icon: React.ElementType, children: React.ReactNode, className?: string, onEditClick: () => void }) => (
    <Card className={cn("shadow-lg", className)}>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-xl flex items-center gap-3">
                <Icon className="text-primary h-6 w-6"/>{title}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onEditClick}>
                <Edit className="h-4 w-4"/>
            </Button>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

export default function EmployerDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') || 'vi') as Language;
  
  const [employer, setEmployer] = useState(mockEmployerData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<{title: string, content: any, field: string } | null>(null);
  const [tempContent, setTempContent] = useState<any>('');
  
  const t = contentByLang[lang] || contentByLang['vi'];

  const handleEditClick = (title: string, currentContent: any, field: string) => {
    setEditingModule({ title, content: currentContent, field });
    setTempContent(JSON.parse(JSON.stringify(currentContent)));
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingModule) return;
    
    setEmployer(prev => {
        const newState = { ...prev };
        const { field } = editingModule;

        if (['about', 'info', 'benefits', 'industries', 'history', 'images', 'banner', 'logo'].includes(field)) {
             // @ts-ignore
            newState[field as keyof typeof newState] = tempContent;
        } else if (field === 'header') {
            // @ts-ignore
            newState.name = tempContent.name;
            // @ts-ignore
            newState.type = tempContent.type;
            // @ts-ignore
            newState.location = tempContent.location;
        }
        
        return newState;
    });

    setIsEditDialogOpen(false);
    setEditingModule(null);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'banner' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEmployer(prev => ({ ...prev, [field]: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const renderEditContent = () => {
    if (!editingModule) return <p>Chức năng đang được phát triển.</p>;
    // The implementation for each edit form will be added in subsequent prompts.
    return <p>Chức năng chỉnh sửa cho module "{editingModule.title}" đang được phát triển.</p>;
  };

  return (
    <>
      <div className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <Card className="shadow-2xl overflow-hidden mb-8">
              <CardHeader className="p-0 relative">
                <div className="relative w-full h-48 md:h-64">
                  <Image src={employer.banner} alt={`${employer.name[lang]} banner`} fill className="object-cover" data-ai-hint={employer.dataAiHintBanner}/>
                  <div className="absolute inset-0 bg-black/40" />
                  <Label htmlFor="banner-upload" className="absolute top-4 right-4 z-10">
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
                            <AvatarImage src={employer.logo} alt={employer.name[lang]} data-ai-hint={employer.dataAiHint} />
                            <AvatarFallback>{employer.name[lang].charAt(0)}</AvatarFallback>
                          </Avatar>
                           <Label htmlFor="logo-upload" className="absolute bottom-1 right-1 cursor-pointer bg-secondary p-2 rounded-full border-2 border-card">
                              <Camera className="h-4 w-4 text-secondary-foreground" />
                           </Label>
                           <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                      </div>
                      <div className="flex-grow pt-16 md:pt-20">
                          <h1 className="text-2xl md:text-3xl font-headline font-bold">{employer.name[lang]}</h1>
                          <p className="font-semibold text-primary">{employer.type[lang]}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              {employer.location[lang]}
                          </p>
                      </div>
                      <div className="absolute top-16 right-0 md:top-20 md:right-0">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick('Thông tin chung', {name: employer.name, type: employer.type, location: employer.location }, 'header')}>
                              <Edit className="h-5 w-5"/>
                          </Button>
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
                      <p className="text-muted-foreground whitespace-pre-line">{employer.about[lang]}</p>
                  </SectionCard>
                  <SectionCard title={t.imagesTitle} icon={ImageIcon} onEditClick={() => handleEditClick(t.imagesTitle, employer.images, 'images')}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {employer.images.map((img, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                  <Image src={img.src} alt={img.alt[lang]} fill className="object-cover" data-ai-hint={img.dataAiHint} />
                              </div>
                          ))}
                      </div>
                  </SectionCard>
                  <SectionCard title={t.historyTitle} icon={History} onEditClick={() => handleEditClick(t.historyTitle, employer.history, 'history')}>
                      <ul className="space-y-4">
                          {employer.history.map((item, index) => (
                              <li key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                                  <p className="font-bold text-primary">{item.year}</p>
                                  <p className="text-sm text-muted-foreground">{item.event[lang]}</p>
                              </li>
                          ))}
                      </ul>
                  </SectionCard>
              </div>
              
              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                  <SectionCard title={t.infoTitle} icon={Building} onEditClick={() => handleEditClick(t.infoTitle, employer.info, 'info')}>
                      <div className="space-y-3 text-sm">
                          <p><strong>{t.foundedLabel}:</strong> {employer.info.founded}</p>
                          <p><strong>{t.sizeLabel}:</strong> {employer.info.size[lang]}</p>
                          <p><strong>{t.licenseLabel}:</strong> {employer.info.license}</p>
                          <p><strong>{t.websiteLabel}:</strong> <a href={employer.info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{employer.info.website}</a></p>
                      </div>
                  </SectionCard>
                  <SectionCard title={t.industriesTitle} icon={Briefcase} onEditClick={() => handleEditClick(t.industriesTitle, employer.industries, 'industries')}>
                      <div className="space-y-3 text-sm">
                          <p><strong>{t.mainIndustriesLabel}:</strong> {employer.industries.main[lang]}</p>
                          <p><strong>{t.secondaryIndustriesLabel}:</strong> {employer.industries.secondary[lang]}</p>
                      </div>
                  </SectionCard>
                  <SectionCard title={t.benefitsTitle} icon={Award} onEditClick={() => handleEditClick(t.benefitsTitle, employer.benefits, 'benefits')}>
                      <ul className="space-y-2 text-sm">
                          {employer.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"/>
                                  <span className="text-muted-foreground">{benefit[lang]}</span>
                              </li>
                          ))}
                      </ul>
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
