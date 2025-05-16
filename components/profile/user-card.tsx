'use client';
import React from 'react';
import { Card, Avatar, Typography, Button } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import TagBadge from '@/components/atoms/tag-badge';

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
    <Card className="w-full mb-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/accountCenter?userId=${user.id}`}>
            <Avatar 
              src={user.avatarUrl} 
              size={48}
              alt={user.username}
            />
          </Link>
          
          <div className="ml-3">
            <div className="flex items-center">
              <Link 
                href={`/accountCenter?userId=${user.id}`}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <Text strong className="hover:text-blue-500 transition-colors">
                  {user.username}
                </Text>
              </Link>
              <TagBadge level={user.level} type="level" className="ml-2" />
            </div>
            
            {user.bio && (
              <Paragraph 
                ellipsis={{ rows: 1 }} 
                style={{ 
                  margin: '4px 0 0', 
                  fontSize: '13px', 
                  color: 'rgba(0, 0, 0, 0.45)',
                  maxWidth: '200px'
                }}
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
        >
          {user.isFollowing ? '已关注' : '关注'}
        </Button>
      </div>
    </Card>
  );
};

export default UserCard;
