'use client';

import React, { Suspense } from 'react';
import ProfileContent from '@/modules/profile/profile-content';
import RocketToTop from '@/components/header/rocket';
import { Spin } from 'antd';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
// import { withProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AccountCenterPage() {
  return (
    <ProtectedRoute role={0} redirectPath="/400">
      <Suspense fallback={<Spin size="large" />}>
        {/* 个人中心内容 */}
        <ProfileContent />
        <RocketToTop />
      </Suspense>
    </ProtectedRoute>
  );
}