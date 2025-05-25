import { Avatar, Dropdown, Button, Menu, MenuProps } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import React from 'react';

interface UserMenuProps {
  isLogin: boolean;
  isMobile: boolean;
  user: { avatar?: string; name?: string };
  userMenu: MenuProps;
  userMenuOpen: boolean;
  setUserMenuOpen: (flag: boolean) => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  mobileAuthMenu: MenuProps;
}

export default function UserMenu({
  isLogin,
  isMobile,
  user,
  userMenu,
  userMenuOpen,
  setUserMenuOpen,
  openLoginModal,
  openRegisterModal,
  mobileAuthMenu,
}: UserMenuProps) {
  return isLogin ? (
    <Dropdown 
      menu={userMenu}
      placement="bottomRight"
      trigger={['click']}
      open={userMenuOpen}
      onOpenChange={setUserMenuOpen}
    >
      <Avatar 
        src={user?.avatar || undefined} 
        icon={!user?.avatar && <UserOutlined />}
        style={{ cursor: 'pointer' }}
      />
    </Dropdown>
  ) : (
    isMobile ? (
      <Dropdown
        menu={mobileAuthMenu}
        placement="bottomRight"
        trigger={['click']}
      >
        <Button type="text" icon={<UserOutlined />} shape="circle" />
      </Dropdown>
    ) : (
      <>
        <Button type="link" icon={<LoginOutlined />} onClick={openLoginModal}>
          登录
        </Button>
        <Button type="link" icon={<UserOutlined />} onClick={openRegisterModal}>
          注册
        </Button>
      </>
    )
  );
}
