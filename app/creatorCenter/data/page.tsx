'use client';

import React, {Suspense} from 'react';
import { Card, Tabs, Typography, Spin, Statistic, Row, Col, Progress } from 'antd';
import { useSearchParams, useRouter } from 'next/navigation';
import CreatorLayout from '@/components/templates/creator-layout';
import { 
  LineChartOutlined, 
  RiseOutlined, 
  TeamOutlined, 
  EyeOutlined,
  LikeOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

/**
 * 数据中心页面
 */
function DataCenterPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 获取当前活动的tab
  const activeTab = searchParams.get('tab') || 'overview';
  
  // 切换tab时更新URL参数
  const handleTabChange = (key: string) => {
    router.push(`/creatorCenter/data?tab=${key}`);
  };
  
  return (
    <CreatorLayout>
      <Card className="w-full mb-4">
        <Title level={4}>数据中心</Title>
        
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="综合数据" key="overview">
            <div className="py-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic 
                      title="总粉丝数" 
                      value={238} 
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: '#1677ff' }}
                    />
                    <div className="mt-2">
                      <span className="text-green-500">
                        <RiseOutlined /> +12 (近7天)
                      </span>
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic 
                      title="累计阅读量" 
                      value={8964} 
                      prefix={<EyeOutlined />}
                    />
                    <div className="mt-2">
                      <span className="text-green-500">
                        <RiseOutlined /> +432 (近7天)
                      </span>
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic 
                      title="累计点赞" 
                      value={1527} 
                      prefix={<LikeOutlined />}
                    />
                    <div className="mt-2">
                      <span className="text-green-500">
                        <RiseOutlined /> +78 (近7天)
                      </span>
                    </div>
                  </Card>
                </Col>
              </Row>
              
              <div className="mt-6">
                <Title level={5}>成长趋势</Title>
                <Card className="mt-2">
                  <div className="h-48 flex items-center justify-center bg-gray-50">
                    <LineChartOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                    <Paragraph className="ml-2 text-gray-400">数据图表展示区域</Paragraph>
                  </div>
                </Card>
              </div>
            </div>
          </TabPane>
          
          <TabPane tab="粉丝分析" key="fans">
            <div className="py-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="粉丝增长">
                    <Statistic 
                      title="总粉丝数" 
                      value={238} 
                      valueStyle={{ color: '#1677ff' }}
                    />
                    <div className="mt-4">
                      <div className="flex justify-between">
                        <span>近7天新增</span>
                        <span>12 人</span>
                      </div>
                      <Progress percent={5} size="small" />
                      
                      <div className="flex justify-between mt-2">
                        <span>近30天新增</span>
                        <span>47 人</span>
                      </div>
                      <Progress percent={20} size="small" />
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <Card title="粉丝活跃度">
                    <div className="h-48 flex items-center justify-center bg-gray-50">
                      <TeamOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                      <Paragraph className="ml-2 text-gray-400">粉丝活跃度图表区域</Paragraph>
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24}>
                  <Card title="粉丝互动率">
                    <div className="py-4">
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Statistic 
                            title="点赞率" 
                            value="5.2%" 
                            valueStyle={{ color: '#1677ff' }}
                          />
                        </Col>
                        <Col span={8}>
                          <Statistic 
                            title="评论率" 
                            value="2.1%" 
                            valueStyle={{ color: '#1677ff' }}
                          />
                        </Col>
                        <Col span={8}>
                          <Statistic 
                            title="收藏率" 
                            value="3.7%" 
                            valueStyle={{ color: '#1677ff' }}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </CreatorLayout>
  );
}

export default function DataCenterPage() {
  return (
    <Suspense fallback={<Spin />}>
      <DataCenterPageInner />
    </Suspense>
  );
}