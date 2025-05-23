'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthModal } from '@/modules/auth/AuthWrapper';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: ReactNode;
  // 可选的重定向路径，默认为首页
  redirectPath?: string;
  // 根据用户角色决定是否允许访问
  roles?: string[];
}

/**
 * 保护路由组件
 * 用于包装需要登录才能访问的页面
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/',
  roles = []
}) => {
  const { isAuthenticated, user, loading } = useAuthModal();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // 如果正在加载，不做处理
    if (loading) return;
    
    // 如果未登录，跳转到指定路径
    if (!isAuthenticated) {
      // 保存当前访问路径，以便登录后可以重定向回来
      if (typeof window !== 'undefined' && pathname !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      
      router.push(redirectPath);
      return;
    }
    
    // 如果指定了角色要求，检查用户是否有权限
    if (roles.length > 0 && user) {
      const hasRole = roles.some(role => user[role] === true);
      if (!hasRole) {
        router.push('/403'); // 无权限页面
        return;
      }
    }
  }, [isAuthenticated, loading, pathname, redirectPath, roles, router, user]);
  
  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }
  
  // 如果已认证，渲染子组件
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;

/**
 * 高阶组件：为组件添加路由保护
 * @param Component 要保护的组件
 * @param options 保护选项
 * @returns 包装后的组件
 */
export const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  return (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
