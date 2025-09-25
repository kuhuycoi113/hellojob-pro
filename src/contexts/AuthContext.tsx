
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import * as chatData from '@/lib/chat-data';
import type { CandidateProfile } from '@/ai/schemas';

export type Role = 'candidate' | 'candidate-empty-profile' | 'guest' | 'candidate-full-profile';

export type PostLoginAction = {
  type: 'APPLY_JOB';
  data: {
    jobId: string;
    jobTitle: string;
  };
} | null;


interface AuthContextType {
  role: Role;
  isLoggedIn: boolean;
  profileName: string | null;
  profileHeadline: string | null;
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

interface AuthProviderProps {
  children: ReactNode;
}

// A complete profile for the new role
const fullCandidateProfile: CandidateProfile = {
    name: 'Lê Thị An',
    headline: 'Kỹ sư Cơ khí với 2 năm kinh nghiệm',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    about: 'Là một kỹ sư cơ khí năng động và ham học hỏi với 2 năm kinh nghiệm trong lĩnh vực thiết kế và vận hành máy móc công nghiệp. Có khả năng sử dụng thành thạo AutoCAD, SolidWorks và có kiến thức nền tảng về hệ thống CNC. Mong muốn tìm kiếm một cơ hội làm việc tại Nhật Bản để phát triển kỹ năng chuyên môn và đóng góp vào sự thành công của công ty.',
    education: [
        { school: 'Đại học Bách Khoa TP.HCM', degree: 'Kỹ sư Cơ khí', gradYear: 2022 },
        { school: 'Trung tâm tiếng Nhật Sakura', degree: 'Chứng chỉ N3', gradYear: 2023 }
    ],
    experience: [
        { company: 'Công ty TNHH Cơ khí Chính xác ABC', role: 'Kỹ sư Vận hành', period: '08/2022 - Hiện tại', description: 'Chịu trách nhiệm vận hành và bảo trì dây chuyền máy phay CNC. Lập trình và tối ưu hóa các chương trình gia công. Đảm bảo chất lượng sản phẩm đầu ra.' },
    ],
    personalInfo: {
      birthYear: 2000,
      gender: 'Nữ',
      phone: '0901234567',
      japaneseProficiency: 'Tiếng Nhật N3',
      englishProficiency: 'Giao tiếp cơ bản',
      dateOfBirth: '2000-05-15',
      height: '160',
      weight: '50',
      tattooStatus: 'Không có',
      hepatitisBStatus: 'Không viêm gan B',
      messenger: 'lethian.2000',
      zalo: '0901234567',
      line: 'lethian.line',
    },
    aspirations: {
        desiredLocation: 'Osaka',
        desiredSalary: '220000',
        desiredNetSalary: '180000',
        desiredVisaType: 'Kỹ sư, tri thức',
        desiredVisaDetail: 'Kỹ sư, tri thức đầu Nhật',
        desiredJobDetail: 'Vận hành máy CNC',
        financialAbility: 'Không yêu cầu',
        interviewLocation: 'Thành phố Hồ Chí Minh',
        specialAspirations: 'Mong muốn có nhiều cơ hội làm thêm giờ và được hỗ trợ đào tạo chuyên sâu về kỹ năng quản lý.',
    },
    notes: 'Đã có kinh nghiệm phỏng vấn với công ty Nhật 2 lần, mong muốn tìm đơn hàng bay nhanh trong vòng 3 tháng tới. Có thể đóng phí ngay.',
    interests: ['Cơ khí', 'Tự động hóa', 'Sản xuất'],
    skills: ['Vận hành máy CNC', 'AutoCAD', 'SolidWorks', 'Làm việc nhóm', 'Giải quyết vấn đề'],
    certifications: ['Chứng chỉ JLPT N3', 'Chứng chỉ An toàn lao động'],
    documents: {
        vietnam: ['Xác nhận cư trú', 'Xác nhận dân sự', 'Căn cước mặt trước'],
        japan: ['Thẻ ngoại kiều mặt trước', 'Chứng chỉ tokutei'],
        other: [],
    },
    desiredIndustry: 'Cơ khí, Chế tạo máy',
};

// A partially filled profile for the 'candidate' role
const partialCandidateProfile: Partial<CandidateProfile> = {
    name: 'Lê Ngọc Hân',
    headline: 'Thực tập sinh ngành cơ khí',
    location: 'Hà Nội, Việt Nam',
    about: 'Mong muốn tìm kiếm cơ hội làm việc tại Nhật Bản để học hỏi kinh nghiệm.',
    education: [
        { school: 'Đại học Công nghiệp Hà Nội', degree: 'Kỹ sư Cơ khí', gradYear: 2023 },
    ],
    experience: [],
    personalInfo: {
      birthYear: 2001,
      gender: 'Nữ',
      phone: '0987654321',
      dateOfBirth: '2001-10-10',
      // Fields below are intentionally left out for testing purposes
      height: '',
      weight: '',
      tattooStatus: '',
      hepatitisBStatus: '',
      japaneseProficiency: '',
      englishProficiency: '',
      messenger: '',
      zalo: '',
      line: '',
    },
    aspirations: {
        desiredLocation: 'Aichi',
        desiredVisaType: 'Thực tập sinh kỹ năng',
    },
    desiredIndustry: 'Cơ khí, Chế tạo máy',
    skills: ['Làm việc nhóm'],
    interests: ['Cơ khí'],
    certifications: [],
    notes: '',
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [role, setInternalRole] = useState<Role>('guest');
  const [postLoginAction, setPostLoginAction] = useState<PostLoginAction>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileHeadline, setProfileHeadline] = useState<string | null>(null);
  const isLoggedIn = role !== 'guest';

  const updateProfileInfoFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    const storedProfile = localStorage.getItem('generatedCandidateProfile');
    if (storedProfile) {
      try {
        const profile: Partial<CandidateProfile> = JSON.parse(storedProfile);
        setProfileName(profile.name || null);
        setProfileHeadline(profile.headline || null);
      } catch (e) {
        console.error("Failed to parse profile from localStorage", e);
        setProfileName(null);
        setProfileHeadline(null);
      }
    } else {
      setProfileName(null);
      setProfileHeadline(null);
    }
  }, []);

  const setRole = (newRole: Role) => {
    if (newRole === 'guest') {
        chatData.setCurrentUser(chatData.guestUser);
        localStorage.removeItem('generatedCandidateProfile');
    } else { 
        chatData.setCurrentUser(chatData.loggedInUser);
        if (newRole === 'candidate-full-profile') {
            localStorage.setItem('generatedCandidateProfile', JSON.stringify(fullCandidateProfile));
        } else if (newRole === 'candidate') {
            localStorage.setItem('generatedCandidateProfile', JSON.stringify(partialCandidateProfile));
        } else if (newRole === 'candidate-empty-profile') {
            localStorage.removeItem('generatedCandidateProfile');
        }
    }
    setInternalRole(newRole);
    updateProfileInfoFromStorage();
  };
  
  const clearPostLoginAction = () => {
    setPostLoginAction(null);
  };
  
  useEffect(() => {
    updateProfileInfoFromStorage();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'generatedCandidateProfile') {
        updateProfileInfoFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateProfileInfoFromStorage]);

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
            setRole('candidate');
        } catch(e) {
            console.error("Failed to apply onboarding preferences:", e);
            sessionStorage.removeItem('onboardingPreferences');
        }
    } else if (role === 'candidate-empty-profile' && !preferencesRaw) {
        localStorage.removeItem('generatedCandidateProfile');
        updateProfileInfoFromStorage();
    }
  }, [role, updateProfileInfoFromStorage]);

  const value = {
    role,
    isLoggedIn,
    profileName,
    profileHeadline,
    setRole,
    postLoginAction,
    setPostLoginAction,
    clearPostLoginAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
