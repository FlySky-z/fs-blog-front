'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input, Avatar, Dropdown, Space, Badge, Layout, Button, message } from 'antd';
import { SearchOutlined, BellOutlined, DownOutlined, HeartOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import styles from './header-nav.module.scss';

interface HeaderComponentProps {
    isLogin: boolean;
    user: {
        avatar?: string;
        name?: string;
    };
    openLoginModal: () => void;
    openRegisterModal: () => void;
    logout: () => void;
}

export default function HeaderComponent(props: HeaderComponentProps) {
    const { isLogin, user, openLoginModal, openRegisterModal, logout } = props;

    const [isScrolled, setIsScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [hasNotification, setHasNotification] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // 监听滚动事件，用于改变顶部导航栏样式
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 头像下拉菜单项
    const userMenuItems = [
        { 
            key: 'profile', 
            label: <Link href="/accountCenter">个人中心</Link> 
        },
        { 
            key: 'settings', 
            label: <Link href="/accountCenter?tab=settings">设置</Link> 
        },
        { 
            key: 'logout', 
            label: '退出登录', 
            danger: true,
            onClick: logout
        },
    ];

    // 站点切换菜单项
    const siteMenuItems = [
        { key: 'blog', label: '博客' },
        { key: 'chat', label: '聊天' },
    ];

    return (
        <Layout.Header className={`${styles.headerContainer}`}>
            <div className={styles.headerInner}>
                {/* 左侧区域: Logo + 站点切换 */}
                <div className={styles.headerLeft}>
                    <Link href="/">
                        <Image 
                            src="/next.svg" 
                            alt="Logo" 
                            width={120} 
                            height={32} 
                            className={styles.logo} 
                        />
                    </Link>
                    {/* <Dropdown 
                        menu={{ items: siteMenuItems }}
                        placement="bottomLeft"
                    >
                        <div className={styles.siteSwitcher}>
                            <span>博客</span>
                            <DownOutlined className={styles.arrowIcon} />
                        </div>
                    </Dropdown> */}
                </div>

                {/* 中部区域: 导航链接 */}
                <div className={styles.headerCenter}>
                    <ul className={styles.navLinks}>
                        <li><Link href="/" className={styles.active}>首页</Link></li>
                        <li><Link href="/blogs">专栏</Link></li>
                        <li><Link href="/tags">标签</Link></li>
                    </ul>
                </div>

                {/* 右侧区域: 搜索框 + 功能图标 + 头像 */}
                <div className={styles.headerRight}>
                    {/* 搜索框 */}
                    <div className={styles.searchContainer}>
                        <Input
                            style={{paddingLeft: '32px'}}
                            id="header-search"
                            placeholder="搜索内容..."
                            prefix={<SearchOutlined className={styles.searchIcon} />}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            suffix={searchFocused ? null : <span className={styles.searchHint}>/</span>}
                        />
                    </div>

                    {/* 功能图标按钮 */}
                    <div className={styles.iconButtons}>
                        <button>
                            <HeartOutlined />
                        </button>
                        <button>
                            <Badge dot={hasNotification}>
                                <BellOutlined />
                            </Badge>
                        </button>
                    </div>

                    {/* 头像下拉菜单 */}
                    {isLogin ? (
                        <Dropdown 
                            menu={{ items: userMenuItems }} 
                            placement="bottomRight"
                            trigger={['click']}
                            open={userMenuOpen}
                            onOpenChange={(flag) => setUserMenuOpen(flag)}
                        >
                            <div className={styles.avatarDropdown}>
                                <Avatar src={user?.avatar ? user.avatar : null} style={{ cursor: 'pointer' }} />
                            </div>
                        </Dropdown>
                    ) : (
                        <Space>
                            <Button 
                                type="link" 
                                icon={<LoginOutlined />} 
                                onClick={() => {
                                    if (openLoginModal) {
                                        openLoginModal();
                                    } else {
                                        console.error('openLoginModal is undefined');
                                        message.error('登录窗口加载失败');
                                    }
                                }}
                            >
                                登录
                            </Button>
                            <Button 
                                type="link" 
                                onClick={() => {
                                    if (openRegisterModal) {
                                        openRegisterModal();
                                    } else {
                                        console.error('openRegisterModal is undefined');
                                        message.error('注册窗口加载失败');
                                    }
                                }}
                            >
                                注册
                            </Button>
                        </Space>
                    )}
                </div>
            </div>
        </Layout.Header>
    );
}
