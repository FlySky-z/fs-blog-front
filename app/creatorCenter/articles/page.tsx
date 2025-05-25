'use client';
import React, { Suspense } from 'react';
import CreatorLayout from '@/components/templates/creator-layout';
import { CreatorDashboardSkeleton } from '@/components/creator/creator-skeleton';
import CreatorHeaderCard from '@/components/creator/creator-header-card';
import SummaryDataCard from '@/components/creator/summary-data-card';
import ArticleManagementCard from '@/components/creator/article-management-card';
import useCreatorSummary from '@/modules/creator/hooks/use-creator-summary';
import useCreatorApplyStatus from '@/modules/creator/hooks/use-creator-apply-status';
import useCreatorTasks from '@/modules/creator/hooks/use-creator-tasks';
import useArticleManagement from '@/modules/creator/hooks/use-article-management';
import useCreatorAnnouncements from '@/modules/creator/hooks/use-creator-announcements';

/**
 * 创作中心页面
 */
function CreatorCenterPageInner() {
  // 请求数据

  const { loading: articlesLoading, articles, pagination, ...articleActions } = useArticleManagement();

  // 检查是否所有数据都在加载
  const isLoading = articlesLoading;

  // 检查是否有申请状态

  return (
    <CreatorLayout>
      
      {/* 文章管理卡片 */}
      <ArticleManagementCard
        articles={articles}
        loading={articlesLoading}
        pagination={pagination}
        onSearch={articleActions.onSearch}
        onStatusFilter={articleActions.onStatusFilter}
        onDelete={articleActions.onDelete}
        onEdit={articleActions.onEdit}
        onView={articleActions.onView}
        onResubmit={articleActions.onResubmit}
      />
    </CreatorLayout>
  );
}

function CreatorCenterPage() {
  return (
    <Suspense fallback={<CreatorDashboardSkeleton />}>
      <CreatorCenterPageInner />
    </Suspense>
  );
}

export default CreatorCenterPage;