'use client';
import React, { useState } from 'react';
import { List, Button, message } from 'antd';
import SidebarCard from '@/components/sidebar/sidebar-card';
import UserMeta from '@/components/molecules/user-meta';
import styles from './recommended-users.module.scss';

export interface RecommendedUser {
  id: string;
  username: string;
  avatar?: string;
  level?: number;
  bio?: string;
  isFollowing?: boolean;
}

interface RecommendedUsersProps {
  users: RecommendedUser[];
  title?: string;
  onFollow?: (userId: string, isFollowing: boolean) => Promise<void>;
}

const RecommendedUsers: React.FC<RecommendedUsersProps> = ({
  users,
  title = '推荐用户',
  onFollow
}) => {
  const [followStates, setFollowStates] = useState<Record<string, boolean>>(
    users.reduce((acc, user) => ({
      ...acc,
      [user.id]: user.isFollowing || false
    }), {})
  );

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleFollow = async (userId: string) => {
    const currentState = followStates[userId];
    
    // 设置加载状态
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    
    try {
      // 乐观更新UI
      setFollowStates(prev => ({ ...prev, [userId]: !currentState }));
      
      // 调用API
      if (onFollow) {
        await onFollow(userId, !currentState);
      }
      
      // 提示成功
      message.success(currentState ? '已取消关注' : '关注成功');
    } catch (error) {
      // 失败时恢复状态
      setFollowStates(prev => ({ ...prev, [userId]: currentState }));
      message.error('操作失败，请重试');
    } finally {
      // 清除加载状态
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <SidebarCard title={title}>
      <List
        dataSource={users}
        renderItem={(user) => (
          <List.Item className={styles.userItem}>
            <div className={styles.userInfo}>
              <UserMeta
                id={user.id}
                username={user.username}
                avatar={user.avatar}
                level={user.level}
                size="small"
              />
              {user.bio && <div className={styles.userBio}>{user.bio}</div>}
            </div>
            <Button
              size="small"
              type={followStates[user.id] ? "default" : "primary"}
              loading={loadingStates[user.id]}
              onClick={() => handleFollow(user.id)}
              className={styles.followButton}
            >
              {followStates[user.id] ? '已关注' : '关注'}
            </Button>
          </List.Item>
        )}
      />
    </SidebarCard>
  );
};

export default RecommendedUsers;
