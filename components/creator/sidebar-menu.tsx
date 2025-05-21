'use client';
import React from 'react';
import { Card, Drawer, Typography, Space } from 'antd';
import { 
  HomeOutlined,
  BarChartOutlined,
  FileTextOutlined,
  EditOutlined,
  InboxOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import MenuItem from '@/components/molecules/center-menu-item';

const { Title } = Typography;

export interface CreatorMenuItemData {
  key: string;
  text: string;
  icon: React.ReactNode;
  href: string;
  subItems?: CreatorMenuItemData[];
  notification?: number;
  divider?: boolean;
}

interface CreatorSidebarMenuProps {
  activeMenuKey: string;
  onMenuSelect: (key: string) => void;
  isMobile: boolean;
  mobileDrawerVisible: boolean;
  onMobileDrawerClose: () => void;
  notificationCounts?: Record<string, number>;
}

const CreatorSidebarMenu: React.FC<CreatorSidebarMenuProps> = ({
  activeMenuKey,
  onMenuSelect,
  isMobile,
  mobileDrawerVisible,
  onMobileDrawerClose,
  notificationCounts = {}
}) => {
  // 创作中心菜单项
  const menuItems: CreatorMenuItemData[] = [
    { 
      key: 'home', 
      text: '首页', 
      icon: <HomeOutlined />,
      href: `/creatorCenter`,
    },
    { 
      key: 'data', 
      text: '数据中心', 
      icon: <BarChartOutlined />,
      href: `/creatorCenter/data`,
      subItems: [
        {
          key: 'overview',
          text: '综合数据',
          icon: <BarChartOutlined />,
          href: `/creatorCenter/data/overview`
        },
        {
          key: 'fans',
          text: '粉丝分析',
          icon: <BarChartOutlined />,
          href: `/creatorCenter/data/fans`
        }
      ]
    },
    { 
      key: 'articles', 
      text: '投稿管理', 
      icon: <FileTextOutlined />,
      href: `/creatorCenter/articles`,
      notification: notificationCounts.articles,
      subItems: [
        {
          key: 'new',
          text: '新增文章',
          icon: <EditOutlined />,
          href: `/create`
        },
        {
          key: 'manage',
          text: '管理文章',
          icon: <FileTextOutlined />,
          href: `/creatorCenter/articles/manage`
        },
        {
          key: 'drafts',
          text: '草稿箱',
          icon: <InboxOutlined />,
          href: `/creatorCenter/articles/drafts`,
          notification: notificationCounts.drafts
        }
      ]
    },
    { 
      key: 'announcements', 
      text: '创作公告', 
      icon: <NotificationOutlined />,
      href: `/creatorCenter/announcements`,
      notification: notificationCounts.announcements
    },
  ];

  // 渲染主菜单项
  const renderMainMenuItems = () => {
    return menuItems.map((item) => (
      <div key={item.key}>
        <MenuItem 
          icon={item.icon}
          text={item.text}
          active={activeMenuKey === item.key || (item.subItems?.some(sub => activeMenuKey === sub.key))}
          href={item.href}
          onClick={() => onMenuSelect(item.key)}
          notification={item.notification}
        />
        {item.subItems && activeMenuKey === item.key && (
          <div style={{ marginTop: '8px', paddingLeft: '12px' }}>
            {item.subItems.map(subItem => (
              <MenuItem 
                key={subItem.key}
                icon={subItem.icon}
                text={subItem.text}
                active={activeMenuKey === subItem.key}
                href={subItem.href}
                onClick={() => onMenuSelect(subItem.key)}
                notification={subItem.notification}
              />
            ))}
          </div>
        )}
      </div>
    ));
  };

  const menuContent = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {isMobile && (
        <Title level={5} style={{ padding: '16px 16px 0' }}>
          创作中心
        </Title>
      )}
      <Space direction="vertical" style={{ width: '100%', marginTop: '8px' }}>
        {renderMainMenuItems()}
      </Space>
    </div>
  );

  // 移动端显示抽屉
  if (isMobile) {
    return (
      <Drawer
        title="创作中心导航"
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
    <Card style={{ width: '100%' }}>
      {menuContent}
    </Card>
  );
};

export default CreatorSidebarMenu;
