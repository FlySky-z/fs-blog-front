'use client';

import { apiClient } from '@/utils/apiClient';
import { API_BASE_URL } from '@/config/env';
import {
    LoginRequest,
    LoginResponse as ApiLoginResponse,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
    CaptchaGetResponse,
    CaptchaCheckResponse,
    CheckEmailResponse,
    CheckUsernameResponse
} from './authModel';

// 本地存储键名
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

/**
 * 用户信息接口
 */
export interface UserInfo {
    id: string;
    username: string;
    email?: string;
    phone?: string;
    avatar?: string;
    [key: string]: any;
}

/**
 * 登录请求参数接口
 */
export interface LoginParams {
    username?: string;
    email?: string;
    phone?: string;
    password: string;
    loginMethod: 'username' | 'email' | 'phone';
}

/**
 * 登录响应接口 (客户端使用)
 */
export interface UserLoginResponse {
    user: UserInfo;
    token: string; // JWT Token
}

/**
 * 认证服务
 * 处理登录、注册、登出、token 管理等认证相关操作
 */
class AuthService {
    private token: string | null = null;
    private user: UserInfo | null = null;

    constructor() {
        // 从本地存储加载 token 和用户信息
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem(TOKEN_KEY);
            const userJson = localStorage.getItem(USER_KEY);
            if (userJson) {
                try {
                    this.user = JSON.parse(userJson);
                } catch (e) {
                    console.error('Failed to parse user info from local storage');
                }
            }
        }

        // 设置 axios 拦截器，自动添加 token
        this.setupInterceptors();
    }

    /**
     * 配置请求拦截器，自动给请求添加 token
     */
    private setupInterceptors() {
        // 添加请求拦截器到 axios 实例
        apiClient.setRequestInterceptor((config) => {
            // 如果有 token，则添加到请求头
            if (this.token) {
                config.headers.set('Authorization', `Bearer ${this.token}`);
            }
            return config;
        });
    }

    /**
     * 用户登录
     * @param params 登录参数
     * @returns 登录响应
     */
    async login(params: LoginParams): Promise<UserLoginResponse> {
        try {
            // 构建后端API所需的请求参数
            const loginRequest: LoginRequest = {
                username: params.username || '',
                password: params.password
            };

            // 发送登录请求
            const apiResponse = await apiClient.post<ApiLoginResponse>('/api/auth/login', loginRequest);

            if (apiResponse.code !== 200 || !apiResponse.data?.id) {
                throw new Error(apiResponse.msg || '登录失败');
            }

            // 生成token(假设JWT token在客户端生成或从响应中获取)
            const token = localStorage.getItem("token") || "";

            // 设置请求拦截器，自动添加 token
            apiClient.setRequestInterceptor((config) => {
                // 如果有 token，则添加到请求头
                if (token) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                }
                return config;
            });

            // 获取用户信息
            const userInfo: UserInfo = await this.getUserInfoById(apiResponse.data.id);

            // 构建客户端使用的响应格式
            const clientResponse: UserLoginResponse = {
                user: userInfo,
                token: token
            };

            // 保存 token 和用户信息
            this.setSession(token, userInfo);

            return clientResponse;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    /**
     * 根据用户ID获取用户详细信息
     * @param userId 用户ID
     * @returns 用户详情
     */
    private async getUserInfoById(userId: string): Promise<UserInfo> {
        try {
            // 获取用户详情的API调用
            const response = await apiClient.get<{ code: number, msg: string, data: UserInfo }>(`/api/user/info/${userId}`);

            if (response.code !== 200 || !response.data) {
                throw new Error(response.msg || '获取用户信息失败');
            }

            return response.data;
        } catch (error) {
            console.error('Failed to get user info:', error);
            throw error;
        }
    }

    /**
     * 设置会话信息（token 和用户信息）
     * @param token JWT Token
     * @param user 用户信息
     */
    private setSession(token: string, user: UserInfo) {
        this.token = token;
        this.user = user;

        // 保存到本地存储
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    }

    /**
     * 清除会话信息
     */
    private clearSession() {
        this.token = null;
        this.user = null;

        // 从本地存储中移除
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    }

    /**
     * 用户登出
     * @returns 登出结果
     */
    async logout(): Promise<boolean> {
        try {
            // 调用登出接口
            const response = await apiClient.get<LogoutResponse>('/api/user/logout');

            // 无论API调用成功与否，都清除本地会话
            this.clearSession();

            return response.code === 200;
        } catch (error) {
            console.error('Logout API call failed, but proceeding with local logout:', error);
            // 清除本地会话
            this.clearSession();
            return false;
        }
    }

    /**
     * 检查用户是否已登录
     * @returns 是否已登录
     */
    isAuthenticated(): boolean {
        return !!this.token;
    }

    /**
     * 获取当前用户信息
     * @returns 用户信息，如未登录则返回 null
     */
    getCurrentUser(): UserInfo | null {
        return this.user;
    }

    /**
     * 获取当前 token
     * @returns JWT token，如未登录则返回 null
     */
    getToken(): string | null {
        return this.token;
    }

    /**
     * 刷新 token
     * 使用 refreshToken（保存在 cookie 中）获取新的 access token
     */
    async refreshToken(): Promise<boolean> {
        try {
            // 调用刷新 token 接口
            // refreshToken 应该已经在 cookie 中，会自动发送
            const response = await apiClient.post<{ code: number, msg: string, data: { token: string } }>('/api/auth/refresh');

            if (response.code === 200 && response.data?.token) {
                // 只更新 token，保留原有用户信息
                if (typeof window !== 'undefined') {
                    localStorage.setItem(TOKEN_KEY, response.data.token);
                }
                this.token = response.data.token;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            // 刷新失败，可能需要重新登录
            this.clearSession();
            return false;
        }
    }

    /**
     * 用户注册
     * @param params 注册参数
     * @returns 注册结果
     */
    async register(params: RegisterRequest): Promise<boolean> {
        try {
            // 发送注册请求
            const response = await apiClient.post<RegisterResponse>('/api/auth/register', params);

            if (response.code !== 200) {
                throw new Error(response.msg || '注册失败');
            }

            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    /**
     * 获取验证码
     * @returns 验证码信息
     */
    async getCaptcha(): Promise<CaptchaGetResponse['data']> {
        try {
            const response = await apiClient.get<CaptchaGetResponse>('/api/captcha/get');

            if (response.code !== 200 || !response.data) {
                throw new Error(response.msg || '获取验证码失败');
            }

            return response.data;
        } catch (error) {
            console.error('Failed to get captcha:', error);
            throw error;
        }
    }

    /**
     * 验证验证码
     * @param captchaId 验证码ID (对应API中的cid)
     * @param xPosition 用户滑动后的X轴位置 (对应API中的x)
     * @returns 是否验证成功
     */
    async checkCaptcha(captchaId: string, xPosition: number, userID: string): Promise<boolean> {
        try {
            // 根据OpenAPI规范，端点是/api/captcha/check/${userID}/{cid}/{x}
            // 其中cid是滑块验证码ID，x是用户滑动后的X轴位置
            console.log('Checking captcha:', { userID, captchaId, xPosition });
            const response = await apiClient.get<CaptchaCheckResponse>(`/api/captcha/check/${userID}/${captchaId}/${xPosition}`);

            // 根据OpenAPI规范，成功响应码为200
            if (response && response.code === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Captcha verification failed:', error);
            return false;
        }
    }

    /**
     * 检查用户名是否可用
     * @param username 用户名
     * @returns 是否可用
     */
    async checkUsername(username: string): Promise<boolean> {
        try {
            const response = await apiClient.get<CheckUsernameResponse>(
                `/api/user/check_username/${encodeURIComponent(username)}`
            );

            return response.code === 200;
        } catch (error) {
            console.error('Username check failed:', error);
            return false;
        }
    }

    /**
     * 检查邮箱是否可用
     * @param email 邮箱
     * @returns 是否可用
     */
    async checkEmail(email: string): Promise<boolean> {
        try {
            const response = await apiClient.get<CheckEmailResponse>(
                `/api/user/check_email/${encodeURIComponent(email)}`
            );

            return response.code === 200;
        } catch (error) {
            console.error('Email check failed:', error);
            return false;
        }
    }
}

// 创建单例实例
export const authService = new AuthService();

export default authService;
