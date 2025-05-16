'use client';
import React from 'react';
import { Tag } from 'antd';
import { TagProps } from 'antd/es/tag';

interface TagBadgeProps extends TagProps {
  level?: number;
  type?: 'level' | 'custom' | 'location';
  text?: string;
}

/**
 * 通用标签徽章组件，可用于显示用户等级、地点或自定义标签
 */
const TagBadge: React.FC<TagBadgeProps> = ({
  level,
  type = 'custom',
  text,
  color,
  ...rest
}) => {
  // 根据类型和等级选择颜色
  const getColor = () => {
    if (color) return color;
    
    if (type === 'level') {
      const levelColors = ['#bfbfbf', '#52c41a', '#1677ff', '#722ed1', '#f5222d', '#faad14'];
      // 限制level范围在1-6之间
      const safeLevel = Math.max(1, Math.min(6, level || 1));
      return levelColors[safeLevel - 1];
    }
    
    if (type === 'location') {
      return '#2db7f5';
    }
    
    return '#108ee9'; // 默认颜色
  };
  
  // 生成显示文本
  const displayText = () => {
    if (text) return text;
    if (type === 'level') return `Lv.${level}`;
    return '';
  };
  
  return (
    <Tag color={getColor()} style={{ borderRadius: 10 }} {...rest}>
      {displayText()}
    </Tag>
  );
};

export default TagBadge;
