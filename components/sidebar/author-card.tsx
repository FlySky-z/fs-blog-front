'use client';
import React from 'react';
import { Button, Statistic } from 'antd';
import { UserOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import SidebarCard from './sidebar-card';
import UserMeta from '@/components/molecules/user-meta';
import Link from 'next/link';
import styles from './author-card.module.scss';

export interface AuthorCardProps {
  id: string;
  username: string;
  avatar?: string;
  level?: number;
  bio?: string;
  followingCount: number;
  followerCount: number;
  likeCount: number;
  isFollowing?: boolean;
  onFollow?: (id: string, isFollowing: boolean) => Promise<void>;
}

const AuthorCard: React.FC<AuthorCardProps> = ({
  id,
  username,
  avatar,
  level = 1,
  bio,
  followingCount,
  followerCount,
  likeCount,
  isFollowing = false,
  onFollow,
}) => {
  const [following, setFollowing] = React.useState(isFollowing);
  const [followLoading, setFollowLoading] = React.useState(false);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (onFollow) {
        await onFollow(id, !following);
      }
      setFollowing(!following);
    } catch (error) {
      console.error('关注操作失败', error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <SidebarCard className="author-card">
      <div style={{ marginBottom: 16 }}>
        <Link 
          href={`/accountCenter?tab=article&userId=${id}`}
          className={styles.authorLink}
        >
          <UserMeta
            id={id}
            username={username}
            avatar={avatar}
            level={level}
            size="large"
          />
        </Link>
      </div>

      {bio && (
        <div style={{ margin: '12px 0', color: '#666' }}>
          {bio}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        margin: '16px 0',
        textAlign: 'center'
      }}>
        <Statistic 
          title="关注" 
          value={followingCount} 
          prefix={<EyeOutlined />} 
          valueStyle={{ fontSize: '16px' }}
        />
        <Statistic 
          title="粉丝" 
          value={followerCount} 
          prefix={<UserOutlined />}
          valueStyle={{ fontSize: '16px' }}
        />
        <Statistic 
          title="获赞" 
          value={likeCount} 
          prefix={<LikeOutlined />}
          valueStyle={{ fontSize: '16px' }}
        />
      </div>

      <Button 
        type={following ? "default" : "primary"} 
        block 
        onClick={handleFollow}
        loading={followLoading}
      >
        {following ? '已关注' : '+ 关注'}
      </Button>
    </SidebarCard>
  );
};

export default AuthorCard;
