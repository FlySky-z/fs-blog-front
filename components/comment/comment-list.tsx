'use client';
import React, { useState } from 'react';
import { Card, Typography, Button, Input, List, Divider, Spin, Empty } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import CommentCard, { CommentCardProps } from '@/components/comment/comment-card';

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface CommentListProps {
  articleId: string;
  comments: CommentCardProps[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onAddComment: (content: string) => Promise<void>;
  onLikeComment?: (id: string, liked: boolean) => Promise<void>;
  onDislikeComment?: (id: string, disliked: boolean) => Promise<void>;
  onReplyComment?: (id: string, content: string) => Promise<void>;
  onReportComment?: (id: string) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({
  articleId,
  comments,
  loading,
  hasMore,
  onLoadMore,
  onAddComment,
  onLikeComment,
  onDislikeComment,
  onReplyComment,
  onReportComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('提交评论失败', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      style={{ marginBottom: 24 }}
      bodyStyle={{ padding: '24px' }}
      className="comment-list-card"
    >
      <Title level={3} style={{ marginTop: 0, marginBottom: 24 }}>
        评论 ({comments.length})
      </Title>
      
      {/* 添加新评论 */}
      <div style={{ marginBottom: 32 }}>
        <TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="发表评论..."
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ marginBottom: 16, borderRadius: '8px' }}
          disabled={submitting}
        />
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={submitting}
            onClick={handleSubmit}
            disabled={!newComment.trim()}
          >
            发表评论
          </Button>
        </div>
      </div>

      <Divider style={{ margin: '8px 0 24px' }} />

      {/* 评论列表 */}
      {comments.length > 0 ? (
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item style={{ display: 'block', padding: 0, border: 'none' }}>
              <CommentCard
                {...comment}
                onLike={onLikeComment}
                onDislike={onDislikeComment}
                onReply={onReplyComment}
                onReport={onReportComment}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无评论，来发表第一条评论吧"
          style={{ margin: '32px 0' }}
        />
      )}

      {/* 加载更多 */}
      {(loading || hasMore) && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button
            onClick={onLoadMore}
            loading={loading}
            disabled={!hasMore}
            type={hasMore ? 'default' : 'text'}
          >
            {loading ? '加载中...' : hasMore ? '加载更多评论' : '没有更多评论了'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CommentList;
