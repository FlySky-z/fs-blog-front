import { Menu, Button, Dropdown, Space, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface NavMenuProps {
  isMobile: boolean;
  navMenu: MenuProps;
}

export default function NavMenu({ isMobile, navMenu }: NavMenuProps) {
  return (
    <Space>
      {(isMobile) ? (
        <Dropdown menu={navMenu} trigger={['click']}>
          <Button type="text">
            首页
          </Button>
        </Dropdown>
      ) : (
        <Menu mode="horizontal" selectable={false} style={{ borderBottom: 'none', background: 'transparent' }} items={navMenu.items}>
        </Menu>
      )}
    </Space>
  );
}
