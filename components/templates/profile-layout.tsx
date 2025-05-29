'use client';
import React, { ReactNode } from 'react';
import { Layout, Grid } from 'antd';
import styles from './profile-layout.module.scss';

const { Content } = Layout;
const { useBreakpoint } = Grid;

interface ProfileLayoutProps {
  profileHeader: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  profileHeader,
  sidebar,
  content,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Content>
      <div className={styles.container}>
        {/* 个人信息区 */}
        {profileHeader && (
          <div className={styles.profileHeader}>
            {profileHeader}
          </div>
        )}

        <div className={styles.grid}>
          {/* 侧边栏区域 */}
          <div className={isMobile ? styles.mobileMenu : styles.sidebar}>
            {sidebar}
          </div>

          {/* 主内容区域 */}
          <div className={styles.mainContent}>
            {content}
          </div>
        </div>
      </div>
    </Content>
  );
};

export default ProfileLayout;
