'use client';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { CommentCardProps } from '@/components/comment/comment-card';

// 模拟从API获取评论列表
const fetchComments = async (
  articleId: string,
  page: number,
  pageSize: number
): Promise<{
  data: CommentCardProps[];
  total: number;
  hasMore: boolean;
}> => {
  // 在实际项目中，这里应该是请求后端API的代码
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成模拟评论数据
      const total = 2; 
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, total);
      const hasMore = endIndex < total;
      
      // 构建当前页的评论数据
      const data = Array.from({ length: endIndex - startIndex }, (_, i) => {
        const commentIndex = startIndex + i;
        const id = `comment-${commentIndex}`;
        
        // 为某些评论添加回复
        const replies = commentIndex % 3 === 0 
          ? Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => ({
              id: `${id}-reply-${j}`,
              content: `这是对评论 ${commentIndex} 的回复 ${j}，包含了对原评论的补充或讨论。`,
              author: {
                id: `user-reply-${j}`,
                username: `回复用户${j}`,
                avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${commentIndex}-${j}`,
                level: Math.floor(Math.random() * 5) + 1,
              },
              createdAt: new Date(Date.now() - Math.random() * 86400000 * 10).toISOString(),
              likeCount: Math.floor(Math.random() * 10),
              dislikeCount: Math.floor(Math.random() * 3),
              isLiked: false,
              isDisliked: false,
            }))
          : [];
        
        return {
          id,
          content: `这是评论 ${commentIndex}。这里是一些评论内容，可能包含对文章的看法、问题或建议。评论可能很长也可能很短，取决于用户想表达的内容。`,
          author: {
            id: `user-${commentIndex}`,
            username: `用户${commentIndex}`,
            avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${commentIndex}`,
            level: Math.floor(Math.random() * 5) + 1,
          },
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
          likeCount: Math.floor(Math.random() * 50),
          dislikeCount: Math.floor(Math.random() * 10),
          isLiked: false,
          isDisliked: false,
          replies,
        };
      });
      
      resolve({ data, total, hasMore });
    }, 800); // 模拟网络延迟
  });
};

// 模拟API操作响应
const simulateApiResponse = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) {
        resolve(true);
      } else {
        reject(new Error('操作失败，请重试'));
      }
    }, 300);
  });
};

// 评论Hook
export const useComments = (articleId: string) => {
  const [comments, setComments] = useState<CommentCardProps[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // 获取评论
  const fetchCommentData = useCallback(async (currentPage: number) => {
    setLoading(true);
    
    try {
      const result = await fetchComments(articleId, currentPage, pageSize);
      if (currentPage === 1) {
        // 第一页，直接替换
        setComments(result.data);
      } else {
        // 加载更多，追加数据
        setComments(prev => [...prev, ...result.data]);
      }
      setTotal(result.total);
      setHasMore(result.hasMore);
    } catch (error) {
      message.error('加载评论失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  // 刷新评论，回到第一页
  const refreshComments = useCallback(() => {
    setPage(1);
    fetchCommentData(1);
  }, [fetchCommentData]);

  // 加载更多评论
  const loadMoreComments = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCommentData(nextPage);
  }, [loading, hasMore, page, fetchCommentData]);

  // 添加评论
  const addComment = useCallback(async (content: string) => {
    try {
      await simulateApiResponse();
      
      // 创建新评论
      const newComment: CommentCardProps = {
        id: `comment-new-${Date.now()}`,
        content,
        author: {
          id: 'current-user', // 实际项目中应该使用当前登录用户的ID
          username: '当前用户',
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=current',
          level: 2,
        },
        createdAt: new Date().toISOString(),
        likeCount: 0,
        dislikeCount: 0,
        isLiked: false,
        isDisliked: false,
        replies: [],
      };
      
      // 将新评论添加到列表开头
      setComments(prev => [newComment, ...prev]);
      setTotal(prev => prev + 1);
      
      message.success('评论发表成功');
      return true;
    } catch (error) {
      message.error('评论发表失败，请重试');
      return false;
    }
  }, []);

  // 点赞评论
  const likeComment = useCallback(async (id: string, liked: boolean) => {
    // 乐观更新UI
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === id) {
          return {
            ...comment,
            isLiked: liked,
            isDisliked: liked ? false : comment.isDisliked,
            likeCount: liked ? comment.likeCount + 1 : comment.likeCount - 1,
            dislikeCount: liked && comment.isDisliked ? comment.dislikeCount - 1 : comment.dislikeCount,
          };
        }
        // 检查嵌套回复
        if (comment.replies?.some(reply => reply.id === id)) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === id) {
                return {
                  ...reply,
                  isLiked: liked,
                  isDisliked: liked ? false : reply.isDisliked,
                  likeCount: liked ? reply.likeCount + 1 : reply.likeCount - 1,
                  dislikeCount: liked && reply.isDisliked ? reply.dislikeCount - 1 : reply.dislikeCount,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );
    
    try {
      await simulateApiResponse();
    } catch (error) {
      // 操作失败时回滚UI状态
      message.error('操作失败，请重试');
      // 这里应该添加UI回滚逻辑
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchCommentData(1);
  }, [fetchCommentData]);

  return {
    comments,
    loading,
    hasMore,
    total,
    refreshComments,
    loadMoreComments,
    addComment,
    likeComment,
  };
};

export default useComments;
