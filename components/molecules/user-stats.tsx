'use client';
import React from 'react';
import StatItem from '@/components/atoms/stat-item';

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
    <div className="flex items-center">
      <StatItem
        value={stats.followers}
        label="粉丝"
        onClick={onFollowersClick}
      />
      <div className="h-10 w-px bg-gray-200 mx-2" />
      <StatItem
        value={stats.following}
        label="关注"
        onClick={onFollowingClick}
      />
      <div className="h-10 w-px bg-gray-200 mx-2" />
      <StatItem
        value={stats.likes}
        label="获赞"
      />
    </div>
  );
};

export default UserStats;
