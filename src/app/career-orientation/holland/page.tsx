
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Book, User, Briefcase } from 'lucide-react';
import Link from 'next/link';

const ageGroups = [
  {
    title: 'Học sinh THCS (12-15 tuổi)',
    description: 'Khám phá sớm các nhóm ngành nghề phù hợp với sở thích và năng khiếu của bản thân.',
    icon: Book,
    link: '/career-orientation/holland/test?ageGroup=thcs',
    color: 'accent-orange'
  },
  {
    title: 'Học sinh PTTH & Sinh viên (16-22 tuổi)',
    description: 'Định hướng chọn trường, chọn ngành học phù hợp để chuẩn bị cho sự nghiệp tương lai.',
    icon: User,
    link: '/career-orientation/holland/test?ageGroup=ptth-sv',
    color: 'accent-green'
  },
  {
    title: 'Người đi làm (23+ tuổi)',
    description: 'Tìm hiểu sâu hơn về bản thân để lựa chọn công việc đúng đam mê hoặc chuyển đổi ngành nghề.',
    icon: Briefcase,
    link: '/career-orientation/holland/test?ageGroup=di-lam',
    color: 'accent-blue'
  }
];

export default function HollandLandingPage() {
  return (
    <div className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Trắc nghiệm sở thích nghề nghiệp Holland
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Hãy chọn nhóm tuổi của bạn để bắt đầu bài kiểm tra và khám phá con đường sự nghiệp phù hợp nhất.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {ageGroups.map((group) => (
            <Card key={group.title} className={`flex flex-col text-center border-t-4 border-${group.color} shadow-lg hover:shadow-xl transition-shadow`}>
              <CardHeader>
                 <div className={`mx-auto bg-${group.color}/10 rounded-full p-4 w-fit`}>
                    <group.icon className={`h-10 w-10 text-${group.color}`} />
                </div>
                <CardTitle className="font-headline mt-4 text-xl">{group.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{group.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                 <Button asChild className={`w-full bg-${group.color} text-white hover:bg-${group.color}/90`}>
                    <Link href={group.link}>
                        Bắt đầu <ArrowRight className="ml-2" />
                    </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
