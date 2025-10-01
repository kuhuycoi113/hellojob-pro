
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, DollarSign, Users, Search, CheckCircle, TrendingUp, BarChart, FileSignature, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giải pháp cho Nghiệp đoàn tại Nhật | HelloJob',
  description: 'Tối ưu chi phí, nâng cao chất lượng Thực tập sinh và phát triển khách hàng bền vững cùng nền tảng công nghệ của HelloJob.',
};

const painPoints = [
    {
        icon: Users,
        title: 'Thiếu nguồn TTS chất lượng',
        description: 'Khó tìm ứng viên đạt chuẩn, không đáp ứng chỉ tiêu, rủi ro ứng viên bỏ trốn/nghỉ việc, tăng chi phí.',
    },
    {
        icon: DollarSign,
        title: 'Chi phí cao, lợi nhuận giảm',
        description: 'Phí từ doanh nghiệp tiếp nhận bị ép xuống, trong khi chi phí quản lý (nhà ở, hỗ trợ, pháp lý) ngày càng tăng.',
    },
    {
        icon: Search,
        title: 'Khó phát triển khách hàng',
        description: 'Cạnh tranh gay gắt trong việc tìm doanh nghiệp mới và giữ chân khách hàng cũ với nguồn cung không ổn định.',
    },
];

const solutions = [
    {
        icon: Users,
        title: 'Nguồn ứng viên dồi dào và chất lượng',
        details: [
            'Danh sách hàng trăm công ty phái cử với dịch vụ nguồn ứng viên đa dạng.',
            'Nguồn ứng viên trực tiếp từ hệ thống công nghệ của HelloJob, chủ động tìm đến nền tảng.',
            'Ứng viên được trang bị kiến thức thông qua hệ thống cẩm nang, nâng cao chất lượng cung cấp đến khách hàng.',
        ],
    },
    {
        icon: TrendingUp,
        title: 'Tối ưu hóa chi phí & Quản lý hiệu quả',
        details: [
            'Được tự do đấu giá mức phí giới thiệu thấp nhất.',
            'Được đề xuất lựa chọn các dịch vụ quản lý, đối ứng phù hợp nhất để bảo đảm hiệu quả kinh doanh.',
            'Nền tảng số hóa quản lý ứng viên, công việc, phỏng vấn, giảm thiểu giấy tờ và quy trình thủ công.',
        ],
    },
    {
        icon: Handshake,
        title: 'Mở rộng & Giữ chân khách hàng',
        details: [
            'Được xây dựng profile doanh nghiệp chuyên nghiệp, hiện đại để quảng bá đến khách hàng những dịch vụ tốt nhất.',
            'Được tự do xây dựng các bài viết, nội dung để thu hút khách hàng vào gian hàng của mình.',
            'Được tiếp cận với những khách hàng tiềm năng trong khu vực của mình trong tương lai.',
        ],
    },
];


export default function UnionLandingPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary to-accent text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-4">
                Lựa chọn nguồn cung ứng viên dồi dào, chất lượng - Tối ưu chi phí, lợi nhuận - Phát triển khách hàng tiếp nhận bền vững
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Nền tảng HelloJob cung cấp giải pháp công nghệ toàn diện, giúp Nghiệp đoàn của bạn giải quyết các bài toán cốt lõi và phát triển mạnh mẽ.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90" id="DANGTINTUYENDUNG01">
                      <Link href="/nha-tuyen-dung">
                          Đăng tin tuyển dụng ngay
                      </Link>
                  </Button>
                  <Button asChild size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" id="DANGKYDOITAC01">
                      <Link href="/nha-tuyen-dung?action=register">
                          Đăng ký đối tác
                      </Link>
                  </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <Image
                src="/img/viet-img/nghiep_doan.jpg"
                alt="Hợp tác cùng phát triển với HelloJob"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                data-ai-hint="business people shaking hands"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Chúng tôi thấu hiểu những thách thức của bạn</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              HelloJob nhận diện rõ những "nỗi đau" mà các Nghiệp đoàn đang đối mặt hàng ngày.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {painPoints.map((point) => (
              <Card key={point.title} className="text-center p-8 shadow-lg bg-background">
                <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit mb-4">
                  <point.icon className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-xl font-bold font-headline mb-3">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Solutions Section */}
       <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Giải pháp của HelloJob dành cho Nghiệp đoàn</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              Chúng tôi biến mỗi thách thức của bạn thành một cơ hội tăng trưởng bằng công nghệ.
            </p>
          </div>
          <div className="space-y-12">
            {solutions.map((solution, index) => (
              <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-row-dense' : ''}`}>
                <div className={`relative h-80 rounded-lg shadow-xl overflow-hidden ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                    <Image src="https://placehold.co/600x400.png" alt={solution.title} fill className="object-cover" data-ai-hint="solution illustration"/>
                </div>
                <div className="space-y-4">
                    <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
                        <solution.icon className="h-8 w-8 text-primary"/>
                    </div>
                    <h3 className="text-2xl font-bold font-headline">{solution.title}</h3>
                    <ul className="space-y-3">
                        {solution.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/>
                                <span className="text-muted-foreground">{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
       </section>

      {/* Final CTA Section */}
      <section className="bg-accent text-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-headline font-bold mb-4">Sẵn sàng nâng tầm hoạt động của Nghiệp đoàn?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
            Trở thành đối tác của HelloJob ngay hôm nay để bắt đầu tối ưu hóa quy trình, giảm chi phí và tiếp cận nguồn ứng viên chất lượng cao.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/nha-tuyen-dung?action=register">Đăng ký đối tác ngay</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover:text-white">
              <Link href="/nha-tuyen-dung">Đăng tin tuyển dụng</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
