'use client';
import React, { useState } from 'react';
import { DatePicker, Radio, Card, Space, Button } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from '@/components/creator/data/data.module.scss';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  onChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => void;
  value: [dayjs.Dayjs | null, dayjs.Dayjs | null];
}

/**
 * 日期范围选择器组件
 */
const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, value }) => {
  // 设置默认选中最近7天
  const [rangeType, setRangeType] = useState<string>('7days');

  // 预设范围选项
  const handleRangeTypeChange = (e: RadioChangeEvent) => {
    const type = e.target.value;
    setRangeType(type);
    
    let start: dayjs.Dayjs | null = null;
    let end: dayjs.Dayjs | null = null;
    const now = dayjs();
    
    switch (type) {
      case '7days':
        start = now.subtract(7, 'day');
        end = now;
        break;
      case '30days':
        start = now.subtract(30, 'day');
        end = now;
        break;
      case '3months':
        start = now.subtract(3, 'month');
        end = now;
        break;
      case '6months':
        start = now.subtract(6, 'month');
        end = now;
        break;
      case '1year':
        start = now.subtract(1, 'year');
        end = now;
        break;
      case 'all':
        // 所有时间范围，传入 null 表示不筛选
        start = null;
        end = null;
        break;
      default:
        // 自定义时间范围，不自动设置日期
        return;
    }
    
    onChange([start, end]);
  };

  // 日期选择变化
  const handleDateRangeChange = (dates: any) => {
    setRangeType('custom');
    onChange(dates);
  };

  // 重置筛选
  const handleReset = () => {
    setRangeType('all');
    onChange([null, null]);
  };

  return (
    <Card className={styles.dateRangeCard}>
      <div className={styles.dateRangeHeader}>
        <Space direction="vertical" size={12} className={styles.fullWidth}>
          <div className={`${styles.flexBetween} ${styles.flexWrap}`}>
            <div className={`${styles.fontMedium} ${styles.marginBottom2} ${styles.flexCenter}`}>
              <CalendarOutlined className={styles.marginRight2} />
              <span>时间范围筛选</span>
            </div>
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              size="small"
            >
              重置
            </Button>
          </div>
          
          <Radio.Group 
            value={rangeType} 
            onChange={handleRangeTypeChange}
            className={styles.rangeRadioGroup}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="7days">近7天</Radio.Button>
            <Radio.Button value="30days">近30天</Radio.Button>
            <Radio.Button value="3months">近3个月</Radio.Button>
            <Radio.Button value="6months">近6个月</Radio.Button>
            <Radio.Button value="1year">近1年</Radio.Button>
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value="custom">自定义</Radio.Button>
          </Radio.Group>
          
          <RangePicker 
            value={value as any} 
            onChange={handleDateRangeChange}
            className={styles.fullWidth}
            allowClear
            placeholder={['开始日期', '结束日期']}
          />
        </Space>
      </div>
    </Card>
  );
};

export default DateRangePicker;
