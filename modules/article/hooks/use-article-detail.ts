'use client';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { ArticleContent } from '@/components/article/article-detail-card';

// 文章详情接口定义
interface ArticleDetail {
  id: string;
  title: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    level?: number;
    bio?: string;
    articleCount: number;
    followerCount: number;
    likeCount: number;
  };
  content: ArticleContent[];
  publishedAt: string;
  likeCount: number;
  favoriteCount: number;
  viewCount: number;
  isLiked: boolean;
  isFavorited: boolean;
  topics: Array<{
    id: string;
    name: string;
  }>;
}

// 模拟从API获取文章详情
const fetchArticleDetail = async (id: string): Promise<ArticleDetail> => {
  // 在实际项目中，这里应该是请求后端API的代码
  // 这里使用setTimeout模拟网络请求延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟的文章详情数据
      resolve({
        id,
        title: `文章标题 ${id}`,
        author: {
          id: 'user-1',
          username: '示例作者',
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
          level: 3,
          bio: '热爱写作和分享的技术爱好者',
          articleCount: 42,
          followerCount: 1024,
          likeCount: 3680
        },
        content: [
          {
            type: 'text',
            content: '这是文章的开头部分，介绍了主要内容和背景。这里可以是一段长文本，描述了作者对该主题的见解和观点。'
          },
          {
            type: 'image',
            content: 'https://picsum.photos/800/400',
            caption: '这是一张示例图片，展示了相关内容'
          },
          {
            type: 'text',
            content: '接下来是正文部分，深入探讨了主题的各个方面。这里包含了详细的分析和论证，支持作者的观点。这部分内容可能会比较长，包含多个段落和子主题。\n\n作者在这里分享了自己的经验和见解，并提供了一些实用的建议和指导。这些内容对读者来说可能非常有价值，特别是对那些对该主题感兴趣或正在学习相关知识的人。'
          },
          {
            type: 'text',
            content: '最后是总结部分，回顾了文章的主要观点和结论。作者可能会在这里提出一些建议或展望，鼓励读者参与讨论或进一步探索该主题。'
          }
        ],
        publishedAt: new Date().toISOString(),
        likeCount: 128,
        favoriteCount: 56,
        viewCount: 1234,
        isLiked: false,
        isFavorited: false,
        topics: [
          { id: 'topic-1', name: '前端开发' },
          { id: 'topic-2', name: 'React' },
          { id: 'topic-3', name: 'TypeScript' },
          { id: 'topic-4', name: '编程技巧' }
        ]
      });
    }, 800); // 模拟800ms的网络延迟
  });
};

// 模拟API操作响应
const simulateApiResponse = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 95%的概率成功，5%的概率失败，模拟真实环境中的失败情况
      if (Math.random() > 0.05) {
        resolve(true);
      } else {
        reject(new Error('操作失败，请重试'));
      }
    }, 300);
  });
};

export const useArticleDetail = (articleId: string) => {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 获取文章详情
  const getArticleDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchArticleDetail(articleId);
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取文章详情失败'));
      message.error('获取文章详情失败');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  // 点赞文章
  const handleLike = useCallback(async (liked: boolean) => {
    if (!article) return;
    
    // 乐观更新UI
    setArticle(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        isLiked: liked,
        likeCount: liked ? prev.likeCount + 1 : Math.max(0, prev.likeCount - 1)
      };
    });
    
    try {
      // 实际API调用
      await simulateApiResponse();
    } catch (err) {
      // 操作失败，回滚UI状态
      setArticle(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isLiked: !liked,
          likeCount: !liked ? prev.likeCount + 1 : Math.max(0, prev.likeCount - 1)
        };
      });
      message.error('操作失败，请稍后重试');
    }
  }, [article]);
  
  // 收藏文章
  const handleFavorite = useCallback(async (favorited: boolean) => {
    if (!article) return;
    
    // 乐观更新UI
    setArticle(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        isFavorited: favorited,
        favoriteCount: favorited ? prev.favoriteCount + 1 : Math.max(0, prev.favoriteCount - 1)
      };
    });
    
    try {
      // 实际API调用
      await simulateApiResponse();
    } catch (err) {
      // 操作失败，回滚UI状态
      setArticle(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isFavorited: !favorited,
          favoriteCount: !favorited ? prev.favoriteCount + 1 : Math.max(0, prev.favoriteCount - 1)
        };
      });
      message.error('操作失败，请稍后重试');
    }
  }, [article]);

  // 关注作者
  const handleFollow = useCallback(async (followerId: string, following: boolean) => {
    try {
      // 实际API调用
      await simulateApiResponse();
      message.success(following ? '已关注' : '已取消关注');
      return true;
    } catch (err) {
      message.error('操作失败，请稍后重试');
      return false;
    }
  }, []);

  // 初始加载
  useEffect(() => {
    getArticleDetail();
  }, [getArticleDetail]);

  return {
    article,
    loading,
    error,
    refetch: getArticleDetail,
    handleLike,
    handleFavorite,
    handleFollow,
  };
};

export default useArticleDetail;
