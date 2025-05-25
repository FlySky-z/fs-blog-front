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
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  // 响应式处理
  useEffect(() => {
    setIsMobile(!screens.lg);
  }, [screens.lg]);

  // 处理侧边栏滚动
  useEffect(() => {
    if (isMobile || !sidebarRef.current) return;

    const handleScroll = () => {
      if (!sidebarRef.current) return;

      const sidebarHeight = sidebarRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const twoThirdsViewport = windowHeight * 2 / 3;

      // 计算侧边栏底部距离视口顶部的距离
      const sidebarBottom = 88 + sidebarHeight;

      // 如果侧边栏底部接近页面2/3处，调整位置
      if (sidebarBottom > twoThirdsViewport) {
        // 使侧边栏底部保持在视口的2/3处
        const newTopPosition = twoThirdsViewport - sidebarHeight;
        if (newTopPosition < 88) { // 不要让侧边栏顶部超过header
          setSidebarStyle({ top: `${newTopPosition}px` });
        }
      } else {
        // 重置为默认位置
        setSidebarStyle({ top: '88px' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // 初始检查
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile]);

  return (
    <Content>
      <div
        className={styles.container}
        style={{
          maxWidth: fullWidth ? '100%' : '1280px',
        }}
      >
        <div>
          <Card
            styles={{
              body: {
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                gap: 16,
              }
            }}
            style={{
              marginBottom: 16,
            }}
          >
            {/* 创建文章 */}
            <Link
              href="/editor"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#1677ff',
                fontWeight: 500,
                fontSize: 16,
                gap: 8,
              }}
            >
              <EditOutlined />
              创建文章
            </Link>
            {/* 进入创作中心 */}
            <Link
              href="/creatorCenter"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#52c41a',
                fontWeight: 500,
                fontSize: 16,
                gap: 8,
              }}
            >
              <FundProjectionScreenOutlined />
              创作中心
            </Link>
          </Card>
        </div>
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
              ...sidebarStyle
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
