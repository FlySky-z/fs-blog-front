'use client';
import React from 'react';
import { Card, Typography, Divider, Image, Space } from 'antd';
import UserMeta from '@/components/molecules/user-meta';
import ArticleActions from '@/components/molecules/article-actions';

const { Title, Paragraph } = Typography;

export interface ArticleContent {
  type: 'text' | 'image' | 'video';
  content: string;
  caption?: string;
}

export interface ArticleDetailCardProps {
  id: string;
  title: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    level?: number;
  };
  publishedAt: string;
  content: ArticleContent[];
  likeCount: number;
  favoriteCount: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  onLike?: (id: string, liked: boolean) => Promise<void>;
  onFavorite?: (id: string, favorited: boolean) => Promise<void>;
  onShare?: (id: string) => void;
  onReport?: (id: string, reason: string) => Promise<void>;
}

const ArticleDetailCard: React.FC<ArticleDetailCardProps> = ({
  id,
  title,
  author,
  publishedAt,
  content,
  likeCount,
  favoriteCount,
  isLiked,
  isFavorited,
  onLike,
  onFavorite,
  onShare,
  onReport,
}) => {
  // 将发布时间格式化为可读形式
  const formattedDate = new Date(publishedAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // 渲染文章内容（文本、图片、视频等）
  const renderContent = () => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'text':
          return (
            <Paragraph key={index} style={{ fontSize: '16px', lineHeight: '1.8' }}>
              {item.content}
            </Paragraph>
          );
        case 'image':
          return (
            <div key={index} style={{ margin: '16px 0' }}>
              <Image
                src={item.content}
                alt={item.caption || `图片${index + 1}`}
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
              {item.caption && (
                <div style={{ textAlign: 'center', color: '#666', margin: '8px 0' }}>
                  {item.caption}
                </div>
              )}
            </div>
          );
        case 'video':
          return (
            <div key={index} style={{ margin: '16px 0' }}>
              <video
                src={item.content}
                controls
                style={{ width: '100%', borderRadius: '8px' }}
                poster={`/thumbnails/${id}-${index}.jpg`} // 假设有视频缩略图
              />
              {item.caption && (
                <div style={{ textAlign: 'center', color: '#666', margin: '8px 0' }}>
                  {item.caption}
                </div>
              )}
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <Card
      style={{ marginBottom: 24 }}
      bodyStyle={{ padding: '24px' }}
      className="article-detail-card"
    >
      {/* 文章头部：标题 */}
      <Title level={1} style={{ marginTop: 0, marginBottom: 16 }}>
        {title}
      </Title>

      {/* 用户信息 */}
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <UserMeta
            id={author.id}
            username={author.username}
            avatar={author.avatar}
            level={author.level}
            createdAt={formattedDate}
            showTime={true}
            size="default"
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* 文章内容 */}
        <div className="article-content">
          {renderContent()}
        </div>

        <Divider style={{ margin: '24px 0 16px' }} />

        {/* 文章操作区 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ArticleActions
            articleId={id}
            likeCount={likeCount}
            favoriteCount={favoriteCount}
            isLiked={isLiked}
            isFavorited={isFavorited}
            onLike={onLike}
            onFavorite={onFavorite}
            onShare={onShare}
            onReport={onReport}
          />
        </div>
      </Space>
    </Card>
  );
};

export default ArticleDetailCard;
