
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Wrench, Megaphone, DollarSign, BookOpen } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Wrench,
    title: 'Xây dựng khoá học',
    description: 'Sử dụng các công cụ và tài nguyên của chúng tôi để tạo ra nội dung bài giảng hấp dẫn và chuyên nghiệp.',
    buttonText: 'Bắt đầu xây dựng',
    link: '/learn/create/course',
    color: 'orange'
  },
  {
    icon: Megaphone,
    title: 'Quảng bá khoá học',
    description: 'Tiếp cận hàng ngàn học viên tiềm năng trên nền tảng HelloJob và các kênh đối tác của chúng tôi.',
    buttonText: 'Tìm hiểu cách quảng bá',
    link: '/learn/promote',
    color: 'blue'
  },
  {
    icon: DollarSign,
    title: 'Doanh thu',
    description: 'Kiếm tiền từ kiến thức của bạn với mô hình chia sẻ doanh thu minh bạch và hấp dẫn của chúng tôi.',
    buttonText: 'Xem cơ chế',
    link: '/learn/dashboard',
    color: 'green'
  }
];

const colorClasses: { [key: string]: { bg: string; text: string; button: string } } = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', button: 'bg-orange-500 hover:bg-orange-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-500 hover:bg-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600', button: 'bg-green-500 hover:bg-green-600' },
};


export default function CreateCoursePage() {
  return (
    <div className="bg-secondary min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
           <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                <BookOpen className="h-12 w-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Chia sẻ khoá học của bạn</h1>
          <p className="text-lg text-muted-foreground mt-4">
            Đóng góp kiến thức của bạn cho cộng đồng và cùng nhau tạo doanh thu.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {steps.map((step) => {
            const colors = colorClasses[step.color];
            return (
              <Card key={step.title} className="flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                   <div className={`mx-auto ${colors.bg} rounded-full p-4 w-fit mb-4`}>
                      <step.icon className={`h-10 w-10 ${colors.text}`} />
                  </div>
                  <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                   <Button asChild className={`w-full ${colors.button} text-white`}>
                      <Link href={step.link}>
                          {step.buttonText} <ArrowRight className="ml-2" />
                      </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
