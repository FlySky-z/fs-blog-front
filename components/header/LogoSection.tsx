import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Dropdown, Button, Menu, Space, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface LogoSectionProps {
  isMobile: boolean;
  isAdmin: boolean;
  currentTheme: string;
  adminMenu: MenuProps;
}

export default function LogoSection({ isMobile, isAdmin, currentTheme, adminMenu }: LogoSectionProps) {
  const router = useRouter();
  return (
    <Space>
      <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <Image
          src="/next.svg"
          alt="Logo"
          width={isMobile ? 40 : 120}
          height={32}
          style={currentTheme === 'dark' ? { filter: 'invert(1)' } : undefined}
        />
      </div>
      {!isMobile && isAdmin && (
        <Dropdown menu={adminMenu} trigger={['click']}>
          <Button type="text">
            博客 <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </Space>
  );
}
