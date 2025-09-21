

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
    avatar: 'https://placehold.co/200x200.png',
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
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] max-h-[450px]">
              <Image
                src="https://placehold.co/600x450.png"
                alt="Đội ngũ HelloJob"
                fill
                className="object-contain rounded-lg shadow-xl"
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

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-secondary">
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
      <section className="bg-accent text-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">Trở thành đối tác của HelloJob</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                Bạn là một nhà tuyển dụng, một công ty phái cử hay một nhà đầu tư có tầm nhìn? Hãy liên hệ với chúng tôi để cùng khai thác tiềm năng của thị trường.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <Link href="/nhuong-quyen">Tìm hiểu mô hình Nhượng quyền <FileSignature/></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover:text-white">
                    <Link href="/nha-tuyen-dung">Dành cho Đối tác tuyển dụng <BarChart/></Link>
                </Button>
            </div>
        </div>
      </section>
    </>
  );
}
