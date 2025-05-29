'use client';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import articleService from '@/modules/article/articleService';

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

// 从API获取侧边栏数据
const fetchSidebarData = async (articleId: string): Promise<SidebarData> => {
  try {
    // 获取推荐文章（最新的5篇文章）
    const recommendedArticlesData = await articleService.getArticleList({
      page: 1,
      limit: 5,
      order_by: 'time',
      sort_order: 'desc'
    });

    // 将API返回的文章数据转换为侧边栏所需格式
    const recommendedArticles = recommendedArticlesData.map(article => ({
      id: article.id,
      title: article.header,
      author: article.author,
      likeCount: article.like,
      viewCount: article.view,
      createdAt: new Date(article.create_time).toISOString()
    }));

    return {
      recommendedArticles,
      
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
    };
  } catch (error) {
    console.error('获取侧边栏数据失败:', error);
    // 发生错误时返回默认数据
    return {
      recommendedArticles: [],
      topics: [],
      welcomeCard: {
        title: '欢迎来到我们的社区！',
        content: '加入我们，分享你的知识和经验，与其他开发者交流讨论。',
        imageUrl: 'https://picsum.photos/300/200',
        buttonText: '立即登录',
      }
    };
  }
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
