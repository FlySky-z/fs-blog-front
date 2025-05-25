'use client';
import { useState, useEffect } from 'react';
import { TabDataType } from '@/components/profile/profile-tab-panel';
import { ArticleListItem } from '@/modules/article/articleModel';
import { CommentItemData } from '@/components/profile/comment-item';
import { CollectionItemData } from '@/components/profile/collection-item';
import { UserCardData } from '@/components/profile/user-card';
import { articleService } from '@/modules/article/articleService';
import { getFollowingList, followUser } from '@/modules/user/userService';

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
    const tabType = tab === 'posts' ? 'article' : tab;
    const fetchTabData = async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      
      try {
        let tabData: TabDataType | undefined;
        let hasMoreFlag = true;
        
        switch (tabType) {
          case 'article': {
            const articles = await articleService.getArticleList({ user_id: userId, page: 1 });
            tabData = { type: 'article', data: articles };
            hasMoreFlag = articles.length > 0;
            break;
          }
          
          case 'favorites': {
            const articles = await articleService.getArticleList({ user_id: userId, page: 1 });
            tabData = { type: 'favorites', data: articles };
            hasMoreFlag = articles.length > 0;
            break;
          }
          
          case 'followers': {
            const followers = await getFollowingList(userId);
            // 转换userInfo为UserCardData
            const followerCards = followers.map(f => ({
              id: String(f.id),
              username: f.username,
              avatarUrl: f.avatar_url,
              level: f.level || 1,
              bio: f.abstract,
              isFollowing: false // 需要根据实际API补充
            }));
            tabData = { type: 'followers', data: followerCards };
            break;
          }
          
          // TODO: comments/collections等tab的真实API
          default:
            tabData = { type: 'article', data: [] };
        }
        
        setTabData(tabData);
        setHasMore(tabType !== 'settings' && tabType !== 'certification' && hasMoreFlag);
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
      const nextPage = page + 1;
      let newData: any[] = [];
      let hasMoreFlag = true;
      
      if (tabData) {
        switch (tabData.type) {
          case 'article': {
            newData = generateMockPosts(3);
            // newData = await articleService.getArticleList({ user_id: userId, page: nextPage });
            hasMoreFlag = newData.length > 0;
            break;
          }
          case 'favorites': {
            newData = await articleService.getArticleList({ user_id: userId, page: nextPage });
            hasMoreFlag = newData.length > 0;
            break;
          }
          case 'comments':
            newData = generateMockComments(3);
            break;
          case 'collections':
            // newData = generateMockCollections(2);
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
            // @ts-ignore - 为简化忽略类型错误
            data: [...tabData.data, ...newData]
          });
        }
      }
      
      setPage(nextPage);
      setHasMore(hasMoreFlag && newData.length > 0);
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
  
  // 关注/取消关注
  const handleToggleFollow = async (userId: string, isFollowing: boolean) => {
    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      await followUser(Number(userId), !isFollowing);
      
      if (tabData && tabData.type === 'followers') {
        setTabData({
          type: 'followers',
          data: tabData.data.map(user =>
            user.id === userId ? { ...user, isFollowing: !isFollowing } : user
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
function generateMockPosts(count: number): ArticleListItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${Date.now()}-${i}`,
    header: `这是一篇关于${['React', 'Vue', 'Angular', 'Next.js', 'TypeScript'][i % 5]}的文章`,
    article_detail: `这是文章的正文内容，包含了很多关于${['前端开发', '后端开发', '全栈开发', '移动开发', '数据分析'][i % 5]}的知识和技巧。`,
    author: "测试作者",
    author_id: `${i}`,
    abstract: '这是文章的摘要内容，展示部分正文的预览，吸引用户点击阅读全文...',
    cover_image: i % 3 === 0 ? `https://picsum.photos/300/200?random=${i}` : undefined,
    create_time: Date.now() - Math.random() * 30 * 86400000,
    last_modified_date: Date.now(),
    view: Math.floor(Math.random() * 1000),
    like: Math.floor(Math.random() * 100),
    comment: Math.floor(Math.random() * 30),
    tags: [
      ['JavaScript', 'React', 'Vue', 'TypeScript', 'Next.js'][i % 5]
    ],
    status: 3,
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
