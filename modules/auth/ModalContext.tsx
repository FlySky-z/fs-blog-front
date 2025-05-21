'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
}

// 创建上下文
const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

/**
 * 模态窗口状态提供者
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    tab: 'login',
  });
  
  // 打开登录模态窗口
  const openLoginModal = useCallback(() => {
    console.log('modalContext: openLoginModal called');
    setModalState({
      visible: true,
      tab: 'login',
    });
  }, []);
  
  // 打开注册模态窗口
  const openRegisterModal = useCallback(() => {
    console.log('modalContext: openRegisterModal called');
    setModalState({
      visible: true,
      tab: 'register',
    });
  }, []);
  
  // 关闭模态窗口
  const closeAuthModal = useCallback(() => {
    console.log('modalContext: closeAuthModal called');
    setModalState((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);
  
  return (
    <ModalContext.Provider
      value={{
        modalState,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/**
 * 使用模态窗口状态的Hook
 */
export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  
  return context;
};
