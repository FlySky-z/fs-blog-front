'use client';
import React from 'react';
import { Card, Skeleton } from 'antd';

interface SkeletonLoadingProps {
  rows?: number;
  avatar?: boolean;
  title?: boolean;
}

/**
 * 通用骨架屏组件
 */
export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  rows = 4,
  avatar = false,
  title = true
}) => {
  return (
    <Card className="w-full mb-4">
      <Skeleton 
        active 
        avatar={avatar} 
        title={title}
        paragraph={{ rows }} 
      />
    </Card>
  );
};

/**
 * 创作中心骨架屏
 */
export const CreatorDashboardSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-12 gap-6">
        {/* 侧边栏骨架屏 */}
        <div className="col-span-12 md:col-span-3 hidden md:block">
          <Card className="w-full">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </div>
        
        {/* 主内容区骨架屏 */}
        <div className="col-span-12 md:col-span-9">
          <SkeletonLoading avatar rows={2} />
          <SkeletonLoading rows={3} />
          <SkeletonLoading rows={4} />
          <SkeletonLoading rows={6} />
          <SkeletonLoading rows={8} />
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboardSkeleton;
