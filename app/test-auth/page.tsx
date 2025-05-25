'use client';
import React, { useState, useEffect, use } from 'react';
import { Card, Space, Typography, Button, Tag, Alert, message } from 'antd';
import { useAuth } from '@/modules/auth/useAuthInitializer';
import { useAuthModal } from '@/modules/auth/AuthModal';
import { apiClient } from '@/utils/apiClient';
import { useUserStore } from '@/store/userStore';
import { RefreshTokenResponse } from '@/modules/auth/authModel';
import authService from '@/modules/auth/authService';

const { Title, Text } = Typography;

/**
 * 认证系统测试页面
 * 用于测试完整的认证流程和状态管理
 */
const TestAuthPage: React.FC = () => {
  // 使用认证状态 Hook
  const { isLoggedIn, isInitializing } = useAuth();
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  
  // 使用认证模态框 Hook
  const { openLoginModal, openRegisterModal, logout, visible, tab } = useAuthModal();

  // 监控localStorage变化
  useEffect(() => {
    const updateStorageInfo = () => {
      if (typeof window !== 'undefined') {
        setStorageInfo({
          accessToken: localStorage.getItem('access_token'),
          refreshToken: localStorage.getItem('refresh_token'),
          userInfo: JSON.stringify(useUserStore.getState().userInfo, null, 2),
          timestamp: new Date().toLocaleTimeString()
        });
      }
    };

    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  // 添加测试结果
  const addTestResult = (test: string, success: boolean, details?: string) => {
    const result = {
      test,
      success,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 9)]);
  };

  // 测试直接登录API
  const testDirectLogin = async () => {
    try {
      const response = authService.login({
        username: 'test',
        password: 'Test123'
        });
      addTestResult('直接API登录', true, '登录成功');
      messageApi.success('直接API登录成功');
    } catch (error: any) {
      addTestResult('直接API登录', false, error.message);
      messageApi.error('直接API登录失败');
    }
  };

  // 测试Token刷新
  const testTokenRefresh = async () => {
    try {
      const response = await apiClient.get<RefreshTokenResponse>('/api/auth/fresh');
      if (response.code !== 200) {
        throw new Error('Token刷新失败');
      }
      addTestResult('Token刷新', true, '刷新成功');
      messageApi.success('Token刷新成功');
    } catch (error: any) {
      addTestResult('Token刷新', false, error.message);
      messageApi.error('Token刷新失败');
    }
  };

  // 测试受保护的API调用
  const testProtectedAPI = async () => {
    console.log(useUserStore.getState());
    const userId = useUserStore.getState().userInfo?.id;
    if (!userId) {
      messageApi.warning('请先登录');
      return;
    }
    
    try {
      const response = await apiClient.get(`/api/user/info/${userId}`);
      addTestResult('受保护API调用', true, '获取用户信息成功');
      messageApi.success('受保护API调用成功');
    } catch (error: any) {
      addTestResult('受保护API调用', false, error.message);
      messageApi.error('受保护API调用失败');
    }
  };

  // 模拟受保护的操作
  const handleProtectedAction = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    
    alert('执行受保护的操作成功！');
  };

  if (isInitializing) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text>正在初始化认证状态...</Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>认证系统测试页面</Title>
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 认证状态显示 */}
        <Card title="认证状态信息" bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>登录状态: </Text>
              <Tag color={isLoggedIn ? 'green' : 'red'}>
                {isLoggedIn ? '已登录' : '未登录'}
              </Tag>
            </div>
            
            <div>
              <Text strong>初始化状态: </Text>
              <Tag color={isInitializing ? 'processing' : 'success'}>
                {isInitializing ? '初始化中' : '已完成'}
              </Tag>
            </div>

            {isLoggedIn && (
              <>
                <div>
                  <Text strong>用户ID: </Text>
                  <Text code>{useUserStore.getState().userInfo?.id || '未获取'}</Text>
                </div>
                
                <div>
                  <Text strong>用户名: </Text>
                  <Text code>{useUserStore.getState().userInfo?.username || '未获取'}</Text>
                </div>
              </>
            )}
          </Space>
        </Card>

        {/* 模态框状态 */}
        <Card title="模态框状态" bordered={false}>
          <Space direction="vertical">
            <div>
              <Text strong>模态框显示: </Text>
              <Tag color={visible ? 'blue' : 'default'}>
                {visible ? '已显示' : '已隐藏'}
              </Tag>
            </div>
            
            {visible && (
              <div>
                <Text strong>当前标签: </Text>
                <Tag color="blue">{tab === 'login' ? '登录' : '注册'}</Tag>
              </div>
            )}
          </Space>
        </Card>

        {/* 操作按钮 */}
        <Card title="操作测试" bordered={false}>
          <Space wrap>
            {!isLoggedIn ? (
              <>
                <Button type="primary" onClick={openLoginModal}>
                  打开登录模态框
                </Button>
                <Button onClick={openRegisterModal}>
                  打开注册模态框
                </Button>
                <Button onClick={testDirectLogin}>
                  直接API登录 (demo/password123)
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" danger onClick={logout}>
                  退出登录
                </Button>
                <Button onClick={testProtectedAPI}>
                  测试受保护API
                </Button>
                <Button onClick={testTokenRefresh}>
                  测试Token刷新
                </Button>
              </>
            )}
            
            <Button onClick={handleProtectedAction}>
              执行受保护操作
            </Button>
            
            <Button onClick={() => window.location.reload()}>
              刷新页面测试
            </Button>
          </Space>
        </Card>

        {/* 实时存储状态 */}
        <Card title="实时存储状态" bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {storageInfo && (
              <>
                <div>
                  <Text strong>更新时间: </Text>
                  <Text code>{storageInfo.timestamp}</Text>
                </div>
                
                <div>
                  <Text strong>Access Token: </Text>
                  <Text code style={{ wordBreak: 'break-all', fontSize: '12px' }}>
                    {storageInfo.accessToken ? 
                      `${storageInfo.accessToken.substring(0, 50)}...` : 
                      '无'
                    }
                  </Text>
                </div>
                
                <div>
                  <Text strong>Refresh Token: </Text>
                  <Text code style={{ wordBreak: 'break-all', fontSize: '12px' }}>
                    {storageInfo.refreshToken ? 
                      `${storageInfo.refreshToken.substring(0, 50)}...` : 
                      '无'
                    }
                  </Text>
                </div>
                
                <div>
                  <Text strong>User Info: </Text>
                  <Text code style={{ wordBreak: 'break-all', fontSize: '12px' }}>
                    {storageInfo.userInfo || '无'}
                  </Text>
                </div>
              </>
            )}
          </Space>
        </Card>

        {/* 测试结果 */}
        <Card title="测试结果历史" bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {testResults.length === 0 ? (
              <Text type="secondary">暂无测试结果</Text>
            ) : (
              testResults.map((result, index) => (
                <Alert
                  key={index}
                  type={result.success ? 'success' : 'error'}
                  message={`${result.timestamp} - ${result.test}`}
                  description={result.details}
                  showIcon
                />
              ))
            )}
          </Space>
        </Card>

        {/* 功能说明 */}
        <Card title="测试说明" bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>测试凭据:</Text>
              <br />
              <Text>用户名: demo，密码: password123</Text>
            </div>
            
            <div>
              <Text strong>1. 登录流程测试:</Text>
              <br />
              <Text>点击"打开登录模态框"按钮或"直接API登录"按钮</Text>
            </div>
            
            <div>
              <Text strong>2. Token自动刷新测试:</Text>
              <br />
              <Text>登录后点击"测试Token刷新"按钮</Text>
            </div>
            
            <div>
              <Text strong>3. 受保护API测试:</Text>
              <br />
              <Text>登录后点击"测试受保护API"按钮</Text>
            </div>
            
            <div>
              <Text strong>4. 状态持久化测试:</Text>
              <br />
              <Text>登录后刷新页面，检查状态是否保持</Text>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default TestAuthPage;
