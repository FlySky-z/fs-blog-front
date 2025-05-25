// hooks/useAuthInitializer.ts
import { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/userStore';

/**
 * 认证初始化 Hook
 * 在应用启动时自动检查和刷新认证状态
 */
export const useAuthInitializer = () => {
  const { initializeAuth, isInitializing, isLoggedIn } = useUserStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 确保只初始化一次
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeAuth();
    }
  }, [initializeAuth]);

  return {
    isInitializing,
    isLoggedIn
  };
};

/**
 * 简单的认证状态 Hook
 * 用于组件中获取当前认证状态
 */
export const useAuth = () => {
  const { isLoggedIn, isInitializing, login, logout } = useUserStore();
  return {
    isLoggedIn,
    isInitializing,
    login,
    logout
  };
};
