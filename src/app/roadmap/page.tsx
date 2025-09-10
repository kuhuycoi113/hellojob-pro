
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HardHat, School, Star, Plane, UserCheck, ShieldCheck, TrendingUp, Briefcase, MapIcon, Compass, Building } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lộ trình sự nghiệp (SWR) tại Nhật Bản',
  description: 'Khám phá lộ trình phát triển sự nghiệp (SWR) bền vững từ Thực tập sinh, Kỹ năng đặc định (Tokutei Ginou) 1 & 2, đến chuyên gia tay nghề cao tại Nhật Bản cùng HelloJob.',
};

const programTypes = [
  {
    icon: HardHat,
    title: 'Thực tập sinh kỹ năng',
    slug: 'trainee',
    description: 'Đây là hình thức phổ biến nhất với thời hạn 3-5 năm, dành cho bất kỳ ai có thể làm việc <i><b>lao động phổ thông</b></i>, tuổi từ 18-40 không yêu cầu bằng cấp, không cần thi tuyển tay nghề và có thể <i><b>nâng cấp lên</b></i> visa Kỹ năng đặc định sau khi hoàn thành.',
    color: 'orange'
  },
  {
    icon: UserCheck,
    title: 'Kỹ năng đặc định (Tokutei)',
    slug: 'tokutei',
    description: 'Dành cho lao động có tay nghề, cho phép làm việc lâu hơn tại Nhật và hưởng <i><b>lương cao hơn</b></i>. Người đi mới hoặc chuyển trái ngành cần <i><b>thi chứng chỉ</b></i> tiếng Nhật và kỳ thi kỹ năng tay nghề, sau giai đoạn 1 có thể nâng cấp lên giai đoạn 2 để <i><b>định cư</b></i> tại Nhật.',
     color: 'dark-blue'
  },
  {
    icon: Briefcase,
    title: 'Kỹ sư, tri thức',
    slug: 'engineer',
    description: 'Dành cho người có trình độ chuyên môn cao (<i><b>Cao đẳng, Đại học</b></i>), làm việc đúng chuyên ngành và là con đường chính thống để phát triển <i><b>sự nghiệp lâu dài</b></i>, mở ra cơ hội xin visa vĩnh trú và bảo lãnh gia đình sang Nhật sinh sống, định cư.',
    color: 'green'
  }
];


const roadmapSteps = [
  {
    icon: Compass,
    title: 'Bước 1: Định hướng nghề nghiệp',
    description: 'Bắt đầu từ tốt nghiệp PTTH, HelloJob sẽ cùng bạn đánh giá năng lực, định hướng con đường phù hợp nhất để trở thành lao động lành nghề, dù là làm việc trong nước hay chinh phục thị trường Nhật Bản.',
    salary: 'Mức lương khởi điểm',
    color: 'orange',
    image: '/img/dinh_huong_nghe_nghiep.jpg',
    dataAiHint: 'career guidance compass',
  },
  {
    icon: Building,
    title: 'Bước 2: Test văn hoá & Tìm công ty phù hợp',
    description: 'Làm các bài test về Văn hoá doanh nghiệp (CTT) để hiểu rõ giá trị bản thân, từ đó tìm kiếm và lựa chọn những công ty có môi trường và văn hoá phù hợp nhất với bạn.',
    salary: 'Tăng sự hài lòng',
    color: 'green',
    image: '/img/van_hoa_cong_ty.jpg',
    dataAiHint: 'corporate culture test',
  },
  {
    icon: Plane,
    title: 'Bước 3: Thực tập sinh tại Nhật (3-5 năm)',
    description: 'Bắt đầu hành trình tại Nhật với vai trò Thực tập sinh kỹ năng. Đây là giai đoạn để bạn làm quen với môi trường, văn hóa làm việc chuyên nghiệp và tích lũy kinh nghiệm nền tảng đầu tiên.',
    salary: '~30 triệu VNĐ/tháng',
    color: 'light-blue',
    image: '/img/thuc_tap_sinh.jpg?v=3',
    dataAiHint: 'trainee learning japan',
  },
  {
    icon: School,
    title: 'Bước 4: Học E-Learning & Nâng cao năng lực',
    description: 'Tham gia các khóa học E-learning về tiếng Nhật, văn hoá ứng xử và kỹ năng làm việc tại Nhật Bản. Việc chuẩn bị kỹ lưỡng về ngôn ngữ và kỹ năng mềm là chìa khóa để bạn hòa nhập nhanh chóng và thành công.',
    salary: 'Đầu tư cho tương lai',
    color: 'orange',
    image: '/img/e_learning.jpg',
    dataAiHint: 'e-learning online course',
  },
  {
    icon: Star,
    title: 'Bước 5: Kỹ năng đặc định 1 (Tối đa 5 năm)',
    description: 'Sau khi hoàn thành chương trình thực tập sinh, bạn sẽ được nâng cấp lên visa Kỹ năng đặc định (Tokutei Ginou 1). Tay nghề cao hơn, được phép chuyển việc trong cùng ngành và nhận mức thu nhập cải thiện rõ rệt.',
    salary: '40-50 triệu VNĐ/tháng',
    color: 'dark-blue',
    image: '/img/tokutei1.jpg',
    dataAiHint: 'skilled worker certificate',
  },
  {
    icon: ShieldCheck,
    title: 'Bước 6: Kỹ năng đặc định 2 (Lâu dài)',
    description: 'Đây là cấp độ cao nhất của lao động kỹ năng. Với visa Tokutei Ginou 2, bạn có cơ hội bảo lãnh gia đình sang sinh sống và làm việc, đồng thời mở ra con đường xin visa vĩnh trú tại Nhật.',
    salary: 'Tiếp tục tăng',
    color: 'green',
    image: '/img/dac_dinh_2_lau_dai.jpg',
    dataAiHint: 'family in japan',
  },
  {
    icon: TrendingUp,
    title: 'Bước 7: Chuyên gia lành nghề',
    description: 'Với sự đồng hành và đào tạo chuyên sâu từ HelloJob, bạn sẽ trở thành chuyên gia trong lĩnh vực của mình, đảm nhận những vị trí quan trọng và đạt được mức thu nhập đỉnh cao.',
    salary: '60-70 triệu VNĐ/tháng',
    color: 'dark-blue',
    image: '/img/chuyen_gia_lanh_nghe.jpg',
    dataAiHint: 'expert engineer meeting',
  },
  {
    icon: Briefcase,
    title: 'Bước 8: Sự nghiệp rộng mở',
    description: 'Lựa chọn trở về Việt Nam với vị thế một chuyên gia được săn đón, hoặc tiếp tục con đường định cư và phát triển sự nghiệp lâu dài tại Nhật Bản. HelloJob luôn là đối tác tin cậy của bạn.',
    salary: 'Thu nhập chuyên gia',
    color: 'light-blue',
    image: '/img/su_nghiep_rong_mo.jpg',
    dataAiHint: 'manager working office',
  },
];

const colorClasses: { [key: string]: { bg: string; text: string; border: string } } = {
  orange: { bg: 'bg-accent-orange', text: 'text-accent-orange', border: 'border-accent-orange' },
  'light-blue': { bg: 'bg-primary', text: 'text-primary', border: 'border-primary' },
  'dark-blue': { bg: 'bg-accent', text: 'text-accent', border: 'border-accent' },
  green: { bg: 'bg-accent-green', text: 'text-accent-green', border: 'border-accent-green' },
};


export default function RoadmapPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
         <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-accent">
            Những con đường cho bạn lựa chọn tại Nhật Bản
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Dù bạn bắt đầu từ đâu, HelloJob sẽ giúp bạn khám phá và lựa chọn con đường sự nghiệp phù hợp nhất tại Nhật Bản, từ Thực tập sinh, Kỹ năng đặc định đến Kỹ sư chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {programTypes.map((program) => {
            const colors = colorClasses[program.color] || colorClasses['light-blue'];
            return (
              <Link href={`/roadmap/${program.slug}`} key={program.slug} className="block group">
                <Card className="text-center shadow-lg h-full group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    <div className={cn("mx-auto rounded-full p-4 w-fit", colors.bg)}>
                        <program.icon className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className={cn("font-headline mt-4 text-xl", colors.text)}>{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: program.description }}></p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-accent">Lộ trình phát triển sự nghiệp (SWR)</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Chúng tôi cam kết đồng hành cùng bạn trên con đường phát triển sự nghiệp bền vững, từ bước đầu tiên đến khi trở thành chuyên gia tay nghề cao.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-border rounded-full hidden md:block" />

          <div className="space-y-12 md:space-y-4">
            {roadmapSteps.map((step, index) => {
              const colors = colorClasses[step.color] || colorClasses['light-blue'];
              const isEven = index % 2 === 0;
              return (
              <div key={index} className={`relative flex flex-col md:flex-row items-center group md:h-80 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                {/* Timeline circle for desktop */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-10">
                   <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-4 border-secondary group-hover:scale-110 transition-transform duration-300",
                        colors.bg
                    )}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                </div>
                
                {/* Content Side */}
                <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                   <div className="w-full md:max-w-sm">
                     <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4", colors.border)}>
                        <CardHeader>
                        <CardTitle className={cn("font-headline text-2xl", colors.text)}>
                            {step.title}
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <div className={`font-bold text-lg`}>
                            <span className="text-accent-green">{step.salary}</span>
                        </div>
                        </CardContent>
                    </Card>
                   </div>
                </div>
                
                {/* Image Side */}
                <div className={`w-full md:w-1/2 flex mt-4 md:mt-0 ${isEven ? 'md:justify-start md:pl-16' : 'md:justify-end md:pr-16'}`}>
                    <Image src={step.image} alt={step.title} width={400} height={225} className="rounded-lg shadow-xl object-cover w-full md:w-auto md:max-w-sm aspect-video" data-ai-hint={step.dataAiHint} />
                </div>

              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
