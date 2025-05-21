'use client';
import React, { useState } from 'react';
import { Card, Typography, Tabs, Row, Col, Statistic } from 'antd';
import { 
  TeamOutlined, 
  EyeOutlined, 
  LikeOutlined, 
  CommentOutlined, 
  StarOutlined 
} from '@ant-design/icons';
import styles from './summary-data-card.module.scss';

const { Title } = Typography;
const { TabPane } = Tabs;

interface StatData {
  newFans: number;
  reads: number;
  likes: number;
  comments: number;
  favorites: number;
}

interface SummaryDataCardProps {
  weekData: StatData;
  monthData: StatData;
  totalData: StatData;
  style?: React.CSSProperties;
}

const SummaryDataCard: React.FC<SummaryDataCardProps> = ({
  weekData,
  monthData,
  totalData,
  style
}) => {
  const [activeTab, setActiveTab] = useState<string>('week');
  
  // 根据当前选中的 tab 获取对应数据
  const getActiveData = () => {
    switch(activeTab) {
      case 'week':
        return weekData;
      case 'month':
        return monthData;
      case 'total':
        return totalData;
      default:
        return weekData;
    }
  };
  
  const data = getActiveData();

  return (
    <Card className={styles.cardContainer} style={style}>
      <div className={styles.header}>
        <Title level={5} className={styles.headerTitle}>数据概览</Title>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="small"
        >
          <TabPane tab="7天" key="week" />
          <TabPane tab="30天" key="month" />
          <TabPane tab="总计" key="total" />
        </Tabs>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col span={24} md={8} lg={4} xl={4}>
          <Statistic 
            title="新增粉丝" 
            value={data.newFans} 
            prefix={<TeamOutlined />} 
            className={styles.statistic}
          />
        </Col>
        <Col span={24} md={8} lg={5} xl={5}>
          <Statistic 
            title="文章阅读" 
            value={data.reads} 
            prefix={<EyeOutlined />}
          />
        </Col>
        <Col span={24} md={8} lg={5} xl={5}>
          <Statistic 
            title="获得点赞" 
            value={data.likes} 
            prefix={<LikeOutlined />}
          />
        </Col>
        <Col span={24} md={8} lg={5} xl={5}>
          <Statistic 
            title="评论数" 
            value={data.comments} 
            prefix={<CommentOutlined />}
          />
        </Col>
        <Col span={24} md={8} lg={5} xl={5}>
          <Statistic 
            title="收藏数" 
            value={data.favorites} 
            prefix={<StarOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SummaryDataCard;
