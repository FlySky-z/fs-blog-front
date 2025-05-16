'use client';
import React from 'react';
import OfficialNews from '@/components/sidebar/official-news';
import RecommendedUsers from '@/components/sidebar/recommended-users';
import QuickEntryTabs from '@/components/sidebar/quick-entry-tabs';
import PromoBanner from '@/components/sidebar/promo-banner';
import WelcomeCard from '@/components/sidebar/welcome-card';
import { useSidebarData } from '@/modules/sidebar/hooks/use-sidebar-data';

interface HomeSidebarProps {
  isLoggedIn?: boolean;
}

const HomeSidebar: React.FC<HomeSidebarProps> = ({
  isLoggedIn = false
}) => {
  // 使用之前定义的 useSidebarData，但这里需要扩展它
  // 由于现有的 useSidebarData 接受 articleId 参数并返回不同的数据格式
  // 这里我们可以修改它并适配，或者在此组件中模拟数据
  
  // 模拟数据
  const mockNewsItems = [
    {
      id: '1',
      title: '技术博客平台全新发布，带来更好的写作体验',
      coverImage: 'https://picsum.photos/600/300?random=1',
      publishedAt: '2025-05-05T08:00:00Z',
      url: '/article/tech-blog-launch'
    },
    {
      id: '2',
      title: '如何利用人工智能提升你的写作效率',
      publishedAt: '2025-05-03T10:30:00Z',
      url: '/article/ai-writing-tips'
    },
    {
      id: '3',
      title: '2025技术趋势展望：哪些技术值得关注',
      publishedAt: '2025-05-01T14:15:00Z',
      url: '/article/tech-trends-2025'
    },
    {
      id: '4',
      title: '程序员健康指南：如何在高压工作中保持身心健康',
      publishedAt: '2025-04-29T09:45:00Z',
      url: '/article/programmer-health-guide'
    }
  ];
  
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
  
  const mockQuickEntries = [
    {
      key: 'categories',
      label: '分类',
      items: [
        { key: 'frontend', label: '前端开发', url: '/category/frontend', icon: <span>🌐</span> },
        { key: 'backend', label: '后端开发', url: '/category/backend', icon: <span>⚙️</span> },
        { key: 'mobile', label: '移动开发', url: '/category/mobile', icon: <span>📱</span> },
        { key: 'ai', label: '人工智能', url: '/category/ai', icon: <span>🤖</span> }
      ]
    },
    {
      key: 'resources',
      label: '资源',
      items: [
        { key: 'ebooks', label: '免费电子书', url: '/resources/ebooks', icon: <span>📚</span> },
        { key: 'courses', label: '在线课程', url: '/resources/courses', icon: <span>🎓</span> },
        { key: 'tools', label: '开发工具', url: '/resources/tools', icon: <span>🛠️</span> },
        { key: 'communities', label: '开发社区', url: '/resources/communities', icon: <span>👥</span> }
      ]
    }
  ];
  
  const mockBanners = [
    {
      id: 'banner1',
      imageUrl: 'https://picsum.photos/600/200?random=10',
      title: '参加年度开发者大会，抢先体验新技术',
      url: '/events/annual-dev-conference'
    },
    {
      id: 'banner2',
      imageUrl: 'https://picsum.photos/600/200?random=20',
      title: '高级前端工程师训练营，助你职场进阶',
      url: '/courses/frontend-bootcamp'
    }
  ];
  
  const mockWelcomeCard = {
    title: '欢迎来到技术博客平台',
    content: '这里是一个分享知识、经验和见解的地方。加入我们，与全球开发者一起成长！',
    imageUrl: 'https://picsum.photos/600/300?random=welcome',
    buttonText: '立即注册',
    buttonLink: '/register'
  };

  // 模拟关注用户的处理函数
  const handleFollowUser = async (userId: string, isFollowing: boolean) => {
    console.log(`${isFollowing ? '关注' : '取消关注'} 用户: ${userId}`);
    // 真实环境下这里会有API调用
    return Promise.resolve();
  };

  return (
    <div>
      {/* 未登录用户显示欢迎卡片 */}
      {!isLoggedIn && (
        <WelcomeCard
          title={mockWelcomeCard.title}
          content={mockWelcomeCard.content}
          imageUrl={mockWelcomeCard.imageUrl}
          buttonText={mockWelcomeCard.buttonText}
          buttonLink={mockWelcomeCard.buttonLink}
        />
      )}
      
      {/* 广告Banner */}
      <PromoBanner
        banners={mockBanners}
        autoplay={true}
      />
      
      {/* 官方资讯 */}
      <OfficialNews
        newsItems={mockNewsItems}
        title="官方资讯"
      />
      
      {/* 推荐用户 */}
      <RecommendedUsers
        users={mockRecommendedUsers}
        title="推荐关注"
        onFollow={handleFollowUser}
      />
      
      {/* 快速入口 */}
      <QuickEntryTabs
        entries={mockQuickEntries}
        title="发现更多"
      />
    </div>
  );
};

export default HomeSidebar;
