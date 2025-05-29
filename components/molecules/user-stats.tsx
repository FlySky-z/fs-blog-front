'use client';
import React from 'react';
import StatItem from '@/components/atoms/stat-item';
import styles from './user-stats.module.scss';

export interface UserStatsData {
  followers: number;
  following: number;
  likes: number;
}

interface UserStatsProps {
  stats: UserStatsData;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

/**
 * 用户统计组件，显示粉丝数、关注数和获赞数
 */
const UserStats: React.FC<UserStatsProps> = ({
  stats,
  onFollowersClick,
  onFollowingClick
}) => {
  return (
    <div className={styles.userStatsContainer}>
      <StatItem
        value={stats.followers}
        label="粉丝"
        // onClick={onFollowersClick}
      />
      <div className={styles.divider} />
      <StatItem
        value={stats.following}
        label="关注"
        onClick={onFollowingClick}
      />
      <div className={styles.divider} />
      <StatItem
        value={stats.likes}
        label="获赞"
      />
    </div>
  );
};

export default UserStats;
