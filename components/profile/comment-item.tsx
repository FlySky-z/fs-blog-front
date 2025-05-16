'use client';
import React from 'react';
import { Card, Typography, Button, Tooltip } from 'antd';
import Link from 'next/link';
import { ClockCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

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
    <Card className="w-full mb-4 hover:shadow-sm transition-shadow">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <Text type="secondary" style={{ display: 'flex', alignItems: 'center' }}>
              评论于帖子：
            </Text>
            <Link href={`/article/${comment.postId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              <Title level={5} className="mt-1 mb-2 hover:text-blue-500 transition-colors">
                {comment.postTitle}
              </Title>
            </Link>
          </div>
          
          <Text type="secondary" style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {formattedDate}
          </Text>
        </div>
        
        <Paragraph
          style={{ margin: '12px 0', color: 'rgba(0, 0, 0, 0.85)' }}
        >
          {comment.content}
        </Paragraph>
        
        <div className="flex justify-end">
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
