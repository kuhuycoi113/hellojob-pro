
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, BookOpen, CheckCircle, Handshake, Users, Heart, Star, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { courses } from '@/lib/learn-data';

export const metadata: Metadata = {
  title: 'E-Learning: Chinh phục tiếng Nhật và Kỹ năng làm việc',
  description: 'Nâng cao kỹ năng, mở rộng cơ hội với các khóa học E-learning được thiết kế riêng cho người lao động Việt Nam muốn làm việc tại Nhật Bản.',
};

const InstructorCta = () => (
    <section className="w-full mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-headline font-bold">Trở thành người hướng dẫn trên HelloJob</h2>
                    <p className="mt-2 text-white/90">Chia sẻ kiến thức chuyên môn của bạn và kiếm thêm thu nhập bằng cách tạo ra các khóa học online của riêng bạn trên nền tảng của chúng tôi.</p>
                </div>
                 <div className="flex justify-center md:justify-end">
                     <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-white/90 rounded-full h-14 text-lg px-8">
                        <Link href="/learn/create">
                            <Handshake className="mr-2"/>
                            Bắt đầu ngay
                        </Link>
                    </Button>
                 </div>
            </div>
        </Card>
      </div>
    </section>
);


export default function LearnPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <BookOpen className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            E-Learning: Chinh phục tiếng Nhật & Kỹ năng
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Nâng cao kỹ năng, mở rộng cơ hội. Học mọi lúc, mọi nơi với các khóa học được thiết kế riêng cho người lao động.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
                 <Card key={course.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                    <CardHeader className="p-0">
                       <Link href={`/learn/${course.id}`} className="block relative aspect-video">
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover"
                            data-ai-hint={course['data-ai-hint']}
                          />
                       </Link>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <p className="text-sm font-bold mb-2 text-primary">{course.category}</p>
                      <Link href={`/learn/${course.id}`} className="flex-grow">
                          <CardTitle className="font-headline text-xl mb-2 group-hover:text-primary transition-colors">{course.title}</CardTitle>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-grow">{course.description}</p>
                      
                       <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5" title="Số học viên">
                                <Users className="h-4 w-4"/>
                                <span>{course.stats.students.toLocaleString()}</span>
                            </div>
                             <div className="flex items-center gap-1.5" title="Lượt thích">
                                <Heart className="h-4 w-4"/>
                                <span>{course.stats.likes.toLocaleString()}</span>
                            </div>
                             <div className="flex items-center gap-1.5" title="Bình luận">
                                <MessageSquare className="h-4 w-4"/>
                                <span>{course.stats.comments.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Đánh giá">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500"/>
                                <span className="font-bold text-foreground">{course.stats.rating}</span>
                            </div>
                        </div>

                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                       <Button asChild className="w-full">
                           <Link href={`/learn/${course.id}`}>
                                Bắt đầu học <ArrowRight className="ml-2" />
                           </Link>
                       </Button>
                    </div>
                  </Card>
            ))}
        </div>
        <InstructorCta />
      </div>
    </div>
  );
}
