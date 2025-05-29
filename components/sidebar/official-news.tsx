'use client';
import React from 'react';
import { List, Typography, Image, Space } from 'antd';
import Link from 'next/link';
import SidebarCard from '@/components/sidebar/sidebar-card';
import styles from './official-news.module.css';
import ImageCard from '../atoms/image-card';
import { ArticleListItem } from '@/modules/article/articleModel';
import { formatDate } from '@/utils/date'; // 假设有一个日期格式化工具函数

const { Text, Title } = Typography;

interface OfficialNewsProps {
  newsItems: ArticleListItem[];
  title?: string;
}

const OfficialNews: React.FC<OfficialNewsProps> = ({
  newsItems,
  title = '官方资讯',
}) => {

  return (
    <SidebarCard title={title}>
      {newsItems.length > 0 && (
        <>
          {/* 第一条带图片 */}
          <div className={styles.featuredNews}>
            <Link href={`/article/${newsItems[0].id}`} className={styles.featuredLink}>
              {newsItems[0].cover_image && (
                <div className={styles.imageContainer}>
                  <ImageCard
                    image_url={newsItems[0].cover_image}
                    ratio={16 / 9}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
              <Title level={5} className={styles.featuredTitle}>
                {newsItems[0].header}
              </Title>
              <Text type="secondary" className={styles.date}>
                {formatDate(newsItems[0].last_modified_date)}
              </Text>
            </Link>
          </div>

          {/* 其余不显示图片 */}
          {newsItems.length > 1 && (
            <List
              className={styles.newsList}
              dataSource={newsItems.slice(1)}
              renderItem={(item) => (
                <List.Item className={styles.newsItem}>
                  <Link href={`/article/${newsItems[0].id}`} className={styles.newsLink}>
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Text className={styles.newsTitle}>{item.header}</Text>
                      <Text type="secondary" className={styles.date}>
                        {formatDate(item.last_modified_date)}
                      </Text>
                    </Space>
                  </Link>
                </List.Item>
              )}
            />
          )}

        </>
      )}
    </SidebarCard>
  );
};

export default OfficialNews;
