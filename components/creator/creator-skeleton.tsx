'use client';
import React from 'react';
import { Card, Skeleton } from 'antd';
import styles from './creator-skeleton.module.scss';

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
    <Card className={styles.cardWithMargin}>
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
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* 侧边栏骨架屏 */}
        {/* <div className={styles.sidebar}>
          <Card className={styles.card}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </div> */}
        
        {/* 主内容区骨架屏 */}
        <div className={styles.main}>
          <SkeletonLoading avatar rows={2}/>
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
