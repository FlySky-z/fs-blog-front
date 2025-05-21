'use client';
import React, { ReactNode } from 'react';
import { Layout, Grid, Button, ConfigProvider } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styles from './profile-layout.module.css';

const { Content } = Layout;
const { useBreakpoint } = Grid;

interface ProfileLayoutProps {
  profileHeader: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
  onOpenMobileMenu?: () => void;
  fullWidth?: boolean;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  profileHeader,
  sidebar,
  content,
  onOpenMobileMenu,
  fullWidth = false,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  return (
    <Content>
      <div
        className={styles.container}
        style={{
          maxWidth: fullWidth ? '100%' : '1280px',
        }}
      >
        {/* 个人信息区 */}
        <div className={styles.profileHeader}>
          {profileHeader}
        </div>

        {/* 移动端菜单按钮 */}
        {isMobile && (
          <div className={styles.mobileMenuButton}>
            <Button
              icon={<MenuOutlined />}
              onClick={onOpenMobileMenu}
              type="default"
              size="large"
            >
              导航菜单
            </Button>
          </div>
        )}

        {/* 内容区 */}
        <div className={styles.layout} style={{
          gridTemplateColumns: isMobile ? '1fr' : '3fr 9fr',
        }}>
          {/* 侧边栏 - 桌面端显示 */}
          {!isMobile && (
            <div className={styles.sidebar}>
              {sidebar}
            </div>
          )}

          {/* 主内容区 */}
          <div className={styles.main}>
            {content}
          </div>
        </div>
      </div>
    </Content>
  );
};

export default ProfileLayout;
