'use client';
import React from 'react';
import { Card, Drawer, Typography, Space } from 'antd';
import { 
  FileTextOutlined,
  CommentOutlined,
  FolderOutlined,
  StarOutlined,
  TeamOutlined,
  SettingOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import MenuItem from '@/components/molecules/center-menu-item';

const { Title } = Typography;

export interface MenuItemData {
  key: string;
  text: string;
  icon: React.ReactNode;
  href: string;
  notification?: number;
}

interface SidebarMenuProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  userId: string;
  isMobile: boolean;
  mobileDrawerVisible: boolean;
  onMobileDrawerClose: () => void;
  notificationCounts?: Record<string, number>;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activeTab,
  onTabChange,
  userId,
  isMobile,
  mobileDrawerVisible,
  onMobileDrawerClose,
  notificationCounts = {}
}) => {
  // 默认菜单项
  const menuItems: MenuItemData[] = [
    { 
      key: 'article', 
      text: '我的发帖', 
      icon: <FileTextOutlined />,
      href: `/accountCenter?tab=article&userId=${userId}`,
      notification: notificationCounts.article
    },
    { 
      key: 'comments', 
      text: '我的评论', 
      icon: <CommentOutlined />,
      href: `/accountCenter?tab=comments&userId=${userId}`,
      notification: notificationCounts.comments
    },
    { 
      key: 'collections', 
      text: '我的合集', 
      icon: <FolderOutlined />,
      href: `/accountCenter?tab=collections&userId=${userId}`
    },
    { 
      key: 'favorites', 
      text: '我的收藏', 
      icon: <StarOutlined />,
      href: `/accountCenter?tab=favorites&userId=${userId}`
    },
    { 
      key: 'followers', 
      text: '我的粉丝', 
      icon: <TeamOutlined />,
      href: `/accountCenter?tab=followers&userId=${userId}`,
      notification: notificationCounts.followers
    },
    { 
      key: 'settings', 
      text: '账号设置', 
      icon: <SettingOutlined />,
      href: `/accountCenter?tab=settings&userId=${userId}`
    },
    { 
      key: 'certification', 
      text: '认证中心', 
      icon: <SafetyCertificateOutlined />,
      href: `/accountCenter?tab=certification&userId=${userId}`
    },
  ];

  const menuContent = (
    <div className="flex flex-col">
      {isMobile && (
        <Title level={5} style={{ padding: '16px 16px 0' }}>
          导航菜单
        </Title>
      )}
      <Space direction="vertical" className="w-full mt-2">
        {menuItems.map((item) => (
          <MenuItem 
            key={item.key}
            icon={item.icon}
            text={item.text}
            active={activeTab === item.key}
            href={item.href}
            onClick={() => onTabChange(item.key)}
            notification={item.notification}
          />
        ))}
      </Space>
    </div>
  );

  // 移动端显示抽屉
  if (isMobile) {
    console.log('Mobile view');
    return (
      <Drawer
        title="导航菜单"
        placement="left"
        onClose={onMobileDrawerClose}
        open={mobileDrawerVisible}
        bodyStyle={{ padding: '12px' }}
      >
        {menuContent}
      </Drawer>
    );
  }

  // 桌面端显示卡片
  return (
    <Card className="w-full">
      {menuContent}
    </Card>
  );
};

export default SidebarMenu;
