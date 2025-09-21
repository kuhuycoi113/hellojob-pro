
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { guestUser, loggedInUser, setCurrentUser } from '@/lib/chat-data';

export type Role = 'candidate' | 'candidate-empty-profile' | 'guest';

interface AuthContextType {
  role: Role;
  isLoggedIn: boolean;
  setRole: (role: Role) => void;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [role, setInternalRole] = useState<Role>('guest');
  const isLoggedIn = role !== 'guest';

  const setRole = (newRole: Role) => {
    // Mutate the currentUser from chat-data based on the role
    if (newRole === 'guest') {
        setCurrentUser(guestUser);
    } else { // 'candidate' or 'candidate-empty-profile'
        setCurrentUser(loggedInUser);
    }
    setInternalRole(newRole);
  };


  useEffect(() => {
    const preferencesRaw = sessionStorage.getItem('onboardingPreferences');
    
    // When role changes to 'candidate-empty-profile' (which is the default on login)
    // we check if there are preferences to apply from the guest session.
    if (role === 'candidate-empty-profile' && preferencesRaw) {
        try {
            const preferences = JSON.parse(preferencesRaw);
            const existingProfileRaw = localStorage.getItem('generatedCandidateProfile');
            let profile = existingProfileRaw ? JSON.parse(existingProfileRaw) : {};

            // Merge preferences into the profile
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
            
            // After applying preferences, the profile is no longer 'empty' in spirit,
            // so we transition the role to 'candidate'.
            setRole('candidate');

        } catch(e) {
            console.error("Failed to apply onboarding preferences:", e);
            // If applying preferences fails, we still remove the temp data
            sessionStorage.removeItem('onboardingPreferences');
        }
    } else if (role === 'candidate-empty-profile' && !preferencesRaw) {
        // If the role is set to empty but there are no preferences, it means a fresh start.
        // Clear any potentially lingering profile data.
        localStorage.removeItem('generatedCandidateProfile');
    }

  }, [role]);

  const value = {
    role,
    isLoggedIn,
    setRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
