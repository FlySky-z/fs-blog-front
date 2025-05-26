'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Avatar, Dropdown, Space, Layout, Button, Row, Col, Menu, MenuProps } from 'antd';
import styles from './header-nav.module.scss';
import { useUIStore } from '@/store/uiStore';
import LogoSection from './LogoSection';
import NavMenu from './NavMenu';
import SearchBox from './SearchBox';
import ThemeToggle from './ThemeToggle';
import NotificationButton from './NotificationButton';
import UserMenu from './UserMenu';

interface HeaderComponentProps {
    isLogin: boolean;
    isAdmin?: boolean;
    user: {
        avatar?: string;
        name?: string;
    };
    openLoginModal: () => void;
    openRegisterModal: () => void;
    handleSearch: (keyword: string) => void;
    logout: () => void;
}

export default function HeaderComponent(props: HeaderComponentProps) {
    const {
        isLogin,
        isAdmin = true,
        user,
        openLoginModal,
        openRegisterModal,
        logout,
    } = props;

    const router = useRouter();
    const { theme: currentTheme, toggleTheme } = useUIStore();
    const [hasNotification, setHasNotification] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1000);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const userMenuItems = [
        {
            key: 'profile',
            label: '个人中心',
            onClick: () => router.push('/accountCenter')
        },
        {
            key: 'logout',
            label: '退出登录',
            danger: true,
            onClick: logout
        },
    ];

    const desktopAdminSiteMenuItems = [
        { key: 'blog', label: '博客', onClick: () => router.push('/') },
        { key: 'admin', label: '管理后台', onClick: () => router.push('/adminCenter') },
    ];

    const navItems = [
        { key: 'home', label: '首页', onClick: () => router.push('/') },
        { key: 'tags', label: '标签', onClick: () => router.push('/tags') },
    ];

    // 菜单项定义
    const adminMenu: MenuProps = {
        items: desktopAdminSiteMenuItems.map(item => ({
            key: item.key,
            label: item.label,
            onClick: item.onClick,
        }))
    };
    const navMenu: MenuProps = {
        items: navItems.map(item => ({
            key: item.key,
            label: <span onClick={item.onClick}>{item.label}</span>,
            onClick: item.onClick,
        }))
    };
    const userMenu: MenuProps = {
        items: userMenuItems.map(item => ({
            key: item.key,
            label: item.label,
            danger: item.danger,
            onClick: item.onClick,
        }))
    };
    const mobileAuthMenu: MenuProps = {
        items: [
            { key: 'login', label: '登录', onClick: openLoginModal },
            { key: 'register', label: '注册', onClick: openRegisterModal },
        ]
    };

    return (
        <Layout.Header 
            style={{
                borderBottom: currentTheme === 'light' ? '1px solid #e8e8e8' : '1px solid #444',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                width: '100vw',
                minWidth: 0,
                padding: 0,
                background: currentTheme === 'light' ? '#fff' : '#1a1a1a',
            }}
        >
            <div style={{
                maxWidth: 1280,
                margin: '0 auto',
                width: '100%',
                padding: isMobile ? '0 8px' : '0 16px',
                height: 64,
                display: 'flex',
                alignItems: 'center',
            }}>
                <Row style={{ width: '100%' }} align="middle" wrap={false} gutter={8}>
                    {/* Left Section */}
                    <Col flex="auto" style={{ display: 'flex', justifyContent: 'flex-start'}} >
                        <LogoSection isMobile={isMobile} isAdmin={isAdmin} currentTheme={currentTheme} adminMenu={adminMenu} />
                    </Col>

                    {/* Center Section */}
                    <Col flex="auto" style={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center', minWidth: 0 }}>
                        <NavMenu isMobile={isMobile} isTablet={isTablet} navMenu={navMenu} />
                    </Col>

                    {/* Right Section */}
                    <Col flex="none">
                        <Space>
                            <SearchBox isMobile={isMobile} handleSearch={props.handleSearch} />
                            <NotificationButton hasNotification={hasNotification} onClick={() => setHasNotification(!hasNotification)} />
                            {toggleTheme && (
                                <ThemeToggle currentTheme={currentTheme} toggleTheme={toggleTheme} />
                            )}
                            <UserMenu
                                isLogin={isLogin}
                                isMobile={isMobile}
                                user={user}
                                userMenu={userMenu}
                                userMenuOpen={userMenuOpen}
                                setUserMenuOpen={setUserMenuOpen}
                                openLoginModal={openLoginModal}
                                openRegisterModal={openRegisterModal}
                                mobileAuthMenu={mobileAuthMenu}
                            />
                        </Space>
                    </Col>
                </Row>
            </div>
        </Layout.Header>
    );
}
