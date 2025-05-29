'use client';
import React, { Suspense } from 'react';
import CreatorLayout from '@/components/templates/creator-layout';
import { CreatorDashboardSkeleton } from '@/components/creator/creator-skeleton';
import ArticleManagementCard from '@/modules/creator/article-management-card';

/**
 * 创作中心页面
 */
function CreatorCenterPageInner() {
  return (
    <CreatorLayout>
      {/* 文章管理卡片 */}
      <ArticleManagementCard/>
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