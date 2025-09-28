
'use client';

import { useState, use, useEffect } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, History, FileText, Briefcase, Award, Edit, Camera, Info, PlusCircle, Trash2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock data now serves as placeholders
const placeholderEmployerData = {
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
  banner: 'https://placehold.co/1200x400.png?text=Tải+lên+ảnh+bìa',
  
  about: {
    vi: 'Công ty phái cử ABC là một trong những đơn vị hàng đầu trong lĩnh vực cung ứng nhân lực cho thị trường Nhật Bản. Với nhiều năm kinh nghiệm, chúng tôi tự hào đã chắp cánh cho hàng ngàn ước mơ của người lao động Việt Nam...',
    ja: 'ABC株式会社は、日本市場への人材供給分野におけるリーディングカンパニーの一つです。...',
    en: 'ABC Corporation is a leading company in supplying labor to the Japanese market. ...'
  },
  
  images: [
    { src: 'https://placehold.co/600x400.png?text=Ảnh+1', alt: { vi: 'Văn phòng làm việc', ja: 'オフィス', en: 'Office Space' }, dataAiHint: 'modern office interior' },
    { src: 'https://placehold.co/600x400.png?text=Ảnh+2', alt: { vi: 'Hoạt động đội nhóm', ja: 'チーム活動', en: 'Team Activity' }, dataAiHint: 'team building activity' },
    { src: 'https://placehold.co/600x400.png?text=Ảnh+3', alt: { vi: 'Lễ ký kết hợp tác', ja: 'パートナーシップ調印式', en: 'Partnership Signing Ceremony' }, dataAiHint: 'partnership signing ceremony' },
    { src: 'https://placehold.co/600x400.png?text=Ảnh+4', alt: { vi: 'Đào tạo nhân viên', ja: '従業員研修', en: 'Employee Training' }, dataAiHint: 'employee training session' },
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
  },

  industries: {
    main: { vi: 'Xây dựng, Cơ khí, Nông nghiệp, Thực phẩm', ja: '建設、機械、農業、食品', en: 'Construction, Machinery, Agriculture, Food' },
    secondary: { vi: 'Điều dưỡng, Dệt may, Điện tử', ja: '介護、繊維、電子', en: 'Nursing, Textile, Electronics' },
  },

  benefits: [
    { vi: 'Hỗ trợ đào tạo tiếng Nhật và kỹ năng chuyên môn trước khi bay.', ja: '渡航前の日本語・専門スキル研修をサポート。', en: 'Support for Japanese language and professional skills training before departure.' },
    { vi: 'Cam kết chi phí minh bạch, rõ ràng, không phát sinh chi phí ẩn.', ja: '透明性の高い明確な費用、隠れたコストなしを約束。', en: 'Commitment to transparent, clear costs with no hidden fees.' },
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
    images: [],
    history: [],
    info: { founded: '', size: { vi: '', ja: '', en: '' }, website: '', license: '' },
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

export default function EmployerDetailPage({ params: paramsProp }: { params: { id: string } }) {
  const params = use(paramsProp);
  
  if (params.id !== 'Z000') {
    notFound();
  }

  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') || 'vi') as Language;
  
  const [employer, setEmployer] = useState({ ...emptyEmployerData });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<{title: string, field: string } | null>(null);
  const [tempContent, setTempContent] = useState<any>('');
  
  const t = contentByLang[lang] || contentByLang['vi'];

  const handleEditClick = (title: string, currentContent: any, field: string) => {
    setEditingModule({ title, field });
    setTempContent(JSON.parse(JSON.stringify(currentContent)));
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingModule) return;
    
    setEmployer(prev => {
        const newState = { ...prev };
        const { field } = editingModule;
        // @ts-ignore
        newState[field] = tempContent;
        return newState;
    });

    setIsEditDialogOpen(false);
    setEditingModule(null);
  };

  const handleTempArrayChange = (index: number, field: string, value: any) => {
    setTempContent((prev: any[]) => {
      const newArray = [...prev];
      newArray[index] = { ...newArray[index], [field]: { ...newArray[index][field], [lang]: value } };
      return newArray;
    });
  };
  
  const addTempArrayItem = (field: string) => {
    if (field === 'history') {
      setTempContent((prev: any[]) => [...prev, { year: new Date().getFullYear().toString(), event: { vi: '', ja: '', en: '' } }]);
    } else if (field === 'benefits') {
       setTempContent((prev: any[]) => [...prev, { vi: '', ja: '', en: '' }]);
    }
  };

  const removeTempArrayItem = (index: number) => {
    setTempContent((prev: any[]) => prev.filter((_, i) => i !== index));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'banner' | 'logo' | `images.${number}`) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newUrl = event.target?.result as string;
        setEmployer(prev => {
          const newState = JSON.parse(JSON.stringify(prev));
          if (field === 'banner' || field === 'logo') {
            newState[field] = newUrl;
          } else if (field.startsWith('images.')) {
            const index = parseInt(field.split('.')[1], 10);
            newState.images[index].src = newUrl;
          }
          return newState;
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const renderEditContent = () => {
    if (!editingModule) return <p>Chức năng đang được phát triển.</p>;

    switch(editingModule.field) {
        case 'about':
            return <Textarea placeholder={`Ví dụ: ${placeholderEmployerData.about[lang]}`} value={tempContent[lang]} onChange={(e) => setTempContent({...tempContent, [lang]: e.target.value})} rows={8} />;
        
        case 'images':
            return (
              <div className="space-y-4">
                 {tempContent.map((img: any, index: number) => (
                   <div key={index} className="flex items-center gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                         <Image src={img.src} alt={img.alt[lang]} fill className="object-cover rounded-md"/>
                      </div>
                      <Input 
                        placeholder={`Ví dụ: ${placeholderEmployerData.images[index]?.alt[lang]}`}
                        value={img.alt[lang]}
                        onChange={(e) => {
                            const newImages = [...tempContent];
                            newImages[index] = {...newImages[index], alt: {...newImages[index].alt, [lang]: e.target.value}};
                            setTempContent(newImages);
                        }}
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
                            <Input placeholder="Năm" value={item.year} onChange={(e) => handleTempArrayChange(index, 'year', e.target.value)} />
                            <Input placeholder={`Ví dụ: ${placeholderEmployerData.history[index]?.event[lang]}`} value={item.event[lang]} onChange={(e) => handleTempArrayChange(index, 'event', e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => removeTempArrayItem(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => addTempArrayItem('history')}><PlusCircle className="mr-2"/> Thêm mốc</Button>
                </div>
            );
        case 'info':
             return (
                <div className="space-y-4">
                    <div className="space-y-2"><Label>{t.foundedLabel}</Label><Input placeholder={`Ví dụ: ${placeholderEmployerData.info.founded}`} value={tempContent.founded} onChange={(e) => setTempContent({...tempContent, founded: e.target.value})} /></div>
                    <div className="space-y-2"><Label>{t.sizeLabel}</Label><Input placeholder={`Ví dụ: ${placeholderEmployerData.info.size[lang]}`} value={tempContent.size[lang]} onChange={(e) => setTempContent({...tempContent, size: {...tempContent.size, [lang]: e.target.value}})} /></div>
                    <div className="space-y-2"><Label>{t.licenseLabel}</Label><Input placeholder={`Ví dụ: ${placeholderEmployerData.info.license}`} value={tempContent.license} onChange={(e) => setTempContent({...tempContent, license: e.target.value})} /></div>
                    <div className="space-y-2"><Label>{t.websiteLabel}</Label><Input placeholder={`Ví dụ: ${placeholderEmployerData.info.website}`} value={tempContent.website} onChange={(e) => setTempContent({...tempContent, website: e.target.value})} /></div>
                </div>
             );
        case 'industries':
             return (
                <div className="space-y-4">
                    <div className="space-y-2"><Label>{t.mainIndustriesLabel}</Label><Input placeholder={`Ví dụ: ${placeholderEmployerData.industries.main[lang]}`} value={tempContent.main[lang]} onChange={(e) => setTempContent({...tempContent, main: {...tempContent.main, [lang]: e.target.value}})} /></div>
                    <div className="space-y-2"><Label>{t.secondaryIndustriesLabel}</Label><Input placeholder={`Ví dụ: ${placeholderEmployerData.industries.secondary[lang]}`} value={tempContent.secondary[lang]} onChange={(e) => setTempContent({...tempContent, secondary: {...tempContent.secondary, [lang]: e.target.value}})} /></div>
                </div>
             );
        case 'benefits':
             return (
                <div className="space-y-4">
                     {tempContent.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input placeholder={`Ví dụ: ${placeholderEmployerData.benefits[index]?.[lang]}`} value={item[lang]} onChange={(e) => handleTempArrayChange(index, 'benefit', e.target.value)} />
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
                            <AvatarFallback>{employer.name[lang]?.charAt(0) || 'A'}</AvatarFallback>
                          </Avatar>
                           <Label htmlFor="logo-upload" className="absolute bottom-1 right-1 cursor-pointer bg-secondary p-2 rounded-full border-2 border-card">
                              <Camera className="h-4 w-4 text-secondary-foreground" />
                           </Label>
                           <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                      </div>
                      <div className="flex-grow pt-16 md:pt-20">
                          <Input className="text-2xl md:text-3xl font-headline font-bold border-0 shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0" placeholder={placeholderEmployerData.name[lang]} value={employer.name[lang]} onChange={(e) => setEmployer({...employer, name: {...employer.name, [lang]: e.target.value}})} />
                          <Input className="font-semibold text-primary border-0 shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0" placeholder={placeholderEmployerData.type[lang]} value={employer.type[lang]} onChange={(e) => setEmployer({...employer, type: {...employer.type, [lang]: e.target.value}})} />
                          <Input className="text-sm text-muted-foreground border-0 shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0" placeholder={placeholderEmployerData.location[lang]} value={employer.location[lang]} onChange={(e) => setEmployer({...employer, location: {...employer.location, [lang]: e.target.value}})} />
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
                      <Textarea className="min-h-[150px] text-muted-foreground" placeholder={`Ví dụ: ${placeholderEmployerData.about[lang]}`} value={employer.about[lang]} onChange={(e) => setEmployer({...employer, about: {...employer.about, [lang]: e.target.value}})} />
                  </SectionCard>
                  <SectionCard title={t.imagesTitle} icon={ImageIcon} onEditClick={() => handleEditClick(t.imagesTitle, employer.images, 'images')}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {employer.images.map((img, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                  <Image src={img.src} alt={img.alt[lang]} fill className="object-cover" />
                                   <Label htmlFor={`image-upload-${index}`} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="h-6 w-6 text-white"/>
                                   </Label>
                                   <Input id={`image-upload-${index}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, `images.${index}`)} />
                              </div>
                          ))}
                      </div>
                  </SectionCard>
                  <SectionCard title={t.historyTitle} icon={History} onEditClick={() => handleEditClick(t.historyTitle, employer.history, 'history')}>
                      <ul className="space-y-4">
                          {employer.history.map((item, index) => (
                              <li key={index} className="relative pl-6">
                                  <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary" />
                                  <Input className="font-bold text-primary mb-1 border-0 shadow-none p-0 h-auto focus-visible:ring-0" placeholder={`Ví dụ: ${placeholderEmployerData.history[index]?.year}`} value={item.year} onChange={(e) => { const newHistory = [...employer.history]; newHistory[index].year = e.target.value; setEmployer({...employer, history: newHistory}); }} />
                                  <Textarea className="text-sm text-muted-foreground min-h-[40px] border-0 shadow-none p-0 h-auto focus-visible:ring-0" placeholder={`Ví dụ: ${placeholderEmployerData.history[index]?.event[lang]}`} value={item.event[lang]} onChange={(e) => { const newHistory = [...employer.history]; newHistory[index].event[lang] = e.target.value; setEmployer({...employer, history: newHistory}); }} />
                              </li>
                          ))}
                      </ul>
                  </SectionCard>
              </div>
              
              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                  <SectionCard title={t.infoTitle} icon={Building} onEditClick={() => handleEditClick(t.infoTitle, employer.info, 'info')}>
                      <div className="space-y-3 text-sm">
                          <p><strong>{t.foundedLabel}:</strong> <Input className="inline-block w-auto p-0 h-auto" placeholder={`Ví dụ: ${placeholderEmployerData.info.founded}`} value={employer.info.founded} onChange={(e) => setEmployer({...employer, info: {...employer.info, founded: e.target.value}})} /></p>
                          <p><strong>{t.sizeLabel}:</strong> <Input className="inline-block w-auto p-0 h-auto" placeholder={`Ví dụ: ${placeholderEmployerData.info.size[lang]}`} value={employer.info.size[lang]} onChange={(e) => setEmployer({...employer, info: {...employer.info.size, [lang]: e.target.value}})} /></p>
                          <p><strong>{t.licenseLabel}:</strong> <Input className="inline-block w-auto p-0 h-auto" placeholder={`Ví dụ: ${placeholderEmployerData.info.license}`} value={employer.info.license} onChange={(e) => setEmployer({...employer, info: {...employer.info, license: e.target.value}})} /></p>
                          <p><strong>{t.websiteLabel}:</strong> <Input className="inline-block w-auto p-0 h-auto text-primary" placeholder={`Ví dụ: ${placeholderEmployerData.info.website}`} value={employer.info.website} onChange={(e) => setEmployer({...employer, info: {...employer.info, website: e.target.value}})} /></p>
                      </div>
                  </SectionCard>
                  <SectionCard title={t.industriesTitle} icon={Briefcase} onEditClick={() => handleEditClick(t.industriesTitle, employer.industries, 'industries')}>
                     <div className="space-y-3 text-sm">
                          <p><strong>{t.mainIndustriesLabel}:</strong> <Textarea className="text-sm min-h-[40px]" placeholder={`Ví dụ: ${placeholderEmployerData.industries.main[lang]}`} value={employer.industries.main[lang]} onChange={(e) => setEmployer(prev => ({...prev, industries: {...prev.industries, main: {...prev.industries.main, [lang]: e.target.value}} }))} /></p>
                          <p><strong>{t.secondaryIndustriesLabel}:</strong> <Textarea className="text-sm min-h-[40px]" placeholder={`Ví dụ: ${placeholderEmployerData.industries.secondary[lang]}`} value={employer.industries.secondary[lang]} onChange={(e) => setEmployer(prev => ({...prev, industries: {...prev.industries, secondary: {...prev.industries.secondary, [lang]: e.target.value}}}))} /></p>
                      </div>
                  </SectionCard>
                  <SectionCard title={t.benefitsTitle} icon={Award} onEditClick={() => handleEditClick(t.benefitsTitle, employer.benefits, 'benefits')}>
                      <ul className="space-y-2 text-sm">
                          {employer.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                  <Textarea className="text-sm text-muted-foreground min-h-[40px] border-0 shadow-none p-0 h-auto focus-visible:ring-0" placeholder={`Ví dụ: ${placeholderEmployerData.benefits[index]?.[lang]}`} value={benefit[lang]} onChange={(e) => { const newBenefits = [...employer.benefits]; newBenefits[index][lang] = e.target.value; setEmployer({...employer, benefits: newBenefits}); }} />
                              </li>
                          ))}
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

    