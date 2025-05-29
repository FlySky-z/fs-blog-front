'use client';
import { useState, useEffect } from 'react';

export interface CreatorSummary {
  newFans: number;
  reads: number;
  likes: number;
  comments: number;
  favorites: number;
  articlesPublished: number;
}

// 模拟API调用获取创作者统计数据
const mockFetchCreatorSummary = (period: 'week' | 'month' | 'total'): Promise<CreatorSummary> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟不同时间段的数据
      if (period === 'week') {
        resolve({
          newFans: 12,
          reads: 432,
          likes: 78,
          comments: 25,
          favorites: 18,
          articlesPublished: 3
        });
      } else if (period === 'month') {
        resolve({
          newFans: 47,
          reads: 1832,
          likes: 329,
          comments: 106,
          favorites: 87,
          articlesPublished: 12
        });
      } else {
        // total
        resolve({
          newFans: 238,
          reads: 8964,
          likes: 1527,
          comments: 648,
          favorites: 421,
          articlesPublished: 45
        });
      }
    }, 500);
  });
};

/**
 * 获取创作者数据概览的Hook
 */
export function useCreatorSummary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [weekData, setWeekData] = useState<CreatorSummary | null>(null);
  const [monthData, setMonthData] = useState<CreatorSummary | null>(null);
  const [totalData, setTotalData] = useState<CreatorSummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [weekResult, monthResult, totalResult] = await Promise.all([
          mockFetchCreatorSummary('week'),
          mockFetchCreatorSummary('month'),
          mockFetchCreatorSummary('total')
        ]);
        
        setWeekData(weekResult);
        setMonthData(monthResult);
        setTotalData(totalResult);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch creator summary:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch creator summary'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    error,
    weekData,
    monthData, 
    totalData
  };
}

export default useCreatorSummary;