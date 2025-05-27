'use client';

import { apiClient, TokenManager } from '@/utils/apiClient';
import {
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
    CaptchaGetResponse,
    CaptchaCheckResponse,
    CheckEmailResponse,
    CheckUsernameResponse
} from './authModel';
import { useUserStore } from '@/store/userStore';


/**
 * 认证服务
 * 处理登录、注册、登出、token 管理等认证相关操作
 */
class AuthService {
    /**
     * 用户登录
     * @param params 登录参数
     * @returns 登录响应
     */
    async login(params: LoginRequest): Promise<LoginResponse> {
        if (!params.username && !params.email && !params.phone) {
            throw new Error('用户名、邮箱或手机号不能为空');
        }

        const loginRequest: LoginRequest = {
            username: params.username || params.email || params.phone || '',
            password: params.password
        };

        // 发送登录请求
        const apiResponse = await apiClient.post<LoginResponse>('/api/auth/login', loginRequest);

        if (apiResponse.code !== 200 || !apiResponse.data?.id) {
            throw new Error(apiResponse.msg || '登录失败');
        }

        return apiResponse;
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
            TokenManager.clearAllTokens();

            return response.code === 200;
        } catch (error) {
            console.error('Logout API call failed, but proceeding with local logout:', error);
            // 清除本地会话
            TokenManager.clearAllTokens();
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
        const response = await apiClient.get<CheckUsernameResponse>(
            `/api/user/check_username/${encodeURIComponent(username)}`
        );

        return response.code === 200;
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
