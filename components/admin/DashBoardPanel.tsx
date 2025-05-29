'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Statistic, Tabs, DatePicker, Space, Button } from 'antd';
import {
  Line,
  Column,
  Pie,
  Area,
  DualAxes
} from '@ant-design/charts';
import {
  FileTextOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface DashBoardPanelProps {
  className?: string;
}

/**
 * 管理中心仪表板面板
 * 展示平台整体数据指标和趋势分析
 */
const DashBoardPanel: React.FC<DashBoardPanelProps> = ({ className }) => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [loading, setLoading] = useState(false);

  // 模拟数据 - 在实际项目中应该从API获取
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalArticles: 12580,
      totalUsers: 8964,
      abnormalUsers: 23,
      pendingReviews: 47,
      todayViews: 15678,
      todayRegistrations: 89
    },
    articleTrend: [] as any[],
    userGrowth: [] as any[],
    contentStatus: [] as any[],
    abnormalDetection: [] as any[],
    regionDistribution: [] as any[]
  });

  // 用 useCallback 包裹 generateMockData
  const generateMockData = useCallback(() => {
    setLoading(true);

    // 文章发布趋势数据
    const articleTrendData = [];
    const userGrowthData = [];
    const abnormalData = [];

    for (let i = 29; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');

      // 文章趋势
      articleTrendData.push({
        date,
        published: Math.floor(Math.random() * 50) + 20,
        reviewed: Math.floor(Math.random() * 30) + 10,
        rejected: Math.floor(Math.random() * 10) + 2
      });

      // 用户增长
      userGrowthData.push({
        date,
        newUsers: Math.floor(Math.random() * 80) + 40,
        activeUsers: Math.floor(Math.random() * 500) + 800
      });

      // 异常检测
      abnormalData.push({
        date,
        loginAbnormal: Math.floor(Math.random() * 10) + 1,
        behaviorAbnormal: Math.floor(Math.random() * 5) + 1,
        contentAbnormal: Math.floor(Math.random() * 8) + 2
      });
    }

    // 内容审核状态分布
    const contentStatusData = [
      { type: '已发布', value: 8450 },
      { type: '待审核', value: 347 },
      { type: '已驳回', value: 125 },
      { type: '已下架', value: 89 }
    ];

    // 地域分布数据
    const regionData = [
      { region: '北京', users: 1245, articles: 3456 },
      { region: '上海', users: 1120, articles: 2890 },
      { region: '广州', users: 890, articles: 2234 },
      { region: '深圳', users: 780, articles: 1998 },
      { region: '杭州', users: 650, articles: 1567 },
      { region: '其他', users: 4279, articles: 5635 }
    ];

    setDashboardData({
      ...dashboardData,
      articleTrend: articleTrendData,
      userGrowth: userGrowthData,
      contentStatus: contentStatusData,
      abnormalDetection: abnormalData,
      regionDistribution: regionData
    });

    setTimeout(() => setLoading(false), 500);
  }, [dashboardData]);

  // 只在组件挂载时调用一次 generateMockData
  useEffect(() => {
    generateMockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 文章趋势图配置
  const articleTrendConfig = {
    data: dashboardData.articleTrend,
    xField: 'date',
    yField: 'published',
    seriesField: 'type',
    point: {
      size: 3,
      shape: 'circle'
    },
    lineStyle: {
      lineWidth: 2
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000
      }
    }
  };

  // 用户增长双轴图配置
  const userGrowthConfig = {
    data: [dashboardData.userGrowth, dashboardData.userGrowth],
    xField: 'date',
    yField: ['newUsers', 'activeUsers'],
    geometryOptions: [
      {
        geometry: 'column',
        yField: 'newUsers',
        color: '#5B8FF9',
        columnWidthRatio: 0.4
      },
      {
        geometry: 'line',
        yField: 'activeUsers',
        color: '#5AD8A6',
        lineStyle: {
          lineWidth: 2
        },
        point: {
          size: 3
        }
      }
    ],
    legend: {
      itemName: {
        formatter: (text: string, item: any) => {
          return text === 'newUsers' ? '新增用户' : '活跃用户';
        }
      }
    },
    xAxis: {
      type: 'time',
      tickCount: 5
    },
    yAxis: {
      newUsers: {
        title: {
          text: '新增用户数'
        }
      },
      activeUsers: {
        title: {
          text: '活跃用户数'
        }
      }
    }
  };

  // 内容状态饼图配置
  const contentStatusConfig = {
    data: dashboardData.contentStatus,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      offset: '-50%',
      content: (data: any) => `${data.value}`,
      style: {
        textAlign: 'center',
        fontSize: 14,
        fill: '#fff',
        fontWeight: 'bold'
      }
    },
    legend: {
      position: 'bottom' as const
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' }
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
        content: '总内容'
      }
    },
    color: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16']
  };

  // 异常检测堆叠面积图配置
  const abnormalDetectionConfig = {
    data: dashboardData.abnormalDetection.flatMap(item => [
      { date: item.date, type: '登录异常', count: item.loginAbnormal },
      { date: item.date, type: '行为异常', count: item.behaviorAbnormal },
      { date: item.date, type: '内容异常', count: item.contentAbnormal }
    ]),
    xField: 'date',
    yField: 'count',
    seriesField: 'type',
    smooth: true,
    isStack: true,
    color: ['#ff4d4f', '#faad14', '#722ed1']
  };

  return (
    <div className={className}>
      {/* 时间选择器 */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            allowClear={false}
          />
          <Button onClick={generateMockData} loading={loading}>
            刷新数据
          </Button>
        </Space>
      </div>

      {/* 概览指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="总文章数"
              value={dashboardData.overview.totalArticles}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="总用户数"
              value={dashboardData.overview.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="异常账号"
              value={dashboardData.overview.abnormalUsers}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="待审核"
              value={dashboardData.overview.pendingReviews}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="今日浏览"
              value={dashboardData.overview.todayViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="今日注册"
              value={dashboardData.overview.todayRegistrations}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="文章发布趋势" loading={loading}>
            <Line {...articleTrendConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="用户增长趋势" loading={loading}>
            <DualAxes {...userGrowthConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <Card title="内容审核状态" loading={loading}>
            <Pie {...contentStatusConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="异常检测趋势" loading={loading}>
            <Area {...abnormalDetectionConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 地域分布表格 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="地域分布统计" loading={loading}>
            <Row gutter={[16, 16]}>
              {dashboardData.regionDistribution.map((region, index) => (
                <Col xs={12} sm={8} lg={4} key={index}>
                  <Card size="small">
                    <Statistic
                      title={region.region}
                      value={region.users}
                      suffix="用户"
                      valueStyle={{ fontSize: 16 }}
                    />
                    <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
                      {region.articles} 篇文章
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashBoardPanel;