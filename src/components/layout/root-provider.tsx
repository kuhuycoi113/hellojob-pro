
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ChatProvider } from '@/contexts/ChatContext';
import { FloatingChatWidget } from '@/components/chat/floating-chat-widget';
import { AuthProvider } from '@/contexts/AuthContext';
import * as React from 'react';
import { PasswordGate } from '../password-gate';

function LayoutManager({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCallPage = pathname.startsWith('/video-call') || pathname.startsWith('/voice-call');

    return (
        <>
            {!isCallPage && <Header />}
            <main className="min-h-screen">{children}</main>
            {!isCallPage && <Footer />}
            {!isCallPage && <FloatingChatWidget />}
            <Toaster />
        </>
    );
}


export function RootProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isUnlocked, setIsUnlocked] = React.useState(false);

    React.useEffect(() => {
        const unlocked = localStorage.getItem('hellojob_password_unlocked') === 'true';
        setIsUnlocked(unlocked);
    }, []);

    if (!isUnlocked) {
        return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
    }

    return (
        <ChatProvider>
            <AuthProvider>
                <LayoutManager>{children}</LayoutManager>
            </AuthProvider>
        </ChatProvider>
    );
}
