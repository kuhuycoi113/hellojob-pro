

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, School, Plane, UserCheck, CheckCircle, TrendingUp, User, Briefcase, Calendar, Map, DollarSign, ChevronRight, Sparkles, Award } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { jobData } from '@/lib/mock-data';
import { JobCard } from '@/components/job-card';

export const metadata: Metadata = {
  title: 'Lộ trình chi tiết: Chương trình Kỹ năng đặc định (Tokutei Ginou)',
  description: 'Khám phá lộ trình 6 bước cho chương trình Kỹ năng đặc định (Tokutei Ginou) tại Nhật, từ việc thi chứng chỉ, phỏng vấn, đến con đường định cư lâu dài.',
};

const programDetails = {
    title: 'Kỹ năng đặc định (Tokutei Ginou)',
    description: 'Chương trình dành cho lao động có tay nghề và trình độ tiếng Nhật nhất định, mang lại mức lương cao hơn và cơ hội làm việc, định cư lâu dài tại Nhật Bản.',
    suitableFor: 'Thực tập sinh đã hoàn thành hợp đồng; du học sinh; hoặc người lao động mới vượt qua kỳ thi kỹ năng và tiếng Nhật.',
    pros: [
        'Mức lương tương đương hoặc cao hơn người Nhật cùng vị trí',
        'Được phép chuyển việc trong cùng ngành nghề',
        'Có cơ hội nâng cấp lên Tokutei Ginou 2 để bảo lãnh gia đình và xin vĩnh trú',
        'Nhiều lựa chọn ngành nghề đa dạng'
    ],
    cons: [
        'Yêu cầu phải thi đỗ kỳ thi kỹ năng đặc định và năng lực tiếng Nhật (JLPT N4 hoặc JFT-Basic A2)',
        'Áp lực công việc và yêu cầu về năng lực cao hơn'
    ]
};

const roadmapSteps = [
  {
    icon: Award,
    title: 'Bước 1: Vượt qua các kỳ thi bắt buộc',
    description: 'Đây là bước tiên quyết. Bạn cần thi đỗ hai kỳ thi: Kỳ thi năng lực tiếng Nhật (tối thiểu N4) và Kỳ thi kỹ năng tay nghề đặc định cho ngành bạn muốn ứng tuyển.',
    details: ['Ôn luyện tiếng Nhật, mục tiêu N4 trở lên', 'Học và thực hành tay nghề theo đề thi', 'Đăng ký và tham gia kỳ thi tại Việt Nam hoặc Nhật']
  },
  {
    icon: Briefcase,
    title: 'Bước 2: Tìm kiếm & Phỏng vấn đơn hàng',
    description: 'Với chứng chỉ trong tay, bạn có thể tự tin tìm kiếm các đơn hàng Tokutei. HelloJob sẽ kết nối bạn với các công ty hàng đầu và hỗ trợ bạn trong suốt quá trình phỏng vấn.',
    details: ['Tạo hồ sơ ấn tượng trên HelloJob', 'Luyện tập phỏng vấn và tác phong chuyên nghiệp', 'Đàm phán lương và các điều kiện làm việc']
  },
  {
    icon: FileSignature,
    title: 'Bước 3: Ký hợp đồng & Xin tư cách lưu trú (COE)',
    description: 'Sau khi trúng tuyển, bạn sẽ ký hợp đồng lao động trực tiếp với công ty tiếp nhận. Công ty hoặc tổ chức hỗ trợ sẽ tiến hành các thủ tục xin COE cho bạn tại Nhật.',
    details: ['Ký hợp đồng lao động', 'Chuẩn bị giấy tờ cần thiết cho hồ sơ xin COE', 'Chờ đợi kết quả COE từ Cục Quản lý Xuất nhập cảnh Nhật Bản']
  },
  {
    icon: Plane,
    title: 'Bước 4: Xin Visa & Bay sang Nhật làm việc',
    description: 'Khi có COE, bạn sẽ nộp hồ sơ xin visa Kỹ năng đặc định tại Đại sứ quán/Lãnh sự quán Nhật Bản ở Việt Nam. Sau khi có visa, bạn đã sẵn sàng cho hành trình mới.',
    details: ['Nộp hồ sơ xin visa tại ĐSQ/LSQ Nhật Bản', 'Tham gia khóa học định hướng cuối cùng', 'Ổn định cuộc sống và bắt đầu công việc']
  },
  {
    icon: TrendingUp,
    title: 'Bước 5: Làm việc & Phát triển sự nghiệp (Tối đa 5 năm)',
    description: 'Trong giai đoạn này, bạn sẽ làm việc với tư cách là một lao động có tay nghề. Đây là thời gian để bạn thể hiện năng lực, tích lũy kinh nghiệm và chuẩn bị cho bước tiếp theo.',
    details: ['Làm việc với mức lương và chế độ như người Nhật', 'Có thể chuyển việc trong cùng ngành', 'Không ngừng học hỏi, nâng cao tay nghề và tiếng Nhật']
  },
  {
    icon: UserCheck,
    title: 'Bước 6: Chuyển đổi lên Tokutei Ginou 2 & Định cư',
    description: 'Đối với một số ngành nghề, sau khi tích lũy đủ kinh nghiệm, bạn có thể tham gia kỳ thi nâng cao để chuyển đổi sang visa Tokutei Ginou 2. Đây là bước ngoặt mở ra cơ hội định cư lâu dài tại Nhật.',
    details: ['Thi đỗ kỳ thi tay nghề bậc cao', 'Xin chuyển đổi sang visa Tokutei Ginou 2', 'Bảo lãnh vợ/chồng, con sang sinh sống', 'Xin visa vĩnh trú sau khi đủ điều kiện']
  },
];


export default function TokuteiRoadmapPage() {
   const featuredJobs = jobData.filter(job => job.visaType?.includes('Kỹ năng đặc định')).slice(0, 4);

  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="w-full bg-blue-600 text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Lộ trình Kỹ năng đặc định (Tokutei Ginou)
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 text-primary-foreground/80">
            Con đường trở thành lao động tay nghề cao, hưởng mức lương hấp dẫn và cơ hội phát triển sự nghiệp lâu dài tại Nhật Bản.
          </p>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
           <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video">
                 <Image 
                    src="/img/tokutei1.jpg"
                    alt="Lao động Kỹ năng đặc định"
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    data-ai-hint="skilled worker japan"
                 />
            </div>
            <div>
                <h2 className="text-3xl font-headline font-bold text-accent-blue mb-4">{programDetails.title}</h2>
                <p className="text-muted-foreground mb-6">{programDetails.description}</p>
                <Card className="bg-blue-50 border-blue-200">
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
                Một hành trình rõ ràng để trở thành một chuyên gia tay nghề cao tại Nhật Bản.
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
                           <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-background bg-blue-500 group-hover:scale-110 transition-transform duration-300">
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
                                    <CardTitle className="font-headline text-2xl text-accent-blue">{step.title}</CardTitle>
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
                <h2 className="text-3xl font-headline font-bold text-primary">Việc làm Kỹ năng đặc định nổi bật</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Khám phá các cơ hội việc làm lương cao, chế độ tốt dành cho lao động có tay nghề.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {featuredJobs.map(job => (
                    <JobCard key={job.id} job={job} variant="grid-item"/>
                 ))}
            </div>
            <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/jobs">Xem tất cả việc làm Tokutei <ChevronRight /></Link>
                </Button>
            </div>
        </div>
       </section>

       {/* CTA Section */}
      <section className="bg-accent text-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">Bạn đã sẵn sàng chinh phục visa Tokutei?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                Tìm kiếm các đơn hàng Kỹ năng đặc định phù hợp nhất hoặc tạo hồ sơ để các nhà tuyển dụng hàng đầu tìm thấy bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <Link href="/ai-profile">Tạo hồ sơ bằng AI <Sparkles/></Link>
                </Button>
                <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
                    <Link href="/jobs">Tìm việc làm Tokutei <Briefcase/></Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
