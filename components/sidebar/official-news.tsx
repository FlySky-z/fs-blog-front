'use client';
import React from 'react';
import { List, Typography, Image, Space } from 'antd';
import Link from 'next/link';
import SidebarCard from '@/components/sidebar/sidebar-card';
import styles from './official-news.module.css';

const { Text, Title } = Typography;

export interface NewsItem {
  id: string;
  title: string;
  coverImage?: string;
  publishedAt: string;
  url: string;
}

interface OfficialNewsProps {
  newsItems: NewsItem[];
  title?: string;
}

const OfficialNews: React.FC<OfficialNewsProps> = ({
  newsItems,
  title = '官方资讯',
}) => {
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <SidebarCard title={title}>
      {newsItems.length > 0 && (
        <>
          {/* 第一条带图片 */}
          <div className={styles.featuredNews}>
            <Link href={newsItems[0].url} className={styles.featuredLink}>
              {newsItems[0].coverImage && (
                <div className={styles.imageContainer}>
                  <Image
                    src={newsItems[0].coverImage}
                    alt={newsItems[0].title}
                    preview={false}
                    className={styles.featuredImage}
                  />
                </div>
              )}
              <Title level={5} className={styles.featuredTitle}>
                {newsItems[0].title}
              </Title>
              <Text type="secondary" className={styles.date}>
                {formatDate(newsItems[0].publishedAt)}
              </Text>
            </Link>
          </div>

          {/* 其他新闻列表 */}
          <List
            className={styles.newsList}
            dataSource={newsItems.slice(1)}
            renderItem={(item) => (
              <List.Item className={styles.newsItem}>
                <Link href={item.url} className={styles.newsLink}>
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Text className={styles.newsTitle}>{item.title}</Text>
                    <Text type="secondary" className={styles.date}>
                      {formatDate(item.publishedAt)}
                    </Text>
                  </Space>
                </Link>
              </List.Item>
            )}
          />
        </>
      )}
    </SidebarCard>
  );
};

export default OfficialNews;
