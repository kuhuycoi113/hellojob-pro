
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, ShieldCheck, X } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nâng cấp tài khoản HelloJob Premium',
  description: 'Mở khóa toàn bộ tiềm năng của HelloJob với tài khoản Premium. Truy cập không giới hạn các khóa học, hồ sơ của bạn sẽ được ưu tiên và nhận nhiều quyền lợi độc quyền khác.',
};

const premiumFeatures = [
    { text: 'Mở khoá TOÀN BỘ khoá học E-learning', free: false, premium: true },
    { text: 'Hồ sơ được làm nổi bật và ưu tiên giới thiệu cho nhà tuyển dụng', free: false, premium: true },
    { text: 'Huy hiệu "Ứng viên Tiềm năng" trên hồ sơ', free: false, premium: true },
    { text: 'Ưu tiên hỗ trợ từ đội ngũ tư vấn viên HelloJob', free: false, premium: true },
    { text: 'Xem các phân tích & xu hướng ngành nghề độc quyền', free: false, premium: true },
    { text: 'Đăng và quản lý hồ sơ tìm việc', free: true, premium: true },
    { text: 'Sử dụng các công cụ trắc nghiệm hướng nghiệp', free: true, premium: true },
    { text: 'Học 50% số bài học đầu tiên của mỗi khoá', free: true, premium: true },
];

export default function PremiumPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-primary/10 p-4 rounded-full mb-6">
                 <Gem className="h-12 w-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-accent">
            Nâng cấp lên HelloJob Premium
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Mở khóa toàn bộ tiềm năng của HelloJob. Hủy bất cứ lúc nào.
          </p>
           <div className="mt-10">
             <Button size="lg" className="h-14 text-xl px-10 bg-accent-blue hover:bg-accent-blue/90">
                Đăng ký Premium chỉ 99.000 VND/tháng
             </Button>
             <p className="text-xs text-muted-foreground mt-2">Áp dụng cho gói thanh toán theo năm.</p>
           </div>
        </div>

        <Card className="max-w-5xl mx-auto mt-16 shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">So sánh các quyền lợi</CardTitle>
                <CardDescription>Xem tất cả các tính năng HelloJob Premium mang lại so với tài khoản miễn phí.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="divide-y divide-border">
                    <div className="hidden md:grid grid-cols-3 gap-4 font-bold py-2">
                        <div className="col-span-1">Tính năng</div>
                        <div className="col-span-1 text-center">Miễn phí</div>
                        <div className="col-span-1 text-center text-primary">Premium</div>
                    </div>
                     {premiumFeatures.map((feature, index) => (
                        <div key={index} className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 items-center">
                            <div className="col-span-2 md:col-span-1 font-semibold">{feature.text}</div>
                            <div className="col-span-1 md:col-span-1 text-center">
                                {feature.free ? 
                                    <Check className="h-6 w-6 text-green-500 inline-block"/> : 
                                    <X className="h-6 w-6 text-red-500 inline-block"/>
                                }
                                <span className="sr-only">{feature.free ? 'Có' : 'Không'}</span>
                            </div>
                            <div className="col-span-1 md:col-span-1 text-center">
                                {feature.premium ? 
                                    <Check className="h-6 w-6 text-green-500 inline-block"/> : 
                                    <X className="h-6 w-6 text-red-500 inline-block"/>
                                }
                                 <span className="sr-only">{feature.premium ? 'Có' : 'Không'}</span>
                            </div>
                        </div>
                     ))}
                </div>
            </CardContent>
        </Card>
        
        <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="underline">Điều khoản dịch vụ</a> và <a href="#" className="underline">Chính sách bảo mật</a> của HelloJob.</p>
            <p className="mt-2 flex items-center justify-center gap-2"><ShieldCheck className="h-4 w-4 text-green-600"/> Giao dịch an toàn và bảo mật.</p>
        </div>
      </div>
    </div>
  );
}
