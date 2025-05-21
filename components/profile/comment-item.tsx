'use client';
import React from 'react';
import { Card, Typography, Button, Tooltip } from 'antd';
import Link from 'next/link';
import { ClockCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styles from './comment-item.module.scss';

const { Text, Paragraph, Title } = Typography;

export interface CommentItemData {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  postTitle: string;
}

interface CommentItemProps {
  comment: CommentItemData;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onEdit,
  onDelete
}) => {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <Card className={styles.commentCard}>
      <div>
        <div className={styles.commentHeader}>
          <div>
            <Text type="secondary" className={styles.commentLabel}>
              评论于帖子：
            </Text>
            <Link href={`/article/${comment.postId}`} className={styles.postLink}>
              <Title level={5} className={styles.postTitle}>
                {comment.postTitle}
              </Title>
            </Link>
          </div>
          
          <Text type="secondary" className={styles.commentDate}>
            <ClockCircleOutlined className={styles.icon} />
            {formattedDate}
          </Text>
        </div>
        
        <Paragraph className={styles.commentContent}>
          {comment.content}
        </Paragraph>
        
        <div className={styles.commentActions}>
          <Button 
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(comment.id)}
          >
            编辑
          </Button>
          <Tooltip title="删除评论">
            <Button 
              type="text" 
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => onDelete?.(comment.id)}
            >
              删除
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};

export default CommentItem;
