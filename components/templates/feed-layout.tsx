'use client';
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { Layout, Grid, ConfigProvider } from 'antd';
import styles from './feed-layout.module.css';

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
      const twoThirdsViewport = windowHeight * 2/3;
      
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
      <Layout style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
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
      </Layout>
    </ConfigProvider>
  );
};

export default FeedLayout;
