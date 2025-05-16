'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Layout, Grid, ConfigProvider } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import RocketToTop from '../ui/rocket';

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
      <Layout style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
        <Content>
          <div 
            style={{ 
              maxWidth: fullWidth ? '100%' : '1280px',
              margin: '0 auto',
              padding: isMobile ? '16px' : '24px',
            }}
          >
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '9fr 3fr',
              gap: '24px'
            }}>
              {/* 主内容区 */}
              <div>{main}</div>
              
              {/* 侧边栏 */}
              <div style={{ 
                display: isMobile ? 'none' : 'block',
              }}>
                {sidebar}
              </div>
            </div>
            
            {/* 移动端下，侧边栏内容显示在底部 */}
            {isMobile && (
              <div style={{ marginTop: '24px' }}>
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
