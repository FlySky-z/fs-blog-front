'use client';
import React from 'react';
import { List, Avatar, Typography, Space } from 'antd';
import Link from 'next/link';
import SidebarCard from './sidebar-card';

const { Text } = Typography;

interface RecommendedArticle {
  id: string;
  title: string;
  author: string;
  avatar?: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
}

interface RecommendedArticlesProps {
  articles: RecommendedArticle[];
  title?: string;
}

const RecommendedArticles: React.FC<RecommendedArticlesProps> = ({
  articles,
  title = "推荐阅读",
}) => {
  return (
    <SidebarCard title={title}>
      <List
        itemLayout="vertical"
        dataSource={articles}
        renderItem={(article) => (
          <List.Item
            key={article.id}
            style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}
          >
            <Link href={`/article/${article.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography.Title level={5} style={{ margin: '0 0 8px', fontSize: '15px' }}>
                {article.title}
              </Typography.Title>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {article.avatar && (
                  <Avatar src={article.avatar} size="small" style={{ marginRight: 8 }} />
                )}
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {article.author}
                </Text>
              </div>

              <Space size={12}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {article.likeCount} 赞
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {article.viewCount} 阅读
                </Text>
              </Space>
            </div>
          </List.Item>
        )}
      />
    </SidebarCard>
  );
};

export default RecommendedArticles;
