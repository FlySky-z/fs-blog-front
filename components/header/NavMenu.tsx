import { Menu, Button, Dropdown, Space, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface NavMenuProps {
  isMobile: boolean;
  isTablet: boolean;
  navMenu: MenuProps;
}

export default function NavMenu({ isMobile, isTablet, navMenu }: NavMenuProps) {
  const router = useRouter();
  return (
    <Space>
      {(isMobile || isTablet) ? (
        <Dropdown menu={navMenu} trigger={['click']}>
          <Button type="text">
            首页 <DownOutlined />
          </Button>
        </Dropdown>
      ) : (
        <Menu mode="horizontal" selectable={false} style={{ borderBottom: 'none', background: 'transparent' }} items={navMenu.items}>
        </Menu>
      )}
    </Space>
  );
}
