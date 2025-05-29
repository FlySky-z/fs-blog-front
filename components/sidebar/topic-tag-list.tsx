'use client';
import React from 'react';
import { Tag, Space } from 'antd';
import SidebarCard from './sidebar-card';
import Link from 'next/link';

interface Topic {
  id: string;
  name: string;
  articleCount?: number;
  color?: string;
}

interface TopicTagListProps {
  topics: Topic[];
  title?: string;
}

const TopicTagList: React.FC<TopicTagListProps> = ({
  topics,
  title = "相关话题",
}) => {
  // 预定义的颜色数组，用于随机分配颜色
  const colors = [
    'magenta', 'red', 'volcano', 'orange', 'gold',
    'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'
  ];
  
  // 如果话题没有指定颜色，根据id确定一个稳定的颜色
  const getTagColor = (id: string, defaultColor?: string) => {
    if (defaultColor) return defaultColor;
    
    // 使用字符串的字符码总和作为哈希值
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <SidebarCard title={title}>
      <Space size={[8, 12]} wrap>
        {topics.map(topic => (
          <Link 
            key={topic.id} 
            href={`/tags?tag=${topic.name}`}
            style={{ textDecoration: 'none' }}
          >
            <Tag 
              color={getTagColor(topic.id, topic.color)} 
              style={{ cursor: 'pointer', fontSize: '13px', padding: '4px 8px' }}
            >
              {topic.name}
              {topic.articleCount !== undefined && ` (${topic.articleCount})`}
            </Tag>
          </Link>
        ))}
      </Space>
    </SidebarCard>
  );
};

export default TopicTagList;
