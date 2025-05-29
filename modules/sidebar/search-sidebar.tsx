'use client';
import React, { useState, useEffect } from 'react';
import OfficialNews from '@/components/sidebar/official-news';
import RecommendedUsers from '@/components/sidebar/recommended-users';
import PromoBanner from '@/components/sidebar/promo-banner';
import { followUser } from '@/modules/user/userService';
import articleService from '../article/articleService';
import { Skeleton, Spin } from 'antd';
import { ArticleListItem } from '../article/articleModel';



const SearchSidebar: React.FC = ({
}) => {
  // 使用 useState 存储官方文章
  const [officialArticles, setOfficialArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 在 useEffect 中获取文章，使用引用标记和清理函数避免重复调用
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchOfficialArticles = async () => {
      try {
        // 如果组件已卸载，则不执行请求
        if (!isMounted) return;

        const articles = await articleService.getArticleList({
          page: 1,
          limit: 5,
          order_by: 'time',
          sort_order: 'desc',
          user_id: '23',
        });
        
        // 只有当组件仍然挂载时才更新状态
        if (isMounted) {
          setOfficialArticles(articles);
          setLoading(false);
        }
      } catch (error) {
        // 只有当组件仍然挂载时才处理错误
        if (isMounted) {
          console.error('获取官方文章失败:', error);
          setLoading(false);
        }
      }
    };
    
    fetchOfficialArticles();
    
    // 清理函数，组件卸载时执行
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const mockRecommendedUsers = [
    {
      id: 'user1',
      username: '张明',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      level: 3,
      bio: '前端工程师 / 技术博主',
      isFollowing: false
    },
    {
      id: 'user2',
      username: '李晓华',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
      level: 4,
      bio: '全栈开发 / 开源贡献者',
      isFollowing: true
    }
  ];

  const mockBanners = [
    {
      id: 'banner1',
      imageUrl: 'https://picsum.photos/600/200?random=10',
      title: '欢迎各位前来体验小破站',
      url: '/article/20'
    },
    {
      id: 'banner2',
      imageUrl: 'https://picsum.photos/600/200?random=10',
      title: '关于网站进入测试的公告',
      url: '/article/19'
    },
  ];


  // 模拟关注用户的处理函数
  const handleFollowUser = async (userId: string, isFollowing: boolean) => {
    await followUser(Number(userId), !isFollowing)
    return Promise.resolve();
  };

  return (
    <div>
      {/* 广告Banner */}
      <PromoBanner
        banners={mockBanners}
        autoplay={true}
      />

      {/* 官方资讯 */}
      {loading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <OfficialNews
          newsItems={officialArticles}
          title="官方资讯"
        />
      )}

      {/* 推荐用户 */}
      <RecommendedUsers
        users={mockRecommendedUsers}
        title="推荐关注"
        onFollow={handleFollowUser}
      />
    </div>
  );
};

export default SearchSidebar;
