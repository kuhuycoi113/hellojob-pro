
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
import { validateProfileForApplication } from '@/lib/utils';
import type { CandidateProfile } from '@/ai/schemas';
import { EditProfileDialog } from '../candidate-edit-dialog';


function LayoutManager({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { toast } = useToast();
    const { isLoggedIn, postLoginAction, clearPostLoginAction } = useAuth();
    const [isPostLoginApplyDialogOpen, setIsPostLoginApplyDialogOpen] = useState(false);
    const [isProfileIncompleteAlertOpen, setIsProfileIncompleteAlertOpen] = useState(false);
    const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);
    
    const isCallPage = pathname.startsWith('/goi-video') || pathname.startsWith('/goi-thoai');
    const isPartnerPage = pathname.startsWith('/doi-tac') || pathname.startsWith('/partner');

    useEffect(() => {
      if (isLoggedIn && postLoginAction && postLoginAction.type === 'APPLY_JOB') {
        setIsPostLoginApplyDialogOpen(true);
      }
    }, [isLoggedIn, postLoginAction]);
    
    const handlePostLoginApply = (apply: boolean) => {
        setIsPostLoginApplyDialogOpen(false); // Close the first dialog
        
        if (apply && postLoginAction && postLoginAction.type === 'APPLY_JOB') {
            const { jobId, jobTitle } = postLoginAction.data;
            const profileRaw = localStorage.getItem('generatedCandidateProfile');

            if (profileRaw) {
                const profile: CandidateProfile = JSON.parse(profileRaw);
                if (validateProfileForApplication(profile)) {
                    // Profile is valid, proceed with application
                    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
                    if (!appliedJobs.includes(jobId)) {
                        appliedJobs.push(jobId);
                        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
                        toast({
                            title: 'Ứng tuyển thành công!',
                            description: `Hồ sơ của bạn đã được gửi cho công việc "${jobTitle}".`,
                            className: 'bg-green-500 text-white'
                        });
                        window.dispatchEvent(new Event('storage'));
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Bạn đã ứng tuyển công việc này',
                            description: `Bạn đã ứng tuyển công việc "${jobTitle}" trước đó.`,
                        });
                    }
                } else {
                    // Profile is incomplete, show alert to update
                    setIsProfileIncompleteAlertOpen(true);
                }
            } else {
                // No profile found, show alert to update
                setIsProfileIncompleteAlertOpen(true);
            }
        }
        
        clearPostLoginAction();
    };

    const handleConfirmUpdateProfile = () => {
        setIsProfileIncompleteAlertOpen(false);
        setIsProfileEditDialogOpen(true);
    };

    return (
        <>
            {!isCallPage && !isPartnerPage && <Header />}
            <main className="min-h-screen">{children}</main>
            {!isCallPage && !isPartnerPage && <Footer />}
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
            <EditProfileDialog 
                isOpen={isProfileEditDialogOpen} 
                onOpenChange={setIsProfileEditDialogOpen} 
                onSaveSuccess={() => {
                    toast({
                        title: 'Cập nhật thành công!',
                        description: 'Thông tin của bạn đã được lưu. Giờ bạn có thể ứng tuyển.',
                        className: 'bg-green-500 text-white'
                    });
                }}
            />
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
