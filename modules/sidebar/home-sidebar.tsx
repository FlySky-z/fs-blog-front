'use client';
import React, { useState, useEffect } from 'react';
import OfficialNews from '@/components/sidebar/official-news';
import RecommendedUsers from '@/components/sidebar/recommended-users';
import { followUser } from '@/modules/user/userService';
import PromoBanner from '@/components/sidebar/promo-banner';
import WelcomeCard from '@/components/sidebar/welcome-card';
import { useAuthModal } from '@/modules/auth/AuthModal';
import articleService from '../article/articleService';
import { Skeleton, Spin } from 'antd';
import { ArticleListItem } from '../article/articleModel';

const HomeSidebar: React.FC = () => {
  const { openLoginModal } = useAuthModal();
  const [officialArticles, setOfficialArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 在 useEffect 中获取文章
  useEffect(() => {
    const fetchOfficialArticles = async () => {
      try {
        const articles = await articleService.getArticleList({
          page: 1,
          limit: 5,
          order_by: 'time',
          sort_order: 'desc',
          user_id: '23', // 官方用户ID
        });
        setOfficialArticles(articles);
      } catch (error) {
        console.error('获取官方文章失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOfficialArticles();
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
    },
    {
      id: 'user3',
      username: '王伟',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
      level: 5,
      bio: '系统架构师 / 技术讲师',
      isFollowing: false
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
      imageUrl: 'https://picsum.photos/600/200?random=20',
      title: '关于网站进入测试的公告',
      url: '/article/19'
    }
  ];

  const mockWelcomeCard = {
    title: '欢迎来到技术博客平台',
    content: '这里是一个分享知识、经验和见解的地方。加入我们，与全球开发者一起成长！',
    imageUrl: 'https://picsum.photos/600/300?random=welcome',
    buttonText: '登录',
  };

  // 模拟关注用户的处理函数
  const handleFollowUser = async (userId: string, isFollowing: boolean) => {
    await followUser(Number(userId), !isFollowing)
    // 真实环境下这里会有API调用
    return Promise.resolve();
  };

  return (
    <div>
      {/* 显示欢迎卡片 */}
      <WelcomeCard
        title={mockWelcomeCard.title}
        content={mockWelcomeCard.content}
        imageUrl={"https://picsum.photos/600/800?random=welcome"}
        buttonText={mockWelcomeCard.buttonText}
        openLoginModal={openLoginModal}
      />

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

      {/* 快速入口 */}
      {/* <QuickEntryTabs
        entries={mockQuickEntries}
        title="发现更多"
      /> */}
    </div>
  );
};

export default HomeSidebar;
