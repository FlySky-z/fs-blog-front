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
    // 获取用户详情的API调用
    const response = await apiClient.get<{ code: number, msg: string, data: userInfo }>(`/api/user/info/${userId}`);

    if (response.code !== 200 || !response.data) {
        throw new Error(response.msg || '获取用户信息失败');
    }
    // 处理用户信息
    const userInfo: userInfo = {
        ...response.data,
        stats: {
            followers: response.data.stats?.followers || 0,
            following: response.data.stats?.following || 0,
            likes: response.data.stats?.likes || 0
        }
    };
    response.data = userInfo;
    return response.data;
}

/**
 * 关注/取关用户
 * @param userId 用户ID
 * @param follow true为关注，false为取关
 */
export async function followUser(userId: number, follow: boolean): Promise<void> {
    const response = await apiClient.post<{ code: number; msg: string }>(
        '/api/user/follow',
        { user_id: userId, follow }
    );
    if (response.code !== 200) {
        throw new Error(response.msg || (follow ? '关注失败' : '取关失败'));
    }
}

export const userService = new UserService();

/**
 * TODO: 获取是否关注用户
 * @param userId 用户ID
 * @returns 是否关注
 */
export async function isFollowingUser(userId: string): Promise<{isFollowing: boolean}> {
    // mock 数据
    const response = {
        code: 200,
        msg: 'success',
        data: {
            isFollowing: false
        }
    }
    // const response = await apiClient.get<{ code: number, msg: string, data: {isFollowing: boolean} }>(`/api/user/isFollowing/${userId}`);
    if (response.code !== 200) {
        // 没有处理错误
        console.error(response.msg || '获取关注状态失败');
        return { isFollowing: false };
    }
    return response.data;
}

/**
 * TODO: 获取用户的关注列表
 * @param userId 用户ID
 * @returns 关注列表
 */
export async function getFollowingList(userId: string): Promise<userInfo[]> {
    // mock 数据
    const response = {
        code: 200,
        msg: 'success',
        data: [
            {
                id: '1',
                username: 'user1',
                avatar: 'https://example.com/avatar1.jpg',
                stats: {
                    followers: 100,
                    following: 50,
                    likes: 10
                }
            },
            {
                id: '2',
                username: 'user2',
                avatar: 'https://example.com/avatar2.jpg',
                stats: {
                    followers: 200,
                    following: 100,
                    likes: 20
                }
            }
        ]
    }
    // const response = await apiClient.get<{ code: number, msg: string, data: userInfo[] }>(`/api/user/following/${userId}`);
    if (response.code !== 200) {
        throw new Error(response.msg || '获取关注列表失败');
    }
    return response.data;
}

