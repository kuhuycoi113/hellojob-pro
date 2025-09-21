

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, School, Plane, UserCheck, CheckCircle, TrendingUp, User, Briefcase, Calendar, Map, DollarSign, ChevronRight, Sparkles } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { jobData } from '@/lib/mock-data';
import { JobCard } from '@/components/job-card';

export const metadata: Metadata = {
  title: 'Lộ trình chi tiết: Chương trình Thực tập sinh Kỹ năng tại Nhật',
  description: 'Khám phá lộ trình 6 bước từ A-Z cho chương trình Thực tập sinh Kỹ năng tại Nhật. Từ chuẩn bị hồ sơ, đào tạo, làm việc đến các hướng phát triển sự nghiệp sau khi hoàn thành.',
};

const programDetails = {
    title: 'Thực tập sinh Kỹ năng',
    description: 'Chương trình phổ biến nhất, là bước khởi đầu vững chắc cho hành trình sự nghiệp tại Nhật Bản. Mục tiêu chính là học hỏi kỹ năng, tích lũy kinh nghiệm và vốn trong môi trường làm việc chuyên nghiệp.',
    suitableFor: 'Lao động phổ thông, không yêu cầu bằng cấp cao, độ tuổi từ 18-35.',
    pros: [
        'Yêu cầu đầu vào không quá cao',
        'Chi phí tham gia hợp lý, nhiều chương trình hỗ trợ',
        'Được đào tạo bài bản trước và sau khi sang Nhật',
        'Cơ hội chuyển đổi sang visa Kỹ năng đặc định sau khi hoàn thành'
    ],
    cons: [
        'Mức lương ban đầu thường thấp hơn các diện khác',
        'Hạn chế trong việc chuyển đổi công ty',
        'Không được bảo lãnh người thân'
    ]
};

const roadmapSteps = [
  {
    icon: FileSignature,
    title: 'Bước 1: Chuẩn bị & Hoàn thiện hồ sơ',
    description: 'Bắt đầu bằng việc chuẩn bị đầy đủ các giấy tờ cần thiết như sơ yếu lý lịch, giấy khám sức khỏe, bằng cấp (nếu có). HelloJob sẽ đồng hành cùng bạn để đảm bảo hồ sơ hoàn chỉnh và ấn tượng nhất.',
    details: ['Khám sức khỏe tổng quát', 'Hoàn thiện CV theo mẫu Nhật', 'Chuẩn bị ảnh thẻ, giấy tờ tùy thân']
  },
  {
    icon: School,
    title: 'Bước 2: Đào tạo Tiếng Nhật & Kỹ năng cơ bản',
    description: 'Tham gia các khóa học đào tạo tập trung (Shuuchuu) tại trung tâm của HelloJob. Bạn sẽ được học tiếng Nhật giao tiếp cơ bản, văn hóa doanh nghiệp và các kỹ năng cần thiết trước khi phỏng vấn.',
    details: ['Học tiếng Nhật tối thiểu N5', 'Tìm hiểu văn hóa Hou-Ren-Sou', 'Đào tạo tay nghề cơ bản (nếu cần)']
  },
  {
    icon: Briefcase,
    title: 'Bước 3: Phỏng vấn & Lựa chọn đơn hàng',
    description: 'Dựa trên hồ sơ và nguyện vọng của bạn, HelloJob sẽ kết nối bạn với các nghiệp đoàn và công ty phù hợp. Bạn sẽ tham gia phỏng vấn trực tiếp hoặc online với nhà tuyển dụng Nhật Bản.',
    details: ['Lựa chọn đơn hàng phù hợp', 'Luyện tập phỏng vấn 1-1', 'Ký hợp đồng lao động sau khi trúng tuyển']
  },
  {
    icon: Plane,
    title: 'Bước 4: Hoàn tất thủ tục & Bay sang Nhật',
    description: 'Sau khi trúng tuyển, HelloJob sẽ hỗ trợ bạn hoàn tất các thủ tục xin visa và chuẩn bị cho cuộc sống mới. Chúng tôi sẽ đồng hành cùng bạn cho đến khi bạn ổn định công việc tại Nhật.',
    details: ['Xin tư cách lưu trú (COE) và visa', 'Đào tạo nâng cao trước khi bay', 'Ổn định cuộc sống & công việc tại Nhật']
  },
  {
    icon: TrendingUp,
    title: 'Bước 5: Làm việc & Tích lũy kinh nghiệm (1-3 năm)',
    description: 'Đây là giai đoạn bạn chính thức làm việc, học hỏi kỹ năng thực tế và tích lũy kinh nghiệm quý báu. Hãy luôn nỗ lực, tuân thủ quy định và tiếp tục trau dồi tiếng Nhật.',
    details: ['Làm việc theo hợp đồng', 'Tích lũy kinh nghiệm và vốn', 'Nâng cao trình độ tiếng Nhật (mục tiêu N3)']
  },
  {
    icon: UserCheck,
    title: 'Bước 6: Hoàn thành & Lựa chọn hướng đi mới',
    description: 'Sau khi hoàn thành chương trình 3 năm, bạn sẽ có nhiều lựa chọn: về nước với kinh nghiệm và vốn, hoặc tiếp tục con đường sự nghiệp tại Nhật bằng cách chuyển đổi sang visa Kỹ năng đặc định.',
    details: ['Nhận chứng chỉ hoàn thành TTS', 'Lựa chọn về nước hoặc ở lại', 'Chuyển đổi sang visa Tokutei Ginou']
  },
];


export default function TraineeRoadmapPage() {
  const featuredJobs = jobData.filter(job => job.visaType?.includes('Thực tập sinh')).slice(0, 4);

  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="w-full bg-orange-600 text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Lộ trình Thực tập sinh Kỹ năng
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 text-primary-foreground/80">
            Khám phá chi tiết con đường từ một người lao động phổ thông trở thành một nhân sự có tay nghề, kinh nghiệm và một tương lai rộng mở.
          </p>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
           <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video">
                 <Image 
                    src="/img/thuc_tap_sinh.jpg?v=3"
                    alt="Thực tập sinh Nhật Bản"
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    data-ai-hint="trainee learning japan"
                 />
            </div>
            <div>
                <h2 className="text-3xl font-headline font-bold text-accent-orange mb-4">{programDetails.title}</h2>
                <p className="text-muted-foreground mb-6">{programDetails.description}</p>
                <Card className="bg-orange-50 border-orange-200">
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
                Một hành trình rõ ràng từ Việt Nam đến Nhật Bản và xa hơn nữa.
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
                           <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-background bg-orange-500 group-hover:scale-110 transition-transform duration-300">
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
                                    <CardTitle className="font-headline text-2xl text-accent-orange">{step.title}</CardTitle>
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
                <h2 className="text-3xl font-headline font-bold text-primary">Việc làm Thực tập sinh kỹ năng nổi bật</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Khám phá các đơn hàng tốt nhất, chi phí hợp lý và bay nhanh.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {featuredJobs.map(job => (
                    <JobCard key={job.id} job={job} variant="grid-item"/>
                 ))}
            </div>
            <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/viec-lam">Xem tất cả việc làm Thực tập sinh <ChevronRight /></Link>
                </Button>
            </div>
        </div>
       </section>

       {/* CTA Section */}
      <section className="bg-accent text-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">Sẵn sàng cho bước đầu tiên?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                Hãy bắt đầu hành trình của bạn ngay hôm nay bằng cách tạo hồ sơ với sự trợ giúp của AI hoặc tìm kiếm các đơn hàng Thực tập sinh mới nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <Link href="/tao-ho-so-ai">Tạo hồ sơ bằng AI <Sparkles/></Link>
                </Button>
                <Button asChild size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90">
                    <Link href="/viec-lam">Tìm việc làm TTS <Briefcase/></Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
