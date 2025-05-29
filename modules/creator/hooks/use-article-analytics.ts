'use client';
import { useState, useEffect, useMemo } from 'react';
import articleService from '@/modules/article/articleService';
import { ArticleListItem } from '@/modules/article/articleModel';
import dayjs from 'dayjs';

// 文章统计数据接口
export interface ArticleStats {
    totalArticles: number;
    totalLikes: number;
    totalViews: number;
    totalComments: number;
    publishedArticles: number;
    pendingArticles: number;
    rejectedArticles: number;
    draftArticles: number;
    last7DaysLikes: number;
    last30DaysLikes: number;
    last7DaysViews: number;
    last30DaysViews: number;
    last7DaysComments: number;
    last30DaysComments: number;
    last7DaysArticles: number;
    last30DaysArticles: number;
    avgLikesPerArticle: number;
    avgViewsPerArticle: number;
    avgCommentsPerArticle: number;
    popularTags: Array<{ tag: string; count: number }>;
    weekdayDistribution: number[];
    monthDistribution: number[];
    timeDistribution: number[];
    statusDistribution: number[];
    articleTrend: Array<{ date: string; count: number }>;
    likeTrend: Array<{ date: string; count: number }>;
    viewTrend: Array<{ date: string; count: number }>;
}

/**
 * 统计文章数据的 hook
 */
export function useArticleAnalytics() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [articles, setArticles] = useState<ArticleListItem[]>([]);
    const [stats, setStats] = useState<ArticleStats | null>(null);
    // 新增日期范围状态，默认为最近7天
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
        dayjs().subtract(7, 'day'),
        dayjs()
    ]);
    // 用于存储过滤后的文章
    const [filteredArticles, setFilteredArticles] = useState<ArticleListItem[]>([]);

    // 获取全部文章
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const data = await articleService.getMyArticleList({
                    page: 1,
                    limit: -1 // 获取全部文章
                });
                setArticles(data || []);
                setError(null);
            } catch (err) {
                console.error('获取文章列表失败:', err);
                setError(err instanceof Error ? err : new Error('获取文章列表失败'));
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // 根据日期范围过滤文章
    useEffect(() => {
        if (articles.length === 0) return;

        // 如果没有设置日期范围，则使用所有文章
        if (!dateRange[0] || !dateRange[1]) {
            setFilteredArticles(articles);
            return;
        }

        // 过滤在日期范围内的文章
        const startDate = dateRange[0].startOf('day');
        const endDate = dateRange[1].endOf('day');

        const filtered = articles.filter(article => {
            const articleDate = dayjs(article.create_time);
            return articleDate.isAfter(startDate) && articleDate.isBefore(endDate);
        });

        setFilteredArticles(filtered);
    }, [articles, dateRange]);

    // 分析文章数据
    useEffect(() => {
        // 使用过滤后的文章或全部文章
        const articlesToAnalyze = filteredArticles.length > 0 ? filteredArticles : articles;

        if (articlesToAnalyze.length === 0) return;

        try {
            // 当前日期
            const now = dayjs();
            const sevenDaysAgo = now.subtract(7, 'day');
            const thirtyDaysAgo = now.subtract(30, 'day');

            // 状态分布统计 - 使用过滤后的文章
            const publishedArticles = articlesToAnalyze.filter(article => article.status === 3).length;
            const pendingArticles = articlesToAnalyze.filter(article => article.status === 2).length;
            const rejectedArticles = articlesToAnalyze.filter(article => article.status === 1).length;
            const draftArticles = articlesToAnalyze.filter(article => article.status === 0).length;

            // 时间过滤函数
            const isWithinLast7Days = (timestamp: number) => dayjs(timestamp).isAfter(sevenDaysAgo);
            const isWithinLast30Days = (timestamp: number) => dayjs(timestamp).isAfter(thirtyDaysAgo);

            // 统计7天和30天内的数据 - 使用过滤后的文章
            const last7DaysArticles = articlesToAnalyze.filter(article => isWithinLast7Days(article.create_time)).length;
            const last30DaysArticles = articlesToAnalyze.filter(article => isWithinLast30Days(article.create_time)).length;

            // 统计各种互动总数 - 使用过滤后的文章
            const totalLikes = articlesToAnalyze.reduce((sum, article) => sum + article.like, 0);
            const totalViews = articlesToAnalyze.reduce((sum, article) => sum + article.view, 0);
            const totalComments = articlesToAnalyze.reduce((sum, article) => sum + article.comment, 0);

            // 计算7天和30天内的互动总数 - 使用过滤后的文章
            const last7DaysLikes = articlesToAnalyze
                .filter(article => isWithinLast7Days(article.create_time))
                .reduce((sum, article) => sum + article.like, 0);

            const last30DaysLikes = articlesToAnalyze
                .filter(article => isWithinLast30Days(article.create_time))
                .reduce((sum, article) => sum + article.like, 0);

            const last7DaysViews = articlesToAnalyze
                .filter(article => isWithinLast7Days(article.create_time))
                .reduce((sum, article) => sum + article.view, 0);

            const last30DaysViews = articlesToAnalyze
                .filter(article => isWithinLast30Days(article.create_time))
                .reduce((sum, article) => sum + article.view, 0);

            const last7DaysComments = articlesToAnalyze
                .filter(article => isWithinLast7Days(article.create_time))
                .reduce((sum, article) => sum + article.comment, 0);

            const last30DaysComments = articlesToAnalyze
                .filter(article => isWithinLast30Days(article.create_time))
                .reduce((sum, article) => sum + article.comment, 0);

            // 计算平均数 - 使用过滤后的文章
            const avgLikesPerArticle = articlesToAnalyze.length > 0 ? totalLikes / articlesToAnalyze.length : 0;
            const avgViewsPerArticle = articlesToAnalyze.length > 0 ? totalViews / articlesToAnalyze.length : 0;
            const avgCommentsPerArticle = articlesToAnalyze.length > 0 ? totalComments / articlesToAnalyze.length : 0;

            // 标签分布统计 - 使用过滤后的文章
            const tagCount: Record<string, number> = {};
            articlesToAnalyze.forEach(article => {
                article.tags.forEach(tag => {
                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                });
            });

            // 获取前10个最流行的标签
            const popularTags = Object.entries(tagCount)
                .map(([tag, count]) => ({ tag, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            // 统计文章发布的时间分布（星期几）- 使用过滤后的文章
            const weekdayDistribution = Array(7).fill(0);
            articlesToAnalyze.forEach(article => {
                const day = dayjs(article.create_time).day();
                weekdayDistribution[day]++;
            });

            // 统计文章发布的月份分布 - 使用过滤后的文章
            const monthDistribution = Array(12).fill(0);
            articlesToAnalyze.forEach(article => {
                const month = dayjs(article.create_time).month();
                monthDistribution[month]++;
            });

            // 统计文章发布的时间段分布（24小时）- 使用过滤后的文章
            const timeDistribution = Array(24).fill(0);
            articlesToAnalyze.forEach(article => {
                const hour = dayjs(article.create_time).hour();
                timeDistribution[hour]++;
            });

            // 状态分布
            const statusDistribution = [draftArticles, rejectedArticles, pendingArticles, publishedArticles];

            // 文章发布趋势 - 根据选定的时间范围调整
            const articleTrend = [];
            const likeTrend = [];
            const viewTrend = [];

            // 如果有选定的日期范围，则使用它来生成趋势数据
            if (dateRange[0] && dateRange[1]) {
                // 计算开始和结束日期之间的天数
                const startDate = dateRange[0];
                const endDate = dateRange[1];
                const diffDays = endDate.diff(startDate, 'day');
                
                // 根据时间范围长度决定数据粒度
                let format = 'MM-DD';
                let unit: 'day' | 'week' | 'month' = 'day';
                let steps = diffDays;
                
                if (diffDays > 60) {
                    // 超过60天显示周粒度
                    format = 'YYYY-[W]ww';
                    unit = 'week';
                    steps = Math.ceil(diffDays / 7);
                }
                if (diffDays > 180) {
                    // 超过180天显示月粒度
                    format = 'YYYY-MM';
                    unit = 'month';
                    steps = Math.ceil(diffDays / 30);
                }
                
                // 生成时间点
                for (let i = 0; i <= steps; i++) {
                    const currentDate = startDate.add(i, unit);
                    
                    // 确保不超过结束日期
                    if (currentDate.isAfter(endDate)) break;
                    
                    const date = currentDate.format(format);
                    
                    // 计算这个时间点的数据
                    let periodStart, periodEnd;
                    if (unit === 'day') {
                        periodStart = currentDate.startOf('day');
                        periodEnd = currentDate.endOf('day');
                    } else if (unit === 'week') {
                        periodStart = currentDate.startOf('week');
                        periodEnd = currentDate.endOf('week');
                    } else {
                        periodStart = currentDate.startOf('month');
                        periodEnd = currentDate.endOf('month');
                    }
                    
                    // 只统计这段时间内的文章
                    const periodArticles = articlesToAnalyze.filter(article => {
                        const articleDate = dayjs(article.create_time);
                        return articleDate.isAfter(periodStart) && articleDate.isBefore(periodEnd);
                    });
                    
                    articleTrend.push({
                        date,
                        count: periodArticles.length
                    });
                    
                    likeTrend.push({
                        date,
                        count: periodArticles.reduce((sum, article) => sum + article.like, 0)
                    });
                    
                    viewTrend.push({
                        date,
                        count: periodArticles.reduce((sum, article) => sum + article.view, 0)
                    });
                }
            } else {
                // 如果没有选定日期范围，则默认显示过去12个月
                for (let i = 11; i >= 0; i--) {
                    const date = now.subtract(i, 'month').format('YYYY-MM');
                    const startOfMonth = now.subtract(i, 'month').startOf('month');
                    const endOfMonth = now.subtract(i, 'month').endOf('month');

                    const monthArticles = articlesToAnalyze.filter(article => {
                        const articleDate = dayjs(article.create_time);
                        return articleDate.isAfter(startOfMonth) && articleDate.isBefore(endOfMonth);
                    });

                    articleTrend.push({
                        date,
                        count: monthArticles.length
                    });

                    likeTrend.push({
                        date,
                        count: monthArticles.reduce((sum, article) => sum + article.like, 0)
                    });

                    viewTrend.push({
                        date,
                        count: monthArticles.reduce((sum, article) => sum + article.view, 0)
                    });
                }
            }

            // 设置统计结果
            setStats({
                totalArticles: articlesToAnalyze.length,
                totalLikes,
                totalViews,
                totalComments,
                publishedArticles,
                pendingArticles,
                rejectedArticles,
                draftArticles,
                last7DaysLikes,
                last30DaysLikes,
                last7DaysViews,
                last30DaysViews,
                last7DaysComments,
                last30DaysComments,
                last7DaysArticles,
                last30DaysArticles,
                avgLikesPerArticle,
                avgViewsPerArticle,
                avgCommentsPerArticle,
                popularTags,
                weekdayDistribution,
                monthDistribution,
                timeDistribution,
                statusDistribution,
                articleTrend,
                likeTrend,
                viewTrend
            });
        } catch (err) {
            console.error('分析文章数据失败:', err);
            setError(err instanceof Error ? err : new Error('分析文章数据失败'));
        }
    }, [articles, filteredArticles]);

    return {
        loading,
        error,
        articles,
        stats,
        dateRange,
        setDateRange,
        filteredArticles
    };
}

export default useArticleAnalytics;
