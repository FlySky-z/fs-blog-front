'use client';
import React from 'react';
import { Card, Typography, Space, Tag, Avatar, Image } from 'antd';
import Link from 'next/link';
import { EyeOutlined, LikeOutlined, MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';
import UserMeta from '@/components/molecules/user-meta';
import styles from './article-card.module.css';

const { Title, Text } = Typography;

export interface PostCardProps {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    level?: number;
  };
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags?: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  isVideo?: boolean;
  videoDuration?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  description,
  coverImage,
  author,
  publishedAt,
  viewCount,
  likeCount,
  commentCount,
  tags,
  isVideo = false,
  videoDuration,
}) => {
  // 格式化发布时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Card 
      className={styles.card}
      hoverable
    >
      <div className={styles.cardContent}>
        {/* 用户信息和时间 */}
        <div className={styles.header}>
          <UserMeta
            id={author.id}
            username={author.username}
            avatar={author.avatar}
            level={author.level}
            size="small"
          />
          <Text type="secondary" className={styles.date}>
            <ClockCircleOutlined style={{ marginRight: 5 }} />
            {formatDate(publishedAt)}
          </Text>
        </div>

        {/* 主体内容 */}
        <Link href={`/article/${id}`} className={styles.body} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
          <div className={styles.textContent}>
            <Title level={4} className={styles.title}>{title}</Title>
            {description && (
              <Text className={styles.description}>{description}</Text>
            )}
          </div>

          {/* 封面图 */}
          {coverImage && (
            <div className={styles.coverContainer}>
              <Image
                src={coverImage}
                alt={title}
                className={styles.coverImage}
                preview={false}
              />
              {/* 视频时长标签 */}
              {isVideo && videoDuration && (
                <div className={styles.duration}>{videoDuration}</div>
              )}
            </div>
          )}
        </Link>

        {/* 底部统计信息和标签 */}
        <div className={styles.footer}>
          <Space className={styles.stats}>
            <Text type="secondary">
              <EyeOutlined /> {viewCount}
            </Text>
            <Text type="secondary">
              <LikeOutlined /> {likeCount}
            </Text>
            <Text type="secondary">
              <MessageOutlined /> {commentCount}
            </Text>
          </Space>

          {tags && tags.length > 0 && (
            <Space size={[0, 8]} wrap className={styles.tags}>
              {tags.map(tag => (
                <Tag key={tag.id} color={tag.color}>
                  {tag.name}
                </Tag>
              ))}
            </Space>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
