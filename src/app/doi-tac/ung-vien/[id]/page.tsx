'use client';

import { useState, useEffect, use } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, Cake, Dna, GraduationCap, MapPin, Phone, School, User, Award, Languages, Star, FileDown, Video, Image as ImageIcon, MessageSquare, ArrowLeft, UserCog, UserRound, Trophy } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { type CandidateProfile } from '@/ai/schemas';

// This is a placeholder. In a real app, you'd fetch this data based on the ID.
const mockCandidateData: any = {
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
      phone: '*********',
      language: 'Tiếng Nhật N3, Tiếng Anh giao tiếp',
      dateOfBirth: '15/05/2000',
      height: '160 cm',
      weight: '50 kg',
      tattooStatus: 'Không có',
      hepatitisBStatus: 'Không viêm gan B',
    },
    interests: ['Cơ khí', 'Tự động hóa', 'Sản xuất'],
    skills: ['Vận hành máy CNC', 'AutoCAD', 'SolidWorks', 'Làm việc nhóm', 'Giải quyết vấn đề'],
    certifications: ['Chứng chỉ JLPT N3', 'Chứng chỉ An toàn lao động'],
    desiredIndustry: 'Cơ khí, Chế tạo máy',
    avatarUrl: 'https://placehold.co/128x128.png',
    videos: [
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Giới thiệu bản thân', dataAiHint: 'self introduction video' },
        { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://placehold.co/400x600.png', alt: 'Vận hành máy phay', dataAiHint: 'cnc machine operation' },
    ],
    images: [
      { src: 'https://placehold.co/400x600.png', alt: 'Ảnh toàn thân', dataAiHint: 'full body portrait' },
      { src: 'https://placehold.co/400x600.png', alt: 'Ảnh làm việc', dataAiHint: 'working in factory' },
    ],
};

type MediaItem = {
  src: string;
  thumbnail?: string; 
  alt: string;
  dataAiHint: string;
};

type EnrichedCandidateProfile = CandidateProfile & { 
  avatarUrl?: string;
  videos: MediaItem[];
  images: MediaItem[];
};

const MediaCarousel = ({ items, title, icon: Icon }: { items: MediaItem[], title: string, icon: React.ElementType }) => (
    <Card>
      <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Icon className="mr-3 text-primary"/> {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full" opts={{align: "start", loop: true}}>
            <CarouselContent className="-ml-2 md:-ml-4">
                {items.map((item, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3">
                       <div className="relative group overflow-hidden rounded-lg aspect-video cursor-pointer">
                            <Image src={item.thumbnail || item.src} alt={item.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={item.dataAiHint} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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


export default function PartnerCandidateDetailPage({ params }: { params: { id: string } }) {
  const [candidate, setCandidate] = useState<EnrichedCandidateProfile | null>(null);

  useEffect(() => {
    // In a real app, you would fetch candidate data using params.id
    // For this demo, we'll use the mock data.
    if (params.id) {
       setCandidate(mockCandidateData);
    }
  }, [params.id]);
  
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

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl overflow-hidden">
             <CardHeader className="p-0">
               <div className="bg-gradient-to-tr from-primary to-accent h-32" />
                 <div className="p-6 flex flex-col md:flex-row items-center md:items-end -mt-16">
                     <Avatar className="h-32 w-32 border-4 border-background bg-background shadow-lg">
                      <AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint="professional headshot" className="object-cover" />
                      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <h1 className="text-3xl font-headline font-bold">{candidate.name}</h1>
                  <p className="text-muted-foreground">{candidate.headline}</p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                    <MapPin className="h-4 w-4" /> {candidate.location}
                  </p>
                </div>
                <div className="md:ml-auto mt-4 md:mt-0 flex gap-2">
                    <Button variant="outline"><MessageSquare/> Liên hệ</Button>
                    <Button className="bg-accent-green hover:bg-accent-green/90 text-white"><Briefcase/> Mời phỏng vấn</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center"><User className="mr-3 text-primary"/> Giới thiệu bản thân</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground whitespace-pre-line">{candidate.about}</p>
                  </CardContent>
                </Card>

                {candidate.videos.length > 0 && <MediaCarousel items={candidate.videos} title="Video" icon={Video}/>}
                {candidate.images.length > 0 && <MediaCarousel items={candidate.images} title="Hình ảnh" icon={ImageIcon} />}

                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center"><Briefcase className="mr-3 text-primary"/> Kinh nghiệm làm việc</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {candidate.experience.map((exp, index) => (
                        <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                            <h4 className="font-bold">{exp.role}</h4>
                            <p className="font-semibold text-sm text-primary">{exp.company}</p>
                            <p className="text-xs text-muted-foreground mb-1">{exp.period}</p>
                            <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center"><GraduationCap className="mr-3 text-primary"/> Học vấn</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {candidate.education.map((edu, index) => (
                        <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                            <p className="font-semibold flex items-center gap-2"><School className="h-4 w-4"/> {edu.school}</p>
                            <p className="text-muted-foreground ml-6">Chuyên ngành: {edu.degree}</p>
                            <p className="text-muted-foreground ml-6">Tốt nghiệp năm: {edu.gradYear}</p>
                        </div>
                     ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6">
                 <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center"><UserCog className="mr-3 text-primary"/> Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="flex items-start gap-3"><strong>Ngày sinh:</strong> {candidate.personalInfo.dateOfBirth}</p>
                    <p className="flex items-start gap-3"><strong>Giới tính:</strong> {candidate.personalInfo.gender}</p>
                    <p className="flex items-start gap-3"><strong>Chiều cao:</strong> {candidate.personalInfo.height}</p>
                    <p className="flex items-start gap-3"><strong>Cân nặng:</strong> {candidate.personalInfo.weight}</p>
                    <p className="flex items-start gap-3"><strong>Ngoại ngữ:</strong> {candidate.personalInfo.language}</p>
                    <p className="flex items-start gap-3"><strong>Ngành mong muốn:</strong> {candidate.desiredIndustry}</p>
                  </CardContent>
                </Card>

                 <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center"><Star className="mr-3 text-primary"/> Kỹ năng & Lĩnh vực</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <h4 className="font-semibold mb-2 text-sm">Kỹ năng</h4>
                     <div className="flex flex-wrap gap-2 mb-4">
                        {candidate.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                     </div>
                     <h4 className="font-semibold mb-2 text-sm">Lĩnh vực quan tâm</h4>
                     <div className="flex flex-wrap gap-2">
                        {candidate.interests.map(interest => <Badge key={interest} className="bg-accent-blue text-white">{interest}</Badge>)}
                     </div>
                  </CardContent>
                </Card>

                 <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center"><Award className="mr-3 text-primary"/> Chứng chỉ & Giải thưởng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     {candidate.certifications.map((cert, index) => (
                         <p key={index} className="text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-muted-foreground"/>{cert}</p>
                     ))}
                  </CardContent>
                </Card>

                 <Button className="w-full"><FileDown/> Tải hồ sơ PDF</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
