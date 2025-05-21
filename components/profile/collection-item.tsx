'use client';
import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import Link from 'next/link';
import { FileOutlined } from '@ant-design/icons';
import styles from './collection-item.module.scss';

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
    <Card className={styles.collectionCard}>
      <div className={styles.collectionContainer}>
        <div 
          className={styles.coverImage}
          style={{
            backgroundImage: collection.coverImage 
              ? `url(${collection.coverImage})` 
              : 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
          }}
        >
          {!collection.coverImage && (
            <FileOutlined className={styles.icon} />
          )}
        </div>
        
        <div className={styles.collectionContent}>
          <div className={styles.header}>
            <Link href={`/collection/${collection.id}`} className={styles.titleLink}>
              <Title level={5} className={styles.title}>
                {collection.title}
              </Title>
            </Link>
            
            <Tag className={styles.tag} color={collection.isPublic ? 'green' : 'default'}>
              {collection.isPublic ? '公开' : '私密'}
            </Tag>
          </div>
          
          {collection.description && (
            <Paragraph 
              ellipsis={{ rows: 2 }} 
              className={styles.description}
            >
              {collection.description}
            </Paragraph>
          )}
          
          <div className={styles.footer}>
            <Text type="secondary" className={styles.date}>
              创建于 {formattedDate}
            </Text>
            
            <Text className={styles.postCount}>
              {collection.postCount} 篇文章
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CollectionItem;
