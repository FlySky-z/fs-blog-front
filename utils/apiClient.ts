/**
 * API 请求客户端
 * 封装常用的 HTTP 请求方法
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/env';
import { TokenManager } from '@/utils/tokenManager';

// 扩展 InternalAxiosRequestConfig 类型，添加 _retry 属性
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 创建 axios 实例
const axiosInstance = axios.create({
  // baseURL: API_BASE_URL,
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
    // 打印出来当前的cookie
    console.log('当前的 cookie:', document.cookie);
    // 应用自定义拦截器
    if (requestInterceptor) {
      config = requestInterceptor(config);
    }

    // 自动添加 Access Token（通过 TokenManager）
    if (TokenManager.hasValidToken()) {
      config.headers['Authorization'] = `Bearer ${TokenManager.getAccessToken()}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

/**
 * 独立的刷新授权函数，方便外部调用
 * @returns Promise<string | null> 返回新的 access token 或 null
 */
const refreshAuthorization = async (): Promise<string | null> => {
  try {
    const refreshResponse = await axiosInstance.get('/api/auth/fresh');
    
    if (refreshResponse.status === 200 && refreshResponse.data?.code === 200) {
      // 从响应头提取并保存新的 access token（通过 TokenManager）
      const newToken = TokenManager.extractAndSaveTokenFromHeaders(refreshResponse.headers);
      return newToken;
    }
    
    return null;
  } catch (error) {
    console.error('刷新授权失败:', error);
    return null;
  }
};

// 响应拦截器
axiosInstance.interceptors.response.use(
  async (response) => {
    // 如果响应头中有新的 access token，则保存
    if (response.config.url === '/api/auth/login' || response.config.url === '/api/auth/fresh') {
      TokenManager.extractAndSaveTokenFromHeaders(response.headers);
    }

    // 处理成功响应中的 401 code（未授权）
    if (response.data?.code === 401) {
      console.warn('响应数据中检测到 401 未授权，需要刷新 token');
      
      const originalConfig = response.config as ExtendedAxiosRequestConfig;
      
      // 如果是刷新 token 的请求失败，直接清除认证信息
      if (originalConfig.url === '/api/auth/fresh') {
        console.warn('刷新 token 请求返回 401，清除认证信息');
        TokenManager.clearAllTokens();
        return response;
      }

      // 如果已经重试过，不再重试
      if (originalConfig._retry) {
        TokenManager.clearAllTokens();
        return response;
      }

      // 标记为已重试
      originalConfig._retry = true;

      // 如果已经在刷新 token，则等待
      if (isRefreshing) {
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            subscribeTokenRefresh((token: string) => {
              if (token) {
                resolve(token);
              } else {
                reject(new Error('Token 刷新失败'));
              }
            });
          });

          // 更新 token 并重新发送请求
          originalConfig.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalConfig);
        } catch (refreshError) {
          TokenManager.clearAllTokens();
          return response;
        }
      }

      // 开始刷新 token
      isRefreshing = true;

      try {
        const newToken = await refreshAuthorization();

        if (newToken) {
          // 更新当前请求的 token
          originalConfig.headers['Authorization'] = `Bearer ${newToken}`;

          // 通知所有等待的请求
          onTokenRefreshed(newToken);

          // 重新发送原始请求
          return axiosInstance(originalConfig);
        } else {
          // 刷新失败，清除认证信息
          console.warn('Token 刷新失败，需要重新登录');
          TokenManager.clearAllTokens();
          onTokenRefreshed('');
          return response;
        }
      } catch (refreshError) {
        console.error('刷新 token 失败:', refreshError);
        TokenManager.clearAllTokens();
        onTokenRefreshed('');
        return response;
      } finally {
        isRefreshing = false;
      }
    }
    
    return response;
  },
);

/**
 * 默认请求选项
 */
interface RequestOptions extends Omit<AxiosRequestConfig, 'url' | 'baseURL'> {
}

/**
 * 发送 HTTP 请求
 * @param endpoint API 端点
 * @param options 请求选项
 * @returns Promise with response
 */
async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url: endpoint,
      ...options,
    });

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
  }
};

export default apiClient;
export { TokenManager, refreshAuthorization };
