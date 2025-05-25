'use client';
import React from 'react';
import { Card, Typography, Divider, Image, Space } from 'antd';
import UserMeta from '@/components/molecules/user-meta';
import ArticleActions from '@/components/molecules/article-actions';
import styles from './article-detail-card.module.scss';

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
            <Paragraph key={index} className={styles.textParagraph}>
              {item.content}
            </Paragraph>
          );
        case 'image':
          return (
            <div key={index} className={styles.mediaContainer}>
              <Image
                src={item.content}
                alt={item.caption || `图片${index + 1}`}
                className={styles.imageContent}
              />
              {item.caption && (
                <div className={styles.captionText}>
                  {item.caption}
                </div>
              )}
            </div>
          );
        case 'video':
          return (
            <div key={index} className={styles.mediaContainer}>
              <video
                src={item.content}
                controls
                className={styles.videoContent}
                poster={`/thumbnails/${id}-${index}.jpg`} // 假设有视频缩略图
              />
              {item.caption && (
                <div className={styles.captionText}>
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
      className={styles.articleCard}
    >
      <div className={styles.cardBody}>
        {/* 文章头部：标题 */}
        <Title level={1} className={styles.articleTitle}>
          {title}
        </Title>

        {/* 用户信息 */}
        <Space direction="vertical" size={16} className={styles.contentWrapper}>
          <div className={styles.userInfoContainer}>
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

          <Divider className={styles.dividerNormal} />

          {/* 文章内容 */}
          <div className={styles.articleContent}>
            {renderContent()}
          </div>

          <Divider className={styles.dividerLarge} />

          {/* 文章操作区 */}
          <div className={styles.actionsContainer}>
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
      </div>
    </Card>
  );
};

export default ArticleDetailCard;
