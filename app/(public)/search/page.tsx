'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FeedLayout from "@/components/templates/feed-layout";
import HomeFeed from "@/modules/article/article-feed";
import SearchSidebar from "@/modules/sidebar/search-sidebar";
import RocketToTop from "@/components/header/rocket";
import { Empty } from 'antd';
import styles from './page.module.scss';
import { useSearchStore } from '@/store/searchStore';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const {
        keyword,
        searchText,
        sortOrder,
        setKeyword,
        setSearchText,
        setSortOrder,
        updateKeywordAndUrl
    } = useSearchStore();

    // 从 URL 参数更新搜索关键词
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setKeyword(q);
            setSearchText(q);
        }
    }, [searchParams, setKeyword, setSearchText]);

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

    // 处理搜索提交
    const handleSearch = () => {
        if (searchText.trim()) {
            updateKeywordAndUrl(searchText);
        }
    };

    // 处理排序变更
    const handleSortChange = (value: 'comprehensive' | 'latest' | 'hottest') => {
        setSortOrder(value);
    };

    // 处理按键按下
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
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
                    keyword ? (
                        <HomeFeed
                            title={buildTitle()}
                            pageSize={10}
                            keyword={keyword}
                            {...mapSortToApiParams()}
                        />
                    ) : (
                        <div className={styles.emptySearchContainer}>
                            <Empty
                                description="请输入搜索关键词"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </div>
                    )
                }
                sidebar={
                    <SearchSidebar />
                }
            />

            <RocketToTop />
        </main>
    );
}
