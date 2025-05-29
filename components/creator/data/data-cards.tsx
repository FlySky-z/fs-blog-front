'use client';
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styles from './data.module.scss';

interface DataCardProps {
  title: string;
  value: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: {
    value: number;
    type: 'up' | 'down' | 'none';
    label: string;
  };
  loading?: boolean;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  loading = false
}) => {
  const renderTrend = () => {
    if (!trend) return null;

    return (
      <div className={`${styles.trendIndicator} ${trend.type === 'up' ? styles.trendUp : trend.type === 'down' ? styles.trendDown : ''}`}>
        {trend.type === 'up' && <ArrowUpOutlined />}
        {trend.type === 'down' && <ArrowDownOutlined />}
        <span className={styles.trendText}>{trend.value} {trend.label}</span>
      </div>
    );
  };

  return (
    <Card className={styles.statCard} loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color: trend?.type === 'up' ? '#3f8600' : trend?.type === 'down' ? '#cf1322' : undefined }}
      />
      {renderTrend()}
    </Card>
  );
};

interface StatisticRowProps {
  stats: {
    totalArticles: number;
    totalLikes: number;
    totalViews: number;
    totalComments: number;
    last7DaysArticles: number;
    last30DaysArticles: number;
    last7DaysLikes: number;
    last30DaysLikes: number;
    last7DaysViews: number;
    last30DaysViews: number;
    last7DaysComments: number;
    last30DaysComments: number;
  };
  loading?: boolean;
}

export const StatisticRow: React.FC<StatisticRowProps> = ({ stats, loading = false }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <DataCard
          title="文章总数"
          value={stats.totalArticles}
          trend={{
            value: stats.last7DaysArticles,
            type: 'up',
            label: '(近7天)'
          }}
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <DataCard
          title="累计阅读量"
          value={stats.totalViews}
          trend={{
            value: stats.last7DaysViews,
            type: 'up',
            label: '(近7天)'
          }}
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <DataCard
          title="累计点赞数"
          value={stats.totalLikes}
          trend={{
            value: stats.last7DaysLikes,
            type: 'up',
            label: '(近7天)'
          }}
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <DataCard
          title="累计评论数"
          value={stats.totalComments}
          trend={{
            value: stats.last7DaysComments,
            type: 'up',
            label: '(近7天)'
          }}
          loading={loading}
        />
      </Col>
    </Row>
  );
};

interface ArticleStatusRowProps {
  stats: {
    publishedArticles: number;
    pendingArticles: number;
    rejectedArticles: number;
    draftArticles: number;
    totalArticles: number;
  };
  loading?: boolean;
}

export const ArticleStatusRow: React.FC<ArticleStatusRowProps> = ({ stats, loading = false }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <DataCard
          title="已发布文章"
          value={stats.publishedArticles}
          trend={{
            value: Math.round(stats.publishedArticles / (stats.totalArticles || 1) * 100),
            type: 'none',
            label: '%'
          }}
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <DataCard
          title="审核中文章"
          value={stats.pendingArticles}
          trend={{
            value: Math.round(stats.pendingArticles / (stats.totalArticles || 1) * 100),
            type: 'none',
            label: '%'
          }}
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <DataCard
          title="未通过文章"
          value={stats.rejectedArticles}
          trend={{
            value: Math.round(stats.rejectedArticles / (stats.totalArticles || 1) * 100),
            type: 'none',
            label: '%'
          }}
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <DataCard
          title="草稿箱文章"
          value={stats.draftArticles}
          trend={{
            value: Math.round(stats.draftArticles / (stats.totalArticles || 1) * 100),
            type: 'none',
            label: '%'
          }}
          loading={loading}
        />
      </Col>
    </Row>
  );
};

interface AverageStatsRowProps {
  stats: {
    avgLikesPerArticle: number;
    avgViewsPerArticle: number;
    avgCommentsPerArticle: number;
  };
  loading?: boolean;
}

export const AverageStatsRow: React.FC<AverageStatsRowProps> = ({ stats, loading = false }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <DataCard
          title="平均阅读量/文章"
          value={Math.round(stats.avgViewsPerArticle * 10) / 10}
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={8}>
        <DataCard
          title="平均点赞数/文章"
          value={Math.round(stats.avgLikesPerArticle * 10) / 10}
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={8}>
        <DataCard
          title="平均评论数/文章"
          value={Math.round(stats.avgCommentsPerArticle * 10) / 10}
          loading={loading}
        />
      </Col>
    </Row>
  );
};

export default {
  DataCard,
  StatisticRow,
  ArticleStatusRow,
  AverageStatsRow
};
