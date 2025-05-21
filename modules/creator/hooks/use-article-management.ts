'use client';
import { useState, useEffect, useCallback } from 'react';
import { Article, ArticleStatus } from '@/components/creator/article-management-card';

// 模拟API调用获取文章列表
const mockFetchArticles = (
  page: number = 1, 
  pageSize: number = 10, 
  status: ArticleStatus | null = null,
  query: string = ''
): Promise<{ articles: Article[], total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成模拟数据
      const mockArticles: Article[] = [];
      const statuses = Object.values(ArticleStatus);
      
      // 总数，用于分页
      const totalCount = 23;
      
      // 根据过滤条件过滤
      const filteredCount = status 
        ? Math.floor(totalCount / 4) 
        : totalCount;
      
      // 考虑搜索条件，如果有搜索词，减少结果数量
      const searchedCount = query 
        ? Math.floor(filteredCount / 2) 
        : filteredCount;
      
      // 计算当前页应该有多少条数据
      const currentPageCount = Math.min(pageSize, searchedCount - (page - 1) * pageSize);
      
      // 填充数据
      for (let i = 0; i < currentPageCount; i++) {
        const id = `article-${(page - 1) * pageSize + i + 1}`;
        const currentStatus = status || statuses[Math.floor(Math.random() * statuses.length)];
        
        mockArticles.push({
          id,
          title: query 
            ? `包含"${query}"的文章 ${id}` 
            : `测试文章 ${id}`,
          status: currentStatus,
          thumbnail: Math.random() > 0.3 
            ? `https://picsum.photos/300/200?random=${id}` 
            : undefined,
          updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          readCount: Math.floor(Math.random() * 1000),
          commentCount: Math.floor(Math.random() * 50),
          likeCount: Math.floor(Math.random() * 100)
        });
      }
      
      resolve({
        articles: mockArticles,
        total: searchedCount
      });
    }, 800);
  });
};

/**
 * 文章管理Hook
 */
export function useArticleManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 加载文章列表
  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const { articles: fetchedArticles, total } = await mockFetchArticles(
        pagination.current,
        pagination.pageSize,
        statusFilter,
        searchQuery
      );
      setArticles(fetchedArticles);
      setPagination(prev => ({ ...prev, total }));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch articles'));
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, statusFilter, searchQuery]);

  // 初始加载和依赖变化时重新加载
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // 处理分页变化
  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  }, []);

  // 处理状态筛选
  const handleStatusFilter = useCallback((status: string | null) => {
    setStatusFilter(status as ArticleStatus | null);
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  }, []);

  // 处理搜索
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  }, []);

  // 处理删除文章
  const handleDeleteArticle = useCallback((id: string) => {
    // 实际应用中应该调用API
    console.log(`删除文章: ${id}`);
    // 从列表中移除
    setArticles(prev => prev.filter(article => article.id !== id));
  }, []);

  // 处理编辑文章
  const handleEditArticle = useCallback((id: string) => {
    // 实际应用中应该跳转到编辑页面
    console.log(`编辑文章: ${id}`);
  }, []);

  // 处理查看文章
  const handleViewArticle = useCallback((id: string) => {
    // 实际应用中应该跳转到文章详情
    console.log(`查看文章: ${id}`);
  }, []);

  // 处理重新提交
  const handleResubmitArticle = useCallback((id: string) => {
    // 实际应用中应该调用重新提交API
    console.log(`重新提交文章: ${id}`);
    // 更新状态
    setArticles(prev => 
      prev.map(article => 
        article.id === id 
          ? { ...article, status: ArticleStatus.PENDING } 
          : article
      )
    );
  }, []);

  return {
    loading,
    error,
    articles,
    pagination: {
      ...pagination,
      onChange: handlePaginationChange
    },
    onStatusFilter: handleStatusFilter,
    onSearch: handleSearch,
    onDelete: handleDeleteArticle,
    onEdit: handleEditArticle,
    onView: handleViewArticle,
    onResubmit: handleResubmitArticle
  };
}

export default useArticleManagement;
