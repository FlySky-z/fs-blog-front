// components/auth/AuthInitializer.tsx
'use client';

import { useAuthInitializer } from '@/modules/auth/useAuthInitializer';
import { ReactNode } from 'react';

interface AuthInitializerProps {
  children: ReactNode;
  loadingComponent?: ReactNode;
}

/**
 * 认证初始化包装组件
 * 在认证状态初始化完成前显示加载界面
 */
export const AuthInitializer = ({ 
  children,
}: AuthInitializerProps) => {
  const { isInitializing } = useAuthInitializer();

  if (isInitializing) {
    return (
      <>
      </>
    );
  }

  return <>{children}</>;
};
