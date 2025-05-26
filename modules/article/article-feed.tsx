'use client';
import React, { useRef, useCallback, useEffect } from 'react';
import { Spin, Empty, Typography, Button, Tooltip } from 'antd';
import { useInfiniteArticle, Post } from '@/modules/article/hooks/use-infinite-article';
import AritcleCard from '@/components/article/article-card';
import styles from './article-feed.module.css';
import { ReloadOutlined, SyncOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface HomeFeedProps {
  title?: string;
  initialPosts?: Post[];
  pageSize?: number;
  keyword?: string;
  orderBy?: 'time' | 'hot';
  sortOrder?: 'asc' | 'desc';
  tag?: string;
  userId?: string;
}

const HomeFeed: React.FC<HomeFeedProps> = ({
  title = '最新文章',
  initialPosts,
  pageSize = 10,
  keyword,
  orderBy,
  sortOrder,
  tag,
  userId
}) => {
  const { posts, loading, hasMore, error, loadMore, refresh } = useInfiniteArticle({
    initialPosts,
    pageSize,
    keyword,
    orderBy,
    sortOrder,
    tag,
    userId
  });
  
  // 手动刷新文章列表
  const handleRefresh = useCallback(() => {
    // 使用 refresh 方法重新加载文章，而不是刷新整个页面
    refresh();
  }, [refresh]);

  // keyword 变化时自动刷新
  useEffect(() => {
    if (keyword) {
      refresh();
    }
  }, [keyword, refresh]);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || error) return; // 如果正在加载或有错误，不设置观察者
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { threshold: 0.1 });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore, loadMore, error]);

  // 清理observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className={styles.homeFeed}>
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
      
      <div className={styles.posts}>
        {posts.map(post => (
          <AritcleCard key={post.id} {...post} />
        ))}
        
        {posts.length === 0 && !loading && (
          <Empty 
            description="暂无文章" 
            className={styles.empty}
          />
        )}
      </div>
      
      {/* 加载更多触发点 */}
      <div ref={loadMoreRef} className={styles.loadingTrigger}>
        {loading && <Spin size="large" className={styles.loadingSpinner} />}
        {!hasMore && posts.length > 0 && (
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

export default HomeFeed;
