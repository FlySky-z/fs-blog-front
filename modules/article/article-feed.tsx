'use client';
import React, { useRef, useCallback, useEffect } from 'react';
import { Spin, Empty, Typography } from 'antd';
import { useInfinitePosts, Post } from '@/modules/article/hooks/use-infinite-article';
import PostCard from '@/components/article/article-card';
import styles from './article-feed.module.css';

const { Title } = Typography;

interface HomeFeedProps {
  title?: string;
  initialPosts?: Post[];
  pageSize?: number;
}

const HomeFeed: React.FC<HomeFeedProps> = ({
  title = '最新文章',
  initialPosts,
  pageSize = 10
}) => {
  const { posts, loading, hasMore, error, loadMore } = useInfinitePosts({
    initialPosts,
    pageSize
  });
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
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
  }, [loading, hasMore, loadMore]);

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
      {title && <Title level={4} className={styles.feedTitle}>{title}</Title>}
      
      <div className={styles.posts}>
        {posts.map(post => (
          <PostCard key={post.id} {...post} />
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
          <div className={styles.error}>加载失败，请重试</div>
        )}
      </div>
    </div>
  );
};

export default HomeFeed;
