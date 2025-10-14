import React from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import { getTokens, Tokens } from 'next-firebase-auth-edge';
import { AuthProvider, User } from '@/contexts/AuthContext';
import { filterStandardClaims } from 'next-firebase-auth-edge/auth/claims';
import { authConfig } from '@/lib/firebase-server';
import { cookies } from 'next/headers';
export const toUser = ({ decodedToken }: Tokens): User => {
    const {
        uid,
        email,
        picture: photoURL,
        email_verified: emailVerified,
        phone_number: phoneNumber,
        name: displayName,
        auth_time: authTime,
        source_sign_in_provider: signInProvider
    } = decodedToken;

    const customClaims = filterStandardClaims(decodedToken);

    return {
        uid,
        email: email ?? null,
        displayName: displayName ?? null,
        photoURL: photoURL ?? null,
        phoneNumber: phoneNumber ?? null,
        emailVerified: emailVerified ?? false,
        providerId: signInProvider,
        customClaims,
        authTime
    };
};


export async function RootProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const tokens = await getTokens(await cookies(), authConfig);
    let user = tokens ? toUser(tokens) : null;
    return (
        <AuthProvider serverUser={user}>
            <ChatProvider>
                {children}
            </ChatProvider>
        </AuthProvider>
    );
}
