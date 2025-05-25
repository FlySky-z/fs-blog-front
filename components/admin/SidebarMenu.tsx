import React from 'react';
import { Menu } from 'antd';
import { DashboardOutlined, FileTextOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';

const items = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: 'article', icon: <FileTextOutlined />, label: '文章管理' },
  { key: 'account', icon: <UserOutlined />, label: '账号管理' },
  { key: 'abnormal', icon: <WarningOutlined />, label: '异常感知' },
];

interface SidebarMenuProps {
  activeKey: string;
  onChange: (key: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ activeKey, onChange }) => {
  return (
    <Menu
      style={{borderInlineEnd: 'none'}}
      mode="inline"
      selectedKeys={[activeKey]}
      onClick={e => onChange(e.key as string)}
      items={items}
    />
  );
};

export default SidebarMenu;
