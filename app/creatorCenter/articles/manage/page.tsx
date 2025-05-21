'use client';
import React from 'react';
import { Card, Typography, Spin, Breadcrumb } from 'antd';
import { HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import Link from 'next/link';
import CreatorLayout from '@/components/templates/creator-layout';
import ArticleManagementCard from '@/components/creator/article-management-card';
import useArticleManagement from '@/modules/creator/hooks/use-article-management';

const { Title } = Typography;

/**
 * 文章管理页面
 */
export default function ArticleManagementPage() {
  const {
    loading,
    articles,
    pagination,
    onSearch,
    onStatusFilter,
    onDelete,
    onEdit,
    onView,
    onResubmit
  } = useArticleManagement();
  
  return (
    <CreatorLayout>
      <Card className="w-full mb-4">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link href="/creatorCenter">
              <HomeOutlined /> 创作中心
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FileTextOutlined /> 文章管理
          </Breadcrumb.Item>
        </Breadcrumb>
        
        <Title level={4}>文章管理</Title>
        
        <ArticleManagementCard
          articles={articles}
          loading={loading}
          pagination={pagination}
          onSearch={onSearch}
          onStatusFilter={onStatusFilter}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
          onResubmit={onResubmit}
        />
      </Card>
    </CreatorLayout>
  );
}
