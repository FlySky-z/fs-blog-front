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
    <>
      <Layout className={styles.layout}>
        <Content>
          <div
            className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}
          >
            <div className={styles.content}>
              {/* 主内容区 */}
              <div className={styles.main}>
                {main}
              </div>

              {/* 侧边栏 */}
              <div className={styles.sidebar}>
                {sidebar}
              </div>
            </div>
          </div>
        </Content>
      </Layout>

      {/* 返回顶部按钮 */}
      <RocketToTop />
    </>
  );
};

export default DetailLayout;
