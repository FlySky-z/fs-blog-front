'use client';
import { useState, useEffect } from 'react';

export interface CreatorAnnouncement {
  id: string;
  content: string;
  date: string;
}

// 模拟API调用获取创作公告
const mockFetchCreatorAnnouncements = (): Promise<CreatorAnnouncement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'ann1',
          content: '恭喜！您已成功晋升为Lv.2创作者',
          date: '2025-05-15'
        },
        {
          id: 'ann2',
          content: '新活动：参与"AI与未来"主题征文，赢取丰厚奖品',
          date: '2025-05-18'
        },
        {
          id: 'ann3',
          content: '系统升级公告：创作中心将于5月25日进行功能升级',
          date: '2025-05-20'
        }
      ]);
    }, 500);
  });
};

/**
 * 获取创作公告的Hook
 */
export function useCreatorAnnouncements() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [announcements, setAnnouncements] = useState<CreatorAnnouncement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await mockFetchCreatorAnnouncements();
        setAnnouncements(result);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch creator announcements:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch creator announcements'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    error,
    announcements
  };
}

export default useCreatorAnnouncements;
