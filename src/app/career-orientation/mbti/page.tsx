import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, CheckSquare, BarChartHorizontal, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    icon: BrainCircuit,
    title: 'Hiểu rõ bản thân',
    description: 'Xác định xu hướng tự nhiên của bạn trong cách bạn tiếp nhận năng lượng, thu thập thông tin, ra quyết định và tổ chức cuộc sống.'
  },
  {
    icon: Users,
    title: 'Cải thiện mối quan hệ',
    description: 'Hiểu cách người khác suy nghĩ và hành động, từ đó cải thiện giao tiếp và sự đồng cảm trong công việc và cuộc sống.'
  },
  {
    icon: BarChartHorizontal,
    title: 'Định hướng sự nghiệp',
    description: 'Khám phá những ngành nghề và môi trường làm việc phù hợp nhất, nơi bạn có thể phát huy tối đa điểm mạnh của mình.'
  }
];

export default function MbtiLandingPage() {
  return (
    <div className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
             <Image src="https://placehold.co/100x100.png" alt="MBTI Icon" width={80} height={80} data-ai-hint="personality puzzle icon"/>
             <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              Trắc nghiệm tính cách MBTI
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Khám phá 1 trong 16 loại tính cách của bạn để hiểu sâu hơn về bản thân và tìm ra con đường sự nghiệp lý tưởng.
          </p>
        </div>
        
        <Card className="max-w-5xl mx-auto shadow-xl mb-12">
            <CardContent className="p-8 grid md:grid-cols-3 gap-8">
                {features.map(feature => (
                    <div key={feature.title} className="flex flex-col items-center text-center">
                        <div className="bg-accent-blue/10 p-4 rounded-full mb-4">
                            <feature.icon className="w-10 h-10 text-accent-blue" />
                        </div>
                        <h3 className="font-bold text-xl font-headline mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                ))}
            </CardContent>
        </Card>

        <div className="text-center">
            <p className="text-muted-foreground mb-6">Bài test gồm 20 câu hỏi và sẽ mất khoảng 5 phút để hoàn thành.</p>
            <Button asChild size="lg" className="bg-accent-blue text-white hover:bg-accent-blue/90">
                <Link href="/career-orientation/mbti/test">
                    Bắt đầu làm bài <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
