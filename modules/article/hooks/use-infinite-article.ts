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
  refresh: () => Promise<void>; // 添加刷新方法
}

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
      title: item.header,
      description: item.abstract,
      coverImage: item.cover_image,
      author: {
        id: item.id,
        username: item.author,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`, // 使用ID作为随机头像的种子
        level: 1, // 默认等级
      },
      publishedAt: new Date(item.last_modified_date).toISOString(), // 转换为ISO格式字符串
      viewCount: Math.floor(Math.random() * 1000), // 随机生成浏览量
      likeCount: item.like,
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
    throw error;
  }
};

export function useInfiniteArticle(options: UseInfinitePostsOptions = {}): UseInfinitePostsReturn {
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
  const [hasInitialized, setHasInitialized] = useState(false); // 添加初始化标记

  const loadInitialPosts = useCallback(async () => {
    // 如果已经初始化过或已经有初始数据，则不再加载
    if (initialPosts.length > 0 || hasInitialized) return;
    
    // 如果已经有错误，也不再重试
    if (error) return;
    
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
      setHasInitialized(true); // 标记为已初始化
    } catch (err) {
      setError(err instanceof Error ? err : new Error('加载文章失败'));
      setHasMore(false); // 出错时设置为没有更多内容
      console.error('Failed to load initial posts:', err);
    } finally {
      setLoading(false);
    }
  }, [initialPosts.length, pageSize, tag, keyword, userId, orderBy, sortOrder, hasInitialized, error]);

  const loadMore = useCallback(async () => {
    // 如果正在加载、没有更多内容、或已经有错误，则不执行加载
    if (loading || !hasMore || error) return;
    
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
      setHasMore(false); // 出错时设置为没有更多内容
      console.error('Failed to load more posts:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, error, page, pageSize, tag, keyword, userId, orderBy, sortOrder]);

  // 添加刷新方法，用于重新加载文章列表
  const refresh = useCallback(async () => {
    // 重置状态
    setPosts([]);
    setError(null);
    setHasMore(true);
    setPage(1);
    setHasInitialized(false); // 重置初始化标记
    
    setLoading(true);
    
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
      setHasInitialized(true); // 标记为已初始化
    } catch (err) {
      setError(err instanceof Error ? err : new Error('刷新文章失败'));
      setHasMore(false);
      console.error('Failed to refresh posts:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSize, tag, keyword, userId, orderBy, sortOrder]);

  // 初始加载
  useEffect(() => {
    // 只在组件首次渲染时加载数据
    if (!hasInitialized) {
      loadInitialPosts();
    }
  }, [loadInitialPosts, hasInitialized]);

  return { posts, loading, error, hasMore, loadMore, refresh };
}
