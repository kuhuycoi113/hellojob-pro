
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EmployerDetailPage from '../client';
import { CheckCircle, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth-dialog';
import { ZaloIcon, MessengerIcon, LineIcon } from '@/components/custom-icons';
import Link from 'next/link';
import Image from 'next/image';

const Logo = () => (
    <Image src="/img/HJPNG.png" alt="HelloJob Logo" width={110} height={36} className="h-9 w-auto" />
);


export default function CompletionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isLoggedIn, role, setPostLoginAction } = useAuth();
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    const handleCreateAccount = () => {
        const recruiterData = Object.fromEntries(searchParams.entries());
        setPostLoginAction({
            type: 'REGISTER_RECRUITER',
            data: { recruiterData }
        });
        setIsAuthDialogOpen(true);
    };

    const handleLater = () => {
        router.push('/');
    };

    const isRecruiter = isLoggedIn; // Simplified check for any logged-in user

    return (
        <div id="Y063">
            {/* The main content is the disabled version of the employer detail page */}
            <EmployerDetailPage isConfirmationMode={true} />

            {/* Sticky footer for success message and actions */}
            <div className="sticky bottom-0 z-40 bg-background/95 p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto flex flex-col md:flex-row justify-start items-start md:items-center gap-4 text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-accent-orange flex-shrink-0 mb-2 sm:mb-0"/>
                        <div id="HT_THONGBAO" className="flex-grow">
                             <p className="font-semibold text-foreground">Thông tin của bạn đã được gửi, chúng tôi sẽ sớm liên hệ với bạn.</p>
                             <p className="text-sm text-muted-foreground">
                                {isRecruiter ? "Bạn có muốn liên hệ ngay với HelloJob không?" : "Bạn có muốn tạo tài khoản để lưu lại thông tin không?"}
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
                            <Button id="HT_NUT_DESAU" variant="outline" size="lg" onClick={handleLater}>
                                Để sau
                            </Button>
                            <Button id="HT_NUT_TAIKHOAN" size="lg" onClick={handleCreateAccount} className="bg-primary hover:bg-primary/90 text-white">
                                Tạo tài khoản
                            </Button>
                        </div>
                    )}
                </div>
            </div>
             <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </div>
    );
}
