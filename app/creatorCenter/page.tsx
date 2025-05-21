'use client';
import React from 'react';
import { Suspense } from 'react';
import { Spin } from 'antd';
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
export default function CreatorCenterPage() {
  // 请求数据
  const { loading: summaryLoading, weekData, monthData, totalData } = useCreatorSummary();
  const { loading: applyLoading, applyStatus } = useCreatorApplyStatus();
  const { loading: tasksLoading, ongoingTasks, newbieTasks } = useCreatorTasks();
  const { loading: articlesLoading, articles, pagination, ...articleActions } = useArticleManagement();
  const { loading: announcementsLoading, announcements } = useCreatorAnnouncements();

  // 检查是否所有数据都在加载
  const isLoading = summaryLoading && applyLoading && tasksLoading && articlesLoading && announcementsLoading;

  if (isLoading) {
    return <CreatorDashboardSkeleton />;
  }

  return (
    <CreatorLayout>
      {/* 创作者头像卡片 */}
      <CreatorHeaderCard
        id="creator-id"
        avatar="https://picsum.photos/200"
        nickname="创作者"
        level={2}
        announcements={announcements || []}
        style={{ marginBottom: '20px' }}
      />
      
      {/* 数据概览卡片 */}
      {weekData && monthData && totalData && (
        <SummaryDataCard
          weekData={weekData}
          monthData={monthData}
          totalData={totalData}
          style={{ marginBottom: '20px' }}
        />
      )}
      
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