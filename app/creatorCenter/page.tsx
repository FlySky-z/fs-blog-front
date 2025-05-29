'use client';
import React, { Suspense } from 'react';
import CreatorLayout from '@/components/templates/creator-layout';
import { CreatorDashboardSkeleton } from '@/components/creator/creator-skeleton';
import CreatorHeaderCard from '@/components/creator/creator-header-card';
// import SummaryDataCard from '@/components/creator/summary-data-card';
import ArticleManagementCard from '@/modules/creator/article-management-card';
import useCreatorAnnouncements from '@/modules/creator/hooks/use-creator-announcements';
import { useUserStore } from '@/store/userStore';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';

/**
 * 创作中心页面
 */
function CreatorCenterPageInner() {
  // 请求数据
  const { loading: announcementsLoading, announcements } = useCreatorAnnouncements();
  // 提前调用 Hook，保证每次渲染都执行
  const router = useRouter();
  const userInfo = useUserStore.getState().userInfo;

  // 检查是否所有数据都在加载
  const isLoading = announcementsLoading;

  if (isLoading) {
    return <CreatorDashboardSkeleton />;
  }
  // 获取用户数据
  if (!userInfo) {
    notification.error({
      message: '用户未登录或无法获取用户信息',
      description: '请先登录以查看创作中心。',
    });
    router.push('/');
    return null;
  }

  return (

    <CreatorLayout>
      {/* 创作者头像卡片 */}
      <CreatorHeaderCard
        id={userInfo?.id.toString()}
        avatar={userInfo?.avatar_url}
        username={userInfo?.username}
        level={1}
        announcements={announcements || []}
        style={{ marginBottom: '20px' }}
      />

      {/* 数据概览卡片 */}
      {/* {(
        <SummaryDataCard
          weekData={weekData}
          monthData={monthData}
          totalData={totalData}
          style={{ marginBottom: '20px' }}
        />
      )} */}

      {/* 文章管理卡片 */}
      <ArticleManagementCard/>
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
