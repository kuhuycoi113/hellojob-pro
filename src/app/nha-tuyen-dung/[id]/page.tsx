
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock data based on the provided image
const mockEmployerData = {
  id: 'tvc-corporation',
  name: 'Công ty Cổ phần TVC',
  type: 'Công ty phái cử',
  location: 'Hà Nội, Việt Nam',
  logo: '/img/favi2.png',
  dataAiHint: 'company logo',
  banner: 'https://placehold.co/1200x400.png?text=Banner',
  dataAiHintBanner: 'modern office building',
  
  about: 'Công ty phái cử TVC là một trong những đơn vị hàng đầu trong lĩnh vực cung ứng nhân lực cho thị trường Nhật Bản. Với nhiều năm kinh nghiệm, chúng tôi tự hào đã chắp cánh cho hàng ngàn ước mơ của người lao động Việt Nam, mang đến những cơ hội việc làm chất lượng và một lộ trình phát triển sự nghiệp bền vững. TVC cam kết minh bạch, tận tâm và luôn đồng hành cùng ứng viên trên mọi chặng đường.',
  
  images: [
    { src: 'https://placehold.co/600x400.png?text=Ảnh+1', alt: 'Văn phòng làm việc', dataAiHint: 'modern office interior' },
    { src: 'https://placehold.co/600x400.png?text=Ảnh+2', alt: 'Hoạt động đội nhóm', dataAiHint: 'team building activity' },
    { src: 'https://placehold.co/600x400.png?text=Ảnh+3', alt: 'Lễ ký kết hợp tác', dataAiHint: 'partnership signing ceremony' },
    { src: 'https://placehold.co/600x400.png?text=Ảnh+4', alt: 'Đào tạo nhân viên', dataAiHint: 'employee training session' },
  ],

  history: [
    { year: '2010', event: 'Thành lập công ty cổ phần TVC.' },
    { year: '2015', event: 'Nhận giấy phép hoạt động dịch vụ đưa người lao động Việt Nam đi làm việc ở nước ngoài.' },
    { year: '2019', event: 'Hợp tác với hơn 50 nghiệp đoàn và xí nghiệp lớn tại Nhật Bản.' },
    { year: '2023', event: 'Đạt mốc 5,000 lao động được phái cử thành công sang Nhật Bản làm việc.' },
  ],

  info: {
    founded: '2010',
    size: '50 - 100 nhân viên',
    website: 'https://tvc-corp.co.jp',
    license: 'Số 123/LĐTBXH-GP',
  },

  industries: {
    main: 'Xây dựng, Cơ khí, Nông nghiệp, Thực phẩm',
    secondary: 'Điều dưỡng, Dệt may, Điện tử',
  },

  benefits: [
    'Hỗ trợ đào tạo tiếng Nhật và kỹ năng chuyên môn trước khi bay.',
    'Cam kết chi phí minh bạch, rõ ràng, không phát sinh chi phí ẩn.',
    'Hỗ trợ cộng đồng người Việt tại Nhật, giải quyết các vấn đề phát sinh.',
    'Tư vấn lộ trình phát triển sự nghiệp sau khi hoàn thành hợp đồng.',
    'Nhiều chương trình hỗ trợ vay vốn cho người lao động.',
  ]
};

// Reusable Section Card Component with Edit Button
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
  const [employer, setEmployer] = useState(mockEmployerData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<{title: string, content: any, field: string } | null>(null);
  const [tempContent, setTempContent] = useState<any>('');

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

  const renderAboutEdit = () => (
      <Textarea 
          value={tempContent}
          onChange={(e) => setTempContent(e.target.value)}
          rows={10}
          className="text-base"
      />
  );
  
  const renderInfoEdit = () => (
      <div className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="founded">Năm thành lập</Label>
              <Input id="founded" value={tempContent.founded} onChange={(e) => setTempContent({...tempContent, founded: e.target.value})} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="size">Quy mô</Label>
              <Input id="size" value={tempContent.size} onChange={(e) => setTempContent({...tempContent, size: e.target.value})} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="license">Giấy phép</Label>
              <Input id="license" value={tempContent.license} onChange={(e) => setTempContent({...tempContent, license: e.target.value})} />
          </div>
           <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={tempContent.website} onChange={(e) => setTempContent({...tempContent, website: e.target.value})} />
          </div>
      </div>
  );

  const renderBenefitsEdit = () => {
    const handleBenefitChange = (index: number, value: string) => {
        const newBenefits = [...tempContent];
        newBenefits[index] = value;
        setTempContent(newBenefits);
    };

    const addBenefit = () => {
        setTempContent([...tempContent, '']);
    };

    const removeBenefit = (index: number) => {
        setTempContent(tempContent.filter((_: any, i: number) => i !== index));
    };

    return (
        <div className="space-y-4">
            {tempContent.map((benefit: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                    <Input
                        value={benefit}
                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                        placeholder={`Phúc lợi #${index + 1}`}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeBenefit(index)}>
                        <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                </div>
            ))}
            <Button variant="outline" onClick={addBenefit} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4"/> Thêm phúc lợi
            </Button>
        </div>
    );
  };
  
  const renderIndustriesEdit = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="main-industries">Ngành nghề chính</Label>
        <Input
          id="main-industries"
          value={tempContent.main}
          onChange={(e) => setTempContent({ ...tempContent, main: e.target.value })}
          placeholder="VD: Xây dựng, Cơ khí, Nông nghiệp..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="secondary-industries">Ngành nghề khác</Label>
        <Input
          id="secondary-industries"
          value={tempContent.secondary}
          onChange={(e) => setTempContent({ ...tempContent, secondary: e.target.value })}
          placeholder="VD: Điều dưỡng, Dệt may..."
        />
      </div>
    </div>
  );

  const renderHistoryEdit = () => {
    const handleHistoryChange = (index: number, field: 'year' | 'event', value: string) => {
        const newHistory = [...tempContent];
        newHistory[index] = { ...newHistory[index], [field]: value };
        setTempContent(newHistory);
    };

    const addHistoryItem = () => {
        setTempContent([...tempContent, { year: '', event: '' }]);
    };

    const removeHistoryItem = (index: number) => {
        setTempContent(tempContent.filter((_: any, i: number) => i !== index));
    };

    return (
        <div className="space-y-4">
            {tempContent.map((item: { year: string, event: string }, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 border rounded-lg relative items-end">
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor={`history-year-${index}`}>Năm</Label>
                        <Input
                            id={`history-year-${index}`}
                            value={item.year}
                            onChange={(e) => handleHistoryChange(index, 'year', e.target.value)}
                            placeholder="2024"
                        />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                        <Label htmlFor={`history-event-${index}`}>Sự kiện</Label>
                        <Input
                            id={`history-event-${index}`}
                            value={item.event}
                            onChange={(e) => handleHistoryChange(index, 'event', e.target.value)}
                            placeholder="Mô tả sự kiện"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button variant="ghost" size="icon" onClick={() => removeHistoryItem(index)}>
                            <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                    </div>
                </div>
            ))}
            <Button variant="outline" onClick={addHistoryItem} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Thêm mốc sự kiện
            </Button>
        </div>
    );
  };

  const renderHeaderEdit = () => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="company-name">Tên công ty</Label>
            <Input id="company-name" value={tempContent.name} onChange={(e) => setTempContent({...tempContent, name: e.target.value})} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="company-type">Loại hình</Label>
            <Input id="company-type" value={tempContent.type} onChange={(e) => setTempContent({...tempContent, type: e.target.value})} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="company-location">Địa điểm</Label>
            <Input id="company-location" value={tempContent.location} onChange={(e) => setTempContent({...tempContent, location: e.target.value})} />
        </div>
    </div>
  );

  const renderImagesEdit = () => {
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, indexToUpdate: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newImages = [...tempContent];
                newImages[indexToUpdate].src = event.target?.result as string;
                setTempContent(newImages);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newImage = {
                    src: event.target?.result as string,
                    alt: 'Ảnh mới',
                    dataAiHint: 'new company image'
                };
                setTempContent([...tempContent, newImage]);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const removeImage = (indexToRemove: number) => {
        setTempContent(tempContent.filter((_: any, i: number) => i !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tempContent.map((img: {src:string, alt:string}, index: number) => (
                    <div key={index} className="relative group">
                         <div className="relative aspect-square rounded-lg overflow-hidden border">
                            <Image src={img.src} alt={img.alt} fill className="object-cover"/>
                         </div>
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Label htmlFor={`img-upload-${index}`} className="cursor-pointer p-2 bg-black/50 rounded-full text-white">
                                <Camera className="h-5 w-5"/>
                            </Label>
                            <Input id={`img-upload-${index}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageFileChange(e, index)} />
                             <Button variant="destructive" size="icon" className="h-9 w-9 rounded-full" onClick={() => removeImage(index)}>
                                <Trash2 className="h-5 w-5"/>
                            </Button>
                         </div>
                         <p className="text-xs text-center mt-1 truncate text-muted-foreground">{img.alt}</p>
                    </div>
                ))}
                 <Label htmlFor="new-image-upload" className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mt-2 text-center">Tải ảnh mới</span>
                     <Input id="new-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleNewImageUpload} />
                </Label>
            </div>
        </div>
    )
  };


  const renderEditContent = () => {
    if (!editingModule) return null;
    switch(editingModule.field) {
        case 'about':
            return renderAboutEdit();
        case 'info':
             return renderInfoEdit();
        case 'benefits':
            return renderBenefitsEdit();
        case 'industries':
            return renderIndustriesEdit();
        case 'history':
            return renderHistoryEdit();
        case 'header':
            return renderHeaderEdit();
        case 'images':
            return renderImagesEdit();
        default:
            return <p>Chức năng này đang được phát triển. Vui lòng quay lại sau.</p>;
    }
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
                  <Image src={employer.banner} alt={`${employer.name} banner`} fill className="object-cover" data-ai-hint={employer.dataAiHintBanner}/>
                  <div className="absolute inset-0 bg-black/40" />
                  <Label htmlFor="banner-upload" className="absolute top-4 right-4 z-10">
                     <Button variant="secondary" size="sm" asChild>
                       <span><Camera className="mr-2 h-4 w-4" /> Sửa ảnh bìa</span>
                     </Button>
                     <Input id="banner-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                  </Label>
                </div>
                <div className="p-6 bg-card">
                  <div className="flex flex-col md:flex-row gap-6 items-start -mt-24 md:-mt-20 relative">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-card bg-card shadow-lg">
                            <AvatarImage src={employer.logo} alt={employer.name} data-ai-hint={employer.dataAiHint} />
                            <AvatarFallback>{employer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                           <Label htmlFor="logo-upload" className="absolute bottom-1 right-1 cursor-pointer bg-secondary p-2 rounded-full border-2 border-card">
                              <Camera className="h-4 w-4 text-secondary-foreground" />
                           </Label>
                           <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                      </div>
                      <div className="flex-grow pt-16 md:pt-20">
                          <h1 className="text-2xl md:text-3xl font-headline font-bold">{employer.name}</h1>
                          <p className="font-semibold text-primary">{employer.type}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              {employer.location}
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
                  <SectionCard title="Giới thiệu doanh nghiệp" icon={FileText} onEditClick={() => handleEditClick('Giới thiệu doanh nghiệp', employer.about, 'about')}>
                      <p className="text-muted-foreground whitespace-pre-line">{employer.about}</p>
                  </SectionCard>
                  <SectionCard title="Ảnh về doanh nghiệp" icon={ImageIcon} onEditClick={() => handleEditClick('Ảnh về doanh nghiệp', employer.images, 'images')}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {employer.images.map((img, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                  <Image src={img.src} alt={img.alt} fill className="object-cover" data-ai-hint={img.dataAiHint} />
                              </div>
                          ))}
                      </div>
                  </SectionCard>
                  <SectionCard title="Lịch sử &amp; các mốc sự kiện" icon={History} onEditClick={() => handleEditClick('Lịch sử & các mốc sự kiện', employer.history, 'history')}>
                      <ul className="space-y-4">
                          {employer.history.map((item, index) => (
                              <li key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                                  <p className="font-bold text-primary">{item.year}</p>
                                  <p className="text-sm text-muted-foreground">{item.event}</p>
                              </li>
                          ))}
                      </ul>
                  </SectionCard>
              </div>
              
              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                  <SectionCard title="Thông tin doanh nghiệp" icon={Building} onEditClick={() => handleEditClick('Thông tin doanh nghiệp', employer.info, 'info')}>
                      <div className="space-y-3 text-sm">
                          <p><strong>Năm thành lập:</strong> {employer.info.founded}</p>
                          <p><strong>Quy mô:</strong> {employer.info.size}</p>
                          <p><strong>Giấy phép:</strong> {employer.info.license}</p>
                          <p><strong>Website:</strong> <a href={employer.info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{employer.info.website}</a></p>
                      </div>
                  </SectionCard>
                  <SectionCard title="Ngành nghề &amp; Lĩnh vực" icon={Briefcase} onEditClick={() => handleEditClick('Ngành nghề & Lĩnh vực', employer.industries, 'industries')}>
                      <div className="space-y-3 text-sm">
                          <p><strong>Ngành nghề chính:</strong> {employer.industries.main}</p>
                          <p><strong>Ngành nghề khác:</strong> {employer.industries.secondary}</p>
                      </div>
                  </SectionCard>
                  <SectionCard title="Phúc lợi &amp; Môi trường" icon={Award} onEditClick={() => handleEditClick('Phúc lợi & Môi trường', employer.benefits, 'benefits')}>
                      <ul className="space-y-2 text-sm">
                          {employer.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"/>
                                  <span className="text-muted-foreground">{benefit}</span>
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
