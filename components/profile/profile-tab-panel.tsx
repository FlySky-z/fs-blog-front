'use client';
import React from 'react';
import { Card, Spin, Empty, Typography, Button } from 'antd';
import ArticleItem, { ArticleItemData } from '@/components/profile/article-item';
import CommentItem, { CommentItemData } from '@/components/profile/comment-item';
import CollectionItem, { CollectionItemData } from '@/components/profile/collection-item';
import UserCard, { UserCardData } from '@/components/profile/user-card';
import AccountSettings from '@/components/profile/account-settings';
import CertificationCenter from '@/components/profile/certification-center';

const { Title } = Typography;

export type TabDataType = 
  | { type: 'posts'; data: ArticleItemData[] }
  | { type: 'comments'; data: CommentItemData[] }
  | { type: 'collections'; data: CollectionItemData[] }
  | { type: 'favorites'; data: ArticleItemData[] }
  | { type: 'followers'; data: UserCardData[] }
  | { type: 'settings'; data: null }
  | { type: 'certification'; data: null };

interface ProfileTabPanelProps {
  title: string;
  loading?: boolean;
  tabData?: TabDataType;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLoading?: boolean;
  onCommentEdit?: (commentId: string) => void;
  onCommentDelete?: (commentId: string) => void;
  onToggleFollow?: (userId: string, isFollowing: boolean) => void;
  followLoading?: Record<string, boolean>;
}

const ProfileTabPanel: React.FC<ProfileTabPanelProps> = ({
  title,
  loading = false,
  tabData,
  hasMore = false,
  onLoadMore,
  loadMoreLoading = false,
  onCommentEdit,
  onCommentDelete,
  onToggleFollow,
  followLoading = {},
}) => {
  // 渲染加载状态
  if (loading) {
    return (
      <Card className="w-full">
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  // 渲染空状态
  if (!tabData || (Array.isArray(tabData.data) && tabData.data.length === 0)) {
    return (
      <Card className="w-full">
        <Title level={4}>{title}</Title>
        <Empty
          description={`暂无${title}内容`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '40px 0' }}
        />
      </Card>
    );
  }

  // 根据不同类型渲染对应内容
  const renderContent = () => {
    if (!tabData) return null;

    switch (tabData.type) {
      case 'posts':
      case 'favorites':
        return tabData.data.map(post => (
          <ArticleItem key={post.id} article={post} />
        ));

      case 'comments':
        return tabData.data.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment}
            onEdit={onCommentEdit}
            onDelete={onCommentDelete}
          />
        ));

      case 'collections':
        return tabData.data.map(collection => (
          <CollectionItem key={collection.id} collection={collection} />
        ));

      case 'followers':
        return tabData.data.map(user => (
          <UserCard 
            key={user.id} 
            user={user}
            onToggleFollow={onToggleFollow || (() => {})}
            loading={followLoading?.[user.id]}
          />
        ));

      case 'settings':
        return <AccountSettings />;
        
      case 'certification':
        return <CertificationCenter />;

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <Title level={4} style={{ marginBottom: '24px' }}>
        {title}
      </Title>

      <div>{renderContent()}</div>

      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-4">
          <Button 
            onClick={onLoadMore} 
            loading={loadMoreLoading}
          >
            加载更多
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProfileTabPanel;
