'use client';
import React, { ReactNode } from 'react';
import { Card, Typography } from 'antd';
import styles from './sidebar-card.module.css';

const { Title } = Typography;

interface SidebarCardProps {
  title?: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SidebarCard: React.FC<SidebarCardProps> = ({
  title,
  extra,
  children,
  className,
  style,
}) => {
  return (
    <Card 
      title={title ? <Title level={5} style={{ margin: 0 }}>{title}</Title> : null}
      extra={extra}
      style={{ marginBottom: 16, width: '100%', ...style }}
      className={`${styles.sidebarCard} ${className || ''}`}
      size="small"
    >
      {children}
    </Card>
  );
};

export default SidebarCard;
