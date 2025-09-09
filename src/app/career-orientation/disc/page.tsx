
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, CheckSquare, BarChartHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    icon: Users,
    title: 'Thấu hiểu bản thân',
    description: 'Nhận diện phong cách hành vi tự nhiên của bạn, điểm mạnh, điểm yếu và cách bạn tương tác với người khác.'
  },
  {
    icon: CheckSquare,
    title: 'Cải thiện giao tiếp',
    description: 'Học cách giao tiếp hiệu quả hơn với những người có nhóm tính cách khác nhau, giảm thiểu xung đột và hiểu lầm.'
  },
  {
    icon: BarChartHorizontal,
    title: 'Định hướng sự nghiệp',
    description: 'Khám phá những môi trường làm việc và ngành nghề phù hợp nhất với tính cách của bạn để phát huy tối đa tiềm năng.'
  }
];

export default function DiscLandingPage() {
  return (
    <div className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
             <Image src="https://placehold.co/100x100.png" alt="DISC Icon" width={80} height={80} data-ai-hint="colorful chart icon"/>
             <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              Trắc nghiệm tính cách DISC
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Khám phá phong cách hành vi của bạn qua 4 nhóm tính cách cốt lõi: Thống trị (Dominance), Ảnh hưởng (Influence), Kiên định (Steadiness) và Tuân thủ (Conscientiousness).
          </p>
        </div>
        
        <Card className="max-w-5xl mx-auto shadow-xl mb-12">
            <CardContent className="p-8 grid md:grid-cols-3 gap-8">
                {features.map(feature => (
                    <div key={feature.title} className="flex flex-col items-center text-center">
                        <div className="bg-accent-green/10 p-4 rounded-full mb-4">
                            <feature.icon className="w-10 h-10 text-accent-green" />
                        </div>
                        <h3 className="font-bold text-xl font-headline mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                ))}
            </CardContent>
        </Card>

        <div className="text-center">
            <p className="text-muted-foreground mb-6">Bài test gồm 28 câu hỏi và sẽ mất khoảng 5-10 phút để hoàn thành.</p>
            <Button asChild size="lg" className="bg-accent-green text-white hover:bg-accent-green/90">
                <Link href="/career-orientation/disc/test">
                    Bắt đầu làm bài <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
