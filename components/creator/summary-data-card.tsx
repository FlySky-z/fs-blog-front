'use client';
import React, { useState } from 'react';
import { Card, Typography, Tabs, Flex, Statistic, Row, Col } from 'antd';
import {
  TeamOutlined,
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
  StarOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { CreatorSummary } from '@/modules/creator/hooks/use-creator-summary';
import styles from './summary-data-card.module.scss';
import cardStyles from './card.module.scss';

const { Title } = Typography;

interface SummaryDataCardProps {
  weekData?: CreatorSummary | null;
  monthData?: CreatorSummary | null;
  totalData?: CreatorSummary | null;
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
    switch (activeTab) {
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
    <Card className={cardStyles.cardContainer} style={style} styles={{
      body: { padding: 0},
    }}>
      <div className={styles.header}>
        <Title level={5} ellipsis={true}>数据概览</Title>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          items={[
            { label: '7天', key: 'week' },
            { label: '30天', key: 'month' },
            { label: '总计', key: 'total' },
          ]}
        />
      </div>

      <Row gutter={[8, 8]}>
        {[
          {
            title: '新增粉丝',
            value: data?.newFans || "-",
            icon: <TeamOutlined />,
            key: 'newFans',
          },
          {
            title: '文章阅读',
            value: data?.reads || "-",
            icon: <EyeOutlined />,
            key: 'reads',
          },
          {
            title: '获得点赞',
            value: data?.likes || "-",
            icon: <LikeOutlined />,
            key: 'likes',
          },
          {
            title: '评论数',
            value: data?.comments || "-",
            icon: <CommentOutlined />,
            key: 'comments',
          },
          {
            title: '收藏数',
            value: data?.favorites || "-",
            icon: <StarOutlined />,
            key: 'favorites',
          },
          {
            title: '文章发布',
            value: data?.articlesPublished || "-",
            icon: <UploadOutlined />,
            key: 'articlesPublished',
          },
        ].map(({ title, value, icon, key }) => (
          <Col key={key} xs={12} sm={4} md={4} lg={4}>
            <Statistic
              title={<span style={{ fontSize: 14 }}>{title}</span>}
              value={value}
              prefix={icon}
              valueStyle={{ fontSize: 18 }}
            />
          </Col>
        ))}
      </Row>
    </Card >
  );
};

export default SummaryDataCard;
