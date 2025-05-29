'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Spin } from 'antd';
import { useUserStore } from '@/store/userStore';

interface ProtectedRouteProps {
  children: ReactNode;
  // 可选的重定向路径，默认为首页
  redirectPath?: string;
  // 根据用户角色决定是否允许访问
  role?: number;
}

/**
 * 保护路由组件
 * 用于包装需要登录才能访问的页面
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/',
  role = 0,
}) => {
  const { isLoggedIn, isInitializing, userInfo: userInfo } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // 如果正在加载，不做处理
    if (isInitializing) return;
    
    // 如果未登录，跳转到指定路径
    if (!isLoggedIn) {
      // 保存当前访问路径，以便登录后可以重定向回来
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      router.push(redirectPath);
      return;
    }
    
    // 如果指定了角色要求，检查用户是否有权限
    if (role > 0 && userInfo) {
      const userRole = userInfo.role || 0; // 默认角色为0（未定义）
      
      // 如果用户角色不足以访问该页面
      if (userRole < role) {
        router.push('/403'); // 无权限页面
        return;
      }
    }
  }, [isLoggedIn, isInitializing, pathname, redirectPath, role, router, userInfo]);
  
  // 如果正在加载，显示加载状态
  if (isInitializing) {
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
  return isLoggedIn ? <>{children}</> : null;
};

export default ProtectedRoute;

/**
 * 为组件添加前端路由保护
 * @param Component 要保护的组件
 * @param options 保护选项
 * @returns 包装后的组件
 */
export const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  const WrappedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
  WrappedComponent.displayName = `WithProtectedRoute(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};
