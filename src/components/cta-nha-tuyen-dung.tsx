
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { YL01Dialog } from './Y-L01-dialog'; // Import the dialog

export function CtaNhaTuyenDung() {
    const router = useRouter();
    const [isYL01DialogOpen, setIsYL01DialogOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState<'vi' | 'ja' | 'en'>('vi');

    const navigateToEmployerPage = (data: any) => {
        const params = new URLSearchParams();
        if (data.role) params.set('role', data.role);
        if (data.sub_role) params.set('sub_role', data.sub_role);
        if (data.name) params.set('name', data.name);
        if (data.company_name) params.set('company_name', data.company_name);
        if (data.lang) params.set('lang', data.lang);

        (data.interest || []).forEach((item: string) => params.append('interest', item));
        (data.visaType || []).forEach((item: string) => params.append('visa_type', item));
        (data.visaDetail || []).forEach((item: string) => params.append('visa_detail', item));
        (data.industry || []).forEach((item: string) => params.append('industry', item));
        (data.location || []).forEach((item: string) => params.append('location', item));
        
        router.push(`/nha-tuyen-dung/dang-ky?${params.toString()}`);
        setIsYL01DialogOpen(false);
    };

    return (
        <>
            <section id="NHATUYENDUNG01" className="w-full py-20 md:py-28 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center gap-12 rounded-lg bg-gradient-to-br from-accent to-primary text-primary-foreground p-12 lg:p-16">
                    <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">
                        Đăng tin tuyển dụng miễn phí
                        <span className="block text-xl text-primary-foreground/80 mt-1">無料で求人掲載 / Post Jobs for Free</span>
                    </h2>
                    <p className="text-lg text-primary-foreground/80 mb-8">
                        Tiếp cận hàng ngàn ứng viên Thực tập sinh kỹ năng, Kỹ năng đặc định, Kỹ sư chất lượng cao từ Việt Nam. Đăng tin miễn phí và kết nối với nhân tài ngay hôm nay.
                        <span className="block text-sm opacity-80 mt-2">質の高い技能実習生、特定技能、エンジニア人材にアクセス。無料で求人を掲載し、今日から人材と繋がりましょう。</span>
                        <span className="block text-sm opacity-80 mt-1">Access thousands of high-quality Technical Intern Trainees, Skilled Workers, and Engineers from Vietnam. Post jobs for free and connect with talent today.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90" id="DANGTINTUYENDUNG01">
                          <Link href="/nha-tuyen-dung">
                            <div className="text-center">
                                <span className="font-semibold">Xem chi tiết</span>
                                <div className="text-xs opacity-80">詳細を確認 / Learn More</div>
                            </div>
                          </Link>
                        </Button>
                        <Button size="lg" className="bg-accent-orange text-white hover:bg-accent-orange/90" id="DANGKYDOITAC01" onClick={() => setIsYL01DialogOpen(true)}>
                          <div className="text-center">
                              <span className="font-semibold">Đăng ký ngay</span>
                              <div className="text-xs opacity-80">今すぐ登録 / Register Now</div>
                          </div>
                        </Button>
                    </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <Link href="/nha-tuyen-dung" className="group block rounded-lg overflow-hidden shadow-xl">
                            <Image
                            src="/img/viet-img/phong-van (3).jpg"
                            alt="Hợp tác tuyển dụng tại Nhật"
                            width={500}
                            height={350}
                            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="recruitment partnership japan"
                            />
                        </Link>
                    </div>
                </div>
                </div>
          </section>
          <YL01Dialog 
            isOpen={isYL01DialogOpen} 
            onOpenChange={setIsYL01DialogOpen}
            onLanguageChange={setSelectedLang}
            initialLang={selectedLang}
            initialStep={1}
            onComplete={navigateToEmployerPage}
            onBack={() => setIsYL01DialogOpen(false)}
          />
      </>
    )
}
