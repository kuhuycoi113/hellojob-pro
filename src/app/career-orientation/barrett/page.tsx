
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, Building, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    icon: Heart,
    title: 'Khám phá giá trị cốt lõi',
    description: 'Xác định những điều thực sự quan trọng đối với bạn trong công việc và cuộc sống.'
  },
  {
    icon: Building,
    title: 'Tìm kiếm văn hoá phù hợp',
    description: 'Nhận biết loại hình văn hoá doanh nghiệp nào sẽ giúp bạn phát triển và cảm thấy gắn bó.'
  },
  {
    icon: Users,
    title: 'Nâng cao sự hài lòng',
    description: 'Khi giá trị của bạn và công ty tương đồng, bạn sẽ cảm thấy hạnh phúc và có động lực hơn.'
  }
];

export default function BarrettLandingPage() {
  return (
    <div className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
             <Image src="https://placehold.co/100x100.png" alt="Barrett Values Icon" width={80} height={80} data-ai-hint="personal values icon"/>
             <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              Trắc nghiệm Giá trị Barrett (CTT)
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Hiểu rõ những giá trị dẫn dắt hành vi của bạn để tìm được một công việc và môi trường làm việc thực sự có ý nghĩa.
          </p>
        </div>
        
        <Card className="max-w-5xl mx-auto shadow-xl mb-12">
            <CardContent className="p-8 grid md:grid-cols-3 gap-8">
                {features.map(feature => (
                    <div key={feature.title} className="flex flex-col items-center text-center">
                        <div className="bg-accent-red/10 p-4 rounded-full mb-4">
                            <feature.icon className="w-10 h-10 text-accent-red" />
                        </div>
                        <h3 className="font-bold text-xl font-headline mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                ))}\
            </CardContent>
        </Card>

        <div className="text-center">
            <p className="text-muted-foreground mb-6">Chọn 10 giá trị quan trọng nhất đối với bạn từ danh sách được cung cấp.</p>
            <Button asChild size="lg" className="bg-accent-red text-white hover:bg-accent-red/90">
                <Link href="/career-orientation/barrett/test">
                    Bắt đầu <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
