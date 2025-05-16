'use client';
import React from 'react';
import { Space, Avatar, Typography, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface UserMetaProps {
  id: string;
  username: string;
  avatar?: string;
  level?: number;
  createdAt?: string;
  showTime?: boolean;
  size?: 'small' | 'default' | 'large';
}

const UserMeta: React.FC<UserMetaProps> = ({
  username,
  avatar,
  level = 1,
  createdAt,
  showTime = false,
  size = 'default',
}) => {
  // 头像大小根据size属性调整
  const avatarSize = size === 'large' ? 48 : size === 'small' ? 24 : 36;
  
  return (
    <Space align="center" size={8}>
      <Avatar
        size={avatarSize}
        src={avatar}
        icon={!avatar ? <UserOutlined /> : undefined}
        alt={username}
      />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text strong style={{ fontSize: size === 'small' ? 14 : 16 }}>
            {username}
          </Text>
          <Tag color="blue" style={{ margin: 0, lineHeight: '16px' }}>
            Lv.{level}
          </Tag>
        </div>
        {showTime && createdAt && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {createdAt}
          </Text>
        )}
      </div>
    </Space>
  );
};

export default UserMeta;
