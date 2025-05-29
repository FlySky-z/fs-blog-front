'use client';
import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { Spin, Empty, Typography, Button, Tooltip, Card, Radio, Space } from 'antd';
import { useInfiniteArticle } from '@/modules/article/hooks/use-infinite-article';
import AritcleCard, { ArticleCardProps } from '@/components/article/article-card';
import styles from './search-feed.module.scss';
import { ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import QuickHeader from '@/components/creator/quick-header';
import { ArticleListItem } from './articleModel';
import SortCard from '@/components/molecules/sort-card';
import { useSearchStore } from '@/store/searchStore';


const { Title } = Typography;

interface ArticleFeedProps {
  title?: string;
  pageSize?: number;
  keyword?: string;
  orderBy?: 'time' | 'hot';
  sortOrder?: 'asc' | 'desc';
  tag?: string;
  userId?: string;
}

/**
 * 将后端文章数据转换为文章卡片需要的格式
 */
const mapArticleToCardProps = (article: ArticleListItem): ArticleCardProps => {
  return {
    id: article.id,
    title: article.header,
    description: article.abstract,
    coverImage: article.cover_image,
    showAuthor: true,
    author: {
      id: article.author_id,
      username: article.author,
    },
    lastModified: article.last_modified_date,
    viewCount: article.view,
    likeCount: article.like,
    commentCount: article.comment,
    tags: article.tags.map((tag, index) => ({
      id: `tag-${index}`,
      name: tag
    }))
  };
};

/**
 * 文章列表组件，支持无限滚动加载
 */
const SearchFeed: React.FC<ArticleFeedProps> = ({
  title = '最新文章',
  pageSize = 10,
  userId,
}) => {
  // 使用搜索状态管理
  const { keyword, tag, sortOrder: sort_status } = useSearchStore();
  
  // 使用 useMemo 缓存API参数映射，避免不必要的重新计算
  const apiParams = useMemo(() => {
    switch (sort_status) {
      case 'latest':
        return {
          orderBy: 'time' as const,
          sortOrder: 'desc' as const
        };
      case 'hottest':
        return {
          orderBy: 'likes' as const,
          sortOrder: 'desc' as const
        };
      default:
        // 综合排序，使用默认参数
        return {};
    }
  }, [sort_status]);

  // 获取文章数据
  const { articles, loading, hasMore, error, loadMore, refresh } = useInfiniteArticle({
    pageSize,
    tag,
    userId,
    keyword,
    ...apiParams
  });

  // 监听搜索参数变化，触发refresh
  const prevParamsRef = useRef({ keyword, tag, sort_status });
  const refreshRef = useRef(refresh);
  
  // 更新 refresh 引用，但不触发 useEffect
  refreshRef.current = refresh;
  
  // 初始加载和参数变化监听
  useEffect(() => {
    const prevParams = prevParamsRef.current;
    const currentParams = { keyword, tag, sort_status };
    
    // 检查参数是否发生了变化
    const hasChanged = 
      prevParams.keyword !== currentParams.keyword ||
      prevParams.tag !== currentParams.tag ||
      prevParams.sort_status !== currentParams.sort_status;
    
    if (hasChanged) {
      refreshRef.current();
      prevParamsRef.current = currentParams;
    }
  }, [keyword, tag, sort_status]);

  // 手动刷新文章列表
  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  // 使用 Intersection Observer 实现无限滚动
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || error || !hasMore) {
      if (observerRef.current && !hasMore) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // 清除之前的观察者
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 创建新的观察者
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { threshold: 0.1 });

    // 开始观察
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore, loadMore, error]);

  // 监听 hasMore 变化，当没有更多数据时断开观察者
  useEffect(() => {
    if (!hasMore && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, [hasMore]);

  // 组件卸载时清理观察者
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className={styles.homeFeed}>

      {/* 排序选项 */}
      <SortCard
      />

      {/* 标题和刷新按钮 */}
      {title && (
        <div className={styles.titleContainer}>
          <Title level={4} className={styles.titleText}>{title}</Title>
          <Tooltip title="刷新">
            <SyncOutlined
              className={styles.refreshIcon}
              onClick={handleRefresh}
              spin={loading}
            />
          </Tooltip>
        </div>
      )}

      {/* 文章列表 */}
      <div className={styles.articles}>
        {articles.map(article => (
          <AritcleCard key={article.id} {...mapArticleToCardProps(article)} />
        ))}

        {articles.length === 0 && !loading && (
          <Empty
            description="暂无文章"
            className={styles.empty}
          />
        )}
      </div>

      {/* 更多 */}
      <div ref={loadMoreRef} className={styles.loadingTrigger}>
        {loading && <Spin size="large" className={styles.loadingSpinner} />}
        {!hasMore && articles.length > 0 && (
          <div className={styles.noMore}>没有更多文章了</div>
        )}
        {error && (
          <div className={styles.error}>
            <span>加载失败，请重试</span>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              className={styles.refreshButton}
              loading={loading}
            >
              重新加载
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFeed;
