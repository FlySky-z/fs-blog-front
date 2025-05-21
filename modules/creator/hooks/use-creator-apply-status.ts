'use client';
import { useState, useEffect } from 'react';

export interface RequirementItem {
  id: string;
  text: string;
  fulfilled: boolean;
}

export interface CreatorApplyStatus {
  requirements: RequirementItem[];
  progress: number;
  canApply: boolean;
  alreadyApplied: boolean;
  isCreator: boolean;
}

// 模拟API调用获取创作者申请状态
const mockFetchCreatorApplyStatus = (): Promise<CreatorApplyStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        requirements: [
          { id: 'req1', text: '拥有至少3篇原创文章', fulfilled: true },
          { id: 'req2', text: '文章总阅读量超过1000', fulfilled: true },
          { id: 'req3', text: '账号注册时间超过30天', fulfilled: true },
          { id: 'req4', text: '完成实名认证', fulfilled: false },
        ],
        progress: 75, // 75%
        canApply: false,
        alreadyApplied: false,
        isCreator: false
      });
    }, 600);
  });
};

/**
 * 获取创作者申请状态的Hook
 */
export function useCreatorApplyStatus() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [applyStatus, setApplyStatus] = useState<CreatorApplyStatus | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await mockFetchCreatorApplyStatus();
        setApplyStatus(result);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch creator apply status:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch creator apply status'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    error,
    applyStatus
  };
}

export default useCreatorApplyStatus;