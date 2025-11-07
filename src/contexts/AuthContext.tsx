
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import * as chatData from '@/lib/chat-data';
import {
  IdTokenResult,
  onIdTokenChanged,
  User as FirebaseUser,
  UserInfo
} from 'firebase/auth';
import { Claims, filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { validateProfileForApplication } from '@/lib/validators';

export type Role = 'candidate' | 'candidate-empty-profile' | 'guest';

export type PostLoginAction = {
  type: 'APPLY_JOB';
  data: {
    jobId: string;
    jobTitle: string;
    job?: any;
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
  applicationCount: number;
  savedJobCount: number;
  lastAction: 'applied' | 'saved' | null,
  setLastAction: (action: 'applied' | 'saved' | null) => void,
  setApplicationCount: (count: number | ((prevCount: number) => number)) => void;
  setSavedJobCount: (count: number | ((prevCount: number) => number)) => void;
  clearLastAction: () => void
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
  const [savedJobCount, setSavedJobCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [lastAction, setLastAction] = useState<'applied' | 'saved' | null>(null);
  let role: Role = 'guest';
  if (serverUser) {
    if (validateProfileForApplication(serverUser)?.length > 0) {
      role = 'candidate-empty-profile';
    } else {
      role = 'candidate';
    }
  }

  const [postLoginAction, setPostLoginAction] = useState<PostLoginAction>(null);
  const isLoggedIn = role !== 'guest';

  // setRole không còn cần thiết, nhưng giữ lại hàm rỗng để không lỗi các nơi gọi
  const setRole = (_role: Role) => { };

  const clearPostLoginAction = () => {
    setPostLoginAction(null);
  };
  const clearLastAction = () => {
    setApplicationCount(0);
    setSavedJobCount(0);
    setLastAction(null);
  }

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
    savedJobCount,
    lastAction,
    setLastAction,
    setSavedJobCount,
    applicationCount,
    setApplicationCount,
    setPostLoginAction,
    clearPostLoginAction,
    clearLastAction
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};