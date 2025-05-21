'use client';
import React, { useState } from 'react';
import { Modal } from 'antd';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from './auth-modal.module.scss';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  onLogin?: (values: any) => Promise<boolean>;
  onRegister?: (values: any) => Promise<boolean>;
}

/**
 * 登录/注册模态窗口组件
 */
const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onClose,
  defaultTab = 'login',
  onLogin: externalLoginHandler,
  onRegister: externalRegisterHandler
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [loading, setLoading] = useState(false);
  
  // 处理切换到注册表单
  const handleSwitchToRegister = () => {
    setActiveTab('register');
  };
  
  // 处理切换到登录表单
  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };
  
  // 处理登录提交
  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      console.log('登录表单提交:', values);
      
      if (externalLoginHandler) {
        return await externalLoginHandler(values);
      }
      
      // 默认处理逻辑（当未提供外部处理函数时）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      onClose();
      return true;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // 处理注册提交
  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      console.log('注册表单提交:', values);
      
      if (externalRegisterHandler) {
        return await externalRegisterHandler(values);
      }
      
      // 默认处理逻辑（当未提供外部处理函数时）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟注册成功，切换到登录表单
      handleSwitchToLogin();
      return true;
    } catch (error) {
      console.error('注册失败:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      destroyOnHidden
      centered
      className={styles.authModal}
      title={null}
      maskClosable={false}
    >
      <div className={styles.modalContent}>
        {activeTab === 'login' ? (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={handleSwitchToRegister}
            loading={loading}
          />
        ) : (
          <RegisterForm 
            onRegister={handleRegister}
            onSwitchToLogin={handleSwitchToLogin}
            loading={loading}
          />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
