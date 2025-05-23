'use client';
import { useState, useEffect, useCallback } from 'react';
import articleService from '@/modules/article/articleService';

// 随机颜色生成函数
const getRandomColor = () => {
  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export interface Post {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    level?: number;
  };
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags?: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  isVideo?: boolean;
  videoDuration?: string;
}

interface UseInfinitePostsOptions {
  initialPosts?: Post[];
  pageSize?: number;
  tag?: string;
  keyword?: string;
  userId?: string;
  orderBy?: 'time' | 'hot';
  sortOrder?: 'asc' | 'desc';
}

interface UseInfinitePostsReturn {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

// 创建延迟函数，用于实现请求间隔和重试
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 从API获取文章列表，并转换为前端需要的格式
const fetchPosts = async (
  page: number, 
  pageSize: number, 
  options?: {
    tag?: string;
    keyword?: string;
    userId?: string;
    orderBy?: 'time' | 'hot';
    sortOrder?: 'asc' | 'desc';
  },
  retryCount: number = 0,
  maxRetries: number = 3
): Promise<{ data: Post[]; hasMore: boolean }> => {
  try {
    // 调用API获取文章列表
    const articleListItems = await articleService.getArticleList({
      page,
      limit: pageSize,
      tag: options?.tag,
      keyword: options?.keyword,
      user_id: options?.userId,
      order_by: options?.orderBy,
      sort_order: options?.sortOrder
    });
    
    // 转换为前端需要的格式
    console.log('获取文章列表:', articleListItems);
    const posts: Post[] = articleListItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.abstract,
      coverImage: item.cover_image,
      author: {
        id: `user-${item.id}`, // 后端数据中可能缺少这个字段，这里临时生成
        username: item.author,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`, // 使用ID作为随机头像的种子
        level: 1, // 默认等级
      },
      publishedAt: new Date(item.last_modified_date).toISOString(), // 转换为ISO格式字符串
      viewCount: Math.floor(Math.random() * 1000), // 随机生成浏览量
      likeCount: parseInt(item.like) || 0,
      commentCount: Math.floor(Math.random() * 50), // 随机生成评论数
      tags: item.tags.map((tag, index) => ({
        id: `tag-${index}`,
        name: tag,
        color: getRandomColor() // 随机生成标签颜色
      }))
    }));
    
    // 根据数据量判断是否还有更多数据
    const hasMore = articleListItems.length === pageSize;
    
    return { data: posts, hasMore };
  } catch (error) {
    console.error(`获取文章列表失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, error);
    
    // 如果还有重试次数，延迟5秒后重试
    if (retryCount < maxRetries) {
      console.log(`5秒后重试获取文章列表 (页码: ${page})...`);
      await delay(5000); // 延迟5秒
      return fetchPosts(page, pageSize, options, retryCount + 1, maxRetries);
    }
    
    // 超出重试次数，抛出异常
    throw error;
  }
};

export function useInfinitePosts(options: UseInfinitePostsOptions = {}): UseInfinitePostsReturn {
  const { 
    initialPosts = [], 
    pageSize = 10,
    tag,
    keyword,
    userId,
    orderBy,
    sortOrder
  } = options;
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPosts.length > 0 ? 2 : 1);

  const loadInitialPosts = useCallback(async () => {
    if (initialPosts.length > 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, hasMore: moreAvailable } = await fetchPosts(1, pageSize, {
        tag,
        keyword,
        userId,
        orderBy,
        sortOrder
      });
      setPosts(data);
      setHasMore(moreAvailable);
      setPage(2);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('加载文章失败'));
      console.error('Failed to load initial posts:', err);
    } finally {
      setLoading(false);
    }
  }, [initialPosts.length, pageSize, tag, keyword, userId, orderBy, sortOrder]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const { data, hasMore: moreAvailable } = await fetchPosts(page, pageSize, {
        tag,
        keyword,
        userId,
        orderBy,
        sortOrder
      });
      setPosts(prevPosts => [...prevPosts, ...data]);
      setHasMore(moreAvailable);
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('加载更多文章失败'));
      console.error('Failed to load more posts:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize, tag, keyword, userId, orderBy, sortOrder]);

  // 初始加载
  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  return { posts, loading, error, hasMore, loadMore };
}
