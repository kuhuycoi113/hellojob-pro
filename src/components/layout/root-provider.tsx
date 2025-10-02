
'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';

export function RootProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ChatProvider>
                {children}
            </ChatProvider>
        </AuthProvider>
    );
}
