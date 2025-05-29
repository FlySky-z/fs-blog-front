'use client';

import React, { useMemo } from 'react';
import { Card, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import {
  HomeOutlined,
  BarChartOutlined,
  FileTextOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import styles from './sidebar-menu.module.scss';

// 组件属性类型定义
interface CreatorSidebarMenuProps {
  activeMenuKey: string;
  onMenuSelect: (key: string) => void;
  isMobile: boolean;
  notificationCounts?: Record<string, number>;
}

/**
 * 创作者中心侧边栏菜单组件
 * 支持桌面端和移动端两种展示模式
 */
const CreatorSidebarMenu: React.FC<CreatorSidebarMenuProps> = ({
  activeMenuKey,
  onMenuSelect,
  isMobile,
  notificationCounts = {}
}) => {
  const router = useRouter();

  // 菜单项列表
  const menuItems = useMemo(() => [
    {
      key: 'home',
      label: (
        <>
          首页
          {notificationCounts.home ? (
            <span className={styles.notificationCount}>({notificationCounts.home})</span>
          ) : null}
        </>
      ),
      icon: <HomeOutlined />,
    },
    {
      key: 'data',
      label: (
        <>
          数据中心
          {notificationCounts.data ? (
            <span className={styles.notificationCount}>({notificationCounts.data})</span>
          ) : null}
        </>
      ),
      icon: <BarChartOutlined />,
    },
    {
      key: 'articles',
      label: (
        <>
          投稿管理
          {notificationCounts.articles ? (
            <span className={styles.notificationCount}>({notificationCounts.articles})</span>
          ) : null}
        </>
      ),
      icon: <FileTextOutlined />,
    },
    {
      key: 'announcements',
      label: (
        <>
          创作公告
          {notificationCounts.announcements ? (
            <span className={styles.notificationCount}>({notificationCounts.announcements})</span>
          ) : null}
        </>
      ),
      icon: <NotificationOutlined />,
    },
  ], [notificationCounts]);

  // 统一的菜单点击处理函数
  const handleMenuClick = (key: string) => {
    onMenuSelect(key);
    router.push(`/creatorCenter${key === 'home' ? '' : `/${key}`}`);
  };

  // 创建菜单组件
  const menu = (
    <Menu
      selectedKeys={[activeMenuKey]}
      onClick={({ key }) => handleMenuClick(key as string)}
      mode={isMobile ? "horizontal" : "vertical"}
      className={isMobile ? styles.mobileMenu : styles.desktopMenu}
      items={menuItems}
    />
  );

  // 返回适当的菜单形式
  return isMobile ? menu : (
    <Card >
      {menu}
    </Card>
  );
};

export default CreatorSidebarMenu;
