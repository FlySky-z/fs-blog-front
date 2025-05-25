"use client";
import React, { useState, useEffect } from 'react';
import { Grid } from 'antd';
import { usePathname } from 'next/navigation';
import CreatorSidebarMenu from '@/components/creator/sidebar-menu';
import styles from './creator-layout.module.scss';

const { useBreakpoint } = Grid;
export default function CreatorCenterLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const pathname = usePathname();

    // 侧边栏状态
    const [activeMenuKey, setActiveMenuKey] = useState('home');


    // 从路径中提取活动菜单项
    useEffect(() => {
        if (pathname === '/creatorCenter') {
            setActiveMenuKey('home');
        } else if (pathname.includes('/creatorCenter/data')) {
            setActiveMenuKey('data');
        } else if (pathname.includes('/creatorCenter/articles')) {
            setActiveMenuKey('articles');
        } else if (pathname.includes('/creatorCenter/announcements')) {
            setActiveMenuKey('announcements');
        }
    }, [pathname]);

    // 处理侧边栏菜单选择
    const handleMenuSelect = (key: string) => {
        setActiveMenuKey(key);
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* 侧边栏区域 */}
                {!isMobile && (
                    <div className={styles.sidebar}>
                        <CreatorSidebarMenu
                            activeMenuKey={activeMenuKey}
                            onMenuSelect={handleMenuSelect}
                            isMobile={false}
                            notificationCounts={{
                                articles: 2,
                                drafts: 3,
                                announcements: 1
                            }}
                        />
                    </div>
                )}

                {/* 移动端导航栏 */}
                {isMobile && (
                    <div className={styles['mobile-menu']}>
                        <CreatorSidebarMenu
                            activeMenuKey={activeMenuKey}
                            onMenuSelect={handleMenuSelect}
                            isMobile={true}
                            notificationCounts={{
                                articles: 2,
                                drafts: 3,
                                announcements: 1
                            }}
                        />
                    </div>
                )}

                {/* 主内容区域 */}
                <div className={styles['main-content']}>
                    {children}
                </div>
            </div>
        </div>
    );
}