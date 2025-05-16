'use client';
import React, { ReactNode } from 'react';
import { Typography } from 'antd';
import Link from 'next/link';

const { Text } = Typography;

interface MenuItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  href: string;
  onClick?: () => void;
  notification?: number;
}

/**
 * 侧边栏菜单项组件
 */
const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  text,
  active = false,
  href,
  onClick,
  notification
}) => {
  return (
    <Link 
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{ textDecoration: 'none' }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderRadius: '8px',
          background: active ? 'rgba(22, 119, 255, 0.1)' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.3s',
          color: active ? '#1677ff' : 'rgba(0, 0, 0, 0.65)',
        }}
      >
        <div style={{ fontSize: '18px', marginRight: '12px' }}>
          {icon}
        </div>
        <Text 
          strong={active} 
          style={{ 
            color: active ? '#1677ff' : 'inherit',
            flex: 1
          }}
        >
          {text}
        </Text>
        
        {notification !== undefined && notification > 0 && (
          <div style={{
            backgroundColor: '#ff4d4f',
            color: 'white',
            borderRadius: '10px',
            fontSize: '12px',
            padding: '0 6px',
            minWidth: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {notification > 99 ? '99+' : notification}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MenuItem;
