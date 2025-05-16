'use client';
import React, { useState } from 'react';
import { Card, Button, Typography, Space, Dropdown, Menu, message } from 'antd';
import { LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled, CommentOutlined, EllipsisOutlined, MoreOutlined } from '@ant-design/icons';
import UserMeta from '@/components/molecules/user-meta';

const { Text, Paragraph } = Typography;

export interface CommentCardProps {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    level?: number;
  };
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  replies?: CommentCardProps[];
  onLike?: (id: string, liked: boolean) => Promise<void>;
  onDislike?: (id: string, disliked: boolean) => Promise<void>;
  onReply?: (id: string, content: string) => Promise<void>;
  onReport?: (id: string) => Promise<void>;
  showReplies?: boolean;
  depth?: number;
}

const CommentCard: React.FC<CommentCardProps> = ({
  id,
  content,
  author,
  createdAt,
  likeCount: initialLikeCount = 0,
  dislikeCount: initialDislikeCount = 0,
  isLiked: initialIsLiked = false,
  isDisliked: initialIsDisliked = false,
  replies = [],
  onLike,
  onDislike,
  onReply,
  onReport,
  showReplies = true,
  depth = 0,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isDisliked, setIsDisliked] = useState(initialIsDisliked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showAllReplies, setShowAllReplies] = useState(false);

  // 格式化评论发布时间
  const formattedDate = new Date(createdAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleLike = async () => {
    if (isDisliked) {
      setIsDisliked(false);
      setDislikeCount(prev => Math.max(0, prev - 1));
    }

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    
    if (onLike) {
      try {
        await onLike(id, newLikedState);
      } catch (error) {
        // 发生错误时恢复状态
        setIsLiked(isLiked);
        setLikeCount(likeCount);
        message.error('操作失败，请稍后重试');
      }
    }
  };

  const handleDislike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
    }

    const newDislikedState = !isDisliked;
    setIsDisliked(newDislikedState);
    setDislikeCount(prev => newDislikedState ? prev + 1 : Math.max(0, prev - 1));
    
    if (onDislike) {
      try {
        await onDislike(id, newDislikedState);
      } catch (error) {
        // 发生错误时恢复状态
        setIsDisliked(isDisliked);
        setDislikeCount(dislikeCount);
        message.error('操作失败，请稍后重试');
      }
    }
  };

  const handleReply = () => {
    setIsReplying(!isReplying);
  };

  const submitReply = async () => {
    if (!replyContent.trim()) {
      message.warning('回复内容不能为空');
      return;
    }

    if (onReply) {
      try {
        await onReply(id, replyContent);
        setReplyContent('');
        setIsReplying(false);
        message.success('回复成功');
      } catch (error) {
        message.error('回复失败，请稍后重试');
      }
    }
  };

  const handleReport = async () => {
    if (onReport) {
      try {
        await onReport(id);
        message.success('举报已提交');
      } catch (error) {
        message.error('举报失败，请稍后重试');
      }
    }
  };

  const menuItems = [
    { key: 'report', label: '举报', onClick: handleReport },
  ];

  // 只显示部分回复，除非显示全部
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 2);
  const hasMoreReplies = replies.length > 2 && !showAllReplies;

  return (
    <Card
      bordered={false}
      style={{ 
        marginBottom: 16, 
        marginLeft: depth > 0 ? `${depth * 32}px` : 0,
        backgroundColor: depth > 0 ? '#fafafa' : undefined,
      }}
      bodyStyle={{ padding: '16px' }}
      className="comment-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <UserMeta
          id={author.id}
          username={author.username}
          avatar={author.avatar}
          level={author.level}
          createdAt={formattedDate}
          showTime={true}
          size="small"
        />

        <Dropdown 
          menu={{ items: menuItems.map(item => ({
            key: item.key,
            label: item.label,
            onClick: item.onClick,
          }))}} 
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      </div>

      <Paragraph style={{ margin: '12px 0', fontSize: 15 }}>
        {content}
      </Paragraph>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button 
          type="text" 
          size="small" 
          icon={isLiked ? <LikeFilled /> : <LikeOutlined />} 
          onClick={handleLike}
          style={{ color: isLiked ? '#1677ff' : undefined }}
        >
          {likeCount > 0 ? likeCount : '赞同'}
        </Button>
        <Button 
          type="text" 
          size="small" 
          icon={isDisliked ? <DislikeFilled /> : <DislikeOutlined />} 
          onClick={handleDislike}
          style={{ color: isDisliked ? '#ff4d4f' : undefined }}
        >
          {dislikeCount > 0 ? dislikeCount : '不赞同'}
        </Button>
        <Button 
          type="text" 
          size="small" 
          icon={<CommentOutlined />} 
          onClick={handleReply}
        >
          回复
        </Button>
      </div>

      {/* 回复框 */}
      {isReplying && (
        <div style={{ marginTop: 16 }}>
          <textarea 
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              minHeight: '80px'
            }}
            placeholder="写下你的评论..."
          />
          <div style={{ marginTop: 8, textAlign: 'right' }}>
            <Button onClick={() => setIsReplying(false)} style={{ marginRight: 8 }}>取消</Button>
            <Button type="primary" onClick={submitReply}>发布</Button>
          </div>
        </div>
      )}

      {/* 嵌套回复 */}
      {showReplies && visibleReplies.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {visibleReplies.map(reply => (
            <CommentCard
              key={reply.id}
              {...reply}
              depth={depth + 1}
              showReplies={depth < 2} // 限制嵌套层级
            />
          ))}
          
          {hasMoreReplies && (
            <Button 
              type="link" 
              onClick={() => setShowAllReplies(true)}
              style={{ padding: '4px 0', marginLeft: '32px' }}
            >
              查看更多回复 ({replies.length - 2})
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default CommentCard;
