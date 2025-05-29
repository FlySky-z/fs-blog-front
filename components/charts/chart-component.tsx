'use client';
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

// 注册 ECharts 组件
echarts.use([
  TitleComponent, 
  TooltipComponent, 
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer
]);

interface ChartProps {
  options: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  loading?: boolean;
}

/**
 * ECharts 图表组件
 */
const ChartComponent: React.FC<ChartProps> = ({ 
  options, 
  style = { height: '300px', width: '100%' },
  className = '',
  loading = false
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 如果图表已存在，先销毁
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // 创建新图表
    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;
    
    // 设置加载状态
    if (loading) {
      chart.showLoading();
    } else {
      chart.hideLoading();
    }
    
    // 设置图表配置
    chart.setOption(options);

    // 窗口大小改变时重绘图表
    const handleResize = () => {
      chart.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    // 监听DOM可见性变化，用于处理tab切换后图表大小问题
    const resizeObserver = new ResizeObserver(() => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    });
    
    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      chart.dispose();
      chartInstance.current = null;
    };
  }, [options, loading]);

  // 当 loading 状态变化时更新图表
  useEffect(() => {
    if (!chartInstance.current) return;
    
    if (loading) {
      chartInstance.current.showLoading();
    } else {
      chartInstance.current.hideLoading();
    }
  }, [loading]);

  return (
    <div 
      ref={chartRef} 
      style={style} 
      className={className}
    />
  );
};

export default ChartComponent;
