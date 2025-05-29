'use client';
import React from 'react';
import ChartComponent from './chart-component';
import { ArticleStats } from '@/modules/creator/hooks/use-article-analytics';
import type { EChartsOption } from 'echarts';

interface ArticleTrendChartProps {
  articleTrend: ArticleStats['articleTrend'];
  likeTrend: ArticleStats['likeTrend'];
  viewTrend: ArticleStats['viewTrend'];
  loading?: boolean;
  style?: React.CSSProperties;
}

/**
 * 文章发布趋势图表
 */
export const ArticleTrendChart: React.FC<ArticleTrendChartProps> = ({
  articleTrend,
  likeTrend,
  viewTrend,
  loading = false,
  style
}) => {
  const options: EChartsOption = {
    title: {
      text: '文章数据趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const
      }
    },
    legend: {
      data: ['文章数量', '点赞数', '阅读数'],
      bottom: 10
    },
    grid: {
      top: 50,
      left: 50,
      right: 50,
      bottom: 60
    },
    xAxis: {
      type: 'category' as const,
      data: articleTrend.map(item => item.date),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: [
      {
        type: 'value' as const,
        name: '文章数量',
        position: 'left' as const
      },
      {
        type: 'value' as const,
        name: '互动数',
        position: 'right' as const
      }
    ],
    series: [
      {
        name: '文章数量',
        type: 'bar' as const,
        data: articleTrend.map(item => item.count),
        yAxisIndex: 0,
        itemStyle: {
          color: '#5470c6'
        }
      },
      {
        name: '点赞数',
        type: 'line' as const,
        smooth: true,
        data: likeTrend.map(item => item.count),
        yAxisIndex: 1,
        itemStyle: {
          color: '#ee6666'
        }
      },
      {
        name: '阅读数',
        type: 'line' as const,
        smooth: true,
        data: viewTrend.map(item => item.count),
        yAxisIndex: 1,
        itemStyle: {
          color: '#91cc75'
        }
      }
    ]
  };

  return (
    <ChartComponent
      options={options}
      loading={loading}
      style={style || { height: '400px', width: '100%' }}
    />
  );
};

interface ArticleStatusChartProps {
  statusDistribution: ArticleStats['statusDistribution'];
  loading?: boolean;
  style?: React.CSSProperties;
}

/**
 * 文章状态分布图表
 */
export const ArticleStatusChart: React.FC<ArticleStatusChartProps> = ({
  statusDistribution,
  loading = false,
  style
}) => {
  const options: EChartsOption = {
    title: {
      text: '文章状态分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical' as const,
      left: 10,
      top: 'center',
      data: ['草稿', '未通过', '审核中', '已发布']
    },
    series: [
      {
        name: '文章状态',
        type: 'pie' as const,
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center' as const
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold' as const
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: statusDistribution[0], name: '草稿', itemStyle: { color: '#909399' } },
          { value: statusDistribution[1], name: '未通过', itemStyle: { color: '#f56c6c' } },
          { value: statusDistribution[2], name: '审核中', itemStyle: { color: '#e6a23c' } },
          { value: statusDistribution[3], name: '已发布', itemStyle: { color: '#67c23a' } }
        ]
      }
    ]
  };

  return (
    <ChartComponent
      options={options}
      loading={loading}
      style={style || { height: '300px', width: '100%' }}
    />
  );
};

interface TagDistributionChartProps {
  popularTags: ArticleStats['popularTags'];
  loading?: boolean;
  style?: React.CSSProperties;
}

/**
 * 标签分布图表
 */
export const TagDistributionChart: React.FC<TagDistributionChartProps> = ({
  popularTags,
  loading = false,
  style
}) => {
  const options: EChartsOption = {
    title: {
      text: '标签分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const
      }
    },
    grid: {
      top: 50,
      left: 100,
      right: 20,
      bottom: 30
    },
    xAxis: {
      type: 'value' as const
    },
    yAxis: {
      type: 'category' as const,
      data: popularTags.map(item => item.tag),
      axisLabel: {
        width: 80,
        overflow: 'truncate' as const
      }
    },
    series: [
      {
        name: '文章数量',
        type: 'bar' as const,
        data: popularTags.map(item => item.count),
        itemStyle: {
          color: function(params: any) {
            const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
            return colorList[params.dataIndex % colorList.length];
          }
        }
      }
    ]
  };

  return (
    <ChartComponent
      options={options}
      loading={loading}
      style={style || { height: '350px', width: '100%' }}
    />
  );
};

interface TimeDistributionChartProps {
  weekdayDistribution: ArticleStats['weekdayDistribution'];
  timeDistribution: ArticleStats['timeDistribution'];
  loading?: boolean;
  style?: React.CSSProperties;
}

/**
 * 发布时间分布图表
 */
export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({
  weekdayDistribution,
  timeDistribution,
  loading = false,
  style
}) => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}点`);

  const options: EChartsOption = {
    title: {
      text: '发布时间分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const
      }
    },
    legend: {
      data: ['星期分布', '时间段分布'],
      bottom: 10
    },
    grid: {
      top: 50,
      left: 50,
      right: 20,
      bottom: 60
    },
    xAxis: [
      {
        type: 'category' as const,
        axisTick: { show: false },
        data: weekdays,
        axisLabel: {
          rotate: 0
        }
      },
      {
        type: 'category' as const,
        axisTick: { show: false },
        data: hours,
        axisLabel: {
          rotate: 45
        }
      }
    ],
    yAxis: {
      type: 'value' as const
    },
    series: [
      {
        name: '星期分布',
        type: 'bar' as const,
        barWidth: '40%',
        xAxisIndex: 0,
        data: weekdayDistribution,
        itemStyle: {
          color: '#5470c6'
        }
      },
      {
        name: '时间段分布',
        type: 'line' as const,
        smooth: true,
        xAxisIndex: 1,
        data: timeDistribution,
        itemStyle: {
          color: '#91cc75'
        }
      }
    ]
  };

  return (
    <ChartComponent
      options={options}
      loading={loading}
      style={style || { height: '350px', width: '100%' }}
    />
  );
};

export default {
  ArticleTrendChart,
  ArticleStatusChart,
  TagDistributionChart,
  TimeDistributionChart
};
