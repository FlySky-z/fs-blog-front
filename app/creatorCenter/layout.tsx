"use client";
import React, { useState, useEffect } from 'react';
import { Grid } from 'antd';
import { usePathname } from 'next/navigation';
import CreatorSidebarMenu from '@/components/creator/sidebar-menu';
import styles from './creator-layout.module.scss';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

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
        <ProtectedRoute role={0} redirectPath="/400">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* 侧边栏区域, TODO: 增加通知count */}
                    <div className={isMobile ? styles.mobileMenu : styles.sidebar}>
                        <CreatorSidebarMenu
                            activeMenuKey={activeMenuKey}
                            onMenuSelect={handleMenuSelect}
                            isMobile={isMobile}
                            notificationCounts={{
                                articles: 0,
                                drafts: 0,
                                announcements: 0
                            }}
                        />
                    </div>

                    {/* 主内容区域 */}
                    <div className={styles.mainContent}>
                        {children}
                    </div>
                </div>
            </div>
        </ProtectedRoute>

    );
}