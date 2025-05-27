'use client';
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { Layout, Grid, Card } from 'antd';
import { EditOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from './feed-layout.module.scss';

const { Content } = Layout;
const { useBreakpoint } = Grid;

interface FeedLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
  fullWidth?: boolean;
}

const FeedLayout: React.FC<FeedLayoutProps> = ({
  main,
  sidebar,
  fullWidth = false,
}) => {
  // useBreakpoint 用于响应式设计
  const screens = useBreakpoint();
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 响应式处理
  useEffect(() => {
    setIsMobile(!screens.lg);
  }, [screens.lg]);

  return (
    <Content>
      <div
        className={styles.container}
        style={{
          maxWidth: fullWidth ? '100%' : '1280px',
        }}
      >
        <div className={styles.layout} style={{
          gridTemplateColumns: isMobile ? '1fr' : '1fr 320px',
        }}>
          {/* 主内容区 */}
          <div className={styles.main}>{main}</div>

          {/* 侧边栏 */}
          <div
            ref={sidebarRef}
            className={styles.sidebar}
            style={{
              display: isMobile ? 'none' : 'block',
              width: '320px',
            }}
          >
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
  );
};

export default FeedLayout;
