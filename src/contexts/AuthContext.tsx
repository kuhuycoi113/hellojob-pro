
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { guestUser, loggedInUser, type User } from '@/lib/chat-data';
import type { CandidateProfile } from '@/ai/schemas';
import { app } from '@/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { validateProfileForApplication } from '@/lib/validators';

export type Role = 'candidate' | 'candidate-empty-profile' | 'guest' | 'candidate-full-profile';

export type PostLoginAction = {
  type: 'APPLY_JOB' | 'SAVE_JOB';
  data: {
    jobId: string;
    jobTitle: string;
  };
} | null;


interface AuthContextType {
  role: Role;
  currentUser: User;
  isLoggedIn: boolean;
  profileName: string | null;
  profileHeadline: string | null;
  avatarUrl: string | null;
  applicationCount: number;
  savedJobCount: number;
  appliedJobs: string[];
  savedJobs: string[];
  applyForJob: (jobId: string, jobTitle: string) => boolean;
  reapplyForJob: (jobId: string) => void;
  cancelApplication: (jobId: string) => void;
  handleSaveJob: (jobId: string, jobTitle: string) => boolean;
  clearApplicationCount: () => void;
  clearSavedJobCount: () => void;
  setApplicationCount: (count: number | ((prevCount: number) => number)) => void;
  setRole: (role: Role) => void;
  postLoginAction: PostLoginAction;
  setPostLoginAction: (action: PostLoginAction) => void;
  clearPostLoginAction: () => void;
  logout: () => void;
  lastAction: 'apply' | 'save' | null;
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
  children: React.ReactNode;
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
        specialAspirations: ['Mong muốn có nhiều cơ hội làm thêm giờ', 'Được hỗ trợ đào tạo chuyên sâu'],
    },
    notes: 'Đã có kinh nghiệm phỏng vấn với công ty Nhật 2 lần, mong muốn tìm đơn hàng bay nhanh trong vòng 3 tháng tới. Có thể đóng phí ngay.',
    interests: ['Cơ khí', 'Tự động hóa', 'Sản xuất'],
    skills: ['Vận hành máy CNC', 'AutoCAD', 'SolidWorks', 'Làm việc nhóm', 'Giải quyết vấn đề'],
    certifications: ['Chứng chỉ JLPT N3', 'Chứng chỉ An toàn lao động'],
    documents: {
        vietnam: ['Xác nhận cư trú', 'Xác nhận dân sự', 'Căn cước mặt trước', 'Căn cước mặt sau', 'Hộ chiếu mặt trước', 'Hộ chiếu mặt sau', 'Giấy khám sức khỏe', 'Bằng học vấn', 'Xác nhận tình trạng hôn nhân', 'Giấy tờ khác'],
        japan: ['Thẻ ngoại kiều mặt trước', 'Thẻ ngoại kiều mặt sau', 'Ảnh CV gốc mặt trước', 'Ảnh CV gốc mặt sau', 'Giấy kết thúc 3 năm mặt trước', 'Giấy kết thúc 3 năm mặt sau', 'Chứng chỉ tokutei', 'Chứng chỉ tiếng Nhật', 'Giấy Shiteisho', 'Giấy đánh giá Hyokachoso', 'Giấy tờ khác'],
        other: ['Thẻ ID', 'Bằng ngoại ngữ', 'Sổ tiết kiệm', 'Xác nhận công việc người bảo lãnh 1', 'Xác nhận công việc người bảo lãnh 2', 'Thẻ ID người bảo lãnh 1', 'Thẻ ID người bảo lãnh 2', 'Giấy tờ khác'],
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
      height: '158',
      weight: '48',
      tattooStatus: 'Không có',
      hepatitisBStatus: 'Không viêm gan B',
      japaneseProficiency: 'Tiếng Nhật N4',
      englishProficiency: '',
      messenger: '',
      zalo: '0987654321',
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
    documents: {
        vietnam: ['Căn cước mặt trước', 'Căn cước mặt sau', 'Bằng học vấn'],
        japan: [],
        other: [],
    },
};

const isProfileConsideredFull = (profile: Partial<CandidateProfile>): boolean => {
  if (!profile) return false;
  // A simple check: if 'about', 'education', and 'experience' are filled, consider it "full".
  return !!(
    profile.name &&
    profile.headline &&
    profile.about &&
    profile.education && profile.education.length > 0 && profile.education.every(e => e.school && e.degree) &&
    profile.experience && profile.experience.length > 0 && profile.experience.every(e => e.company && e.role)
  );
};


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [role, setInternalRole] = useState<Role>('guest');
  const [currentUser, setCurrentUser] = useState<User>(guestUser);
  const [postLoginAction, setPostLoginAction] = useState<PostLoginAction>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileHeadline, setProfileHeadline] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [applicationCount, setApplicationCount] = useState(0);
  const [savedJobCount, setSavedJobCount] = useState(0);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<'apply' | 'save' | null>(null);

  const isLoggedIn = role !== 'guest';
  const { toast } = useToast();

  const auth = getAuth(app);

  const logout = () => {
    signOut(auth);
    if (process.env.NEXT_PUBLIC_ENABLE_ROLE_SIMULATION === 'true') {
        localStorage.removeItem('simulatedRole');
    }
    toast({ title: "Đăng xuất thành công!" });
  };
  
  const clearPostLoginAction = () => {
    setPostLoginAction(null);
  };
  
  const updateAuthAndProfileState = useCallback((firebaseUser: FirebaseUser | null) => {
    if (typeof window === 'undefined') return;
    
    // Developer simulation override
    const simulatedRole = process.env.NEXT_PUBLIC_ENABLE_ROLE_SIMULATION === 'true' 
        ? localStorage.getItem('simulatedRole') as Role 
        : null;

    if(simulatedRole) {
        setInternalRole(simulatedRole);
         if (simulatedRole === 'guest') {
             setCurrentUser(guestUser);
             setProfileName(null);
             setProfileHeadline(null);
             setAvatarUrl(null);
             setApplicationCount(0);
             setSavedJobCount(0);
             setAppliedJobs([]);
             setSavedJobs([]);
         } else {
             let profileData: Partial<CandidateProfile & {avatarUrl?: string}> = {};
             if (simulatedRole === 'candidate-full-profile') {
                 profileData = fullCandidateProfile as Partial<CandidateProfile & {avatarUrl?: string}>;
             } else if (simulatedRole === 'candidate') {
                 profileData = partialCandidateProfile as Partial<CandidateProfile & {avatarUrl?: string}>;
             }
             setProfileName(profileData.name || 'Ứng viên');
             setProfileHeadline(profileData.headline || 'Cập nhật hồ sơ');
             setAvatarUrl(profileData.avatarUrl || null);
             setCurrentUser(prev => ({...prev, name: profileData.name || 'Ứng viên', id: firebaseUser?.uid || 'user-0', avatarUrl: profileData.avatarUrl || loggedInUser.avatarUrl}));
         }
        const localAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        setAppliedJobs(localAppliedJobs);
        const localSavedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setSavedJobs(localSavedJobs);
        return;
    }

    if (!firebaseUser) {
        setInternalRole('guest');
        setCurrentUser(guestUser);
        setProfileName(null);
        setProfileHeadline(null);
        setAvatarUrl(null);
        setApplicationCount(0);
        setSavedJobCount(0);
        setAppliedJobs([]);
        setSavedJobs([]);
        return;
    }

    // Real logic for logged-in users
    const storedProfileRaw = localStorage.getItem('generatedCandidateProfile');
    
    if (!storedProfileRaw) {
        setInternalRole('candidate-empty-profile');
    } else {
        try {
            const profile = JSON.parse(storedProfileRaw);
            if (isProfileConsideredFull(profile)) {
                setInternalRole('candidate-full-profile');
            } else {
                setInternalRole('candidate');
            }
        } catch {
            setInternalRole('candidate-empty-profile');
        }
    }

    const profile: Partial<CandidateProfile & { avatarUrl?: string }> = storedProfileRaw ? JSON.parse(storedProfileRaw) : {};
    const displayName = firebaseUser.displayName || profile.name || 'Ứng viên';
    
    setProfileName(displayName);
    setProfileHeadline(profile.headline || 'Cập nhật hồ sơ của bạn');
    setAvatarUrl(firebaseUser.photoURL || profile.avatarUrl || null);
    
    setCurrentUser({
        id: firebaseUser.uid,
        name: displayName,
        avatarUrl: firebaseUser.photoURL || profile.avatarUrl || loggedInUser.avatarUrl,
    });

    const localAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setAppliedJobs(localAppliedJobs);
    const localSavedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(localSavedJobs);
  }, []);

  const setRole = (newRole: Role) => {
    if (process.env.NEXT_PUBLIC_ENABLE_ROLE_SIMULATION !== 'true') {
        console.warn("Manual role setting is disabled in production.");
        return;
    }
    localStorage.setItem('simulatedRole', newRole);
    updateAuthAndProfileState(auth.currentUser);
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        updateAuthAndProfileState(user);
    });

    const handleStorageChange = () => {
        updateAuthAndProfileState(auth.currentUser);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        unsubscribe();
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [auth, updateAuthAndProfileState]);

  const handleSaveJob = (jobId: string, jobTitle: string) => {
    const SAVED_JOB_LIMIT = 20;
    const isAlreadySaved = savedJobs.includes(jobId);

    if (isAlreadySaved) {
        // Unsave
        const newSavedJobs = savedJobs.filter(id => id !== jobId);
        setSavedJobs(newSavedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
        toast({ title: "Đã bỏ lưu việc làm", description: `"${jobTitle}" đã được xóa khỏi danh sách của bạn.` });
        // We don't decrement the `new` count when unsaving
    } else {
        // Save
        if (savedJobs.length >= SAVED_JOB_LIMIT) {
             toast({ variant: 'destructive', title: "Đã đạt giới hạn lưu", description: "Bạn chỉ có thể lưu tối đa 20 việc làm. Vui lòng xóa bớt để lưu việc mới." });
             return false;
        }
        const newSavedJobs = [...savedJobs, jobId];
        setSavedJobs(newSavedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
        setSavedJobCount(prev => prev + 1);
        setLastAction('save');
        toast({ title: "Đã lưu việc làm", description: `"${jobTitle}" đã được thêm vào danh sách của bạn.` });
    }
    return true;
  };

  const applyForJob = (jobId: string, jobTitle: string) => {
    const APPLICATION_LIMIT = 10;
    
    if (appliedJobs.length >= APPLICATION_LIMIT) {
        return false; // Limit reached
    }

    setAppliedJobs(prev => {
        const newAppliedJobs = [...prev, jobId];
        localStorage.setItem('appliedJobs', JSON.stringify(newAppliedJobs));
        return newAppliedJobs;
    });

    setApplicationCount(prev => prev + 1);
    setLastAction('apply');

    toast({
        title: 'Ứng tuyển thành công!',
        description: `Hồ sơ của bạn đã được gửi cho công việc "${jobTitle}".`,
        className: 'bg-green-500 text-white'
    });
    
    return true;
  };
  
  const reapplyForJob = (jobId: string) => {
     setAppliedJobs(prev => {
        const newAppliedJobs = [...prev, jobId];
        localStorage.setItem('appliedJobs', JSON.stringify(newAppliedJobs));
        return newAppliedJobs;
    });
    // NO toast and NO badge update for re-apply
  };

  const cancelApplication = (jobId: string) => {
    setAppliedJobs(prev => {
        const newAppliedJobs = prev.filter(id => id !== jobId);
        localStorage.setItem('appliedJobs', JSON.stringify(newAppliedJobs));
        return newAppliedJobs;
    });
     toast({
        title: "Đã huỷ ứng tuyển",
        description: `Bạn đã huỷ ứng tuyển công việc có mã ${jobId}.`,
    });
  };

  const clearApplicationCount = useCallback(() => {
    setApplicationCount(0);
  }, []);

  const clearSavedJobCount = useCallback(() => {
    setSavedJobCount(0);
  }, []);

  const value = {
    role,
    currentUser,
    isLoggedIn,
    profileName,
    profileHeadline,
    avatarUrl,
    applicationCount,
    savedJobCount,
    setApplicationCount,
    clearApplicationCount,
    clearSavedJobCount,
    appliedJobs,
    savedJobs,
    applyForJob,
    reapplyForJob,
    cancelApplication,
    handleSaveJob,
    setRole,
    postLoginAction,
    setPostLoginAction,
    clearPostLoginAction,
    logout,
    lastAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
