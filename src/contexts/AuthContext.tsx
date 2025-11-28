
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
import { applyJob, updateProfile } from '@/actions/user-action';
import { toast } from '@/hooks/use-toast';

export type Role = 'candidate' | 'candidate-empty-profile' | 'guest' | 'admin';

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
  clearLastAction: () => void,
  isLimitApplyDialogOpen: boolean;
  setIsLimitApplyDialogOpen: (isOpen: boolean) => void;
  setIsProfileIncompleteAlertOpen: (isOpen: boolean) => void;
  isProfileIncompleteAlertOpen: boolean;
  isConfirmLoginOpen: boolean;
  setIsConfirmLoginOpen: (isOpen: boolean) => void;
  applyForJob: (job: any, jobTitle: string) => Promise<boolean>;
  isApplying: boolean;
  setIsApplying: (action: boolean) => void;
  isAuthDialogOpen: boolean;
  setIsAuthDialogOpen: (isOpen: boolean) => void;
  isProfileEditDialogOpen: boolean;
  setIsProfileEditDialogOpen: (isOpen: boolean) => void;
  lastDataApplied: { job: any, jobTitle: string } | null;
  setLastDataApplied: (data: { job: any, jobTitle: string } | null) => void;
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
  const [isLimitApplyDialogOpen, setIsLimitApplyDialogOpen] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<'applied' | 'saved' | null>(null);
  const [isProfileIncompleteAlertOpen, setIsProfileIncompleteAlertOpen] = useState(false);
  const [isConfirmLoginOpen, setIsConfirmLoginOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [lastDataApplied, setLastDataApplied] = useState<{ job: any, jobTitle: string } | null>(null);
  let role: Role = serverUser?.role ?? 'guest';

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
  const changeEditProfileOpenStage = (open: boolean) => {
    setIsProfileEditDialogOpen(open);
  }
  const applyForJob = async (job: any, jobTitle: string) => {
    setLastDataApplied(null);
    if (isApplying) {
      toast({
        title: 'Hệ thống đang xử lý!',
        description: `Yêu cầu ứng tuyển của bạn đang được gửi đi. Vui lòng chờ trong giây lát`,
        className: 'bg-green-500 text-white'
      });
      return false;
    }
    if (!isLoggedIn) {
      setPostLoginAction({ type: 'APPLY_JOB', data: { jobId: job.id, jobTitle: jobTitle, job } });
      setIsConfirmLoginOpen(true);
    } else {
      const missingFields = validateProfileForApplication(serverUser);
      if (missingFields?.length === 0 && !!serverUser) {
        setIsApplying(true);
        const appliedJobs = serverUser.appliedJobs || [];
        appliedJobs.push(job.id);
        await applyJob(serverUser.uid, job);
        await updateProfile(serverUser.uid, { appliedJobs });
        serverUser.appliedJobs = Object.assign([], appliedJobs);
        setApplicationCount(prev => prev + 1);
        setLastAction('applied');
        toast({
          title: 'Ứng tuyển thành công!',
          description: `Hồ sơ của bạn đã được gửi cho công việc "${jobTitle}".`,
          className: 'bg-green-500 text-white'
        });
        setIsApplying(false);
        return true;
      } else {
        setIsProfileIncompleteAlertOpen(true);
        setLastDataApplied({ job, jobTitle });
      }
    }
    return false;
  };

  useEffect(() => {
    const preferencesRaw = sessionStorage.getItem('onboardingPreferences');
    if (role === 'candidate-empty-profile' && !!serverUser && preferencesRaw) {
      try {
        const preferences = JSON.parse(preferencesRaw);
        const existingAspiration = serverUser?.aspiration ?? {};
        const updatedAspirations = { ...existingAspiration, ...preferences };
        updateProfile(serverUser?.uid, {
          aspirations: updatedAspirations
        }).then(() => {
          serverUser.aspirations = updatedAspirations;
        });
        sessionStorage.removeItem('onboardingPreferences');
      } catch (e) {
        console.error("Failed to apply onboarding preferences:", e);
        sessionStorage.removeItem('onboardingPreferences');
      }
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
    clearLastAction,
    isLimitApplyDialogOpen,
    setIsLimitApplyDialogOpen,
    isProfileIncompleteAlertOpen,
    setIsProfileIncompleteAlertOpen,
    isConfirmLoginOpen,
    setIsConfirmLoginOpen,
    applyForJob,
    isApplying,
    setIsApplying,
    isProfileEditDialogOpen,
    setIsProfileEditDialogOpen: changeEditProfileOpenStage,
    isAuthDialogOpen,
    setIsAuthDialogOpen,
    lastDataApplied,
    setLastDataApplied
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};