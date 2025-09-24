

'use client';

import React, { type ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ChatProvider } from '@/contexts/ChatContext';
import { FloatingChatWidget } from '@/components/chat/floating-chat-widget';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

function LayoutManager({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { toast } = useToast();
    const { postLoginAction, clearPostLoginAction } = useAuth();
    const [isPostLoginApplyDialogOpen, setIsPostLoginApplyDialogOpen] = useState(false);
    
    const isCallPage = pathname.startsWith('/goi-video') || pathname.startsWith('/goi-thoai');
    const isPartnerPage = pathname.startsWith('/doi-tac') || pathname.startsWith('/partner');

    useEffect(() => {
      if (postLoginAction && postLoginAction.type === 'APPLY_JOB') {
        setIsPostLoginApplyDialogOpen(true);
      }
    }, [postLoginAction]);
    
    const handlePostLoginApply = (apply: boolean) => {
        if (apply && postLoginAction && postLoginAction.type === 'APPLY_JOB') {
            const { jobId, jobTitle } = postLoginAction.data;
            const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
            if (!appliedJobs.includes(jobId)) {
                appliedJobs.push(jobId);
                localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
                toast({
                    title: 'Ứng tuyển thành công!',
                    description: `Hồ sơ của bạn đã được gửi cho công việc "${jobTitle}".`,
                    className: 'bg-green-500 text-white'
                });
                // Dispatch a storage event to notify other components (like JobCard) of the change
                window.dispatchEvent(new Event('storage'));
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Bạn đã ứng tuyển công việc này',
                    description: `Bạn đã ứng tuyển công việc "${jobTitle}" trước đó.`,
                });
            }
        }
        setIsPostLoginApplyDialogOpen(false);
        clearPostLoginAction();
    };

    return (
        <>
            {!isCallPage && !isPartnerPage && <Header />}
            <main className="min-h-screen">{children}</main>
            {!isCallPage && !isPartnerPage && <Footer />}
            {!isCallPage && !isPartnerPage && <FloatingChatWidget />}
            <Toaster />
            <AlertDialog open={isPostLoginApplyDialogOpen} onOpenChange={setIsPostLoginApplyDialogOpen}>
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
        </>
    );
}

export function RootProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ChatProvider>
                <LayoutManager>{children}</LayoutManager>
            </ChatProvider>
        </AuthProvider>
    );
}
