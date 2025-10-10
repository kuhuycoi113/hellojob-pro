

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, FileSignature, BarChart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const partnerBenefits = [
  { 
    icon: Users,
    title: 'Nguồn ứng viên dồi dào', 
    description: 'Tiếp cận hệ thống dữ liệu ứng viên Kỹ năng Đặc định (Tokutei) đã được sàng lọc và xác thực thông tin ban đầu.'
  },
  { 
    icon: FileSignature,
    title: 'Công cụ quản lý hiệu quả', 
    description: 'Sử dụng nền tảng để quản lý tin tuyển dụng, theo dõi trạng thái ứng viên và tương tác một cách chuyên nghiệp.'
  },
  { 
    icon: BarChart,
    title: 'Hỗ trợ Marketing & Vận hành', 
    description: 'Được hỗ trợ quảng bá tin tuyển dụng trên các kênh của HelloJob, tiếp cận đúng đối tượng mục tiêu và tối ưu hóa hiệu quả.'
  },
  {
    icon: ShieldCheck,
    title: 'Hợp tác minh bạch',
    description: 'Quy trình hợp tác rõ ràng, cơ chế chia sẻ doanh thu hấp dẫn và minh bạch, đảm bảo quyền lợi cho đối tác.'
  }
];

export default function EmployersPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section for Partnership */}
      <section className="w-full bg-accent text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
                Nền tảng Đối tác Tuyển dụng Kỹ năng Đặc định
                <span className="block text-2xl text-primary-foreground/80 mt-1">特定技能パートナーシップ基盤</span>
              </h1>
              <p className="text-lg md:text-xl max-w-md mx-auto md:mx-0 text-primary-foreground/80">
                Hợp tác cùng HelloJob để khai thác tối đa tiềm năng thị trường lao động Tokutei Ginou tại Nhật Bản.
                <span className="block text-base opacity-80 mt-2">Partner with HelloJob to fully exploit the potential of the Tokutei Ginou labor market in Japan.</span>
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90" id="DANGTINTUYENDUNG01">
                  <Link href="/nha-tuyen-dung/dang-tin-tuyen-dung">
                    <div className="text-center">
                        <span className="font-semibold">Đăng tin tuyển dụng ngay</span>
                        <div className="text-xs opacity-80">求人を掲載 / Post Job Now</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" id="DANGKYDOITAC01">
                  <Link href="/nha-tuyen-dung/dang-ky">
                    <div className="text-center">
                        <span className="font-semibold">Đăng ký đối tác</span>
                        <div className="text-xs opacity-80">パートナー登録 / Register as Partner</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
             <div className="relative hidden md:block">
                <Image 
                  src="https://placehold.co/600x400.png"
                  alt="Sơ đồ hợp tác đối tác"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                  data-ai-hint="partnership model diagram"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Benefits */}
      <section className="w-full py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Lợi ích dành cho Đối tác</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              Chúng tôi cung cấp một nền tảng toàn diện với các công cụ và sự hỗ trợ cần thiết để giúp bạn thành công.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {partnerBenefits.map(feature => (
              <Card key={feature.title} className="text-center p-6 border-t-4 border-primary shadow-lg hover:shadow-xl transition-shadow">
                 <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                 <h3 className="text-xl font-bold font-headline mb-2">{feature.title}</h3>
                 <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <Card className="p-8 md:p-12 bg-secondary border-none">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline mb-4">Chào mừng các Đối tác Tuyển dụng</h2>
                    <p className="text-muted-foreground max-w-4xl mx-auto">
                        HelloJob là hệ thống giúp các đối tác đăng tải thông tin việc làm miễn phí để tuyển dụng ứng viên Việt Nam. Chúng tôi chào mừng các đối tác là Cá nhân (làm việc cho các tổ chức nhân lực) hoặc Pháp nhân tại Việt Nam và Nhật Bản.
                    </p>
                    <div className="mt-6 bg-background p-6 rounded-lg inline-block">
                        <h3 className="font-semibold mb-3">Các loại hình tuyển dụng chính:</h3>
                        <ul className="space-y-1 text-muted-foreground text-left">
                            <li>- Kỹ năng đặc định (特定技能)</li>
                            <li>- Thực tập sinh kỹ năng (技能実習)</li>
                            <li>- Kỹ sư, tri thức (技術・人文知識・国際業務 - 技人国)</li>
                        </ul>
                    </div>
                     <p className="mt-6 text-muted-foreground max-w-4xl mx-auto">
                        Bạn có thể đăng việc làm ngay hoặc để lại thông tin liên hệ để tìm hiểu về cơ chế hợp tác.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
                           <Link href="/nha-tuyen-dung/dang-tin-tuyen-dung">
                            <div className="text-center">
                                <span className="font-semibold">Đăng tin tuyển dụng ngay</span>
                                <div className="text-xs opacity-80">求人を掲載 / Post Job Now</div>
                            </div>
                          </Link>
                        </Button>
                         <Button asChild size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90">
                          <Link href="/nhuong-quyen">
                            <div className="text-center">
                                <span className="font-semibold">Đăng ký đối tác</span>
                                <div className="text-xs opacity-80">パートナー登録 / Register as Partner</div>
                            </div>
                          </Link>
                        </Button>
                    </div>
                 </div>
            </Card>
        </div>
      </section>

    </div>
  );
}
