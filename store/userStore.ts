// store/userStore.ts
import { create } from 'zustand';
import { TokenManager } from '@/utils/tokenManager';
import authService from '@/modules/auth/authService';
import { userInfo } from '@/modules/user/userModel';
import { getUserInfoById } from '@/modules/user/userService';
import { refreshAuthorization } from '@/utils/apiClient';


interface UserState {
    // 认证状态
    isLoggedIn: boolean;
    isInitializing: boolean;

    // 用户信息
    userInfo?: userInfo | null;

    // 模态框状态（如果需要保留）
    currentTab?: string;

    // 方法
    initializeAuth: () => Promise<void>;
    login: (userId: string) => void;
    logout: () => void;
    setUserInfo: (info: userInfo) => void;

    // 模态框方法（如果需要保留）
    openTabModal: (tab: string) => void;
    closeTabModal: () => void;
}




export const useUserStore = create<UserState>((set, get) => ({
    // 初始状态
    isLoggedIn: false,
    isInitializing: true,
    userId: null,
    username: null,
    currentTab: undefined,

    // 初始化认证状态
    initializeAuth: async () => {

        try {

            const token = TokenManager.getAccessToken();

            if (!token) {
                // 没有token，设置为未登录状态
                set({
                    isLoggedIn: false,
                    isInitializing: false,
                });
                return;
            }

            // 尝试刷新token
            try {
                const refreshResult = await refreshAuthorization();

                if (refreshResult != null) {
                    // 刷新成功
                    var jwtPayload = TokenManager.extractUserInfoFromToken(refreshResult);
                    if (!jwtPayload) {
                        throw new Error('无效的JWT');
                    }
                    var userinfo = await getUserInfoById(jwtPayload.uid);
                    set({
                        isLoggedIn: true,
                        isInitializing: false,
                        userInfo: userinfo,
                    });
                } else {
                    // 刷新失败，清理状态
                    TokenManager.clearAllTokens();
                    set({
                        isLoggedIn: false,
                        isInitializing: false,
                        userInfo: null
                    });
                    console.warn('登录已过期，请重新登录');
                }
            } catch (error) {
                console.error('初始化认证失败:', error);
                TokenManager.clearAllTokens();
                set({
                    isLoggedIn: false,
                    isInitializing: false,
                    userInfo: null
                });
            }
        } finally {
        }
    },

    // 登录
    login: (userId: string) => {
        // 获取用户信息
        getUserInfoById(userId)
            .then((userInfo) => {
                set({ userInfo });
            })
            .catch((error) => {
                console.error('获取用户信息失败:', error);
            });
        

        set({
            isLoggedIn: true,
            isInitializing: false,
        });
    },

    // 登出
    logout: () => {
        TokenManager.clearAllTokens();
        set({
            isLoggedIn: false,
            isInitializing: false,
            userInfo: null,
        });
    },

    // 设置用户信息
    setUserInfo: (info: userInfo) => {
        set({ userInfo: info });
    },

    // 模态框方法（保留原有功能）
    openTabModal: (tab: string) => {
        set({ currentTab: tab });
    },

    closeTabModal: () => {
        set({ currentTab: undefined });
    },
}));