'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { notification, Modal } from 'antd';
import ProfileLayout from '@/components/templates/profile-layout';
import AvatarHeader from '@/components/profile/avatar-header';
import SidebarMenu from '@/components/profile/sidebar-menu';
import ProfileTabPanel from '@/components/profile/profile-tab-panel';
import useProfile from '@/modules/profile/hooks/use-profile';
import useProfileTabs from '@/modules/profile/hooks/use-profile-tabs';

interface ProfileContentProps {
  initialUserId?: string;
  initialTab?: string;
}

const tabTitles: Record<string, string> = {
  posts: '我的发帖',
  comments: '我的评论',
  collections: '我的合集',
  favorites: '我的收藏',
  followers: '我的粉丝',
  settings: '账号设置',
  certification: '认证中心'
};

const ProfileContent: React.FC<ProfileContentProps> = ({
  initialUserId = 'current-user',
  initialTab = 'posts'
}) => {
  const searchParams = useSearchParams();
  
  // 从URL参数获取用户ID和当前标签
  const userId = searchParams.get('userId') || initialUserId;
  const defaultTab = searchParams.get('tab') || initialTab;
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  
  // 获取用户资料
  const { 
    user, 
    loading: profileLoading,
    toggleFollowing,
    isFollowingLoading
  } = useProfile(userId);
  
  // 获取标签页数据
  const {
    tabData,
    loading: tabLoading,
    hasMore,
    loadMore,
    loadMoreLoading,
    handleCommentEdit,
    handleCommentDelete,
    handleToggleFollow,
    followLoading
  } = useProfileTabs(activeTab, userId);
  
  // 处理标签切换
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileDrawerVisible(false);
    
    // 更新URL参数，但不重新加载页面
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
  };
  
  // 处理编辑个人资料
  const handleEditProfile = () => {
    notification.info({
      message: '功能开发中',
      description: '个人资料编辑功能正在开发中，敬请期待！',
    });
  };
  
  // 处理显示粉丝列表
  const handleFollowersClick = () => {
    handleTabChange('followers');
  };
  
  // 处理显示关注列表 (假设也存在这个标签)
  const handleFollowingClick = () => {
    notification.info({
      message: '功能开发中',
      description: '关注列表功能正在开发中，敬请期待！',
    });
  };
  
  // 处理评论删除确认
  const confirmDeleteComment = (commentId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条评论吗？此操作无法撤销。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => handleCommentDelete(commentId)
    });
  };
  
  return (
    <ProfileLayout
      profileHeader={
        user ? (
          <AvatarHeader 
            user={user}
            onEditProfile={handleEditProfile}
            onToggleFollow={toggleFollowing}
            onFollowersClick={handleFollowersClick}
            onFollowingClick={handleFollowingClick}
          />
        ) : null
      }
      sidebar={
        <SidebarMenu 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userId={userId}
          isMobile={false}
          mobileDrawerVisible={mobileDrawerVisible}
          onMobileDrawerClose={() => setMobileDrawerVisible(false)}
          notificationCounts={{
            posts: 2,
            comments: 0,
            followers: 1
          }}
        />
      }
      content={
        <ProfileTabPanel
          title={tabTitles[activeTab] || '个人中心'}
          loading={profileLoading || tabLoading}
          tabData={tabData}
          hasMore={hasMore}
          onLoadMore={loadMore}
          loadMoreLoading={loadMoreLoading}
          onCommentEdit={handleCommentEdit}
          onCommentDelete={confirmDeleteComment}
          onToggleFollow={handleToggleFollow}
          followLoading={followLoading}
        />
      }
      onOpenMobileMenu={() => setMobileDrawerVisible(true)}
    />
  );
};

export default ProfileContent;
