'use client';
import React from 'react';
import { Card, Avatar, Typography, Button } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import TagBadge from '@/components/atoms/tag-badge';
import styles from './user-card.module.scss';

const { Text, Paragraph } = Typography;

export interface UserCardData {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  bio?: string;
  isFollowing: boolean;
}

interface UserCardProps {
  user: UserCardData;
  onToggleFollow: (userId: string, isFollowing: boolean) => void;
  loading?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onToggleFollow,
  loading = false
}) => {
  return (
    <Card className={styles.userCard}>
      <div className={styles.cardContainer}>
        <div className={styles.userInfoContainer}>
          <Link href={`/accountCenter?userId=${user.id}`} className={styles.avatarLink}>
            <Avatar 
              src={user.avatarUrl} 
              size={48}
              alt={user.username}
            />
          </Link>
          
          <div className={styles.userDetails}>
            <div className={styles.userHeader}>
              <Link 
                href={`/accountCenter?userId=${user.id}`}
                className={styles.usernameLink}
              >
                <Text strong className={styles.username}>
                  {user.username}
                </Text>
              </Link>
              <TagBadge level={user.level} type="level" className={styles.tagBadge} />
            </div>
            
            {user.bio && (
              <Paragraph 
                ellipsis={{ rows: 1 }} 
                className={styles.userBio}
              >
                {user.bio}
              </Paragraph>
            )}
          </div>
        </div>
        
        <Button
          icon={user.isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
          type={user.isFollowing ? 'default' : 'primary'}
          size="small"
          onClick={() => onToggleFollow(user.id, !user.isFollowing)}
          loading={loading}
          className={styles.followButton}
        >
          {user.isFollowing ? '已关注' : '关注'}
        </Button>
      </div>
    </Card>
  );
};

export default UserCard;
