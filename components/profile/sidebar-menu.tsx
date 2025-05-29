'use client';
import React, { useMemo } from 'react';
import { Card, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import { 
  FileTextOutlined,
  CommentOutlined,
  FolderOutlined,
  StarOutlined,
  TeamOutlined,
  SettingOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import styles from './sidebar-menu.module.scss';

interface SidebarMenuProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  userId: string;
  isMobile: boolean;
  notificationCounts?: Record<string, number>;
  isCurrentUser?: boolean; // 是否是当前登录用户
}

/**
 * 账户中心侧边栏菜单组件
 * 支持桌面端和移动端两种展示模式
 */
const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activeTab,
  onTabChange,
  userId,
  isMobile,
  notificationCounts = {},
  isCurrentUser = false // 默认不是当前用户
}) => {
  const router = useRouter();

  // 菜单项列表 - 使用useMemo优化性能
  const menuItems = useMemo(() => {
    // 基本菜单项（所有人都可见）
    const baseMenuItems = [
      {
        key: 'article',
        label: (
          <>
            {isCurrentUser ? '我的发帖' : '作者文章'} 
            {notificationCounts.article ? (
              <span className={styles.notificationCount}>({notificationCounts.article})</span>
            ) : null}
          </>
        ),
        icon: <FileTextOutlined />,
      }
    ];

    // 仅当前用户可见的菜单项
    const currentUserMenuItems = [
      {
        key: 'comments',
        label: (
          <>
            我的评论
            {notificationCounts.comments ? (
              <span className={styles.notificationCount}>({notificationCounts.comments})</span>
            ) : null}
          </>
        ),
        icon: <CommentOutlined />,
      },
      {
        key: 'collections',
        label: (
          <>
            我的合集
            {notificationCounts.collections ? (
              <span className={styles.notificationCount}>({notificationCounts.collections})</span>
            ) : null}
          </>
        ),
        icon: <FolderOutlined />,
      },
      {
        key: 'favorites',
        label: (
          <>
            我的收藏
            {notificationCounts.favorites ? (
              <span className={styles.notificationCount}>({notificationCounts.favorites})</span>
            ) : null}
          </>
        ),
        icon: <StarOutlined />,
      },
      {
        key: 'followers',
        label: (
          <>
            我的粉丝
            {notificationCounts.followers ? (
              <span className={styles.notificationCount}>({notificationCounts.followers})</span>
            ) : null}
          </>
        ),
        icon: <TeamOutlined />,
      },
      {
        key: 'settings',
        label: (
          <>
            账号设置
            {notificationCounts.settings ? (
              <span className={styles.notificationCount}>({notificationCounts.settings})</span>
            ) : null}
          </>
        ),
        icon: <SettingOutlined />,
      },
      {
        key: 'certification',
        label: (
          <>
            认证中心
            {notificationCounts.certification ? (
              <span className={styles.notificationCount}>({notificationCounts.certification})</span>
            ) : null}
          </>
        ),
        icon: <SafetyCertificateOutlined />,
      }
    ];

    // 根据是否是当前用户返回不同的菜单项
    return isCurrentUser ? [...baseMenuItems, ...currentUserMenuItems] : baseMenuItems;
  }, [notificationCounts, isCurrentUser]);

  // 统一的菜单点击处理函数
  const handleMenuClick = (key: string) => {
    onTabChange(key);
    router.push(`/accountCenter?tab=${key}&userId=${userId}`);
  };

  // 创建菜单组件
  const menu = (
    <Menu
      selectedKeys={[activeTab]}
      onClick={({ key }) => handleMenuClick(key as string)}
      mode={isMobile ? "horizontal" : "vertical"}
      className={isMobile ? styles.mobileMenu : styles.desktopMenu}
      items={menuItems}
    />
  );

  // 返回适当的菜单形式
  return isMobile ? menu : (
    <Card>
      {menu}
    </Card>
  );
};

export default SidebarMenu;
