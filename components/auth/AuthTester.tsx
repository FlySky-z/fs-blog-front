'use client';
import React from 'react';
import { Button, Space } from 'antd';
import { useAuthModal } from '@/modules/auth/AuthWrapper';

const AuthTester: React.FC = () => {
  const { 
    openLoginModal, 
    openRegisterModal, 
    isAuthenticated, 
    user 
  } = useAuthModal();
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px 0' }}>
      <h3>认证状态测试</h3>
      <p>认证状态: {isAuthenticated ? '已登录' : '未登录'}</p>
      {user && <p>用户: {user.name}</p>}
      
      <Space>
        <Button type="primary" onClick={openLoginModal}>
          打开登录窗口
        </Button>
        <Button onClick={openRegisterModal}>
          打开注册窗口
        </Button>
      </Space>
    </div>
  );
};

export default AuthTester;
