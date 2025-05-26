'use client';
import React from 'react';
import { Card, Radio, Typography, Space, Divider } from 'antd';
import { SortAscendingOutlined, FireOutlined, FieldTimeOutlined } from '@ant-design/icons';
import OfficialNews from '@/components/sidebar/official-news';
import RecommendedUsers from '@/components/sidebar/recommended-users';
import PromoBanner from '@/components/sidebar/promo-banner';
import { useAuthModal } from '@/modules/auth/AuthModal';
import { useSearchStore } from '@/store/searchStore';
import type { RadioChangeEvent } from 'antd';

const { Title } = Typography;

interface SearchSidebarProps {
  sortOrder?: 'comprehensive' | 'latest' | 'hottest';
  onSortChange?: (value: 'comprehensive' | 'latest' | 'hottest') => void;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({
  sortOrder: propsSortOrder,
  onSortChange: propsOnSortChange
}) => {
  const { sortOrder: storeSortOrder, setSortOrder } = useSearchStore();
  const { openLoginModal } = useAuthModal();
  
  // 使用props中的值或从store中获取值
  const currentSortOrder = propsSortOrder || storeSortOrder;
  
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
      coverImage: 'https://picsum.photos/600/300?random=1',
      url: '/article/ai-writing-tips'
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
    }
  ];

  const mockBanners = [
    {
      id: 'banner1',
      imageUrl: 'https://picsum.photos/600/200?random=10',
      title: '参加年度开发者大会，抢先体验新技术',
      url: '/events/annual-dev-conference'
    }
  ];

  // 处理排序变更
  const handleSortChange = (e: RadioChangeEvent) => {
    const value = e.target.value as 'comprehensive' | 'latest' | 'hottest';
    if (propsOnSortChange) {
      propsOnSortChange(value);
    } else {
      setSortOrder(value);
    }
  };

  // 模拟关注用户的处理函数
  const handleFollowUser = async (userId: string, isFollowing: boolean) => {
    console.log(`${isFollowing ? '关注' : '取消关注'} 用户: ${userId}`);
    return Promise.resolve();
  };

  return (
    <div>
      {/* 排序选项卡片 */}
      <Card
        title={<Title level={5}>排序方式</Title>}
        style={{ marginBottom: 16 }}
      >
        <Radio.Group 
          value={currentSortOrder} 
          onChange={handleSortChange}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value="comprehensive">
              <Space>
                <SortAscendingOutlined />
                综合排序
              </Space>
            </Radio>
            <Radio value="latest">
              <Space>
                <FieldTimeOutlined />
                最新优先
              </Space>
            </Radio>
            <Radio value="hottest">
              <Space>
                <FireOutlined />
                最热优先
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      </Card>

      {/* 广告Banner */}
      <PromoBanner
        banners={mockBanners}
        autoplay={true}
      />

      {/* 官方资讯 */}
      <OfficialNews
        newsItems={mockNewsItems}
        title="热门资讯"
      />

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
