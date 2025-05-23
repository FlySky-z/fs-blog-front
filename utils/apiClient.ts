/**
 * API 请求客户端
 * 封装常用的 HTTP 请求方法
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/env';
import authService from '@/modules/auth/authService';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 秒超时
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 允许跨域请求携带 cookie
});

// 自定义请求拦截器存储
let requestInterceptor: ((config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig) | undefined;

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 应用自定义拦截器（如果存在）
    if (requestInterceptor) {
      config = requestInterceptor(config);
    }
    
    // 可以在发送请求前做一些处理
    // 例如：添加公共参数、处理请求数据等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 原始请求存储
const originalRequests = new Map();

// 是否正在刷新 token
let isRefreshing = false;
// 等待 token 刷新的请求队列
let refreshSubscribers: Array<(token: string) => void> = [];

// 订阅 token 刷新
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 通知所有订阅者 token 已经刷新
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 可以在获取响应数据前做一些处理
    // 例如：统一处理某些业务逻辑、转换数据格式等
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    
    // 处理 401 未授权错误
    if (status === 401 && !originalRequest._retry) {
      // 如果是刷新 token 的请求失败，直接返回错误
      if (originalRequest.url === '/auth/refresh') {
        // 清除认证信息
        if (typeof window !== 'undefined') {
          console.warn('刷新 token 失败，清除认证信息');
        }
        return Promise.reject(error);
      }
      
      // 标记请求已经尝试过重试
      originalRequest._retry = true;
      
      // 如果已经在刷新 token，则等待
      if (isRefreshing) {
        try {
          // 添加到等待队列
          const newToken = await new Promise<string>((resolve) => {
            subscribeTokenRefresh((token: string) => {
              resolve(token);
            });
          });
          
          // 更新 token 并重试请求
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      
      // 开始刷新 token
      isRefreshing = true;
      
      try {
        // 调用刷新 token 的方法
        const refreshSuccess = await authService.refreshToken();
        
        if (refreshSuccess) {
          const newToken = authService.getToken();
          if (newToken) {
            // 更新当前请求的 token
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            
            // 通知所有等待的请求
            onTokenRefreshed(newToken);
            
            // 重试原始请求
            return axiosInstance(originalRequest);
          }
        }
        
        // 刷新失败，需要重新登录
        console.warn('Token 已过期，请重新登录');
        // 可以触发重定向到登录页或者显示登录模态框
        // window.location.href = '/login';
        
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('刷新 token 失败:', refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // 其他错误直接返回
    return Promise.reject(error);
  }
);

/**
 * 默认请求选项
 */
interface RequestOptions extends Omit<AxiosRequestConfig, 'url' | 'baseURL'> {
  token?: string;
}

/**
 * 发送 HTTP 请求
 * @param endpoint API 端点
 * @param options 请求选项
 * @returns Promise with response data
 */
async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...axiosOptions } = options;
  
  // 构建请求头
  const headers: Record<string, string> = {
    ...(axiosOptions.headers as Record<string, string> || {}),
  };

  // 添加认证 token（如果提供）
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url: endpoint,
      ...axiosOptions,
      headers,
    });

    // 如果是登录请求，保存 token
    if (endpoint.includes("/login") && response.status === 200) {
      const token = response.headers['authorization'];
      if (token) {
        localStorage.setItem('token', token.split(' ')[1]);
      }
    }
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    
    if (axiosError.response) {
      const errorData = axiosError.response.data;
      throw new Error(errorData?.message || `请求失败: ${axiosError.response.status}`);
    } else if (axiosError.request) {
      console.error('请求已发送但未收到响应');
      throw new Error('网络错误，未收到服务器响应');
    }
    
    console.error(`API 请求失败 (${endpoint}):`, error);
    throw error;
  }
}

/**
 * API 客户端
 */
export const apiClient = {
  /**
   * 发送 GET 请求
   */
  get: <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    return fetchApi<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  },

  /**
   * 发送 POST 请求
   */
  post: <T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> => {
    return fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      data,
    });
  },

  /**
   * 发送 PUT 请求
   */
  put: <T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> => {
    return fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      data,
    });
  },

  /**
   * 发送 DELETE 请求
   */
  delete: <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    return fetchApi<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
  
  /**
   * 设置请求拦截器
   * @param interceptor 拦截器函数
   */
  setRequestInterceptor: (interceptor: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig) => {
    requestInterceptor = interceptor;
  },
};

export default apiClient;
