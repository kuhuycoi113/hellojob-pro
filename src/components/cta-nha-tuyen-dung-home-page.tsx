'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { XL01Dialog } from '@/components/X-L01-dialog';
import type { Language } from './X-L01-dialog';

export function CtaNhaTuyenDungHomePage() {
    const [isXL01DialogOpen, setIsXL01DialogOpen] = useState(false);
    const [recruitmentPrefs, setRecruitmentPrefs] = useState<any>(null);
    const [selectedLang, setSelectedLang] = useState<Language>('vi');
    const router = useRouter();

    const handleXL01Complete = (preferences: any) => {
        console.log("X-L01 Completed with:", preferences);
        setRecruitmentPrefs(preferences);
        setIsXL01DialogOpen(false);
        // Navigate to the next step or page if needed
        // For now, we just close the dialog
    };
    
    return (
        <>
            <section id="NHATUYENDUNG01_HOME" className="w-full bg-gradient-to-br from-accent to-primary text-primary-foreground py-20 md:py-28">
                <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
                        Đăng tin tuyển dụng miễn phí
                        <span className="block text-xl text-primary-foreground/80 mt-1">無料で求人掲載 / Post Jobs for Free</span>
                    </h1>
                    <p className="text-lg text-primary-foreground/80 my-8">
                        Tiếp cận hàng ngàn ứng viên Thực tập sinh kỹ năng, Kỹ năng đặc định, Kỹ sư chất lượng cao từ Việt Nam. Đăng tin miễn phí và kết nối với nhân tài ngay hôm nay.
                        <span className="block text-sm opacity-80 mt-2">質の高い技能実習生、特定技能、エンジニア人材にアクセス。無料で求人を掲載し、今日から人材と繋がりましょう。/ HelloJob is a free job posting platform to recruit Vietnamese candidates...</span>
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => setIsXL01DialogOpen(true)}>
                            <div className="text-center">
                                <span className="font-semibold">Đăng tin tuyển dụng ngay</span>
                                <div className="text-xs opacity-80">求人を掲載 / Post Job Now</div>
                            </div>
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
                    <div className="relative hidden md:block">
                        <Image 
                            src="/img/viet-img/phong-van (3).jpg"
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
            <XL01Dialog
                isOpen={isXL01DialogOpen}
                onOpenChange={setIsXL01DialogOpen}
                onLanguageChange={setSelectedLang}
                initialLang={selectedLang}
                onComplete={handleXL01Complete}
                onBack={() => setIsXL01DialogOpen(false)}
            />
        </>
    )
}
