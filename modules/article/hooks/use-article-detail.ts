'use client';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { ArticleContent } from '@/components/article/article-detail-card';
import articleService from '@/modules/article/articleService';
import { followUser, userService } from '@/modules/user/userService';

// 判断内容类型：HTML、Markdown 或纯文本
const detectContentType = (content: string): 'html' | 'markdown' | 'text' => {
  if (!content) return 'text';
  
  // HTML特征判断
  const htmlFeatures = [
    /<\/?[a-z][\s\S]*>/i,  // HTML标签
    /<(br|hr|img|input).*?>/i,  // 自闭合标签
    /&[a-z]+;/i,  // HTML实体如&nbsp;
    /<div>|<p>|<span>|<a\s|<img\s|<table>/i  // 常见HTML标签
  ];
  
  // Markdown特征判断
  const markdownFeatures = [
    /^#+ .+$/m,  // 标题 (# Title)
    /\[.+?\]\(.+?\)/,  // 链接 [text](url)
    /^[\*\-\+] .+$/m,  // 无序列表
    /^[0-9]+\. .+$/m,  // 有序列表
    /`{1,3}[^`]+`{1,3}/,  // 行内代码或代码块
    /\*\*.+?\*\*|\*.+?\*/,  // 粗体或斜体
    /!\[.+?\]\(.+?\)/,  // 图片 ![alt](src)
    /^>.+$/m,  // 引用
    /^(?:[-*_]){3,}$/m,  // 分隔线
    /^\|.+\|.+\|$/m  // 表格
  ];
  
  // 计算特征匹配数
  let htmlScore = 0;
  let markdownScore = 0;
  
  htmlFeatures.forEach(pattern => {
    if (pattern.test(content)) htmlScore++;
  });
  
  markdownFeatures.forEach(pattern => {
    if (pattern.test(content)) markdownScore++;
  });
  
  // 根据特征匹配数决定内容类型
  if (htmlScore > markdownScore && htmlScore > 1) {
    return 'html';
  } else if (markdownScore > htmlScore && markdownScore > 1) {
    return 'markdown';
  } else {
    // 如果特征不明显，尝试更简单的检测
    if (content.includes('<') && content.includes('>') && 
        (content.includes('</') || content.includes('/>'))) {
      return 'html';
    }
    
    // 默认为纯文本
    return 'markdown';
  }
};

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
    // 如果能获取到文章，则获取作者信息
    const authorData = await userService.getUserInfoById(articleData.author_id);
    // 转换为前端需要的格式
    return {
      id,
      title: articleData.header,
      author: {
        id: articleData.author_id,
        username: articleData.author,
        avatar: authorData.avatar_url,
        level: authorData.level,
        bio: authorData.abstract,
        followingCount: authorData.stats.following, // 关注数
        followerCount: authorData.stats.followers, // 粉丝
        likeCount: authorData.stats.likes // 点赞
      },
      // 将文章内容转换为前端组件需要的格式
      content: [
        {
          type: detectContentType(articleData.article_detail || 'markdown'),
          content: articleData.article_detail || '无内容'
        }
      ],
      publishedAt: new Date(articleData.create_time).toISOString(), // 转换为ISO格式字符串
      likeCount: articleData.like, 
      favoriteCount: 0, // 收藏数
      viewCount: 0, // 浏览量
      isLiked: false,
      isFavorited: false,
      topics: articleData.tags.map((tag, index) => ({
        id: `${index}`,
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
        };
      });
      message.error('操作失败，请稍后重试');
    }
  }, [article]);

  // 关注作者
  const handleFollow = useCallback(async (followerId: string, following: boolean) => {
    try {
      // 实际API调用
      await followUser(Number(followerId), !following);
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
