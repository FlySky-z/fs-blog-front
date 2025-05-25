'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Layout, Grid, ConfigProvider } from 'antd';
import RocketToTop from '../header/rocket';
import styles from './detail-layout.module.scss';

const { Content } = Layout;
const { useBreakpoint } = Grid;

interface DetailLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
  fullWidth?: boolean;
}

const DetailLayout: React.FC<DetailLayoutProps> = ({
  main,
  sidebar,
  fullWidth = false,
}) => {
  const screens = useBreakpoint();
  const [isMobile, setIsMobile] = useState(false);
  
  // 响应式处理
  useEffect(() => {
    setIsMobile(!screens.lg);
  }, [screens.lg]);

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 8,
        },
        components: {
          Card: {
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          },
        },
      }}
    >
      <Layout className={styles.layout}>
        <Content>
          <div 
            className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}
          >
            <div className={styles.content}>
              {/* 主内容区 */}
              <div className={styles.main}>{main}</div>
              
              {/* 侧边栏 */}
              <div className={styles.sidebar}>
                {sidebar}
              </div>
            </div>
            
            {/* 移动端下，侧边栏内容显示在底部 */}
            {isMobile && (
              <div className={styles.mobileSidebar}>
                {sidebar}
              </div>
            )}
          </div>
        </Content>
      </Layout>
      
      {/* 返回顶部按钮 */}
      <RocketToTop />
    </ConfigProvider>
  );
};

export default DetailLayout;
