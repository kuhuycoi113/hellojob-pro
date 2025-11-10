
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { EditProfileDialog } from '../../app/ho-so-cua-toi/components/candidate-edit-dialog';
import { CtaNhaTuyenDung } from '../cta-nha-tuyen-dung';
import { CtaViecLamPhuHop } from '../cta-viec-lam-phu-hop';
import { Badge } from '../ui/badge';
import { AuthDialog } from '../auth-dialog';

const FloatingChatWidget = dynamic(() => import('@/components/chat/floating-chat-widget').then(mod => mod.FloatingChatWidget), { ssr: false });


export function LayoutManager({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const { isLoggedIn, postLoginAction, clearPostLoginAction, user,
        isLimitApplyDialogOpen, setIsLimitApplyDialogOpen, applyForJob,
        isProfileIncompleteAlertOpen, setIsProfileIncompleteAlertOpen, setIsConfirmLoginOpen, isConfirmLoginOpen,
        isAuthDialogOpen, setIsAuthDialogOpen, isProfileEditDialogOpen, setIsProfileEditDialogOpen, lastDataApplied } = useAuth();
    const [isPostLoginApplyDialogOpen, setIsPostLoginApplyDialogOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const isAuthPage = pathname.startsWith('/xac-thuc');
    const isCallPage = pathname.startsWith('/goi-video') || pathname.startsWith('/goi-thoai');
    const isPartnerPage = pathname.startsWith('/doi-tac') || pathname.startsWith('/partner');
    const isNtdLandingNdPage = pathname === '/nha-tuyen-dung/landing/nd';

    const excludedCtaPages = ['/', '/gioi-thieu', '/nha-tuyen-dung', '/nhuong-quyen', '/viec-lam', '/nha-tuyen-dung/dang-ky', '/nha-tuyen-dung/landing/nd'];

    // Determine whether to show CTAs based on client-side path
    const showDefaultCtas = isClient && !isCallPage && !isAuthPage && !isPartnerPage && !excludedCtaPages.includes(pathname);
    const showProfileSuggestions = !pathname.startsWith('/viec-lam');
    const showNtdLandingCta = isClient && isNtdLandingNdPage;


    useEffect(() => {
        if (isLoggedIn && postLoginAction && postLoginAction.type === 'APPLY_JOB') {
            setIsPostLoginApplyDialogOpen(true);
        }
    }, [isLoggedIn, postLoginAction]);
    useEffect(() => {
        if (isLoggedIn && postLoginAction && postLoginAction.type === 'APPLY_JOB') {
            setIsPostLoginApplyDialogOpen(true);
        }
    }, [isLimitApplyDialogOpen]);

    const handlePostLoginApply = async (apply: boolean) => {
        setIsPostLoginApplyDialogOpen(false); // Close the first dialog
        if (apply && postLoginAction && postLoginAction.type === 'APPLY_JOB') {
            const { jobTitle, job } = postLoginAction.data;
            const res = await applyForJob(job, jobTitle);
            if (!!res) {
                clearPostLoginAction();
            }
        }
    };

    const handleConfirmUpdateProfile = () => {
        setIsProfileIncompleteAlertOpen(false);
        setIsProfileEditDialogOpen(true);
    };

    const handleConfirmLogin = () => {
        setIsConfirmLoginOpen(false);
        setIsAuthDialogOpen(true);
    };
    return (
        <>
            {!isCallPage && !isPartnerPage && !isAuthPage && <Header />}
            <main className={!isAuthPage ? "min-h-screen" : ""}>{children}</main>
            {showDefaultCtas && (
                <div className="space-y-20 md:space-y-28 py-20 md:py-28">
                    {showProfileSuggestions && <CtaViecLamPhuHop />}
                    {/* <CtaViecLamGoiY /> */}
                    <CtaNhaTuyenDung />
                </div>
            )}
            {showNtdLandingCta && (
                <div className="space-y-20 md:space-y-28 py-20 md:py-28">
                    <CtaNhaTuyenDung />
                </div>
            )}
            {!isCallPage && !isPartnerPage && !isAuthPage && <Footer />}
            {!isCallPage && !isPartnerPage && <FloatingChatWidget />}
            <Toaster />
            <AlertDialog open={isPostLoginApplyDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    clearPostLoginAction();
                    setIsPostLoginApplyDialogOpen(false);
                }
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tiếp tục ứng tuyển?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có muốn tiếp tục ứng tuyển công việc "{postLoginAction?.data.jobTitle}" không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handlePostLoginApply(false)}>Từ chối</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handlePostLoginApply(true)}>Đồng ý</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={isProfileIncompleteAlertOpen} onOpenChange={setIsProfileIncompleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hồ sơ của bạn chưa hoàn thiện</AlertDialogTitle>
                        <AlertDialogDescription>
                            Để có thể ứng tuyển, bạn cần cập nhật đủ thông tin cá nhân và cung cấp ít nhất một phương thức liên lạc (SĐT, Zalo...). Bạn có muốn cập nhật hồ sơ ngay bây giờ không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Để sau</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmUpdateProfile}>Đồng ý, cập nhật</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={isLimitApplyDialogOpen} onOpenChange={setIsLimitApplyDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Đã đạt giới hạn ứng tuyển</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn đã đạt giới hạn tối đa 10 lượt ứng tuyển cùng lúc. Bạn có thể vào mục 'Việc đã ứng tuyển' để quản lý hoặc <Badge variant="outline" className="border-destructive text-destructive">Huỷ ứng tuyển</Badge> các đơn không cần thiết để có thêm lượt mới.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Để sau</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push('/viec-lam-cua-toi?highlight=applied')}>
                            Đến mục đã ứng tuyển
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <EditProfileDialog
                isOpen={isProfileEditDialogOpen}
                onOpenChange={setIsProfileEditDialogOpen}
                onSaveSuccess={async () => {
                    toast({
                        title: 'Cập nhật thành công!',
                        description: 'Thông tin của bạn đã được lưu. Giờ bạn có thể ứng tuyển.',
                        className: 'bg-green-500 text-white'
                    });
                    const data = lastDataApplied;
                    if (!!data?.job) {
                        const res = await applyForJob(data.job, data.jobTitle);
                    }
                }}
            />

            <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
            <AlertDialog open={isConfirmLoginOpen} onOpenChange={setIsConfirmLoginOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn chưa đăng nhập</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn cần đăng nhập để ứng tuyển, bạn có muốn đăng nhập không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Để sau</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmLogin}>
                            Đồng ý
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
