'use client';
import React from 'react';
import { use } from 'react';
import { Skeleton, Empty, Alert, Card } from 'antd';
import DetailLayout from '@/components/templates/detail-layout';
import ArticleDetailCard from '@/components/article/article-detail-card';
import CommentList from '@/components/comment/comment-list';
import AuthorCard from '@/components/sidebar/author-card';
import WelcomeCard from '@/components/sidebar/welcome-card';
import RecommendedArticles from '@/components/sidebar/recommended-articles';
import TopicTagList from '@/components/sidebar/topic-tag-list';

// 业务逻辑hooks
import useArticleDetail from '@/modules/article/hooks/use-article-detail';
import useComments from '@/modules/comment/hooks/use-comments';
import useSidebarData from '@/modules/sidebar/hooks/use-sidebar-data';

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  // 获取文章详情
  const {
    article,
    loading: articleLoading,
    error: articleError,
    handleLike,
    handleFavorite,
    handleFollow
  } = useArticleDetail(id);

  // 获取评论数据
  const {
    comments,
    loading: commentsLoading,
    hasMore: hasMoreComments,
    loadMoreComments,
    addComment,
    likeComment
  } = useComments(id);

  // 类型适配器函数
  const handleAddComment = async (content: string): Promise<void> => {
    await addComment(content);
  };

  const handleFollowAuthor = async (id: string, isFollowing: boolean): Promise<void> => {
    await handleFollow(id, isFollowing);
  };

  const handleLikeComment = async (id: string, liked: boolean): Promise<void> => {
    await likeComment(id, liked);
  };

  // 获取侧边栏数据
  const {
    data: sidebarData,
    loading: sidebarLoading
  } = useSidebarData(id);

  // 渲染主内容区
  const renderMainContent = () => {
    if (articleError) {
      return (
        <Alert
          message="加载失败"
          description="无法加载文章内容，请稍后再试"
          type="error"
          showIcon
        />
      );
    }

    if (articleLoading || !article) {
      return (
        <>
          {/* 文章详情骨架屏 */}
          <Card style={{ marginBottom: 24 }}>
            <Skeleton active avatar paragraph={{ rows: 1 }} />
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>

          {/* 评论骨架屏 */}
          <Card>
            <Skeleton active avatar paragraph={{ rows: 1 }} />
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </Card>
        </>
      );
    }

    // 文章不存在
    if (!article) {
      return (
        <Empty
          description="文章不存在或已被删除"
          style={{ padding: '48px 0' }}
        />
      );
    }

    return (
      <>
        {/* 文章详情卡片 */}
        <ArticleDetailCard
          id={article.id}
          title={article.title}
          author={article.author}
          publishedAt={article.publishedAt}
          content={article.content}
          likeCount={article.likeCount}
          favoriteCount={article.favoriteCount}
          isLiked={article.isLiked}
          isFavorited={article.isFavorited}
          onLike={(_, liked) => handleLike(liked)}
          onFavorite={(_, favorited) => handleFavorite(favorited)}
        />

        {/* 评论列表 */}
        <CommentList
          articleId={id}
          comments={comments}
          loading={commentsLoading}
          hasMore={hasMoreComments}
          onLoadMore={loadMoreComments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      </>
    );
  };

  // 渲染侧边栏
  const renderSidebar = () => {
    // 侧边栏骨架屏
    if (sidebarLoading || !sidebarData || articleLoading || !article) {
      return (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </Card>
          <Card style={{ marginBottom: 16 }}>
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
          <Card>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </>
      );
    }

    return (
      <>
        {/* 作者卡片 */}
        {article && (
          <AuthorCard
            id={article.author.id}
            username={article.author.username}
            avatar={article.author.avatar}
            level={article.author.level}
            bio={article.author.bio}
            articleCount={article.author.articleCount}
            followerCount={article.author.followerCount}
            likeCount={article.author.likeCount}
            onFollow={handleFollowAuthor}
          />
        )}

        {/* 欢迎卡片 */}
        {sidebarData.welcomeCard && (
          <WelcomeCard
            title={sidebarData.welcomeCard.title}
            content={sidebarData.welcomeCard.content}
            imageUrl={sidebarData.welcomeCard.imageUrl}
            buttonText={sidebarData.welcomeCard.buttonText}
            buttonLink={sidebarData.welcomeCard.buttonLink}
          />
        )}

        {/* 话题标签列表 */}
        {article && article.topics && (
          <TopicTagList topics={article.topics} />
        )}

        {/* 推荐文章 */}
        {sidebarData.recommendedArticles && (
          <RecommendedArticles articles={sidebarData.recommendedArticles} />
        )}
      </>
    );
  };

  // 渲染整体布局
  return (
    <DetailLayout
      main={renderMainContent()}
      sidebar={renderSidebar()}
    />
  );
}