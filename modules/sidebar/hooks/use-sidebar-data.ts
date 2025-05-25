'use client';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';

// 侧边栏相关数据类型
export interface SidebarData {
  recommendedArticles: Array<{
    id: string;
    title: string;
    author: string;
    avatar?: string;
    likeCount: number;
    viewCount: number;
    createdAt: string;
  }>;
  topics: Array<{
    id: string;
    name: string;
    articleCount?: number;
    color?: string;
  }>;
  welcomeCard?: {
    title: string;
    content: string;
    imageUrl?: string;
    buttonText?: string;
  };
}

// 模拟从API获取侧边栏数据
const fetchSidebarData = async (articleId: string): Promise<SidebarData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        // 推荐文章
        recommendedArticles: Array.from({ length: 5 }, (_, i) => ({
          id: `article-rec-${i}`,
          title: `推荐文章 ${i + 1}：这是一个有趣的标题，吸引读者点击`,
          author: `推荐作者 ${i}`,
          avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=rec-${i}`,
          likeCount: Math.floor(Math.random() * 200),
          viewCount: Math.floor(Math.random() * 1000) + 200,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString()
        })),
        
        // 相关话题
        topics: [
          { id: 'topic-1', name: '前端开发', articleCount: 120 },
          { id: 'topic-2', name: 'React', articleCount: 85 },
          { id: 'topic-3', name: 'TypeScript', articleCount: 67 },
          { id: 'topic-4', name: '编程技巧', articleCount: 42 },
          { id: 'topic-5', name: 'UI设计', articleCount: 38 },
          { id: 'topic-6', name: '性能优化', articleCount: 25 }
        ],
        
        // 欢迎卡片
        welcomeCard: {
          title: '欢迎来到我们的社区！',
          content: '加入我们，分享你的知识和经验，与其他开发者交流讨论。',
          imageUrl: 'https://picsum.photos/300/200',
          buttonText: '立即登录',
        }
      });
    }, 600);
  });
};

// 侧边栏数据Hook
export const useSidebarData = (articleId: string) => {
  const [data, setData] = useState<SidebarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 获取侧边栏数据
  const getSidebarData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const sidebarData = await fetchSidebarData(articleId);
      setData(sidebarData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取侧边栏数据失败'));
      message.error('获取相关数据失败');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  // 初始加载
  useEffect(() => {
    getSidebarData();
  }, [getSidebarData]);

  return {
    data,
    loading,
    error,
    refetch: getSidebarData
  };
};

export default useSidebarData;
