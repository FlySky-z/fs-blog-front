import { apiClient } from '@/utils/apiClient';
import { userInfo } from './userModel';
import { use } from 'react';


/**
 * 根据用户ID获取用户详细信息
 * @param userId 用户ID
 * @returns 用户详情
 */

class UserService {
    /**
     * 获取用户信息
     * @param userId 用户ID
     * @returns 用户信息
     */
    async getUserInfoById(userId: string): Promise<userInfo> {
        return getUserInfoById(userId);
    }
}

export async function getUserInfoById(userId: string): Promise<userInfo> {
    try {
        // 获取用户详情的API调用
        const response = await apiClient.get<{ code: number, msg: string, data: userInfo }>(`/api/user/info/${userId}`);

        if (response.code !== 200 || !response.data) {
            throw new Error(response.msg || '获取用户信息失败');
        }

        return response.data;
    } catch (error) {
        console.error('Failed to get user info:', error);
        throw error;
    }
}

export const userService = new UserService();
