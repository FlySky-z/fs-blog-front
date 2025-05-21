'use client';
import { useState, useCallback } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isLoggedIn: boolean;
}

interface LoginData {
  email?: string;
  phone?: string;
  password: string;
  loginMethod: 'email' | 'phone';
}

interface RegisterData {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  registerMethod: 'email' | 'phone';
}

/**
 * 认证相关的状态和方法
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 检查是否已登录
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      // 实际项目中应该从API获取用户信息或检查本地存储
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('认证检查失败:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 登录
  const login = useCallback(async (data: LoginData) => {
    setLoading(true);
    setError(null);
    
    try {
      // 实际项目中应该调用API进行登录
      console.log('登录数据:', data);
      
      // 模拟登录成功
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser = {
        id: '123',
        username: 'demo_user',
        email: data.email,
        phone: data.phone,
        avatar: '',
        isLoggedIn: true
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (err: any) {
      console.error('登录失败:', err);
      setError(err.message || '登录失败，请稍后重试');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 注册
  const register = useCallback(async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      // 实际项目中应该调用API进行注册
      console.log('注册数据:', data);
      
      // 模拟注册成功
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return true;
    } catch (err: any) {
      console.error('注册失败:', err);
      setError(err.message || '注册失败，请稍后重试');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 登出
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      // 实际项目中应该调用API进行登出
      console.log('登出');
      
      // 清除本地存储和状态
      localStorage.removeItem('user');
      setUser(null);
      return true;
    } catch (err: any) {
      console.error('登出失败:', err);
      setError(err.message || '登出失败，请稍后重试');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    checkAuth,
    login,
    register,
    logout
  };
};
