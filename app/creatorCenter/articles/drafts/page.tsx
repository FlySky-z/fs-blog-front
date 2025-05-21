'use client';
import React, { useState, useEffect } from 'react';
import { Card, Typography, Table, Button, Space, Empty, Skeleton, Breadcrumb } from 'antd';
import { EditOutlined, DeleteOutlined, SendOutlined, HomeOutlined, InboxOutlined } from '@ant-design/icons';
import Link from 'next/link';
import CreatorLayout from '@/components/templates/creator-layout';
import { Article, ArticleStatus } from '@/components/creator/article-management-card';
import styles from './page.module.scss';

const { Title, Text } = Typography;

/**
 * 草稿箱页面
 */
export default function DraftsPage() {
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Article[]>([]);
  
  // 模拟获取草稿列表
  useEffect(() => {
    const fetchDrafts = () => {
      setTimeout(() => {
        const mockDrafts: Article[] = Array(5).fill(null).map((_, index) => ({
          id: `draft-${index + 1}`,
          title: `草稿 ${index + 1}`,
          status: ArticleStatus.DRAFT,
          thumbnail: index % 2 === 0 ? `https://picsum.photos/300/200?random=${index}` : undefined,
          updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          readCount: 0,
          commentCount: 0,
          likeCount: 0
        }));
        
        setDrafts(mockDrafts);
        setLoading(false);
      }, 1000);
    };
    
    fetchDrafts();
  }, []);
  
  // 表格列定义
  const columns = [
    {
      title: '草稿标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Article) => (
        <div className={styles.draftTitleCell}>
          {record.thumbnail && (
            <div className={styles.thumbnail}>
              <img 
                src={record.thumbnail} 
                alt={text} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          <div className={styles.draftTitleText}>
            <Text strong>{text}</Text>
            <Text type="secondary">上次保存: {record.updatedAt}</Text>
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Article) => (
        <div className={styles.actionsCell}>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => console.log(`编辑草稿: ${record.id}`)}
          >
            编辑
          </Button>
          <Button
            icon={<SendOutlined />}
            size="small"
            type="primary"
            onClick={() => console.log(`提交草稿: ${record.id}`)}
          >
            提交审核
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => console.log(`删除草稿: ${record.id}`)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  
  return (
    <CreatorLayout>
      <Card className="w-full">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link href="/creatorCenter">
              <HomeOutlined /> 创作中心
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <InboxOutlined /> 草稿箱
          </Breadcrumb.Item>
        </Breadcrumb>
        
        <Title level={4}>草稿箱</Title>
        
        {loading ? (
          <Skeleton paragraph={{ rows: 6 }} active />
        ) : (
          <Table
            rowKey="id"
            dataSource={drafts}
            columns={columns}
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  description="暂无草稿"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button 
                    type="primary" 
                    onClick={() => console.log('创建新文章')}
                  >
                    创建新文章
                  </Button>
                </Empty>
              )
            }}
          />
        )}
      </Card>
    </CreatorLayout>
  );
}
