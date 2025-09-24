

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, School, Plane, UserCheck, CheckCircle, TrendingUp, User, Briefcase, Calendar, Map, DollarSign, ChevronRight, Sparkles, GraduationCap, Building, ShieldCheck } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { jobData } from '@/lib/mock-data';
import { JobCard } from '@/components/job-card';

export const metadata: Metadata = {
  title: 'Lộ trình chi tiết: Chương trình Kỹ sư, Tri thức tại Nhật Bản',
  description: 'Khám phá lộ trình sự nghiệp dành cho Kỹ sư và Lao động có trình độ cao đẳng, đại học muốn phát triển lâu dài và định cư tại Nhật Bản.',
};

const programDetails = {
    title: 'Kỹ sư, Tri thức',
    description: 'Đây là con đường chính thống và danh giá nhất, dành cho những người có trình độ chuyên môn từ Cao đẳng, Đại học trở lên, mong muốn phát triển sự nghiệp đúng chuyên ngành và định cư lâu dài tại Nhật.',
    suitableFor: 'Sinh viên mới tốt nghiệp hoặc kỹ sư đã có kinh nghiệm, có bằng Cao đẳng/Đại học chính quy các chuyên ngành kỹ thuật, IT, kinh tế...',
    pros: [
        'Mức lương và chế độ đãi ngộ tốt nhất, tương đương người Nhật',
        'Làm việc đúng chuyên ngành, phát huy tối đa năng lực',
        'Cơ hội thăng tiến lên các vị trí quản lý, chuyên gia',
        'Con đường rõ ràng nhất để xin visa vĩnh trú và bảo lãnh gia đình'
    ],
    cons: [
        'Yêu cầu khắt khe về bằng cấp chuyên môn và trình độ tiếng Nhật',
        'Quy trình phỏng vấn và tuyển chọn cạnh tranh cao'
    ]
};

const roadmapSteps = [
  {
    icon: GraduationCap,
    title: 'Bước 1: Chuẩn bị Nền tảng & Hồ sơ',
    description: 'Nền tảng vững chắc là chìa khóa. Bạn cần có bằng cấp chuyên môn phù hợp và trình độ tiếng Nhật đủ để làm việc trong môi trường chuyên nghiệp.',
    details: ['Bằng Cao đẳng/Đại học chính quy chuyên ngành phù hợp', 'Trình độ tiếng Nhật (thường từ N3 trở lên)', 'Chuẩn bị CV tiếng Nhật chuyên nghiệp và Portfolio (nếu có)']
  },
  {
    icon: Building,
    title: 'Bước 2: Tìm kiếm & Ứng tuyển vào công ty',
    description: 'Không giống như TTS hay Tokutei, bạn sẽ ứng tuyển trực tiếp vào các công ty tại Nhật. HelloJob sẽ là cầu nối giúp bạn tiếp cận những nhà tuyển dụng hàng đầu.',
    details: ['Tìm kiếm công ty phù hợp với chuyên ngành và nguyện vọng', 'Vượt qua các vòng kiểm tra năng lực (SPI, coding test...)', 'Tham gia các buổi phỏng vấn kỹ thuật và phỏng vấn với quản lý']
  },
  {
    icon: FileSignature,
    title: 'Bước 3: Ký hợp đồng & Xin tư cách lưu trú (COE)',
    description: 'Sau khi nhận được "naitei" (thư mời làm việc), bạn sẽ ký hợp đồng lao động. Công ty sẽ hỗ trợ bạn thực hiện các thủ tục phức tạp để xin COE.',
    details: ['Ký hợp đồng lao động với các điều khoản rõ ràng', 'Công ty nộp hồ sơ bảo lãnh xin COE tại Nhật', 'Chờ đợi kết quả COE (thường mất 1-3 tháng)']
  },
  {
    icon: Plane,
    title: 'Bước 4: Xin Visa & Sang Nhật làm việc',
    description: 'Với COE, việc xin visa tại Việt Nam sẽ trở nên thuận lợi hơn rất nhiều. Bạn sẽ chính thức bắt đầu sự nghiệp của một kỹ sư/chuyên gia tại Nhật Bản.',
    details: ['Nộp hồ sơ xin visa "Kỹ thuật, tri thức, nghiệp vụ quốc tế"', 'Chuẩn bị hành trang và bay sang Nhật', 'Ổn định cuộc sống và bắt đầu công việc mơ ước']
  },
  {
    icon: TrendingUp,
    title: 'Bước 5: Phát triển sự nghiệp & Tích luỹ',
    description: 'Đây là giai đoạn bạn tập trung vào công việc, thể hiện năng lực, học hỏi công nghệ mới và xây dựng uy tín trong công ty. Mức lương và vị trí của bạn sẽ tăng tiến theo năng lực.',
    details: ['Làm việc đúng chuyên môn', 'Tham gia các dự án quan trọng', 'Xây dựng mạng lưới quan hệ chuyên nghiệp']
  },
  {
    icon: ShieldCheck,
    title: 'Bước 6: Con đường Vĩnh trú & Bảo lãnh gia đình',
    description: 'Sau một thời gian làm việc và đóng thuế đầy đủ (thường là 10 năm, có thể rút ngắn), bạn có thể nộp đơn xin visa vĩnh trú. Bạn cũng có thể bảo lãnh vợ/chồng, con cái sang Nhật sinh sống cùng.',
    details: ['Đáp ứng các điều kiện về thời gian lưu trú, thu nhập và thuế', 'Nộp đơn xin visa vĩnh trú (Eijuken)', 'Bảo lãnh người thân và xây dựng cuộc sống ổn định, lâu dài']
  },
];


export default function EngineerRoadmapPage() {
  const featuredJobs = jobData.filter(job => job.visaType?.includes('Kỹ sư')).slice(0, 4);

  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="w-full bg-green-600 text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Lộ trình Kỹ sư & Tri thức
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 text-primary-foreground/80">
            Con đường chính thống nhất để phát triển sự nghiệp bền vững, định cư và bảo lãnh gia đình tại Nhật Bản.
          </p>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
           <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video">
                 <Image 
                    src="/img/chuyen_gia_lanh_nghe.jpg"
                    alt="Kỹ sư làm việc tại Nhật"
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    data-ai-hint="engineer working japan"
                 />
            </div>
            <div>
                <h2 className="text-3xl font-headline font-bold text-accent-green mb-4">{programDetails.title}</h2>
                <p className="text-muted-foreground mb-6">{programDetails.description}</p>
                <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                        <CardTitle className="text-lg">Dành cho ai?</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="font-semibold">{programDetails.suitableFor}</p>
                    </CardContent>
                </Card>
            </div>
           </div>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
                <Card>
                    <CardHeader><CardTitle className="text-accent-green">Ưu điểm</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {programDetails.pros.map(item => (
                            <p key={item} className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-accent-green mt-0.5 flex-shrink-0"/> <span>{item}</span></p>
                        ))}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-accent-red">Nhược điểm</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {programDetails.cons.map(item => (
                            <p key={item} className="flex items-start gap-2"><ChevronRight className="h-5 w-5 text-accent-red mt-0.5 flex-shrink-0"/> <span>{item}</span></p>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>
      
      {/* Roadmap Steps Timeline */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-accent">6 Bước trong Lộ trình</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                Hành trình trở thành chuyên gia được săn đón tại Nhật Bản.
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Vertical line */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-border rounded-full" />

                <div className="space-y-12">
                    {roadmapSteps.map((step, index) => {
                    const isEven = index % 2 === 0;
                    return (
                    <div key={index} className="relative flex items-start md:items-center group">
                        {/* Timeline circle */}
                        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 bg-background pt-1">
                           <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-background bg-green-500 group-hover:scale-110 transition-transform duration-300">
                              <step.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        
                        {/* Content Card */}
                        <div className={cn(
                            "w-full md:w-1/2",
                             isEven ? 'md:pr-12' : 'md:pl-12 md:ml-[50%]',
                             'pl-20'
                        )}>
                           <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl text-accent-green">{step.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-4">{step.description}</p>
                                    <div className="space-y-2 text-sm">
                                        {step.details.map(detail => (
                                            <p key={detail} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0"/> {detail}</p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    )})}
                </div>
            </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
       <section className="py-20 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline font-bold text-primary">Việc làm Kỹ sư, tri thức nổi bật</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Khám phá các cơ hội việc làm chất lượng cao dành riêng cho các kỹ sư và chuyên gia.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {featuredJobs.map(job => (
                    <JobCard key={job.id} job={job} variant="grid-item" showApplyButtons={true}/>
                 ))}
            </div>
            <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/viec-lam">Xem tất cả việc làm Kỹ sư <ChevronRight /></Link>
                </Button>
            </div>
        </div>
       </section>

       {/* CTA Section */}
      <section className="bg-accent text-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">Bạn có bằng cấp và chuyên môn?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                Đây là con đường dành cho bạn. Hãy bắt đầu bằng cách tạo một hồ sơ chuyên nghiệp để các nhà tuyển dụng hàng đầu có thể tìm thấy bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <Link href="/tao-ho-so-ai">Tạo hồ sơ bằng AI <Sparkles/></Link>
                </Button>
                <Button asChild size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90">
                    <Link href="/viec-lam">Tìm việc làm Kỹ sư <Briefcase/></Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
