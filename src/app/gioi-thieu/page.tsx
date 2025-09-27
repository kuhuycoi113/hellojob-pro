
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Target, Users, TrendingUp, Handshake, BarChart, FileSignature, Heart, Zap, Sparkles, Brain, CheckCircle, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Về HelloJob',
  description: 'Tìm hiểu về sứ mệnh, tầm nhìn, giá trị cốt lõi và đội ngũ tâm huyết của HelloJob trong việc kết nối nguồn nhân lực Việt Nam với thị trường Nhật Bản.',
};


const teamMembers = [
  {
    name: 'Nguyễn Quốc Việt',
    role: 'Founder & CEO',
    avatar: '/img/HDQT/Viet02.png',
    dataAiHint: 'male ceo portrait',
  },
  {
    name: 'Phùng Thị Tuyết Nhung',
    role: 'Founder & COO',
    avatar: 'https://placehold.co/200x200.png',
    dataAiHint: 'female coo portrait',
  },
  {
    name: 'Trương Quỳnh Phương',
    role: 'Co-Founder - Thành viên HĐQT',
    avatar: 'https://placehold.co/200x200.png',
    dataAiHint: 'female board member portrait',
  },
   {
    name: 'Nguyễn Ngọc Hà',
    role: 'Co-Founder - Thành viên HĐQT',
    avatar: 'https://placehold.co/200x200.png',
    dataAiHint: 'female board member portrait',
  },
  {
    name: 'Bùi Quang Huy',
    role: 'CTO',
    avatar: 'https://placehold.co/200x200.png',
    dataAiHint: 'male cto portrait',
  },
  {
    name: 'Lê Mạnh Hùng',
    role: 'Head of Marketing',
    avatar: 'https://placehold.co/200x200.png',
    dataAiHint: 'male marketing head portrait',
  },
];

const values = [
    {
        icon: Heart,
        title: "Về cơ bản con người là tốt, cho là nhận",
    },
    {
        icon: Zap,
        title: "Không ngừng phát triển, không giới hạn",
    },
    {
        icon: Sparkles,
        title: "Luôn sáng tạo, tìm giải pháp, không nản chí, không than vãn, không bao giờ bỏ cuộc",
    },
    {
        icon: Brain,
        title: "Be what you dream, Tin tưởng bản thân, trở thành người bạn muốn",
    },
    {
        icon: Shield,
        title: "Lựa chọn làm điều tốt, trở thành người có ích cho xã hội",
    },
    {
        icon: CheckCircle,
        title: "Kết quả công việc là câu trả lời chính xác nhất",
    },
]

const activityImages = [
    "/img/anhgioithieu/congty001.webp",
    "/img/anhgioithieu/congty005.webp",
    "/img/anhgioithieu/khachhang001.webp",
    "/img/anhgioithieu/khachhang002.webp",
    "/img/anhgioithieu/khachhang007.webp",
    "/img/anhgioithieu/khachhang004.webp",
    "/img/anhgioithieu/khachhang009.webp",
    "/img/anhgioithieu/khachhang008.webp",
    "/img/anhgioithieu/laodong002.webp",
    "/img/anhgioithieu/laodong003.webp",
    "/img/anhgioithieu/laodong004.webp",
    "/img/anhgioithieu/laodong005.webp",
    "/img/anhgioithieu/laodong006.webp",
    "/img/anhgioithieu/laodong007.webp",
    "/img/anhgioithieu/nhanvien009.webp",
    "/img/anhgioithieu/laodong009.webp",
    "/img/anhgioithieu/nhanvien008.webp",
    "/img/anhgioithieu/laodong011.webp",
    "/img/anhgioithieu/laodong012.webp",
    "/img/anhgioithieu/laodong013.webp",
    "/img/anhgioithieu/laodong020.webp",
    "/img/anhgioithieu/nhanvien001.webp",
    "/img/anhgioithieu/nhanvien002.webp",
    "/img/anhgioithieu/nhanvien004.webp",
    "/img/anhgioithieu/nhanvien005.webp",
];


export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-primary text-primary-foreground py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Về HelloJob</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 text-primary-foreground/80">
            Chúng tôi là cầu nối vững chắc giữa nguồn nhân lực chất lượng cao Việt Nam và các cơ hội việc làm tại thị trường Nhật Bản.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[1250/735]">
              <Image
                src="/img/viet-img/HJALL.jpg"
                alt="Đội ngũ HelloJob"
                fill
                className="object-cover rounded-lg shadow-xl"
                data-ai-hint="diverse team working"
              />
            </div>
            <div className="space-y-8">
              <div>
                <Target className="h-12 w-12 text-accent-orange mb-4" />
                <h2 className="text-3xl font-headline font-bold text-primary mb-2">Sứ mệnh của chúng tôi</h2>
                <p className="text-muted-foreground text-lg">
                  Tạo ra một thế giới việc làm giúp con người phát triển và hạnh phúc
                </p>
              </div>
              <div>
                <Lightbulb className="h-12 w-12 text-accent-green mb-4" />
                <h2 className="text-3xl font-headline font-bold text-primary mb-2">Tầm nhìn</h2>
                <p className="text-muted-foreground text-lg">
                  Trở thành giải pháp dịch chuyển lao động trên toàn cầu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
       <section className="py-20 md:py-28 bg-background">
         <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                 <h2 className="text-3xl font-headline font-bold text-primary">6 Giá trị cốt lõi</h2>
                 <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg">Những nguyên tắc định hướng mọi hành động và quyết định của chúng tôi.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map(value => (
                    <Card key={value.title} className="p-6 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4">
                         <value.icon className="h-10 w-10 text-primary flex-shrink-0"/>
                         <h3 className="text-base font-bold font-headline">{value.title}</h3>
                    </Card>
                ))}
            </div>
         </div>
      </section>

      {/* Activity Photos Section */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-headline font-bold text-primary">Hình ảnh hoạt động</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg">
              Những khoảnh khắc đáng nhớ trong hành trình phát triển và kết nối của HelloJob.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activityImages.map((src, index) => (
              <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Image
                  src={src}
                  alt={`Hoạt động HelloJob ${index + 1}`}
                  fill
                  className="object-cover"
                  data-ai-hint="team building event"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-headline font-bold text-primary">Đội ngũ của chúng tôi</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg">
              Những con người tâm huyết đứng sau thành công của HelloJob, luôn nỗ lực vì sự phát triển của bạn.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative h-32 w-32 md:h-40 md:w-40 mx-auto mb-4">
                   <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="rounded-full object-contain shadow-lg"
                    data-ai-hint={member.dataAiHint}
                  />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary font-semibold text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* CTA Section */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 rounded-lg bg-gradient-to-br from-accent to-primary text-primary-foreground p-12 lg:p-16">
            <div className="md:w-1/2 text-center md:text-left">
               <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">
                Đăng tin tuyển dụng miễn phí
                <span className="block text-xl text-primary-foreground/80 mt-1">無料で求人掲載 / Post Jobs for Free</span>
              </h2>
               <p className="text-lg text-primary-foreground/80 mb-8">
                Tiếp cận hàng ngàn ứng viên Thực tập sinh kỹ năng, Kỹ năng đặc định, Kỹ sư chất lượng cao từ Việt Nam. Đăng tin miễn phí và kết nối với nhân tài ngay hôm nay.
                <span className="block text-sm opacity-80 mt-2">質の高い技能実習生、特定技能、エンジニア人材にアクセス。無料で求人を掲載し、今日から人材と繋がりましょう。</span>
                <span className="block text-sm opacity-80 mt-1">Access thousands of high-quality Technical Intern Trainees, Skilled Workers, and Engineers from Vietnam. Post jobs for free and connect with talent today.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90" id="DANGTINTUYENDUNG01">
                  <Link href="/nha-tuyen-dung">
                    <div className="text-center">
                        <span className="font-semibold">Đăng tin tuyển dụng ngay</span>
                        <div className="text-xs opacity-80">求人を掲載 / Post Job Now</div>
                    </div>
                  </Link>
                </Button>
                 <Button asChild size="lg" className="bg-accent-orange hover:bg-accent-orange/90 text-white" id="DANGKYDOITAC01">
                  <Link href="/nha-tuyen-dung">
                     <div className="text-center">
                        <span className="font-semibold">Đăng ký đối tác</span>
                        <div className="text-xs opacity-80">パートナー登録 / Register as Partner</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
             <div className="md:w-1/2 flex justify-center">
              <Image
                src="/img/viet-img/phong-van (3).jpg"
                alt="Hợp tác tuyển dụng tại Nhật"
                width={500}
                height={350}
                className="rounded-lg shadow-xl"
                data-ai-hint="recruitment partnership japan"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
