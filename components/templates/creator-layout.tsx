'use client';
import React, { useState, useEffect } from 'react';
import { Grid, Button, FloatButton } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import CreatorSidebarMenu from '@/components/creator/sidebar-menu';
import styles from './creator-layout.module.scss';
import RocketToTop from '../header/rocket';

const { useBreakpoint } = Grid;

interface CreatorLayoutProps {
  children: React.ReactNode;
}

/**
 * 创作中心布局模板
 * 用于统一创作中心相关页面的布局和导航
 */
const CreatorLayout: React.FC<CreatorLayoutProps> = ({ children }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const pathname = usePathname();
  
  // 侧边栏状态
  const [activeMenuKey, setActiveMenuKey] = useState('home');
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  
  
  // 从路径中提取活动菜单项
  useEffect(() => {
    if (pathname === '/creatorCenter') {
      setActiveMenuKey('home');
    } else if (pathname.includes('/creatorCenter/data')) {
      setActiveMenuKey('data');
    } else if (pathname.includes('/creatorCenter/articles')) {
      setActiveMenuKey('articles');
    } else if (pathname.includes('/creatorCenter/announcements')) {
      setActiveMenuKey('announcements');
    }
  }, [pathname]);

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
  
  return (
    <>
      {children}
      <RocketToTop />
    </>
  );
};

export default CreatorLayout;


// return (
//     <div className={styles.container}>
//       <div className={styles.grid}>
//         {/* 主内容区域 */}
//         <div className={styles['main-content']}>
//           {children}
//         </div>
//       </div>

//       <RocketToTop />
//     </div>
//   );