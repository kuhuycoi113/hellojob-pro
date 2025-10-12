
'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EmployerDetailPage from '../client';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


type Language = 'vi' | 'ja' | 'en';

const contentByLang: Record<Language, { question: string; editButton: string; confirmButton: string; }> = {
    vi: {
        question: "Bạn đã chắc chắn với các thông tin đã điền chưa?",
        editButton: "Sửa lại",
        confirmButton: "Xác nhận & Tiếp tục"
    },
    ja: {
        question: "ご入力いただいた内容でよろしいでしょうか？",
        editButton: "修正する",
        confirmButton: "確認して続行"
    },
    en: {
        question: "Are you sure about the information you have entered?",
        editButton: "Edit",
        confirmButton: "Confirm & Continue"
    }
};


function ConfirmationPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [lang, setLang] = useState<Language>('vi');
    const [showFooter, setShowFooter] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const isMobile = useIsMobile();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
        const langParam = searchParams.get('lang');
        if (langParam === 'ja' || langParam === 'en') {
            setLang(langParam);
        } else {
            setLang('vi');
        }
    }, [searchParams]);
    
    const controlFooter = useCallback(() => {
        if (window.scrollY > lastScrollY && window.scrollY > 80) { // if scroll down
            setShowFooter(false);
        } else { // if scroll up
            setShowFooter(true);
        }
        setLastScrollY(window.scrollY);
    }, [lastScrollY]);

    useEffect(() => {
        if (isClient && isMobile) {
            window.addEventListener('scroll', controlFooter);
            return () => {
                window.removeEventListener('scroll', controlFooter);
            };
        }
    }, [isClient, isMobile, controlFooter]);

    const t = contentByLang[lang];

    const handleEdit = () => {
        const params = new URLSearchParams(searchParams.toString());
        router.push(`/nha-tuyen-dung/dang-ky?${params.toString()}`);
    };

    const handleConfirm = () => {
        const params = new URLSearchParams(searchParams.toString());
        router.push(`/nha-tuyen-dung/dang-ky/hoan-thanh?${params.toString()}`);
    };

    return (
        <div id="Y063">
            {/* The main content is the disabled version of the employer detail page */}
            <EmployerDetailPage isConfirmationMode={true} />

            {/* Sticky footer for confirmation actions */}
            <div id="DANGKY_XACNHAN_FOOTER" className={cn(
                "sticky bottom-0 z-40 bg-background/95 p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)] transition-transform duration-300",
                 isMobile && (!showFooter ? "translate-y-full" : "translate-y-0")
            )}>
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="font-semibold text-foreground">{t.question}</p>
                    <div className="flex gap-4 flex-shrink-0">
                        <Button id="XN_NUT_SUALAI" variant="outline" size="lg" onClick={handleEdit}>
                           {t.editButton}
                        </Button>
                        <Button id="XN_NUT_XACNHAN" size="lg" className="bg-accent-green hover:bg-accent-green/90 text-white" onClick={handleConfirm}>
                           {t.confirmButton}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationPageContent />
        </Suspense>
    );
}
