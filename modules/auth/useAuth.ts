'use client';
import { useState, useCallback } from 'react';
import authService, { LoginParams, UserInfo } from './authService';
import apiClient from '@/utils/apiClient';

// 扩展 UserInfo 接口，添加 isLoggedIn 属性
interface User extends UserInfo {
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
      // 使用 authService 检查认证状态
      const isAuthenticated = authService.isAuthenticated();
      
      if (isAuthenticated) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          // 转换为包含 isLoggedIn 属性的 User 对象
          const userData = {
            ...currentUser,
            isLoggedIn: true
          };
          setUser(userData);
          return;
        }
      }
      
      setUser(null);
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
      // 将 LoginData 转换为 LoginParams
      const params: LoginParams = {
        ...data,
        loginMethod: data.loginMethod
      };
      
      // 调用 authService 的登录方法
      const response = await authService.login(params);
      
      // 处理登录成功的情况
      const userData = {
        ...response.user,
        isLoggedIn: true
      };
      
      setUser(userData);
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
      // 调用 API 进行注册
      // 注意：目前 authService 中没有直接提供注册方法，这里可能需要使用 apiClient 或扩展 authService
      
      // 使用 apiClient 直接发送注册请求
      const response = await apiClient.post('/auth/register', {
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        method: data.registerMethod
      });
      
      return !!response;
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
      // 调用 authService 的登出方法
      await authService.logout();
      
      // 清除状态
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
