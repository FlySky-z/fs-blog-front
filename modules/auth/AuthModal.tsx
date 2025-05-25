'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useUserStore } from '@/store/userStore';
import { authService } from './authService';
import { message } from 'antd';
import AuthModal from '@/components/auth/AuthModal';

// 定义模态框状态接口
interface ModalState {
  visible: boolean;
  tab: 'login' | 'register';
}

// 定义上下文接口
interface ModalContextType {
  modalState: ModalState;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  // 添加认证相关方法
  isLoggedIn: boolean;
  userId: number;
  username: string;
  handleLogin: (values: any) => Promise<boolean>;
  handleRegister: (values: any) => Promise<boolean>;
  handleLogout: () => void;
}

// 创建上下文
const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

/**
 * 模态窗口状态提供者
 * 集成认证状态管理
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    tab: 'login',
  });

  // 使用新的用户状态管理
  const { 
    isLoggedIn,
    login: userLogin, 
    logout: userLogout 
  } = useUserStore();
  
  // 打开登录模态窗口
  const openLoginModal = useCallback(() => {
    setModalState({
      visible: true,
      tab: 'login',
    });
  }, []);
  
  // 打开注册模态窗口
  const openRegisterModal = useCallback(() => {
    setModalState({
      visible: true,
      tab: 'register',
    });
  }, []);
  
  // 关闭模态窗口
  const closeAuthModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  // 处理登录
  const handleLogin = useCallback(async (values: any) => {
    try {
      const loginParams = {
        username: values.username || values.phone,
        password: values.password,
        loginMethod: values.loginMethod as 'username' | 'phone'
      };

      const response = await authService.login(loginParams);
      
      if (response.code === 200) {
        // 使用 userStore 的 login 方法更新状态
        userLogin(response.data?.id || "");
        
        messageApi.success('登录成功');
        closeAuthModal();
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('登录失败:', error);
      messageApi.error(error.message || '登录失败，请稍后重试');
      return false;
    }
  }, [userLogin, closeAuthModal]);

  // 处理注册
  const handleRegister = useCallback(async (values: any) => {
    try {
      const success = await authService.register(values);
      
      if (success) {
        messageApi.success('注册成功，请登录');
        // 切换到登录标签，但不关闭模态框
        setModalState(prev => ({
          ...prev,
          tab: 'login'
        }));
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('注册失败:', error);
      messageApi.error(error.message || '注册失败，请稍后重试');
      return false;
    }
  }, []);

  // 处理登出
  const handleLogout = useCallback(() => {
    userLogout();
    messageApi.success('已退出登录');
  }, [userLogout]);

  return (
    <ModalContext.Provider
      value={{
        modalState,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        isLoggedIn,
        userId: useUserStore.getState().userInfo?.id || 0,
        username: useUserStore.getState().userInfo?.username || '',
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
      {contextHolder}
      {children}
      {/* 渲染认证模态框 */}
      <AuthModal
        visible={modalState.visible}
        onClose={closeAuthModal}
        defaultTab={modalState.tab}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </ModalContext.Provider>
  );
};

/**
 * 使用模态框上下文的 Hook
 */
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

/**
 * 认证模态框 Hook
 * 提供认证状态和模态框操作的统一接口
 */
export const useAuthModal = () => {
  const context = useModalContext();
  return {
    // 模态框状态
    visible: context.modalState.visible,
    tab: context.modalState.tab,
    
    // 模态框操作
    openLoginModal: context.openLoginModal,
    openRegisterModal: context.openRegisterModal,
    closeAuthModal: context.closeAuthModal,
    
    // 认证状态
    isLoggedIn: context.isLoggedIn,
    isAuthenticated: context.isLoggedIn,
    userId: context.userId,
    username: context.username,
    
    // 认证操作
    login: context.handleLogin,
    register: context.handleRegister,
    logout: context.handleLogout,
  };
};
