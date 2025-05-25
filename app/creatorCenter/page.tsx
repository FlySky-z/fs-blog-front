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
import { useUserStore } from '@/store/userStore';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

/**
 * 创作中心页面
 */
function CreatorCenterPageInner() {
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
  // 获取用户数据
  const userInfo = useUserStore.getState().userInfo;
  if (!userInfo) {
    notification.error({
      message: '用户未登录或无法获取用户信息',
      description: '请先登录以查看创作中心。',
      });
    const router = useRouter();
    router.push('/');
    return null;
  }

  return (

    <CreatorLayout>
      {/* 创作者头像卡片 */}
      <CreatorHeaderCard
        id={userInfo?.id.toString()}
        avatar={userInfo?.avatar_url}
        nickname={userInfo?.username}
        level={1}
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

export default function CreatorCenterPage() {
  return (
    <Suspense fallback={<CreatorDashboardSkeleton />}>
      <CreatorCenterPageInner />
    </Suspense>
  );
}
