'use client';
import React, { useState, useEffect } from 'react';
import { Grid, Skeleton, Card, Button, FloatButton } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import CreatorSidebarMenu from '@/components/creator/sidebar-menu';
import CreatorHeaderCard from '@/components/creator/creator-header-card';
import SummaryDataCard from '@/components/creator/summary-data-card';
import CreatorApplyCard from '@/components/creator/creator-apply-card';
import TaskListCard from '@/components/creator/task-list-card';
import ArticleManagementCard from '@/components/creator/article-management-card';
import useCreatorSummary from './hooks/use-creator-summary';
import useCreatorApplyStatus from './hooks/use-creator-apply-status';
import useCreatorTasks from './hooks/use-creator-tasks';
import useArticleManagement from './hooks/use-article-management';
import useCreatorAnnouncements from './hooks/use-creator-announcements';
import RocketToTop from '@/components/header/rocket';

const { useBreakpoint } = Grid;

/**
 * 创作中心主模块
 */
export const CreatorDashboard: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // 侧边栏状态
  const [activeMenuKey, setActiveMenuKey] = useState('home');
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  // 请求数据
  const { loading: summaryLoading, weekData, monthData, totalData } = useCreatorSummary();
  const { loading: applyLoading, applyStatus } = useCreatorApplyStatus();
  const { loading: tasksLoading, ongoingTasks, newbieTasks } = useCreatorTasks();
  const { loading: articlesLoading, articles, pagination, ...articleActions } = useArticleManagement();
  const { loading: announcementsLoading, announcements } = useCreatorAnnouncements();

  // 滚动回顶部
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理侧边栏菜单选择
  const handleMenuSelect = (key: string) => {
    setActiveMenuKey(key);
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  // 移动端侧边栏开关
  const toggleMobileDrawer = () => {
    setMobileDrawerVisible(prev => !prev);
  };

  // 渲染内容区域骨架屏
  const renderSkeletons = () => (
    <>
      <Card className="w-full mb-4">
        <Skeleton avatar paragraph={{ rows: 2 }} active />
      </Card>

      <Card className="w-full mb-4">
        <Skeleton paragraph={{ rows: 3 }} active />
      </Card>

      <Card className="w-full mb-4">
        <Skeleton paragraph={{ rows: 4 }} active />
      </Card>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-12 gap-6">
        {/* 侧边栏区域 */}
        {!isMobile && (
          <div className="col-span-12 md:col-span-3">
            <CreatorSidebarMenu
              activeMenuKey={activeMenuKey}
              onMenuSelect={handleMenuSelect}
              isMobile={isMobile}
              mobileDrawerVisible={mobileDrawerVisible}
              onMobileDrawerClose={() => setMobileDrawerVisible(false)}
              notificationCounts={{
                articles: 2,
                drafts: 3,
                announcements: 1
              }}
            />
          </div>
        )}

        {/* 移动端抽屉控制按钮 */}
        {isMobile && (
          <div className="fixed top-16 left-4 z-30">
            <Button
              type="primary"
              onClick={toggleMobileDrawer}
              className="mb-4"
            >
              导航菜单
            </Button>

            <CreatorSidebarMenu
              activeMenuKey={activeMenuKey}
              onMenuSelect={handleMenuSelect}
              isMobile={true}
              mobileDrawerVisible={mobileDrawerVisible}
              onMobileDrawerClose={() => setMobileDrawerVisible(false)}
              notificationCounts={{
                articles: 2,
                drafts: 3,
                announcements: 1
              }}
            />
          </div>
        )}

        {/* 主内容区域 */}
        <div className="col-span-12 md:col-span-9">
          {/* 创作者头像卡片 */}
          {announcementsLoading ? (
            <Card className="w-full mb-4">
              <Skeleton avatar paragraph={{ rows: 2 }} active />
            </Card>
          ) : (
            <CreatorHeaderCard
              id="creator-id"
              avatar="https://picsum.photos/200"
              nickname="创作者昵称"
              level={2}
              announcements={announcements}
            />
          )}

          {/* 数据概览卡片 */}
          {summaryLoading ? (
            <Card className="w-full mb-4">
              <Skeleton paragraph={{ rows: 3 }} active />
            </Card>
          ) : (
            weekData && monthData && totalData && (
              <SummaryDataCard
                weekData={weekData}
                monthData={monthData}
                totalData={totalData}
              />
            )
          )}

          {/* 创作者申请卡片 */}
          {applyLoading ? (
            <Card className="w-full mb-4">
              <Skeleton paragraph={{ rows: 4 }} active />
            </Card>
          ) : (
            applyStatus && (
              <CreatorApplyCard
                requirements={applyStatus.requirements}
                progress={applyStatus.progress}
                canApply={applyStatus.canApply}
                alreadyApplied={applyStatus.alreadyApplied}
                isCreator={applyStatus.isCreator}
              />
            )
          )}

          {/* 任务列表卡片 */}
          {tasksLoading ? (
            <Card className="w-full mb-4">
              <Skeleton paragraph={{ rows: 6 }} active />
            </Card>
          ) : (
            <TaskListCard
              ongoingTasks={ongoingTasks}
              newbieTasks={newbieTasks}
            />
          )}

          {/* 文章管理卡片 */}
          {articlesLoading && articles.length === 0 ? (
            <Card className="w-full mb-4">
              <Skeleton paragraph={{ rows: 8 }} active />
            </Card>
          ) : (
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
          )}
        </div>
      </div>

      {/* 回到顶部按钮 */}
      <RocketToTop />
    </div>
  );
};

export default CreatorDashboard;
