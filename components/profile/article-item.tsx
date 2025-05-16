'use client';
import React from 'react';
import { Card, Typography, Space, Tag, Avatar } from 'antd';
import Link from 'next/link';
import { EyeOutlined, LikeOutlined, CommentOutlined, ClockCircleOutlined } from '@ant-design/icons';

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
      className="w-full mb-4 hover:shadow-md transition-shadow"
      bodyStyle={{ padding: '16px' }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <Link href={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Title level={5} className="m-0 hover:text-blue-500 transition-colors">
              {article.title}
            </Title>
          </Link>
          
          <div className="flex items-center text-gray-500 mt-2 mb-2">
            <ClockCircleOutlined style={{ fontSize: '14px' }} />
            <Text type="secondary" style={{ marginLeft: '4px', fontSize: '14px' }}>
              {formattedDate}
            </Text>
          </div>
          
          <Paragraph 
            ellipsis={{ rows: 2 }}
            style={{ color: 'rgba(0, 0, 0, 0.65)', margin: '8px 0' }}
          >
            {article.excerpt}
          </Paragraph>
          
          <div className="flex flex-wrap justify-between mt-3">
            <Space wrap size={[0, 8]} style={{ marginBottom: '8px' }}>
              {article.tags?.map(tag => (
                <Tag key={tag.id} color={tag.color || '#108ee9'}>
                  {tag.name}
                </Tag>
              ))}
            </Space>
            
            <Space className="text-gray-500">
              <span className="flex items-center">
                <EyeOutlined style={{ marginRight: 4 }} />
                {article.viewCount}
              </span>
              <span className="flex items-center">
                <LikeOutlined style={{ marginRight: 4 }} />
                {article.likeCount}
              </span>
              <span className="flex items-center">
                <CommentOutlined style={{ marginRight: 4 }} />
                {article.commentCount}
              </span>
            </Space>
          </div>
        </div>
        
        {article.coverImage && (
          <div className="md:ml-4 mt-3 md:mt-0">
            <div 
              style={{
                width: '120px',
                height: '80px',
                backgroundImage: `url(${article.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '4px',
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ArticleItem;
