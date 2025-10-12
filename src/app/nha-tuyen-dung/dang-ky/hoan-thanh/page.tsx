
'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EmployerDetailPage from '../client';
import { CheckCircle, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth-dialog';
import { ZaloIcon, MessengerIcon, LineIcon } from '@/components/custom-icons';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Logo = () => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={110} height={36} className="h-9 w-auto" />
);

type Language = 'vi' | 'ja' | 'en';

const contentByLang = {
    vi: {
        guestQuestion: "Bạn có muốn tạo tài khoản để lưu lại thông tin không?",
        loggedInQuestion: "Bạn có muốn liên hệ ngay với HelloJob không?",
        laterButton: "Sửa lại", // Changed from "Để sau"
        createAccountButton: "Tạo tài khoản",
        successMessage: "Thông tin của bạn đã được gửi, chúng tôi sẽ sớm liên hệ với bạn.",
    },
    ja: {
        guestQuestion: "情報を保存するためにアカウントを作成しますか？",
        loggedInQuestion: "HelloJobに今すぐ連絡しますか？",
        laterButton: "修正する", // Changed from "後で"
        createAccountButton: "アカウント作成",
        successMessage: "ご入力いただいた情報が送信されました。担当者よりご連絡いたします。",
    },
    en: {
        guestQuestion: "Do you want to create an account to save your information?",
        loggedInQuestion: "Would you like to contact HelloJob right away?",
        laterButton: "Edit", // Changed from "Later"
        createAccountButton: "Create Account",
        successMessage: "Your information has been sent, we will contact you shortly.",
    }
};

function CompletionPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isLoggedIn, setPostLoginAction } = useAuth();
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [lang, setLang] = useState<Language>('vi');
    const [isClient, setIsClient] = useState(false);
    const isMobile = useIsMobile();
    const [showFooter, setShowFooter] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const controlFooter = useCallback(() => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 80) { // if scroll down
          setShowFooter(false);
        } else { // if scroll up
          setShowFooter(true);
        }
        setLastScrollY(window.scrollY);
      }
    }, [lastScrollY]);

    useEffect(() => {
        if (isClient && isMobile) {
            window.addEventListener('scroll', controlFooter);
            return () => {
                window.removeEventListener('scroll', controlFooter);
            };
        }
    }, [isClient, isMobile, controlFooter]);

    useEffect(() => {
        const langParam = searchParams.get('lang');
        if (langParam === 'ja' || langParam === 'en') {
            setLang(langParam);
        } else {
            setLang('vi');
        }
    }, [searchParams]);

    const handleCreateAccount = () => {
        const recruiterData = Object.fromEntries(searchParams.entries());
        setPostLoginAction({
            type: 'REGISTER_RECRUITER',
            data: { recruiterData }
        });
        setIsAuthDialogOpen(true);
    };

    const handleEdit = () => {
        const params = new URLSearchParams(searchParams.toString());
        router.push(`/nha-tuyen-dung/dang-ky?${params.toString()}`);
    };

    const isRecruiter = isLoggedIn; // Simplified check for any logged-in user
    const t = contentByLang[lang];

    return (
        <div id="Y063_Y064">
            {/* The main content is the disabled version of the employer detail page */}
            <EmployerDetailPage isConfirmationMode={true} />

            {/* Sticky footer for success message and actions */}
            <div className={cn(
                "sticky bottom-0 z-40 bg-background/95 p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)] transition-transform duration-300",
                isMobile && (!showFooter ? "translate-y-full" : "translate-y-0")
            )}>
                <div className="container mx-auto flex flex-col md:flex-row justify-start items-start md:items-center gap-4 text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-accent-orange flex-shrink-0 mb-2 sm:mb-0"/>
                        <div id="HT_THONGBAO" className="flex-grow">
                             <p className="font-semibold text-foreground">{t.successMessage}</p>
                             <p className="text-sm text-muted-foreground">
                                {isRecruiter ? t.loggedInQuestion : t.guestQuestion}
                             </p>
                        </div>
                    </div>
                    {isRecruiter ? (
                        <div id="DANGKY_HOANTAT_FOOTER_LOGGEDIN" className="flex items-center gap-3 flex-shrink-0 mt-4 md:mt-0 md:ml-4">
                            <div className="hidden md:block">
                                <Logo />
                            </div>
                            <Button asChild variant="outline" size="icon" className="h-11 w-11 border-blue-500 hover:bg-blue-50">
                                <Link href="mailto:chairman@hellojob.jp"><Mail className="h-5 w-5 text-blue-500"/></Link>
                            </Button>
                            <Button asChild variant="outline" size="icon" className="h-11 w-11 border-green-500 hover:bg-green-50">
                                <Link href="tel:0386667999"><Image src="/img/phone.svg" alt="Phone" width={20} height={20} /></Link>
                            </Button>
                            <Button asChild variant="outline" size="icon" className="h-11 w-11 border-sky-500 hover:bg-sky-50">
                                <Link href="https://zalo.me/your_zalo_id"><ZaloIcon className="h-5 w-5"/></Link>
                            </Button>
                            <Button asChild variant="outline" size="icon" className="h-11 w-11 border-purple-500 hover:bg-purple-50">
                                <Link href="https://m.me/your_user_id"><MessengerIcon className="h-5 w-5"/></Link>
                            </Button>
                            <Button asChild variant="outline" size="icon" className="h-11 w-11 border-emerald-500 hover:bg-emerald-50">
                                <Link href="https://line.me/ti/p/~your_line_id"><LineIcon className="h-5 w-5"/></Link>
                            </Button>
                        </div>
                    ) : (
                        <div id="DANGKY_HOANTAT_FOOTER_GUEST" className="flex gap-4 flex-shrink-0 mt-4 sm:mt-0">
                            <Button id="HT_NUT_SUALAI" variant="outline" size="lg" onClick={handleEdit}>
                                {t.laterButton}
                            </Button>
                            <Button id="HT_NUT_TAIKHOAN" size="lg" onClick={handleCreateAccount} className="bg-primary hover:bg-primary/90 text-white">
                                {t.createAccountButton}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
             <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </div>
    );
}


export default function CompletionPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CompletionPageContent />
        </Suspense>
    );
}
