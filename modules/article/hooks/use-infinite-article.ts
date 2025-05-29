'use client';
import { useState, useCallback } from 'react';
import { ArticleListItem } from '@/modules/article/articleModel';
import articleService from '@/modules/article/articleService';

interface UseInfiniteArticleOptions {
  pageSize?: number;
  tag?: string;
  keyword?: string;
  userId?: string;
  orderBy?: 'time' | 'likes';
  sortOrder?: 'asc' | 'desc';
}

interface UseInfiniteArticleReturn {
  articles: ArticleListItem[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * 封装文章列表API请求，处理分页和hasMore逻辑
 */
const fetchArticleList = async (
  page: number,
  pageSize: number,
  options: {
    tag?: string;
    keyword?: string;
    userId?: string;
    orderBy?: 'time' | 'likes';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<{ data: ArticleListItem[]; hasMore: boolean }> => {
  const { tag, keyword, userId, orderBy, sortOrder } = options;
  
  const articles = await articleService.getArticleList({
    page,
    limit: pageSize,
    tag,
    keyword,
    user_id: userId,
    order_by: orderBy,
    sort_order: sortOrder
  });
  
  const hasMore = articles.length >= pageSize;
  
  return { data: articles, hasMore };
};

/**
 * 无限滚动文章列表Hook
 * 用于支持分页加载、刷新等功能
 */
export function useInfiniteArticle(options: UseInfiniteArticleOptions = {}): UseInfiniteArticleReturn {
  const {
    pageSize = 10,
    tag,
    keyword,
    userId,
    orderBy,
    sortOrder
  } = options;
  // 状态管理
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  /**
   * 加载文章数据
   * @param currentPage 要加载的页码
   */
  const loadArticles = useCallback(async (currentPage: number) => {
    // 检查是否可以加载更多（仅对加载更多操作进行检查）
    if (currentPage > 1 && (loading || !hasMore || error)) return;
    
    setLoading(true);
    
    try {
      const { data, hasMore: moreAvailable } = await fetchArticleList(currentPage, pageSize, {
        tag,
        keyword,
        userId,
        orderBy,
        sortOrder
      });
      
      // 如果是第1页，替换文章列表；否则追加到现有列表
      if (currentPage === 1) {
        setArticles(data);
      } else {
        setArticles(prevArticles => [...prevArticles, ...data]);
        
      }
      if(moreAvailable) setPage(currentPage + 1);
      setHasMore(moreAvailable);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(
        currentPage === 1 ? '加载文章失败' : '加载更多文章失败'
      ));
      setHasMore(false);
      console.error(currentPage === 1 ? '加载文章失败:' : '加载更多文章失败:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, error, pageSize, tag, keyword, userId, orderBy, sortOrder]);
  
  /**
   * 加载更多数据
   */
  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    await loadArticles(page);
  }, [loadArticles, page, hasMore]);
  
  /**
   * 刷新数据
   */
  const refresh = useCallback(async () => {
    setError(null); // 刷新时重置错误状态
    setPage(1); // 重置页码
    setHasMore(true); // 重置hasMore状态
    await loadArticles(1);
  }, [loadArticles]);
  return {
    articles: articles,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
}
