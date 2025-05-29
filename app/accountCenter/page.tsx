'use client';

import React, { Suspense } from 'react';
import ProfileContent from '@/modules/profile/profile-content';
import RocketToTop from '@/components/header/rocket';
import { Spin } from 'antd';

export default function AccountCenterPage() {
  return (
      <Suspense fallback={<Spin size="large" />}>
        {/* 个人中心内容 */}
        <ProfileContent />
        <RocketToTop />
      </Suspense>
  );
}