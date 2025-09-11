'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Role = 'candidate' | 'candidate-empty-profile' | 'guest';

interface AuthContextType {
  role: Role;
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
  const [role, setRole] = useState<Role>('candidate');

  useEffect(() => {
    // When simulating 'candidate-empty-profile', we want to clear the stored profile
    // to ensure the profile page starts fresh.
    if (role === 'candidate-empty-profile') {
      localStorage.removeItem('generatedCandidateProfile');
    }
  }, [role]);

  const value = {
    role,
    setRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
