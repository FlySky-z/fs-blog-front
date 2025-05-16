'use client';
import React, { useState } from 'react';
import { Space, Button, Tooltip, message, Modal } from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  FlagOutlined,
} from '@ant-design/icons';

export interface ArticleActionsProps {
  articleId: string;
  likeCount: number;
  favoriteCount: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  onLike?: (id: string, liked: boolean) => Promise<void>;
  onFavorite?: (id: string, favorited: boolean) => Promise<void>;
  onShare?: (id: string) => void;
  onReport?: (id: string, reason: string) => Promise<void>;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({
  articleId,
  likeCount: initialLikeCount = 0,
  favoriteCount: initialFavoriteCount = 0,
  isLiked: initialIsLiked = false,
  isFavorited: initialIsFavorited = false,
  onLike,
  onFavorite,
  onShare,
  onReport,
}) => {
  // 本地状态，实际项目中应从API获取初始状态
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      
      // 调用传入的处理函数
      if (onLike) {
        await onLike(articleId, !isLiked);
      }
    } catch (error) {
      // 操作失败，回滚UI状态
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      message.error('点赞失败，请稍后重试');
    }
  };

  const handleFavorite = async () => {
    try {
      setIsFavorited(!isFavorited);
      setFavoriteCount(prev => isFavorited ? prev - 1 : prev + 1);
      
      // 调用传入的处理函数
      if (onFavorite) {
        await onFavorite(articleId, !isFavorited);
      }
    } catch (error) {
      // 操作失败，回滚UI状态
      setIsFavorited(isFavorited);
      setFavoriteCount(favoriteCount);
      message.error('收藏失败，请稍后重试');
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(articleId);
    } else {
      // 如果没有提供分享处理函数，则使用Web Share API
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href,
        }).catch(() => {
          message.info('分享链接已复制');
        });
      } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href);
        message.success('链接已复制到剪贴板');
      }
    }
  };

  const showReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleReport = async () => {
    try {
      if (onReport) {
        await onReport(articleId, '举报原因'); // 实际项目中应该获取用户输入的举报原因
      }
      setIsReportModalOpen(false);
      message.success('举报已提交，我们会尽快处理');
    } catch (error) {
      message.error('举报提交失败，请稍后重试');
    }
  };

  return (
    <>
      <Space size="large">
        <Button
          type="text"
          icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
          onClick={handleLike}
          style={{ color: isLiked ? '#1677ff' : undefined }}
        >
          {likeCount > 0 ? likeCount : '点赞'}
        </Button>
        <Button
          type="text"
          icon={isFavorited ? <StarFilled /> : <StarOutlined />}
          onClick={handleFavorite}
          style={{ color: isFavorited ? '#faad14' : undefined }}
        >
          {favoriteCount > 0 ? favoriteCount : '收藏'}
        </Button>
        <Tooltip title="分享">
          <Button type="text" icon={<ShareAltOutlined />} onClick={handleShare}>
            分享
          </Button>
        </Tooltip>
        <Tooltip title="举报">
          <Button type="text" icon={<FlagOutlined />} onClick={showReportModal}>
            举报
          </Button>
        </Tooltip>
      </Space>

      <Modal
        title="举报内容"
        open={isReportModalOpen}
        onOk={handleReport}
        onCancel={() => setIsReportModalOpen(false)}
        okText="提交"
        cancelText="取消"
      >
        <p>您确定要举报这篇文章吗？</p>
        {/* 实际项目中应该有举报表单，包括举报原因选择等 */}
      </Modal>
    </>
  );
};

export default ArticleActions;
