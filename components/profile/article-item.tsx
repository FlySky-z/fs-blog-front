'use client';
import React from 'react';
import { Card, Typography, Space, Tag, Avatar } from 'antd';
import Link from 'next/link';
import { EyeOutlined, LikeOutlined, CommentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from './article-item.module.scss';

const { Title, Text, Paragraph } = Typography;

export interface ArticleItemData {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishDate: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags?: Array<{id: string; name: string; color?: string}>;
}

interface ArticleItemProps {
  article: ArticleItemData;
}

const ArticleItem: React.FC<ArticleItemProps> = ({ article: article }) => {
  const formattedDate = new Date(article.publishDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <Card 
      className={styles.articleCard}
    >
      <div className={styles.articleContainer}>
        <div className={styles.articleContent}>
          <Link href={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Title level={5} className={styles.articleTitle}>
              {article.title}
            </Title>
          </Link>
          
          <div className={styles.articleMeta}>
            <ClockCircleOutlined className={styles.icon} />
            <Text type="secondary" className={styles.publishDate}>
              {formattedDate}
            </Text>
          </div>
          
          <Paragraph 
            ellipsis={{ rows: 2 }}
            className={styles.articleExcerpt}
          >
            {article.excerpt}
          </Paragraph>
          
        </div>
        
        {article.coverImage && (
          <div className={styles.coverImageContainer}>
            <div 
              className={styles.coverImage}
              style={{ backgroundImage: `url(${article.coverImage})` }}
            />
          </div>
        )}
      </div>
      <div className={styles.articleFooter}>
            <Space wrap size={[0, 8]} className={styles.tagContainer}>
              {article.tags?.map(tag => (
                <Tag key={tag.id} color={tag.color || '#108ee9'}>
                  {tag.name}
                </Tag>
              ))}
            </Space>
            
            <Space className={styles.statsContainer}>
              <span className={styles.statItem}>
                <EyeOutlined className={styles.icon} />
                {article.viewCount}
              </span>
              <span className={styles.statItem}>
                <LikeOutlined className={styles.icon} />
                {article.likeCount}
              </span>
              <span className={styles.statItem}>
                <CommentOutlined className={styles.icon} />
                {article.commentCount}
              </span>
            </Space>
          </div>
    </Card>
  );
};

export default ArticleItem;
