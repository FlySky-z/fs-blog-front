'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input, Avatar, Dropdown, Space, Badge, Layout } from 'antd';
import { SearchOutlined, BellOutlined, DownOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';
import styles from './header-nav.module.scss';

export default function HeaderNav() {
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
        // 初始化时也检查一下
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 监听键盘快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && !searchFocused) {
                e.preventDefault();
                document.getElementById('header-search')?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [searchFocused]);

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
            onClick: () => {
                console.log('用户登出');
                // 这里可以添加登出逻辑
            }
        },
    ];

    // 站点切换菜单项
    const siteMenuItems = [
        { key: 'blog', label: '博客' },
        { key: 'forum', label: '论坛' },
        { key: 'docs', label: '文档' },
    ];

    return (
        <Layout.Header className={`${styles.headerContainer} ${isScrolled ? styles.scrolled : ''} theme: light`}>
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
                    <Dropdown 
                        menu={{ items: siteMenuItems }}
                        placement="bottomLeft"
                    >
                        <div className={styles.siteSwitcher}>
                            <span>博客</span>
                            <DownOutlined className={styles.arrowIcon} />
                        </div>
                    </Dropdown>
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
                    <Dropdown 
                        menu={{ items: userMenuItems }} 
                        placement="bottomRight"
                        trigger={['click']}
                        open={userMenuOpen}
                        onOpenChange={(flag) => setUserMenuOpen(flag)}
                    >
                        <div className={styles.avatarDropdown}>
                            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </Layout.Header>
    );
}
