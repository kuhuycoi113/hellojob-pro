
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { Header2 } from '@/components/header2';
import { ChatProvider } from '@/contexts/ChatContext';
import { FloatingChatWidget } from '@/components/chat/floating-chat-widget';
import { AuthProvider } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { PasswordGate } from '../password-gate';

export function RootProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isCallPage = pathname.startsWith('/video-call') || pathname.startsWith('/voice-call');
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        const unlocked = localStorage.getItem('hellojob_password_unlocked') === 'true';
        setIsUnlocked(unlocked);
    }, []);

    if (!isUnlocked) {
        return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
    }

    return (
        <ChatProvider>
            <AuthProvider>
                {!isCallPage && <Header />}
                {!isCallPage && <Header2 />}
                <main className="min-h-screen pt-32 md:pt-0">{children}</main>
                {!isCallPage && <Footer />}
                {!isCallPage && <FloatingChatWidget />}
                <Toaster />
            </AuthProvider>
        </ChatProvider>
    );
}
