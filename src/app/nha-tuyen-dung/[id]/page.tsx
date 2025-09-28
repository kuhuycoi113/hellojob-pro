'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calendar, MapPin, Users, Image as ImageIcon, History, FileText, Briefcase, Award, Edit, Camera, CheckCircle, Info } from 'lucide-react';
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
  const [editingModule, setEditingModule] = useState<{title: string, content: any, field: keyof typeof employer | `info.${keyof typeof mockEmployerData['info']}` } | null>(null);
  const [tempContent, setTempContent] = useState<any>('');

  const handleEditClick = (title: string, currentContent: any, field: keyof typeof employer | `info.${keyof typeof mockEmployerData['info']}`) => {
    setEditingModule({ title, content: currentContent, field });
    setTempContent(currentContent);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingModule) return;
    
    setEmployer(prev => {
        const newState = { ...prev };
        const { field } = editingModule;

        if (field.startsWith('info.')) {
            const infoField = field.split('.')[1] as keyof typeof mockEmployerData['info'];
            newState.info[infoField] = tempContent[infoField];
        } else {
            // @ts-ignore
            newState[field as keyof typeof employer] = tempContent;
        }

        return newState;
    });

    setIsEditDialogOpen(false);
    setEditingModule(null);
  }

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

  const renderEditContent = () => {
    if (!editingModule) return null;
    switch(editingModule.field) {
        case 'about':
            return renderAboutEdit();
        case 'info.founded':
        case 'info.size':
        case 'info.license':
        case 'info.website':
             return renderInfoEdit();
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
                  <Button variant="secondary" size="sm" className="absolute top-4 right-4 z-10" onClick={() => handleEditClick('Ảnh bìa', employer.banner, 'banner')}>
                      <Camera className="mr-2 h-4 w-4" /> Sửa ảnh bìa
                  </Button>
                </div>
                <div className="p-6 bg-card">
                  <div className="flex flex-col md:flex-row gap-6 items-start -mt-24 md:-mt-20 relative">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-card bg-card shadow-lg">
                            <AvatarImage src={employer.logo} alt={employer.name} data-ai-hint={employer.dataAiHint} />
                            <AvatarFallback>{employer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <Button variant="secondary" size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full z-10" onClick={() => handleEditClick('Avatar', employer.logo, 'logo')}>
                              <Camera className="h-4 w-4"/>
                          </Button>
                      </div>
                      <div className="flex-grow pt-16 md:pt-20">
                          <h1 className="text-2xl md:text-3xl font-headline font-bold">{employer.name}</h1>
                          <p className="font-semibold text-primary">{employer.type}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <MapPin className="h-4 w-4" /> {employer.location}
                          </p>
                      </div>
                      <div className="absolute top-16 right-0 md:top-20 md:right-0">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick('Thông tin chung', {name: employer.name, type: employer.type, location: employer.location }, 'name')}>
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
                  <SectionCard title="Ảnh về doanh nghiệp" icon={ImageIcon} onEditClick={() => handleEditClick('Ảnh', '', 'images')}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {employer.images.map((img, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                  <Image src={img.src} alt={img.alt} fill className="object-cover" data-ai-hint={img.dataAiHint} />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Camera className="h-8 w-8 text-white" />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </SectionCard>
                  <SectionCard title="Lịch sử & các mốc sự kiện" icon={History} onEditClick={() => handleEditClick('Lịch sử', '', 'history')}>
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
                  <SectionCard title="Thông tin doanh nghiệp" icon={Building} onEditClick={() => handleEditClick('Thông tin doanh nghiệp', employer.info, 'info.founded')}>
                      <div className="space-y-3 text-sm">
                          <p><strong>Năm thành lập:</strong> {employer.info.founded}</p>
                          <p><strong>Quy mô:</strong> {employer.info.size}</p>
                          <p><strong>Giấy phép:</strong> {employer.info.license}</p>
                          <p><strong>Website:</strong> <a href={employer.info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{employer.info.website}</a></p>
                      </div>
                  </SectionCard>
                  <SectionCard title="Ngành nghề & Lĩnh vực" icon={Briefcase} onEditClick={() => handleEditClick('Ngành nghề', '', 'industries')}>
                      <div className="space-y-3 text-sm">
                          <p><strong>Ngành nghề chính:</strong> {employer.industries.main}</p>
                          <p><strong>Ngành nghề khác:</strong> {employer.industries.secondary}</p>
                      </div>
                  </SectionCard>
                  <SectionCard title="Phúc lợi & Môi trường" icon={Award} onEditClick={() => handleEditClick('Phúc lợi', '', 'benefits')}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingModule?.title}</DialogTitle>
          </DialogHeader>
           <div className="py-4">
              {renderEditContent()}
           </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
            </DialogClose>
             {(editingModule?.field === 'about' || editingModule?.field.startsWith('info.')) && (
                <Button onClick={handleSaveChanges}>Lưu thay đổi</Button>
             )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
