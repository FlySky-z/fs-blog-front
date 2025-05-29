'use client';
import React, { useEffect } from 'react';
import FeedLayout from "@/components/templates/feed-layout";
import SearchFeed from "@/modules/article/search-feed";
import SearchSidebar from "@/modules/sidebar/search-sidebar";
import RocketToTop from "@/components/header/rocket";
import { Empty } from 'antd';
import styles from './page.module.scss';
import { useSearchStore } from '@/store/searchStore';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const {
        keyword,
        tag,
        sortOrder,
        setKeyword,
        setSortOrder,
        setTag,
    } = useSearchStore();

    // 从URL参数初始化搜索状态
    useEffect(() => {
        const urlKeyword = searchParams.get('q') || '';
        const urlTag = searchParams.get('tag') || '';
        const urlSortOrder = searchParams.get('sort') || '';
        setKeyword(urlKeyword.trim());
        setTag(urlTag.trim());
        if (urlSortOrder === 'latest' || urlSortOrder === 'hottest') {
            setSortOrder(urlSortOrder as 'latest' | 'hottest');
        } else {
            setSortOrder('comprehensive'); // 默认综合排序
        }
    }, [searchParams, setKeyword, setTag, setSortOrder]);

    // 将排序方式映射到API参数
    const mapSortToApiParams = () => {
        switch (sortOrder) {
            case 'latest':
                return {
                    orderBy: 'time' as const,
                    sortOrder: 'desc' as const
                };
            case 'hottest':
                return {
                    orderBy: 'hot' as const,
                    sortOrder: 'desc' as const
                };
            default:
                // 综合排序，使用默认参数
                return {};
        }
    };

    // 构建标题文本
    const buildTitle = () => {
        if (!keyword) return '所有文章';

        const sortName = {
            comprehensive: '综合排序',
            latest: '最新优先',
            hottest: '最热优先'
        }[sortOrder];

        return `"${keyword}" 的搜索结果 - ${sortName}`;
    };

    return (
        <main>
            <FeedLayout
                main={
                    <SearchFeed
                        title={buildTitle()}
                        pageSize={10}
                        {...mapSortToApiParams()}
                    />
                }
                sidebar={
                    <SearchSidebar />
                }
            />
            <RocketToTop />
        </main>
    );
}
