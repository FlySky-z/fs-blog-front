'use client';
import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface StatItemProps {
  value: number | string;
  label: string;
  className?: string;
  onClick?: () => void;
}

/**
 * 统计项组件，用于显示数字+标签的统计信息
 */
const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  className,
  onClick
}) => {
  return (
    <div 
      className={`flex flex-col items-center ${className || ''}`}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        padding: '0 12px'
      }}
    >
      <Text strong style={{ fontSize: '18px', marginBottom: 4 }}>
        {value}
      </Text>
      <Text type="secondary" style={{ fontSize: '14px' }}>
        {label}
      </Text>
    </div>
  );
};

export default StatItem;
