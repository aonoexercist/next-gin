'use client';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  permissions: string[];
  isAdmin: boolean;
  can: (permission: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [_isAdmin, setIsAdmin] = useState(false);

  const fetchUser = useAuth((s) => s.fetch);
  const userData = useAuth((s) => s.user);
  const isLoggedIn = useAuth((s) => s.isLoggedIn);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      try {
        // fetchUser should hit /api/me and update the store's isLoggedIn/user
        const loggedIn = await fetchUser();
        if (!cancelled && loggedIn) {
          const adminResult = await isAdmin();
          if (!cancelled) setIsAdmin(adminResult);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [fetchUser, isLoggedIn]);

  console.log('AuthProvider userData:', userData);
  const permissions = userData?.permissions?.map((permission: string) => permission).flat() || [];
  console.log('AuthProvider permissions:', permissions);

  const can = (permission: string) => {
    console.log('Checking permission:', permission, 'for user permissions:', permissions);
    if (_isAdmin) return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{ user: isLoggedIn ? userData : null, isLoggedIn, permissions, isAdmin: _isAdmin, can, loading }}
    >
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