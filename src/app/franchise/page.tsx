

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Database, Handshake, Cpu, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const partnerBenefits = [
    {
        icon: Database,
        title: "Tiếp cận nguồn ứng viên dồi dào",
        description: "Kết nối trực tiếp với hệ thống dữ liệu hàng ngàn ứng viên đã được sàng lọc, xác thực thông tin và đào tạo kỹ năng bài bản."
    },
    {
        icon: Cpu,
        title: "Nền tảng công nghệ thông minh",
        description: "Sử dụng các công cụ AI để tìm kiếm, lọc và quản lý ứng viên hiệu quả, tự động gợi ý các hồ sơ phù hợp nhất với yêu cầu của bạn."
    },
    {
        icon: Handshake,
        title: "Hỗ trợ vận hành và pháp lý",
        description: "Đội ngũ chuyên gia của chúng tôi tại Việt Nam sẽ hỗ trợ toàn diện về thủ tục, giấy tờ và đảm bảo quy trình tuyển dụng tuân thủ pháp luật."
    }
];

export default function FranchisePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-primary text-primary-foreground py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Nền tảng Đối tác Tuyển dụng tại Nhật Bản
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 text-primary-foreground/80">
            Hợp tác cùng HelloJob để tìm kiếm nguồn nhân lực Kỹ năng Đặc định (Tokutei Ginou) chất lượng cao từ Việt Nam một cách hiệu quả và minh bạch.
          </p>
           <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                          Trở thành Đối tác
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-headline text-2xl">Đăng ký hợp tác</DialogTitle>
                            <DialogDescription>
                                Vui lòng để lại thông tin của bạn. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Tên công ty</Label>
                                <Input id="name" placeholder="HelloJob Japan" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Số điện thoại</Label>
                                <Input id="phone" placeholder="0987654321" className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" type="email" placeholder="contact@hellojob.jp" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-primary text-white">Gửi thông tin</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button asChild size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90">
                    <Link href="/doi-tac/dang-tin-tuyen-dung"><Briefcase/> Đăng việc làm</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-secondary">
         <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                 <h2 className="text-3xl font-headline font-bold text-primary">Tại sao nên hợp tác với HelloJob?</h2>
                 <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg">Chúng tôi không chỉ là một nền tảng, chúng tôi là cầu nối vững chắc, mang lại giải pháp tuyển dụng toàn diện cho các doanh nghiệp và nghiệp đoàn tại Nhật Bản.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {partnerBenefits.map(benefit => (
                    <Card key={benefit.title} className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-accent-blue">
                        <benefit.icon className="h-16 w-16 text-primary mx-auto mb-6"/>
                        <h3 className="text-xl font-bold font-headline mb-3">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                    </Card>
                ))}
            </div>
         </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-4 text-primary">Quy trình hợp tác đơn giản, hiệu quả</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Nền tảng của chúng tôi được thiết kế để tối ưu hóa quy trình tuyển dụng, giúp bạn tiết kiệm thời gian, chi phí và nhanh chóng tìm được ứng viên phù hợp.
              </p>
              <ul className="space-y-6">
                  <li className="flex gap-4">
                    <CheckCircle className="h-8 w-8 text-accent-green mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">Đăng ký và Xác thực</h3>
                      <p className="text-muted-foreground text-sm">Tạo tài khoản đối tác và cung cấp thông tin để chúng tôi xác thực doanh nghiệp/nghiệp đoàn của bạn.</p>
                    </div>
                  </li>
                   <li className="flex gap-4">
                    <CheckCircle className="h-8 w-8 text-accent-green mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">Đăng tin & Tìm kiếm</h3>
                      <p className="text-muted-foreground text-sm">Dễ dàng đăng tin tuyển dụng hoặc chủ động tìm kiếm trong kho hồ sơ ứng viên khổng lồ của chúng tôi.</p>
                    </div>
                  </li>
                   <li className="flex gap-4">
                    <CheckCircle className="h-8 w-8 text-accent-green mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">Phỏng vấn & Tuyển chọn</h3>
                      <p className="text-muted-foreground text-sm">Sử dụng công cụ của chúng tôi để lên lịch phỏng vấn, trao đổi và quản lý quá trình tuyển chọn ứng viên.</p>
                    </div>
                  </li>
              </ul>
            </div>
             <div>
              <Image
                src="https://placehold.co/600x600.png"
                alt="Quy trình tuyển dụng"
                width={600}
                height={600}
                className="rounded-lg shadow-xl"
                data-ai-hint="recruitment process flowchart"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-sky-500 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">Sẵn sàng tìm kiếm nhân tài Việt Nam?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">Hãy để lại thông tin, đội ngũ HelloJob sẽ liên hệ và tư vấn chi tiết về mô hình hợp tác, giúp bạn giải quyết bài toán nhân sự một cách hiệu quả nhất.</p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                      Liên hệ với chúng tôi
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Đăng ký hợp tác</DialogTitle>
                        <DialogDescription>
                            Vui lòng để lại thông tin của bạn. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                       <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Tên công ty</Label>
                            <Input id="name" placeholder="HelloJob Japan" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Số điện thoại</Label>
                            <Input id="phone" placeholder="0987654321" className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" placeholder="contact@hellojob.jp" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-primary text-white">Gửi thông tin</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </section>
    </>
  );
}
