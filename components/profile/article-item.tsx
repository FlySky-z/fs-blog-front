'use client';
import React from 'react';
import { Typography } from 'antd';
import { ArticleListItem as ArticleItemData } from '@/modules/article/articleModel';
import AritcleCard from '@/components/article/article-card';

interface ArticleItemProps {
  article: ArticleItemData;
}

const ArticleItem: React.FC<ArticleItemProps> = ({ article: article }) => {
  const formattedDate = new Date(article.last_modified_date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <AritcleCard
      id={article.id}
      title={article.header}
      description={article.abstract}
      coverImage={article.cover_image}
      showAuthor={false}
      publishedAt={new Date(article.last_modified_date).toISOString()}
      viewCount={article.view}
      likeCount={article.like}
      commentCount={article.comment}
      tags={article.tags.map((tag, id) => ({
        id: id.toString(),
        name: tag,
        color: 'blue'
      }))}
      isVideo={false}
      videoDuration={undefined}
    />
  );
};

export default ArticleItem;
