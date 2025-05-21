'use client';
import React, { useState, useEffect } from 'react';
import { Grid, Button, FloatButton } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import CreatorSidebarMenu from '@/components/creator/sidebar-menu';
import styles from './creator-layout.module.scss';
import RocketToTop from '../ui/rocket';

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
  
  // 滚动回顶部
  const [showScrollTop, setShowScrollTop] = useState(false);
  
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
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* 侧边栏区域 */}
        {!isMobile && (
          <div className={styles.sidebar}>
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
          <div className={styles['fixed-button']}>
            <Button 
              type="primary" 
              onClick={toggleMobileDrawer}
              className={styles.button}
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
        <div className={styles['main-content']}>
          {children}
        </div>
      </div>

      <RocketToTop />
    </div>
  );
};

export default CreatorLayout;
