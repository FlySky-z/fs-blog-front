'use client';
import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import Link from 'next/link';
import { FileOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export interface CollectionItemData {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  postCount: number;
  createdAt: string;
  isPublic: boolean;
}

interface CollectionItemProps {
  collection: CollectionItemData;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ collection }) => {
  const formattedDate = new Date(collection.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <Card className="w-full mb-4 hover:shadow-md transition-shadow">
      <div className="flex">
        <div 
          className="shrink-0 mr-4"
          style={{
            width: '80px',
            height: '80px',
            backgroundImage: collection.coverImage 
              ? `url(${collection.coverImage})` 
              : 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {!collection.coverImage && (
            <FileOutlined style={{ fontSize: '32px', color: 'white' }} />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link href={`/collection/${collection.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              <Title level={5} className="mb-2 hover:text-blue-500 transition-colors">
                {collection.title}
              </Title>
            </Link>
            
            <Tag color={collection.isPublic ? 'green' : 'default'}>
              {collection.isPublic ? '公开' : '私密'}
            </Tag>
          </div>
          
          {collection.description && (
            <Paragraph 
              ellipsis={{ rows: 2 }} 
              style={{ margin: '8px 0', color: 'rgba(0, 0, 0, 0.65)' }}
            >
              {collection.description}
            </Paragraph>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <Text type="secondary" style={{ fontSize: '13px' }}>
              创建于 {formattedDate}
            </Text>
            
            <Text style={{ color: '#1677ff' }}>
              {collection.postCount} 篇文章
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CollectionItem;
