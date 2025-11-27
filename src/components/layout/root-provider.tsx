'use client'
import React, { createContext, useContext } from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import { AuthProvider, User } from '@/contexts/AuthContext';
import { filterStandardClaims } from 'next-firebase-auth-edge/lib/auth/claims';
import { onIdTokenChanged, User as FirebaseUser, IdTokenResult } from 'firebase/auth';
import { login, logout } from '../../../api';
import { useSearchParams } from 'next/navigation';
import { setUserData } from '@/lib/auth.util';
import { app, auth, db } from "@/lib/firebase";
export const toUser = (user: FirebaseUser, idTokenResult: IdTokenResult): User => {

    // return {
    //     uid,
    //     email: email ?? null,
    //     displayName: displayName ?? null,
    //     photoURL: photoURL ?? null,
    //     phoneNumber: phoneNumber ?? null,
    //     emailVerified: emailVerified ?? false,
    //     providerId: signInProvider,
    //     customClaims,
    //     authTime
    // };

    return {
        ...user,
        emailVerified:
            user.emailVerified || (idTokenResult.claims.email_verified as boolean),
        customClaims: filterStandardClaims(idTokenResult.claims),
        authTime: toAuthTime(idTokenResult.issuedAtTime)
    };
};

function toAuthTime(date: string) {
    return new Date(date).getTime() / 1000;
}
export interface AuthProviderProps {
    serverUser: User | null;
    children: React.ReactNode;
    serverTime: number;
}

type ServerInfoContextType = {
    serverTime: number;
};
const ServerInfoContext = createContext<ServerInfoContextType | null>(null);

export function RootProvider({
    children,
    serverUser,
    serverTime
}: AuthProviderProps) {
    const [user, setUser] = React.useState(serverUser);
    React.useEffect(() => {
        if (user === serverUser) {
            return;
        }
        setUser(serverUser);
    }, [serverUser]);
    React.useEffect(() => {
        if (!!serverUser?.uid && !!user) {
            setUser({ ...user });
        }
    }, []);
    React.useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                await handleLogout();
                return;
            }
            await handleLogin(firebaseUser);
        });
        return unsubscribe;
    }, []); // <-- run once, not on every user change
    const handleLogout = async () => {
        if (!user) {
            return;
        }

        await logout();
        window.location.href = '/';
    };

    const handleLogin = async (firebaseUser: FirebaseUser) => {
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const issuedAtTime = toAuthTime(idTokenResult.issuedAtTime);
        if (
            user?.authTime &&
            user.authTime >= issuedAtTime
        ) {
            return;
        }
        let decodedUser = toUser(firebaseUser, idTokenResult);
        await login(idTokenResult.token);
        const res = await setUserData(decodedUser, null, serverTime);
        decodedUser = { ...decodedUser, ...res.userInfo };
        // console.log(decodedUser)
        // if(!res.isNewUser){

        // }else{
        //   decodedUser.
        // }
        setUser(decodedUser);
    };
    return (
        <ServerInfoContext.Provider value={{ serverTime }}>
            <AuthProvider serverUser={user}>
                <ChatProvider>
                    {children}
                </ChatProvider>
            </AuthProvider>
        </ServerInfoContext.Provider>
    );
}

export function useServerInfo() {
    const context = useContext(ServerInfoContext);
    if (!context) throw new Error("ServerInfo must be init");
    return context;
}