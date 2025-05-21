'use client';
import React from 'react';
import { Card, Typography, List, Tag, Skeleton, Breadcrumb } from 'antd';
import { BellOutlined, NotificationOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import CreatorLayout from '@/components/templates/creator-layout';
import useCreatorAnnouncements from '@/modules/creator/hooks/use-creator-announcements';

const { Title, Text, Paragraph } = Typography;

/**
 * 创作公告页面
 */
export default function AnnouncementsPage() {
  const { loading, announcements, error } = useCreatorAnnouncements();
  
  // 扩展公告数据，用于展示更多内容
  const extendedAnnouncements = loading ? [] : [
    ...announcements,
    {
      id: 'ann-extra-1',
      content: '5月内容创作奖励计划开始报名，最高可获得1000元奖金',
      date: '2025-05-10'
    },
    {
      id: 'ann-extra-2',
      content: '新功能上线：草稿自动保存和定时发布功能已开放',
      date: '2025-05-02'
    },
    {
      id: 'ann-extra-3',
      content: '创作者课堂：如何提高文章阅读量和互动率',
      date: '2025-04-28'
    },
    {
      id: 'ann-extra-4',
      content: '4月优秀创作者名单已公布，查看是否有你',
      date: '2025-04-25'
    }
  ];
  
  const renderContent = () => {
    if (loading) {
      return <Skeleton paragraph={{ rows: 10 }} active />;
    }
    
    if (error) {
      return <Text type="danger">加载公告失败，请刷新页面重试</Text>;
    }
    
    return (
      <List
        itemLayout="vertical"
        dataSource={extendedAnnouncements}
        renderItem={(item, index) => (
          <List.Item
            key={item.id}
            extra={
              index < 3 && <Tag color="red">NEW</Tag>
            }
          >
            <div className="flex items-start">
              <NotificationOutlined 
                style={{ 
                  fontSize: '24px', 
                  marginRight: '16px',
                  color: index < 3 ? '#1677ff' : '#8c8c8c'
                }} 
              />
              
              <div>
                <Paragraph>
                  <Text strong>{item.content}</Text>
                </Paragraph>
                <Text type="secondary">{item.date}</Text>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };
  
  return (
    <CreatorLayout>
      <Card className="w-full">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link href="/creatorCenter">
              <HomeOutlined /> 创作中心
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <BellOutlined /> 创作公告
          </Breadcrumb.Item>
        </Breadcrumb>
        
        <div className="flex items-center mb-4">
          <BellOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
          <Title level={4} style={{ margin: 0 }}>创作公告</Title>
        </div>
        
        {renderContent()}
      </Card>
    </CreatorLayout>
  );
}
