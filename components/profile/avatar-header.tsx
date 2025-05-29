'use client';
import React from 'react';
import { Avatar, Typography, Button, Card } from 'antd';
import { EditOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import TagBadge from '@/components/atoms/tag-badge';
import UserStats from '@/components/molecules/user-stats';
import styles from './avatar-header.module.scss';
import { userInfo } from '@/modules/user/userModel';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;


interface AvatarHeaderProps {
  user: userInfo;
  isCurrentUser: boolean;
  isFollowingLoading?: boolean;
  onEditProfile?: () => void;
  onToggleFollow?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

const AvatarHeader: React.FC<AvatarHeaderProps> = ({
  user,
  isCurrentUser,
  isFollowingLoading,
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
            src={user.avatar_url}
            icon={!user.avatar_url ? <UserOutlined /> : null}
            size={80}
            alt={user.username}
          />

          {/* 用户信息 */}
          <div className={styles.userDetails}>
            <div className={styles.userTitleContainer}>
              <Title level={4} className={styles.userTitle}>
                {user.username}
              </Title>
              <TagBadge level={1} type="level" />  
              <Text type="secondary" className={styles.userId}>
                @{user.id}
              </Text>
            </div>

            {/* 个性签名 */}
            <Text className={styles.userBio}>
              {user.abstract || '这个人很懒，还没有填写个人简介'}
            </Text>
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
            {isCurrentUser ? (
              <Button
                icon={<EditOutlined />}
                type="default"
                onClick={onEditProfile}
              >
                编辑资料
              </Button>
            ) : (
              <Button
                icon={isFollowingLoading ? <UserDeleteOutlined /> : <UserAddOutlined />}
                type={isFollowingLoading ? 'default' : 'primary'}
                onClick={onToggleFollow}
              >
                {isFollowingLoading ? '已关注' : '关注'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AvatarHeader;
