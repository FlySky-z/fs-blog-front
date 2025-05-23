'use client';
import React, { ReactNode, useCallback } from 'react';
import { message } from 'antd';
import { AuthProvider, useAuthContext } from './AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { useModalContext } from './ModalContext';

interface AuthWrapperProps {
  children: ReactNode;
}

// 内部组件，已经有AuthProvider包裹
const AuthWrapperInner: React.FC = () => {

  try {
    const modalContext = useModalContext();
    const { modalState, closeAuthModal } = modalContext;

    const authContext = useAuthContext();
    const { login, register } = authContext;

    // 处理登录表单提交
    const handleLogin = useCallback(async (values: any) => {
      const success = await login(values);

      if (success) {
        message.success('登录成功');
        closeAuthModal();
      } else {
        message.error('登录失败，请检查账号密码');
      }

      return success;
    }, [login, closeAuthModal]);

    // 处理注册表单提交
    const handleRegister = useCallback(async (values: any) => {
      const success = await register(values);

      if (success) {
        message.success('注册成功，请登录');
        // 不需要关闭模态框，切换到登录页
      } else {
        message.error('注册失败，请稍后重试');
      }

      return success;
    }, [register]);

    return (
      <AuthModal
        visible={modalState.visible}
        onClose={closeAuthModal}
        defaultTab={modalState.tab}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  } catch (error) {
    console.error('AuthWrapperInner: Error rendering modal', error);
    return null; // 如果出错，不渲染模态框
  }
};

/**
 * 认证包裹组件，提供认证上下文和模态窗口
 */
const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
      <AuthWrapperInner />
    </AuthProvider>
  );
};

/**
 * 创建一个自定义的Hook，结合认证状态和模态框状态
 */
const useAuthModal = () => {

  try {
    const modalContext = useModalContext();

    const {
      modalState,
      openLoginModal,
      openRegisterModal,
      closeAuthModal
    } = modalContext;

    const authContext = useAuthContext();
    return {
      // 模态框状态和方法
      visible: modalState.visible,
      tab: modalState.tab,
      openLoginModal,
      openRegisterModal,
      closeAuthModal,

      // 认证状态和方法
      ...authContext,

      // 处理登出
      handleLogout: async () => {
        const success = await authContext.logout();

        if (success) {
          message.success('已退出登录');
        }

        return success;
      }
    };
  } catch (error) {
    // 返回默认值
    return {
      visible: false,
      tab: 'login' as const,
      openLoginModal: () => console.error('Modal context not available'),
      openRegisterModal: () => console.error('Modal context not available'),
      closeAuthModal: () => console.error('Modal context not available'),
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      handleLogout: async () => false,
      login: async () => false,
      register: async () => false,
      logout: async () => false,
    };
  }
};

// 导出认证相关功能
export { useAuthContext } from './AuthContext';
export { useAuthModal };
export default AuthWrapper;
