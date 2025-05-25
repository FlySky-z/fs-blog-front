'use client';
import { useState, useEffect } from 'react';
import {
  getUserInfoById,
  followUser,
  isFollowingUser
} from '@/modules/user/userService';
import { userInfo } from '@/modules/user/userModel';
/**
 * 获取用户个人资料的 Hook
 */
export const useProfile = (userId: string, currentUserId: string) => {
  const [userInfo, setUserInfo] = useState<userInfo>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  // 判断是否是当前用户
  const isCurrentUser = userId === currentUserId;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const userInfo = await getUserInfoById(userId);
        const { isFollowing } = await isFollowingUser(userId);
        setUserInfo(userInfo);
        setIsFollowing(isFollowing ?? false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取用户资料失败'));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // 关注/取关
  const toggleFollowing = async () => {
    if (!userInfo || isCurrentUser || isFollowingLoading) return;
    setIsFollowingLoading(true);
    try {
      await followUser(userInfo.id, !isFollowing);
      setIsFollowing((prev) => !prev);
      setUserInfo((prev) => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          followers: isFollowing ? prev.stats.followers - 1 : prev.stats.followers + 1
        }
      } : prev);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('关注操作失败'));
    } finally {
      setIsFollowingLoading(false);
    }
  };

  return {
    userInfo,
    loading,
    error,
    isCurrentUser,
    isFollowing,
    isFollowingLoading,
    toggleFollowing
  };
};

export default useProfile;
