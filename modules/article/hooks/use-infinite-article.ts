'use client';
import { useState, useEffect, useCallback } from 'react';

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
}

interface UseInfinitePostsReturn {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

// 模拟获取文章数据的函数
const mockFetchPosts = async (page: number, pageSize: number): Promise<{ data: Post[]; hasMore: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 创建随机文章数据
      const posts = Array.from({ length: pageSize }, (_, index) => {
        const actualIndex = (page - 1) * pageSize + index;
        const isVideo = Math.random() > 0.7;
        const hasCover = Math.random() > 0.3;
        
        return {
          id: `post-${actualIndex}`,
          title: `文章标题 ${actualIndex}: ${['如何提高编程效率', '2025年必学的前端技术', 'TypeScript高级技巧', 'React性能优化指南', '写给初学者的Docker教程'][actualIndex % 5]}`,
          description: `这是文章 ${actualIndex} 的简短描述。${'这是一些随机的描述内容，展示文章的主要内容和吸引读者继续阅读。'.repeat(Math.floor(Math.random() * 2) + 1)}`,
          coverImage: hasCover ? `https://picsum.photos/600/300?random=${actualIndex}` : undefined,
          author: {
            id: `author-${actualIndex % 10}`,
            username: `作者 ${actualIndex % 10}`,
            avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${actualIndex % 10}`,
            level: Math.floor(Math.random() * 5) + 1,
          },
          publishedAt: new Date(Date.now() - actualIndex * 86400000).toISOString(),
          viewCount: Math.floor(Math.random() * 1000) + 100,
          likeCount: Math.floor(Math.random() * 200),
          commentCount: Math.floor(Math.random() * 50),
          tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, tagIndex) => {
            const tags = [
              { id: 'tag-1', name: 'JavaScript', color: 'gold' },
              { id: 'tag-2', name: 'React', color: 'blue' },
              { id: 'tag-3', name: 'Vue', color: 'green' },
              { id: 'tag-4', name: 'Node.js', color: 'lime' },
              { id: 'tag-5', name: 'TypeScript', color: 'geekblue' }
            ];
            return tags[(actualIndex + tagIndex) % tags.length];
          }),
          isVideo,
          videoDuration: isVideo ? `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined
        };
      });

      // 模拟只有10页数据
      const hasMore = page < 10;
      
      resolve({ data: posts, hasMore });
    }, 800); // 添加延迟模拟网络请求
  });
};

export function useInfinitePosts(options: UseInfinitePostsOptions = {}): UseInfinitePostsReturn {
  const { initialPosts = [], pageSize = 10 } = options;
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
      const { data, hasMore: moreAvailable } = await mockFetchPosts(1, pageSize);
      setPosts(data);
      setHasMore(moreAvailable);
      setPage(2);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('加载文章失败'));
      console.error('Failed to load initial posts:', err);
    } finally {
      setLoading(false);
    }
  }, [initialPosts.length, pageSize]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const { data, hasMore: moreAvailable } = await mockFetchPosts(page, pageSize);
      setPosts(prevPosts => [...prevPosts, ...data]);
      setHasMore(moreAvailable);
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('加载更多文章失败'));
      console.error('Failed to load more posts:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize]);

  // 初始加载
  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  return { posts, loading, error, hasMore, loadMore };
}
