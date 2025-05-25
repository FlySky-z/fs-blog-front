'use client';

import React, { Suspense } from 'react';
import ProfileContent from '@/modules/profile/profile-content';
import RocketToTop from '@/components/header/rocket';
import { Spin } from 'antd';
// import { withProtectedRoute } from '@/components/auth/ProtectedRoute';

function AccountCenterPage() {
  return (
    <Suspense fallback={<Spin size="large"/>}>
      {/* 个人中心内容 */}
      <ProfileContent />
      <RocketToTop />
    </Suspense>
  );
}

// // 使用高阶组件为个人中心页面添加路由保护
// export default withProtectedRoute(AccountCenterPage, {
//   redirectPath: '/' // 未登录时重定向到首页
// });

export default AccountCenterPage;