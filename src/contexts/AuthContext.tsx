
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as chatData from '@/lib/chat-data';
import {
  IdTokenResult,
  onIdTokenChanged,
  User as FirebaseUser,
  UserInfo
} from 'firebase/auth';
import { Claims,filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";

export type Role = 'candidate' | 'candidate-empty-profile' | 'guest';

export type PostLoginAction = {
  type: 'APPLY_JOB';
  data: {
    jobId: string;
    jobTitle: string;
  };
} | null;


interface AuthContextType {
  user: User | null;
  role: Role;
  isLoggedIn: boolean;
  setRole: (role: Role) => void;
  postLoginAction: PostLoginAction;
  setPostLoginAction: (action: PostLoginAction) => void;
  clearPostLoginAction: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export interface User extends UserInfo {
  emailVerified: boolean;
  customClaims: Claims;
  authTime: number;
  isAdmin?: boolean;
  [key: string]: any;
}

interface AuthProviderProps {
  serverUser: User | null;
  children: ReactNode;
}

function toAuthTime(date: string) {
  return new Date(date).getTime() / 1000;
}

function toUser(user: FirebaseUser, idTokenResult: IdTokenResult): User {
  return {
    ...user,
    emailVerified:
      user.emailVerified || (idTokenResult.claims.email_verified as boolean),
    customClaims: filterStandardClaims(idTokenResult.claims),
    authTime: toAuthTime(idTokenResult.issuedAtTime)
  };
}

export const AuthProvider = ({ serverUser, children }: AuthProviderProps) => {
  // Xác định role dựa vào serverUser
  let role: Role = 'guest';
  if (serverUser) {
    if (!serverUser.phoneNumber || !serverUser.email) {
      role = 'candidate-empty-profile';
    } else {
      role = 'candidate';
    }
  }

  const [postLoginAction, setPostLoginAction] = useState<PostLoginAction>(null);
  const isLoggedIn = role !== 'guest';

  // setRole không còn cần thiết, nhưng giữ lại hàm rỗng để không lỗi các nơi gọi
  const setRole = (_role: Role) => {};

  const clearPostLoginAction = () => {
    setPostLoginAction(null);
  };

  useEffect(() => {
    const preferencesRaw = sessionStorage.getItem('onboardingPreferences');
    if (role === 'candidate-empty-profile' && preferencesRaw) {
      try {
        const preferences = JSON.parse(preferencesRaw);
        const existingProfileRaw = localStorage.getItem('generatedCandidateProfile');
        let profile = existingProfileRaw ? JSON.parse(existingProfileRaw) : {};

        profile = {
          ...profile,
          desiredIndustry: preferences.desiredIndustry || profile.desiredIndustry,
          aspirations: {
            ...profile.aspirations,
            desiredVisaType: preferences.desiredVisaType,
            desiredVisaDetail: preferences.desiredVisaDetail,
            desiredLocation: preferences.desiredLocation,
          }
        };
        localStorage.setItem('generatedCandidateProfile', JSON.stringify(profile));
        sessionStorage.removeItem('onboardingPreferences');
      } catch (e) {
        console.error("Failed to apply onboarding preferences:", e);
        sessionStorage.removeItem('onboardingPreferences');
      }
    } else if (role === 'candidate-empty-profile' && !preferencesRaw) {
      localStorage.removeItem('generatedCandidateProfile');
    }
  }, [role]);

  const value = {
    user: serverUser,
    role,
    isLoggedIn,
    setRole,
    postLoginAction,
    setPostLoginAction,
    clearPostLoginAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};