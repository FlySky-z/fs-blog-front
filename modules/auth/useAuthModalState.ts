'use client';
import { useState, useCallback } from 'react';
import { message } from 'antd';

/**
 * 认证模态窗口逻辑Hook - 仅处理UI状态
 */
export const useAuthModalState = () => {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // 打开登录模态窗口
  const openLoginModal = useCallback(() => {
    console.log('openLoginModal called');
    setTab('login');
    setVisible(true);
    console.log('Visible state set to true');
  }, []);
  
  // 打开注册模态窗口
  const openRegisterModal = useCallback(() => {
    console.log('openRegisterModal called');
    setTab('register');
    setVisible(true);
    console.log('Visible state set to true');
  }, []);
  
  // 关闭模态窗口
  const closeAuthModal = useCallback(() => {
    setVisible(false);
  }, []);
  
  return {
    visible,
    tab,
    openLoginModal,
    openRegisterModal,
    closeAuthModal,
  };
};

// 带有完整功能的认证模态窗口Hook，需要在AuthContext内部使用
export { useAuthContext } from './AuthContext';
