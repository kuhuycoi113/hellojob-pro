
'use client';

import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ChatProvider } from '@/contexts/ChatContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LayoutManager } from './layout-manager';


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
