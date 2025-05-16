'use client';
import { useState, useEffect } from 'react';
import { ProfileUser } from '@/components/profile/avatar-header';

/**
 * 获取用户个人资料的 Hook
 */
export const useProfile = (userId: string) => {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 模拟关注/取消关注
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 这里应该调用真实 API
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();
        
        // 模拟 API 响应
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟用户数据
        const isCurrentUser = userId === 'current-user';
        const mockUser: ProfileUser = {
          id: userId,
          username: isCurrentUser ? '当前用户' : `用户${userId.slice(0, 4)}`,
          avatarUrl: `https://api.dicebear.com/7.x/miniavs/svg?seed=${userId}`,
          bio: '这是一个简短的个人介绍，用来展示我的兴趣爱好和专业领域。',
          level: Math.floor(Math.random() * 5) + 1,
          tags: [
            { id: '1', name: 'Front-end', color: 'blue' },
            { id: '2', name: 'React', color: 'green' },
            { id: '3', name: 'TypeScript', color: 'magenta' }
          ],
          location: '北京',
          isCurrentUser,
          isFollowing: !isCurrentUser && Math.random() > 0.5,
          stats: {
            followers: Math.floor(Math.random() * 5000),
            following: Math.floor(Math.random() * 500),
            likes: Math.floor(Math.random() * 10000)
          }
        };
        
        setUser(mockUser);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取用户资料失败'));
        console.error('获取用户资料失败:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);
  
  // 模拟关注/取消关注功能
  const toggleFollowing = async () => {
    if (!user || user.isCurrentUser || isFollowingLoading) return;
    
    setIsFollowingLoading(true);
    
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 更新状态
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isFollowing: !prev.isFollowing,
          stats: {
            ...prev.stats,
            followers: prev.isFollowing 
              ? prev.stats.followers - 1 
              : prev.stats.followers + 1
          }
        };
      });
    } catch (err) {
      console.error('关注操作失败:', err);
    } finally {
      setIsFollowingLoading(false);
    }
  };
  
  return {
    user,
    loading,
    error,
    isFollowingLoading,
    toggleFollowing
  };
};

export default useProfile;
