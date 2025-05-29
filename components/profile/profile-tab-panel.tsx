'use client';
import React from 'react';
import { Card, Spin, Empty, Typography, Button } from 'antd';
import ArticleItem from '@/components/profile/article-item';
import { ArticleListItem } from '@/modules/article/articleModel';
import CommentItem, { CommentItemData } from '@/components/profile/comment-item';
import CollectionItem, { CollectionItemData } from '@/components/profile/collection-item';
import UserCard, { UserCardData } from '@/components/profile/user-card';
import AccountSettings from '@/components/profile/account-settings';
import CertificationCenter from '@/components/profile/certification-center';
import styles from './profile-tab-panel.module.scss';

const { Title } = Typography;

export type TabDataType = 
  | { type: 'article'; data: ArticleListItem[] }
  | { type: 'comments'; data: CommentItemData[] }
  | { type: 'collections'; data: CollectionItemData[] }
  | { type: 'favorites'; data: ArticleListItem[] }
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
      <Card className={styles.profileTabCard}>
        {/* 为加载状态添加标题以保持一致性 */}
        <Title level={4} className={styles.tabTitle}>{title}</Title>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  // 渲染空状态 (此条件会正确处理 settings 和 certification 类型，因为它们的 data 为 null)
  if (!tabData || (Array.isArray(tabData.data) && tabData.data.length === 0)) {
    return (
      <Card className={styles.profileTabCard}>
        <Title level={4}>{title}</Title>
        <Empty
          description={`暂无${title}内容`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className={styles.emptyState}
        />
      </Card>
    );
  }

  // 根据不同类型渲染对应内容
  const renderContent = () => {
    // 前面的检查已确保 tabData 在此处已定义
    switch (tabData!.type) {
      case 'article':
        return tabData!.data.map(article => (
          <ArticleItem key={article.id} article={article} />
        ));
      case 'favorites':
        return tabData!.data.map(post => (
          <ArticleItem key={post.id} article={post} />
        ));

      case 'comments':
        return tabData!.data.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment}
            onEdit={onCommentEdit}
            onDelete={onCommentDelete}
          />
        ));

      case 'collections':
        return tabData!.data.map(collection => (
          <CollectionItem key={collection.id} collection={collection} />
        ));

      case 'followers':
        return tabData!.data.map(user => (
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
        // 处理未知的 tabData.type
        console.warn('ProfileTabPanel: Encountered unknown tabData.type:', (tabData as any)?.type);
        return <Empty description={`无法加载 "${title}" 内容，类型未知。`} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
  };

  return (
    <Card className={styles.profileTabCard}>
      <Title level={4} className={styles.tabTitle}>
        {title}
      </Title>

      <div>{renderContent()}</div>

      {hasMore && onLoadMore && (
        <div className={styles.loadMoreContainer}>
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
