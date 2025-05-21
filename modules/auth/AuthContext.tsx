'use client';
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';

interface AuthContextType {
  user: ReturnType<typeof useAuth>['user'];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: ReturnType<typeof useAuth>['login'];
  register: ReturnType<typeof useAuth>['register'];
  logout: ReturnType<typeof useAuth>['logout'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 认证上下文提供者
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  
  useEffect(() => {
    // 组件挂载时检查认证状态
    auth.checkAuth();
  }, [auth.checkAuth]);
  
  return (
    <AuthContext.Provider value={{
      user: auth.user,
      loading: auth.loading,
      error: auth.error,
      isAuthenticated: auth.isAuthenticated,
      login: auth.login,
      register: auth.register,
      logout: auth.logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 使用认证上下文的Hook
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};
