'use client';
import { useState, useEffect } from 'react';
import { TabDataType } from '@/components/profile/profile-tab-panel';
import { ArticleItemData } from '@/components/profile/article-item';
import { CommentItemData } from '@/components/profile/comment-item';
import { CollectionItemData } from '@/components/profile/collection-item';
import { UserCardData } from '@/components/profile/user-card';

/**
 * 获取用户各标签页数据的 Hook
 */
export const useProfileTabs = (tab: string, userId: string) => {
  const [tabData, setTabData] = useState<TabDataType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});
  
  // 加载初始数据
  useEffect(() => {
    const fetchTabData = async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      
      try {
        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 600));
        
        let tabData: TabDataType | undefined;
        
        // 根据标签类型生成不同的模拟数据
        switch (tab) {
          case 'posts':
            tabData = {
              type: 'posts',
              data: generateMockPosts(8)
            };
            break;
            
          case 'comments':
            tabData = {
              type: 'comments',
              data: generateMockComments(5)
            };
            break;
            
          case 'collections':
            tabData = {
              type: 'collections',
              data: generateMockCollections(4)
            };
            break;
            
          case 'favorites':
            tabData = {
              type: 'favorites',
              data: generateMockPosts(6)
            };
            break;
            
          case 'followers':
            tabData = {
              type: 'followers',
              data: generateMockFollowers(10)
            };
            break;
            
          case 'settings':
            tabData = { type: 'settings', data: null };
            break;
            
          case 'certification':
            tabData = { type: 'certification', data: null };
            break;
            
          default:
            tabData = {
              type: 'posts',
              data: generateMockPosts(8)
            };
        }
        
        setTabData(tabData);
        setHasMore(tab !== 'settings' && tab !== 'certification');
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取数据失败'));
        console.error('获取标签数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTabData();
  }, [tab, userId]);
  
  // 加载更多数据
  const loadMore = async () => {
    if (loadMoreLoading || !hasMore) return;
    
    setLoadMoreLoading(true);
    
    try {
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 增加页码
      const nextPage = page + 1;
      
      // 如果是第三页则没有更多数据
      const newHasMore = nextPage < 3;
      
      // 根据类型添加不同的数据
      if (tabData) {
        let newData: any[] = [];
        
        switch (tabData.type) {
          case 'posts':
          case 'favorites':
            newData = generateMockPosts(4);
            break;
            
          case 'comments':
            newData = generateMockComments(3);
            break;
            
          case 'collections':
            newData = generateMockCollections(2);
            break;
            
          case 'followers':
            newData = generateMockFollowers(5);
            break;
        }
        
        if (
          Array.isArray(tabData.data) &&
          Array.isArray(newData) &&
          tabData.type !== 'settings' &&
          tabData.type !== 'certification'
        ) {
          setTabData({
            type: tabData.type,
            // @ts-ignore - 类型扩展有点复杂，为简化示例忽略类型错误
            data: [...tabData.data, ...newData]
          });
        }
      }
      
      setPage(nextPage);
      setHasMore(newHasMore);
    } catch (err) {
      console.error('加载更多数据失败:', err);
    } finally {
      setLoadMoreLoading(false);
    }
  };
  
  // 模拟处理编辑评论
  const handleCommentEdit = (commentId: string) => {
    console.log('编辑评论:', commentId);
    // 在实际应用中，这里会打开编辑对话框
  };
  
  // 模拟处理删除评论
  const handleCommentDelete = (commentId: string) => {
    console.log('删除评论:', commentId);
    // 在实际应用中，这里会显示确认对话框并调用 API
    
    // 模拟UI更新
    if (tabData && tabData.type === 'comments') {
      setTabData({
        type: 'comments',
        data: tabData.data.filter(comment => comment.id !== commentId)
      });
    }
  };
  
  // 模拟关注/取消关注
  const handleToggleFollow = async (userId: string, isFollowing: boolean) => {
    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // 更新 UI
      if (tabData && tabData.type === 'followers') {
        setTabData({
          type: 'followers',
          data: tabData.data.map(user => 
            user.id === userId ? { ...user, isFollowing } : user
          )
        });
      }
    } catch (err) {
      console.error('关注操作失败:', err);
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  return {
    tabData,
    loading,
    error,
    hasMore,
    loadMore,
    loadMoreLoading,
    handleCommentEdit,
    handleCommentDelete,
    handleToggleFollow,
    followLoading
  };
};

// 生成模拟文章数据
function generateMockPosts(count: number): ArticleItemData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${Date.now()}-${i}`,
    title: `这是一篇关于${['React', 'Vue', 'Angular', 'Next.js', 'TypeScript'][i % 5]}的文章`,
    excerpt: '这是文章的摘要内容，展示部分正文的预览，吸引用户点击阅读全文...',
    coverImage: i % 3 === 0 ? `https://picsum.photos/300/200?random=${i}` : undefined,
    publishDate: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    viewCount: Math.floor(Math.random() * 1000),
    likeCount: Math.floor(Math.random() * 100),
    commentCount: Math.floor(Math.random() * 30),
    tags: [
      { id: `tag-${i}-1`, name: ['JavaScript', 'React', 'Vue', 'TypeScript', 'Next.js'][i % 5] },
      { id: `tag-${i}-2`, name: ['前端', '教程', '实战', '经验', '技巧'][i % 5] }
    ]
  }));
}

// 生成模拟评论数据
function generateMockComments(count: number): CommentItemData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `comment-${Date.now()}-${i}`,
    content: `这是评论内容，可能是对文章的讨论或者提问，也可能是对其他评论的回复。${'这是额外的评论内容，使评论更长一些。'.repeat(i % 3)}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    postId: `post-${i}`,
    postTitle: `《${['React Hooks 完全指南', 'Vue3 性能优化技巧', '构建现代化前端应用', 'TypeScript 高级类型', 'CSS Grid 布局详解'][i % 5]}》`
  }));
}

// 生成模拟合集数据
function generateMockCollections(count: number): CollectionItemData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `collection-${Date.now()}-${i}`,
    title: [`前端开发精选`, `React 学习路线`, `JavaScript 技巧合集`, `优质项目案例`][i % 4],
    description: i % 2 === 0 ? '这是合集的描述，介绍了该合集的主题和内容范围。' : undefined,
    coverImage: i % 2 === 0 ? `https://picsum.photos/300/200?random=${i + 10}` : undefined,
    postCount: Math.floor(Math.random() * 20) + 1,
    createdAt: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
    isPublic: i % 3 !== 0
  }));
}

// 生成模拟粉丝数据
function generateMockFollowers(count: number): UserCardData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${Date.now()}-${i}`,
    username: `用户${Math.floor(Math.random() * 10000)}`,
    avatarUrl: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    level: Math.floor(Math.random() * 5) + 1,
    bio: i % 2 === 0 ? '这是用户的个人简介，展示了用户的兴趣和专业领域。' : undefined,
    isFollowing: Math.random() > 0.5
  }));
}

export default useProfileTabs;
