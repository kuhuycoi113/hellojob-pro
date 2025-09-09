
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, BarChartHorizontal, ClipboardCheck, ArrowRight, UserCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const tests = [
  {
    icon: BrainCircuit,
    title: 'Trắc nghiệm Sở thích nghề nghiệp Holland',
    description: 'Khám phá 6 nhóm sở thích nghề nghiệp tương ứng với bạn (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) để tìm ra môi trường làm việc phù hợp nhất.',
    link: '/career-orientation/holland',
    color: 'accent-orange'
  },
  {
    icon: ClipboardCheck,
    title: 'Khám phá nghề nghiệp O*NET',
    description: 'Dựa trên sở thích của bạn, bài test sẽ gợi ý danh sách các ngành nghề cụ thể đang có nhu cầu cao trên thị trường, giúp bạn có lựa chọn thực tế và thông minh.',
    link: '/career-orientation/onet',
    color: 'accent-blue'
  },
  {
    icon: BarChartHorizontal,
    title: 'Trắc nghiệm tính cách DISC',
    description: 'Hiểu rõ phong cách hành vi của bạn qua 4 nhóm tính cách (Dominance, Influence, Steadiness, Conscientiousness), giúp cải thiện giao tiếp và làm việc nhóm.',
    link: '/career-orientation/disc',
    color: 'accent-green'
  },
  {
    icon: UserCheck,
    title: 'Trắc nghiệm tính cách MBTI',
    description: 'Xác định 1 trong 16 loại tính cách của bạn để hiểu rõ hơn về điểm mạnh, điểm yếu và các ngành nghề phù hợp với xu hướng tự nhiên của bạn.',
    link: '/career-orientation/mbti',
    color: 'accent-blue'
  },
   {
    icon: Heart,
    title: 'Trắc nghiệm giá trị Barrett (CTT)',
    description: 'Xác định những giá trị cá nhân cốt lõi của bạn để tìm kiếm một môi trường làm việc có văn hoá doanh nghiệp phù hợp.',
    link: '/career-orientation/barrett',
    color: 'accent-red'
  }
];

export default function CareerOrientationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
                Khám phá bản thân, Định hướng tương lai
              </h1>
              <p className="text-lg md:text-xl max-w-md mx-auto md:mx-0 text-primary-foreground/80">
                Thực hiện các bài trắc nghiệm khoa học để hiểu rõ tiềm năng, sở thích và tính cách của bạn, từ đó lựa chọn con đường sự nghiệp phù hợp nhất.
              </p>
            </div>
             <div className="relative flex justify-center">
                <Image 
                  src="/img/who_am_i.png?v=3"
                  alt="Biểu đồ hướng nghiệp"
                  width={450}
                  height={450}
                  className="rounded-full shadow-2xl"
                  data-ai-hint="career path diagram"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section className="w-full py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-accent">Bộ công cụ hướng nghiệp</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              Các bài kiểm tra này được thiết kế dựa trên các mô hình tâm lý học và hướng nghiệp uy tín trên thế giới.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {tests.map(test => (
              <Card key={test.title} className={`flex flex-col text-center p-6 border-t-4 border-${test.color} shadow-lg hover:shadow-xl transition-shadow`}>
                <CardHeader>
                    <div className={`mx-auto bg-${test.color}/10 rounded-full p-4 w-fit`}>
                        <test.icon className={`h-12 w-12 text-${test.color}`} />
                    </div>
                    <CardTitle className="font-headline mt-4 text-xl">{test.title}</CardTitle>
                </CardHeader>
                 <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">{test.description}</p>
                 </CardContent>
                 <div className="mt-auto pt-4">
                    <Button asChild className={`bg-${test.color} text-white hover:bg-${test.color}/90`}>
                      <Link href={test.link}>
                        Bắt đầu làm bài <ArrowRight className="ml-2" />
                      </Link>
                    </Button>
                 </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
