'use client';
import React from 'react';
import { Avatar, Typography, Button, Space, Card } from 'antd';
import { EditOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import TagBadge from '@/components/atoms/tag-badge';
import UserStats, { UserStatsData } from '@/components/molecules/user-stats';

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
    <Card className="w-full mb-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex items-start">
          {/* 头像 */}
          <Avatar 
            src={user.avatarUrl} 
            size={80}
            alt={user.username}
          />
          
          {/* 用户信息 */}
          <div className="ml-4">
            <div className="flex items-center">
              <Title level={4} style={{ margin: 0, marginRight: '8px' }}>
                {user.username}
              </Title>
              <TagBadge level={user.level} type="level" />
              <Text type="secondary" className="ml-2">
                @{user.id}
              </Text>
            </div>
            
            {/* 个性签名 */}
            <Text
              style={{ 
                margin: '8px 0', 
                display: 'block',
                color: 'rgba(0, 0, 0, 0.65)',
                maxWidth: '600px'
              }}
            >
              {user.bio || '这个人很懒，还没有填写个人简介'}
            </Text>
            
            {/* 标签 */}
            <div className="flex flex-wrap mt-2 mb-2">
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
        <div className="flex flex-col items-center md:items-end justify-between mt-4 md:mt-0">
          <UserStats 
            stats={user.stats}
            onFollowersClick={onFollowersClick}
            onFollowingClick={onFollowingClick}
          />
          
          <div className="mt-4">
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
