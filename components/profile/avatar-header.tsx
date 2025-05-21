'use client';
import React from 'react';
import { Avatar, Typography, Button, Space, Card } from 'antd';
import { EditOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import TagBadge from '@/components/atoms/tag-badge';
import UserStats, { UserStatsData } from '@/components/molecules/user-stats';
import styles from './avatar-header.module.scss';

const { Title, Text } = Typography;

export interface ProfileUser {
  id: string;
  username: string;
  avatarUrl: string;
  bio?: string;
  level: number;
  tags?: Array<{id: string; name: string; color?: string}>;
  location?: string;
  isCurrentUser: boolean;
  isFollowing?: boolean;
  stats: UserStatsData;
}

interface AvatarHeaderProps {
  user: ProfileUser;
  onEditProfile?: () => void;
  onToggleFollow?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

const AvatarHeader: React.FC<AvatarHeaderProps> = ({
  user,
  onEditProfile,
  onToggleFollow,
  onFollowersClick,
  onFollowingClick
}) => {
  return (
    <Card className={styles.avatarHeaderCard}>
      <div className={styles.avatarHeaderContainer}>
        <div className={styles.userInfoContainer}>
          {/* 头像 */}
          <Avatar 
            src={user.avatarUrl} 
            size={80}
            alt={user.username}
          />
          
          {/* 用户信息 */}
          <div className={styles.userDetails}>
            <div className={styles.userTitleContainer}>
              <Title level={4} className={styles.userTitle}>
                {user.username}
              </Title>
              <TagBadge level={user.level} type="level" />
              <Text type="secondary" className={styles.userId}>
                @{user.id}
              </Text>
            </div>
            
            {/* 个性签名 */}
            <Text className={styles.userBio}>
              {user.bio || '这个人很懒，还没有填写个人简介'}
            </Text>
            
            {/* 标签 */}
            <div className={styles.userTagsContainer}>
              <Space size={[8, 8]} wrap>
                {user.tags?.map(tag => (
                  <TagBadge key={tag.id} text={tag.name} color={tag.color} />
                ))}
                {user.location && (
                  <TagBadge type="location" text={user.location} />
                )}
              </Space>
            </div>
          </div>
        </div>
        
        {/* 统计与操作按钮 */}
        <div className={styles.userActionsContainer}>
          <UserStats 
            stats={user.stats}
            onFollowersClick={onFollowersClick}
            onFollowingClick={onFollowingClick}
          />
          
          <div className={styles.actionButtonContainer}>
            {user.isCurrentUser ? (
              <Button 
                icon={<EditOutlined />} 
                type="default"
                onClick={onEditProfile}
              >
                编辑资料
              </Button>
            ) : (
              <Button
                icon={user.isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
                type={user.isFollowing ? 'default' : 'primary'}
                onClick={onToggleFollow}
              >
                {user.isFollowing ? '已关注' : '关注'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AvatarHeader;
