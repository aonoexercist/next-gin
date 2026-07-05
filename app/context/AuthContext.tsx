'use client';

import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: any;
  permissions: string[];
  isAdmin: boolean;
  can: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, userData }: { children: React.ReactNode, userData: any }) {
  // If the backend says they are a SuperAdmin, they pass every permission check
  const isAdmin = userData?.is_admin || userData?.roles?.includes('super_admin');
  const permissions = userData?.permissions || [];

  const can = (permission: string) => {
    if (isAdmin) return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user: userData, permissions, isAdmin, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};