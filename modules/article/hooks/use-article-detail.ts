'use client';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { ArticleContent } from '@/components/article/article-detail-card';
import articleService from '@/modules/article/articleService';
import { userService } from '@/modules/user/userService';

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
    followingCount: number;
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

// 从API获取文章详情
const fetchArticleDetail = async (id: string): Promise<ArticleDetail> => {
  try {
    // 使用articleService获取文章详情
    const articleData = await articleService.getArticleDetail(id);
    // const authorData = await userService.getUserInfoById(articleData.author_id);
    console.log('API数据:', articleData);
    // 转换为前端需要的格式
    // 由于后端API数据结构可能与前端需要的不完全一致，这里进行一些转换和补充
    return {
      id,
      title: articleData.header,
      author: {
        id: articleData.author_id,
        username: articleData.author,
        // avatar: authorData.avatar_url,
        level: 1, // 模拟等级
        // bio: authorData.abstract,
        followingCount: 11, // 模拟文章数
        followerCount: 4, // 模拟粉丝数
        likeCount: 514 // 模拟点赞数
      },
      // 将文章内容转换为前端组件需要的格式
      content: [
        {
          type: 'text',
          content: articleData.article_detail || '无内容'
        }
      ],
      publishedAt: new Date(articleData.create_time).toISOString(), // 转换为ISO格式字符串
      likeCount: articleData.like, // 模拟数据
      favoriteCount: 56, // 模拟数据
      viewCount: 1234,
      isLiked: false,
      isFavorited: false,
      topics: articleData.tags.map((tag, index) => ({
        id: `tag-${index}`,
        name: tag
      }))
    };
  } catch (error) {
    console.error(`获取文章详情失败 (ID: ${id}):`, error);
    throw error;
  }
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
        // favoriteCount: favorited ? prev.favoriteCount + 1 : Math.max(0, prev.favoriteCount - 1)
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
          // favoriteCount: !favorited ? prev.favoriteCount + 1 : Math.max(0, prev.favoriteCount - 1)
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
