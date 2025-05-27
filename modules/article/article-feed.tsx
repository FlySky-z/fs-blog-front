'use client';
import React, { useRef, useCallback, useEffect } from 'react';
import { Spin, Empty, Typography, Button, Tooltip } from 'antd';
import { useInfiniteArticle } from '@/modules/article/hooks/use-infinite-article';
import AritcleCard, { PostCardProps } from '@/components/article/article-card';
import styles from './article-feed.module.scss';
import { ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import QuickHeader from '@/components/creator/quick-header';
import { ArticleListItem } from './articleModel';


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
const mapArticleToCardProps = (article: ArticleListItem): PostCardProps => {
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
    publishedAt: new Date(article.create_time).toISOString(),
    viewCount: article.view,
    likeCount: article.like,
    commentCount: article.comment,
    tags: article.tags.map((tag, index) => ({
      id: `${article.id}-tag-${index}`,
      name: tag
    }))
  };
};

/**
 * 文章列表组件，支持无限滚动加载
 */
const ArticleFeed: React.FC<ArticleFeedProps> = ({
  title = '最新文章',
  pageSize = 10,
  orderBy,
  sortOrder,
  tag,
  userId,
  keyword
}) => {
  // 获取文章数据
  const { articles, loading, hasMore, error, loadMore, refresh } = useInfiniteArticle({
    pageSize: 1,
    orderBy,
    sortOrder,
    tag,
    userId,
    keyword
  });

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
      {/* 快速导航头部 */}
      <QuickHeader />

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

export default ArticleFeed;
