'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Typography, Tag, Spin, Empty, message, Input } from 'antd';
import { TagsOutlined, SearchOutlined } from '@ant-design/icons';
import FeedLayout from "@/components/templates/feed-layout";
import SearchFeed from "@/modules/article/search-feed";
import SearchSidebar from "@/modules/sidebar/search-sidebar";
import RocketToTop from "@/components/header/rocket";
import SortCard from '@/components/molecules/sort-card';
import { articleService } from '@/modules/article/articleService';
import { useSearchStore } from '@/store/searchStore';
import styles from './page.module.scss';

const { Title } = Typography;
const { CheckableTag } = Tag;

const TagsPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [allTags, setAllTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredTags, setFilteredTags] = useState<string[]>([]);
    const [searchTag, setSearchTag] = useState('');
    const { tag, setTag, sortOrder, setSortOrder } = useSearchStore();

    // 从URL获取标签参数
    useEffect(() => {
        const urlTag = searchParams.get('tag') || '';
        if (urlTag) {
            setTag(urlTag);
        }
    }, [searchParams, setTag]);

    // 获取所有标签
    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                const tags = await articleService.getTags();
                setAllTags(tags);
                setFilteredTags(tags);
            } catch (error) {
                console.error('获取标签失败:', error);
                message.error('获取标签列表失败，请稍后再试');
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    // 过滤标签
    useEffect(() => {
        if (searchTag) {
            const filtered = allTags.filter(tag => 
                tag.toLowerCase().includes(searchTag.toLowerCase())
            );
            setFilteredTags(filtered);
        } else {
            setFilteredTags(allTags);
        }
    }, [searchTag, allTags]);

    // 处理标签点击
    const handleTagClick = (tagName: string, checked: boolean) => {
        if (checked) {
            setTag(tagName);
            // 更新URL，保持浏览器历史记录
            router.push(`/tags?tag=${encodeURIComponent(tagName)}`);
        } else {
            setTag('');
            router.push('/tags');
        }
    };

    // 构建标题文本
    const buildTitle = () => {
        if (!tag) return '所有文章';

        const sortNames: Record<string, string> = {
            comprehensive: '综合排序',
            latest: '最新优先',
            hottest: '最热优先'
        };
        
        const sortName = sortNames[sortOrder] || '综合排序';
        return `标签 "${tag}" 的文章 - ${sortName}`;
    };

    // 渲染主区域内容
    const renderMain = () => (
        <>
            {/* 标签列表卡片 */}
            <Card 
                title={<Title level={5}><TagsOutlined /> 文章标签</Title>}
                className={styles.tagsCard}
            >
                <Input
                    placeholder="搜索标签"
                    prefix={<SearchOutlined />}
                    allowClear
                    onChange={(e) => setSearchTag(e.target.value)}
                    className={styles.searchInput}
                />
                
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <Spin size="large" tip="加载标签中..." />
                    </div>
                ) : filteredTags.length > 0 ? (
                    <div className={styles.tagsContainer}>
                        {filteredTags.map((tagName) => (
                            <CheckableTag
                                key={tagName}
                                checked={tag === tagName}
                                onChange={(checked) => handleTagClick(tagName, checked)}
                            >
                                {tagName}
                            </CheckableTag>
                        ))}
                    </div>
                ) : (
                    <Empty description="暂无标签" />
                )}
            </Card>
            
            {/* 文章列表 */}
            <SearchFeed title={buildTitle()} pageSize={10} />
        </>
    );

    return (
        <main>
            <FeedLayout
                main={renderMain()}
                sidebar={<SearchSidebar />}
            />
            <RocketToTop />
        </main>
    );
};

export default TagsPage;