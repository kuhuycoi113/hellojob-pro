
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calendar, Clock, MapPin, Users, Video, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data, in a real app this would be fetched based on params.id
const employer = {
  id: 'samsung',
  name: 'Samsung Electronics Vietnam',
  industry: 'Điện tử',
  location: 'Khu công nghệ cao, Quận 9, TP. Hồ Chí Minh',
  logo: 'https://picsum.photos/seed/samsunglogo/150/150',
  dataAiHint: 'samsung logo',
  banner: 'https://picsum.photos/seed/samsungbanner/1200/400',
  dataAiHintBanner: 'samsung factory',
  size: '10,000+ nhân viên',
  about: 'Samsung Electronics là một công ty điện tử đa quốc gia của Hàn Quốc, là một trong những nhà sản xuất thiết bị điện tử và linh kiện lớn nhất thế giới. Tại Việt Nam, chúng tôi có các nhà máy sản xuất lớn, tập trung vào việc sản xuất điện thoại di động và các thiết bị điện tử gia dụng, đóng góp lớn vào kim ngạch xuất khẩu của Việt Nam.',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video
  images: [
    { src: 'https://picsum.photos/seed/factory1/400/600', alt: 'Dây chuyền sản xuất hiện đại', dataAiHint: 'production line' },
    { src: 'https://picsum.photos/seed/factory2/600/400', alt: 'Khuôn viên công ty rộng rãi', dataAiHint: 'company campus' },
    { src: 'https://picsum.photos/seed/factory3/600/400', alt: 'Hoạt động đội nhóm', dataAiHint: 'team activity' },
    { src: 'https://picsum.photos/seed/dormitory2/600/400', alt: 'Ký túc xá 2', dataAiHint: 'company dormitory' },
  ],
  jobs: [
    { title: 'Kỹ sư Vận hành Dây chuyền', type: 'Toàn thời gian', date: '25/07/2024' },
    { title: 'Nhân viên Kiểm tra Chất lượng (QC)', type: 'Toàn thời gian', date: '25/07/2024' },
    { title: 'Thực tập sinh Kỹ thuật Phần mềm', type: 'Thực tập', date: '24/07/2024' },
    { title: 'Công nhân Lắp ráp Linh kiện', type: 'Toàn thời gian', date: '22/07/2024' },
  ]
};

export default function EmployerDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Card className="shadow-2xl overflow-hidden">
          <CardHeader className="p-0 relative">
            <Image src={employer.banner} alt={`${employer.name} banner`} width={1200} height={400} className="w-full h-48 md:h-64 object-cover" data-ai-hint={employer.dataAiHintBanner}/>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-0 left-0 p-6 flex items-end">
               <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background bg-background shadow-lg">
                  <AvatarImage src={employer.logo} alt={employer.name} data-ai-hint={employer.dataAiHint} />
                  <AvatarFallback>{employer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-6 text-white">
                  <h1 className="text-2xl md:text-4xl font-headline font-bold drop-shadow-lg">{employer.name}</h1>
                  <Badge className="mt-2 bg-white/20 text-white backdrop-blur-sm">{employer.industry}</Badge>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
             {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-2xl">Giới thiệu công ty</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground whitespace-pre-line">{employer.about}</p></CardContent>
                </Card>
                 {employer.videoUrl && <Card>
                    <CardHeader><CardTitle className="font-headline text-2xl flex items-center"><Video className="mr-3 text-primary"/> Video</CardTitle></CardHeader>
                    <CardContent>
                        <div className="aspect-video">
                            <iframe className="w-full h-full rounded-lg" src={employer.videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </CardContent>
                </Card>}
                <Card>
                    <CardHeader><CardTitle className="font-headline text-2xl">Hình ảnh</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative md:col-span-1 aspect-[2/3]">
                            <Image src={employer.images[0].src} alt={employer.images[0].alt} fill className="rounded-lg object-cover" data-ai-hint={employer.images[0].dataAiHint}/>
                        </div>
                        <div className="md:col-span-1 grid grid-rows-3 gap-4">
                            <div className="relative aspect-video">
                                <Image src={employer.images[1].src} alt={employer.images[1].alt} fill className="rounded-lg object-cover" data-ai-hint={employer.images[1].dataAiHint}/>
                            </div>
                             <div className="relative aspect-video">
                                <Image src={employer.images[2].src} alt={employer.images[2].alt} fill className="rounded-lg object-cover" data-ai-hint={employer.images[2].dataAiHint}/>
                            </div>
                             <div className="relative aspect-video">
                                <Image src={employer.images[3].src} alt={employer.images[3].alt} fill className="rounded-lg object-cover" data-ai-hint={employer.images[3].dataAiHint}/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-xl">Thông tin</CardTitle></CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <p className="flex items-start gap-3"><MapPin className="h-5 w-5 mt-0.5 text-muted-foreground"/> <span><strong>Địa chỉ:</strong> {employer.location}</span></p>
                        <p className="flex items-center gap-3"><Users className="h-5 w-5 text-muted-foreground"/> <span><strong>Quy mô:</strong> {employer.size}</span></p>
                        <p className="flex items-center gap-3"><Building className="h-5 w-5 text-muted-foreground"/> <span><strong>Ngành:</strong> {employer.industry}</span></p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="font-headline text-xl">Việc làm đang tuyển</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {employer.jobs.map((job, i) => (
                                <li key={i} className="border-b pb-4 last:border-0 last:pb-0">
                                    <h4 className="font-bold hover:text-primary cursor-pointer">{job.title}</h4>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> {job.type}</span>
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> {job.date}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
