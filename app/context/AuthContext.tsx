'use client';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  permissions: string[];
  isAdmin: boolean;
  can: (permission: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [_isAdmin, setIsAdmin] = useState(false);

  // Subscribe reactively to the store instead of a one-off getState() snapshot
  const userData = useAuth((s) => s.user);
  const fetchUser = useAuth((s) => s.fetch);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      try {
        const [adminResult] = await Promise.all([
          isAdmin(),
          fetchUser(),
        ]);
        if (!cancelled) setIsAdmin(adminResult);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [fetchUser]);

  const permissions = userData?.permissions?.map((role: any) => role.permissions).flat() || [];

  const can = (permission: string) => {
    if (_isAdmin) return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user: userData, permissions, isAdmin: _isAdmin, can, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};

export default AuthProvider;