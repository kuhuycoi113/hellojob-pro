
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Target, TrendingUp, RadioTower } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: Target,
    title: 'Tiếp cận đúng đối tượng',
    description: 'Quảng cáo của bạn sẽ được hiển thị cho hàng ngàn người lao động Việt Nam đang có nhu cầu học tập để làm việc tại Nhật.',
  },
  {
    icon: TrendingUp,
    title: 'Tăng doanh thu và ghi danh',
    description: 'Tăng đáng kể số lượng học viên đăng ký, từ đó tối đa hóa doanh thu từ khóa học của bạn.',
  },
  {
    icon: RadioTower,
    title: 'Xây dựng thương hiệu cá nhân',
    description: 'Nâng cao uy tín và thương hiệu của bạn với tư cách là một chuyên gia trong cộng đồng HelloJob.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Chọn gói quảng bá',
    description: 'Lựa chọn gói quảng cáo phù hợp với ngân sách và mục tiêu của bạn, từ việc làm nổi bật khóa học trên trang chủ đến các chiến dịch email marketing.',
  },
  {
    step: 2,
    title: 'HelloJob thực hiện',
    description: 'Đội ngũ của chúng tôi sẽ triển khai các chiến dịch quảng bá trên các kênh hiệu quả nhất, đảm bảo khóa học của bạn tiếp cận được nhiều người nhất.',
  },
  {
    step: 3,
    title: 'Theo dõi và Tối ưu',
    description: 'Bạn sẽ nhận được báo cáo chi tiết về hiệu quả của chiến dịch, giúp bạn hiểu rõ hơn về học viên và tối ưu hóa cho các lần quảng bá sau.',
  },
];

export default function PromoteCoursePage() {
  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="w-full bg-blue-600 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            Quảng bá khoá học của bạn
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/80">
            Đưa khóa học của bạn đến với hàng ngàn học viên tiềm năng và tối đa hóa doanh thu.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-headline font-bold text-primary">Tại sao nên quảng bá với HelloJob?</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg">
              Chúng tôi cung cấp một nền tảng mạnh mẽ để kết nối kiến thức của bạn với những người thực sự cần nó.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
                <div className="mx-auto bg-blue-100 rounded-full p-4 w-fit mb-6">
                  <benefit.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold font-headline mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-headline font-bold text-primary">Quy trình hoạt động</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg">
              Chỉ với 3 bước đơn giản để bắt đầu chiến dịch quảng bá của bạn.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Dashed line connecting steps */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 w-full h-px border-t-2 border-dashed border-border -translate-y-1/2 -z-10" />
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center relative">
                 <div className="mx-auto bg-background p-2">
                    <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-2xl border-4 border-background mb-4">
                        {step.step}
                    </div>
                 </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 text-center py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-headline font-bold text-primary">Sẵn sàng để bắt đầu?</h2>
          <p className="text-muted-foreground my-4 max-w-2xl mx-auto">
            Liên hệ với đội ngũ của chúng tôi ngay hôm nay để nhận được tư vấn chi tiết về các gói quảng bá và bắt đầu hành trình chia sẻ kiến thức của bạn.
          </p>
          <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">Liên hệ chúng tôi</Button>
        </div>
      </section>
    </div>
  );
}
