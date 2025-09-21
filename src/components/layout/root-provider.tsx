
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ChatProvider } from '@/contexts/ChatContext';
import { FloatingChatWidget } from '@/components/chat/floating-chat-widget';
import { AuthProvider } from '@/contexts/AuthContext';
import React, { type ReactNode } from 'react';

function LayoutManager({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isCallPage = pathname.startsWith('/goi-video') || pathname.startsWith('/goi-thoai');
    const isPartnerPage = pathname.startsWith('/doi-tac') || pathname.startsWith('/partner');


    return (
        <>
            {!isCallPage && !isPartnerPage && <Header />}
            <main className="min-h-screen">{children}</main>
            {!isCallPage && !isPartnerPage && <Footer />}
            {!isCallPage && !isPartnerPage && <FloatingChatWidget />}
            <Toaster />
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
