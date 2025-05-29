'use client';

import React, { Suspense } from 'react';
import { Card, Tabs, Typography, Spin, Statistic, Row, Col, Progress, Empty, Alert, Button, Space, Tooltip, Tag } from 'antd';
import { useSearchParams, useRouter } from 'next/navigation';
import CreatorLayout from '@/components/templates/creator-layout';
import {
  LineChartOutlined,
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import styles from './data.module.scss';
import { StatisticRow, ArticleStatusRow, AverageStatsRow } from '@/components/creator/data/data-cards';
import { ArticleTrendChart, ArticleStatusChart, TagDistributionChart, TimeDistributionChart } from '@/components/charts/article-charts';
import useArticleAnalytics from '@/modules/creator/hooks/use-article-analytics';
import useCreatorAnnouncements from '@/modules/creator/hooks/use-creator-announcements';
import { useUserStore } from '@/store/userStore';
import DateRangePicker from '@/components/molecules/date-range-picker';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

/**
 * 数据中心页面内容组件
 */
function DataCenterPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { stats, loading, error, dateRange, setDateRange, filteredArticles } = useArticleAnalytics();
  const { announcements } = useCreatorAnnouncements();

  // 获取当前活动的tab
  const activeTab = searchParams.get('tab') || 'overview';

  // 切换tab时更新URL参数
  const handleTabChange = (key: string) => {
    router.push(`/creatorCenter/data?tab=${key}`);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    setDateRange(dates);
  };

  // 如果用户未登录，显示提示
  if (!userInfo) {
    return (
      <CreatorLayout>
        <Card className={styles.fullWidth + ' ' + styles.marginBottom4}>
          <Empty description="请先登录" />
        </Card>
      </CreatorLayout>
    );
  }

  // 如果发生错误，显示错误提示
  if (error) {
    return (
      <CreatorLayout>
        <Card className={styles.fullWidth + ' ' + styles.marginBottom4}>
          <Alert
            message="数据获取失败"
            description="无法获取您的文章数据，请稍后再试。"
            type="error"
            showIcon
          />
        </Card>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <Card className={styles.fullWidth + ' ' + styles.marginBottom4}>
        <Title level={4}>数据中心</Title>

        {/* 创作公告 */}
        {announcements.length > 0 && (
          <div className={styles.marginBottom4}>
            <Alert
              message={`创作公告: ${announcements[0].content}`}
              type="info"
              showIcon
              banner
            />
          </div>
        )}

        {/* 日期范围选择器 */}
        <div className={styles.marginBottom4}>
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </div>

        {/* 分析结果信息 */}
        {dateRange[0] && dateRange[1] && (
          <Alert
            message={
              <div className={styles.flexBetween}>
                <span>
                  当前筛选: {dateRange[0].format('YYYY-MM-DD')} 至 {dateRange[1].format('YYYY-MM-DD')}
                  {filteredArticles.length > 0 ?
                    `，共 ${filteredArticles.length} 篇文章` :
                    '，该时间段内没有文章'}
                </span>
                <Button
                  type="link"
                  onClick={() => setDateRange([null, null])}
                  size="small"
                >
                  清除筛选
                </Button>
              </div>
            }
            type="info"
            showIcon
            className={styles.marginBottom4}
          />
        )}

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className={styles.analyticsTabs}
          items={[
            {
              key: 'overview',
              label: '综合数据',
              icon: <BarChartOutlined />,
              children: (
                <div className={styles.tabContent}>
                  {/* 统计数据卡片 */}
                  {stats ? (
                    <StatisticRow stats={stats} loading={loading} />
                  ) : (
                    <StatisticRow
                      stats={{
                        totalArticles: 0,
                        totalLikes: 0,
                        totalViews: 0,
                        totalComments: 0,
                        last7DaysArticles: 0,
                        last30DaysArticles: 0,
                        last7DaysLikes: 0,
                        last30DaysLikes: 0,
                        last7DaysViews: 0,
                        last30DaysViews: 0,
                        last7DaysComments: 0,
                        last30DaysComments: 0
                      }}
                      loading={true}
                    />
                  )}

                  {/* 趋势图表 */}
                  <Card className={`${styles.chartCard} ${styles.marginTop6}`} title={
                    <div className={`${styles.flexBetween} ${styles.flexWrap}`}>
                      <span>数据趋势</span>
                      <Space>
                        <Tooltip title="导出数据">
                          <Button type="text" icon={<DownloadOutlined />} size="small" />
                        </Tooltip>
                      </Space>
                    </div>
                  }>
                    {stats ? (
                      <ArticleTrendChart
                        articleTrend={stats.articleTrend}
                        likeTrend={stats.likeTrend}
                        viewTrend={stats.viewTrend}
                        loading={loading}
                      />
                    ) : (
                      <div className={styles.chartContainer}>
                        <Spin size="large" />
                      </div>
                    )}
                  </Card>

                  {/* 状态和标签分布 */}
                  <Row gutter={[16, 16]} className={styles.marginTop6}>
                    <Col xs={24} lg={12}>
                      <Card className={styles.chartCard} title="文章状态分布">
                        {stats ? (
                          <ArticleStatusChart
                            statusDistribution={stats.statusDistribution}
                            loading={loading}
                          />
                        ) : (
                          <div className={styles.chartContainerMedium}>
                            <Spin size="large" />
                          </div>
                        )}
                      </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Card className={styles.chartCard} title="热门标签">
                        {stats && stats.popularTags.length > 0 ? (
                          <TagDistributionChart
                            popularTags={stats.popularTags}
                            loading={loading}
                          />
                        ) : (
                          <div className={styles.chartContainerMedium}>
                            {loading ? (
                              <Spin size="large" />
                            ) : (
                              <Empty description="暂无标签数据" />
                            )}
                          </div>
                        )}
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            },
            {
              key: 'articles',
              label: '文章分析',
              icon: <LineChartOutlined />,
              children: (
                <div className={styles.tabContent}>
                  {/* 文章状态统计 */}
                  {stats ? (
                    <ArticleStatusRow stats={stats} loading={loading} />
                  ) : (
                    <ArticleStatusRow
                      stats={{
                        publishedArticles: 0,
                        pendingArticles: 0,
                        rejectedArticles: 0,
                        draftArticles: 0,
                        totalArticles: 0
                      }}
                      loading={true}
                    />
                  )}

                  {/* 平均数据统计 */}
                  <div className={styles.marginTop6}>
                    <Title level={5}>互动数据</Title>
                    {stats ? (
                      <AverageStatsRow stats={stats} loading={loading} />
                    ) : (
                      <AverageStatsRow
                        stats={{
                          avgLikesPerArticle: 0,
                          avgViewsPerArticle: 0,
                          avgCommentsPerArticle: 0
                        }}
                        loading={true}
                      />
                    )}
                  </div>

                  {/* 文章发布时间分析 */}
                  <Card className={`${styles.chartCard} ${styles.marginTop6}`} title="发布时间分析">
                    {stats ? (
                      <TimeDistributionChart
                        weekdayDistribution={stats.weekdayDistribution}
                        timeDistribution={stats.timeDistribution}
                        loading={loading}
                      />
                    ) : (
                      <div className={styles.chartContainerMedium}>
                        <Spin size="large" />
                      </div>
                    )}
                  </Card>

                  {/* 标签分布 */}
                  <Card className={`${styles.chartCard} ${styles.marginTop6}`} title="标签分析">
                    {stats && stats.popularTags.length > 0 ? (
                      <TagDistributionChart
                        popularTags={stats.popularTags}
                        loading={loading}
                        style={{ height: '400px' }}
                      />
                    ) : (
                      <div className={styles.chartContainerMedium}>
                        {loading ? (
                          <Spin size="large" />
                        ) : (
                          <Empty description="暂无标签数据" />
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              )
            },
            {
              key: 'interaction',
              label: '互动分析',
              icon: <CommentOutlined />,
              children: (
                <div className={styles.tabContent}>
                  {/* 互动数据总览 */}
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Card className={styles.chartCard}>
                        <Statistic
                          title="总阅读量"
                          value={stats?.totalViews || 0}
                          prefix={<EyeOutlined />}
                          loading={loading}
                        />
                        <div className={styles.marginTop4}>
                          <div className={styles.flexBetween}>
                            <span>近7天</span>
                            <span>{stats?.last7DaysViews || 0}</span>
                          </div>
                          <Progress
                            percent={stats ? Math.min(100, Math.round(stats.last7DaysViews / (stats.totalViews || 1) * 100)) : 0}
                            size="small"
                          />

                          <div className={`${styles.flexBetween} ${styles.marginTop2}`}>
                            <span>近30天</span>
                            <span>{stats?.last30DaysViews || 0}</span>
                          </div>
                          <Progress
                            percent={stats ? Math.min(100, Math.round(stats.last30DaysViews / (stats.totalViews || 1) * 100)) : 0}
                            size="small"
                          />
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} md={8}>
                      <Card className={styles.chartCard}>
                        <Statistic
                          title="总点赞数"
                          value={stats?.totalLikes || 0}
                          prefix={<LikeOutlined />}
                          loading={loading}
                        />
                        <div className={styles.marginTop4}>
                          <div className={styles.flexBetween}>
                            <span>近7天</span>
                            <span>{stats?.last7DaysLikes || 0}</span>
                          </div>
                          <Progress
                            percent={stats ? Math.min(100, Math.round(stats.last7DaysLikes / (stats.totalLikes || 1) * 100)) : 0}
                            size="small"
                          />

                          <div className={`${styles.flexBetween} ${styles.marginTop2}`}>
                            <span>近30天</span>
                            <span>{stats?.last30DaysLikes || 0}</span>
                          </div>
                          <Progress
                            percent={stats ? Math.min(100, Math.round(stats.last30DaysLikes / (stats.totalLikes || 1) * 100)) : 0}
                            size="small"
                          />
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} md={8}>
                      <Card className={styles.chartCard}>
                        <Statistic
                          title="总评论数"
                          value={stats?.totalComments || 0}
                          prefix={<CommentOutlined />}
                          loading={loading}
                        />
                        <div className={styles.marginTop4}>
                          <div className={styles.flexBetween}>
                            <span>近7天</span>
                            <span>{stats?.last7DaysComments || 0}</span>
                          </div>
                          <Progress
                            percent={stats ? Math.min(100, Math.round(stats.last7DaysComments / (stats.totalComments || 1) * 100)) : 0}
                            size="small"
                          />

                          <div className={`${styles.flexBetween} ${styles.marginTop2}`}>
                            <span>近30天</span>
                            <span>{stats?.last30DaysComments || 0}</span>
                          </div>
                          <Progress
                            percent={stats ? Math.min(100, Math.round(stats.last30DaysComments / (stats.totalComments || 1) * 100)) : 0}
                            size="small"
                          />
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* 趋势图表 */}
                  <Card className={`${styles.chartCard} mt-6`} title="互动趋势">
                    {stats ? (
                      <ArticleTrendChart
                        articleTrend={stats.articleTrend}
                        likeTrend={stats.likeTrend}
                        viewTrend={stats.viewTrend}
                        loading={loading}
                      />
                    ) : (
                      <div className={styles.chartContainer}>
                        <Spin size="large" />
                      </div>
                    )}
                  </Card>

                  {/* 互动率分析 */}
                  <Card className={`${styles.chartCard} ${styles.marginTop6}`} title="互动率分析">
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={8}>
                        <Statistic
                          title="平均阅读量/文章"
                          value={stats ? Math.round(stats.avgViewsPerArticle * 10) / 10 : 0}
                          loading={loading}
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <Statistic
                          title="平均点赞/文章"
                          value={stats ? Math.round(stats.avgLikesPerArticle * 10) / 10 : 0}
                          loading={loading}
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <Statistic
                          title="平均评论/文章"
                          value={stats ? Math.round(stats.avgCommentsPerArticle * 10) / 10 : 0}
                          loading={loading}
                        />
                      </Col>
                    </Row>
                  </Card>
                </div>
              )
            },
            {
              key: 'patterns',
              label: '发布规律',
              icon: <ClockCircleOutlined />,
              children: (
                <div className={styles.tabContent}>
                  {/* 发布时间分析 */}
                  <Card className={`${styles.chartCard}`} title="发布时间分析">
                    {stats ? (
                      <TimeDistributionChart
                        weekdayDistribution={stats.weekdayDistribution}
                        timeDistribution={stats.timeDistribution}
                        loading={loading}
                        style={{ height: '400px' }}
                      />
                    ) : (
                      <div className={styles.chartContainer}>
                        <Spin size="large" />
                      </div>
                    )}
                  </Card>

                  {/* 发布规律分析结果 */}
                  <Card className={`${styles.chartCard} mt-6`} title="发布规律分析">
                    {stats && !loading ? (
                      <div>
                        <Title level={5}>您的发布时间</Title>
                        <Paragraph>
                          根据您的历史发布数据分析，您最常在
                          <strong className={styles.marginX1}>
                            {stats.weekdayDistribution.indexOf(Math.max(...stats.weekdayDistribution)) === 0
                              ? '周日'
                              : `周${stats.weekdayDistribution.indexOf(Math.max(...stats.weekdayDistribution))}`}
                          </strong>
                          的
                          <strong className={styles.marginX1}>
                            {stats.timeDistribution.indexOf(Math.max(...stats.timeDistribution))}点
                          </strong>
                          发布文章。
                        </Paragraph>

                        <Title level={5} className={styles.marginTop4}>发布建议</Title>

                        <Title level={5} className={styles.marginTop4}>内容建议</Title>
                        <Paragraph>
                          您的高互动文章通常带有标签：
                          {stats.popularTags.slice(0, 3).map((tagItem, index) => (
                            <Tag key={index} color="blue" className={styles.marginX1}>{tagItem.tag}</Tag>
                          ))}
                        </Paragraph>
                      </div>
                    ) : (
                      <div className={styles.chartContainerSmall}>
                        <Spin size="large" />
                      </div>
                    )}
                  </Card>
                </div>
              )
            }
          ]}
        />
      </Card>
    </CreatorLayout>
  );
}

/**
 * 数据中心页面
 */
export default function DataCenterPage() {
  return (
    <Suspense fallback={<Spin />}>
      <DataCenterPageInner />
    </Suspense>
  );
}
