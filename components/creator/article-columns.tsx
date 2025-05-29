'use client';
import React from 'react';
import { Space, Tag, Typography, Tooltip, Button } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  ReloadOutlined,
  LikeOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { ArticleListItem } from '@/modules/article/articleModel';
import dayjs from 'dayjs';
import { ArticleStatus } from '../../modules/creator/article-management-card';

const { Text } = Typography;

interface ArticleColumnsProps {
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onResubmit: (id: string) => void;
}

/**
 * 根据状态获取对应的标签颜色
 */
const getStatusTagColor = (status: number) => {
  switch (status) {
    case ArticleStatus.PUBLISHED:
      return 'success';
    case ArticleStatus.PENDING:
      return 'processing';
    case ArticleStatus.REJECTED:
      return 'error';
    case ArticleStatus.DRAFT:
      return 'default';
    default:
      return 'default';
  }
};

/**
 * 根据状态获取对应的中文描述
 */
const getStatusText = (status: number) => {
  switch (status) {
    case ArticleStatus.PUBLISHED:
      return '已发布';
    case ArticleStatus.PENDING:
      return '审核中';
    case ArticleStatus.REJECTED:
      return '未通过';
    case ArticleStatus.DRAFT:
      return '草稿';
    default:
      return '未知';
  }
};

// 表格列定义组件
export const useArticleColumns = ({ onEdit, onView, onDelete, onResubmit }: ArticleColumnsProps) => {
  return [
    {
      title: '文章信息',
      dataIndex: 'header',
      key: 'header',
      render: (text: string, record: ArticleListItem) => (
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Text
              strong
              ellipsis={{ tooltip: text }}
              style={{ maxWidth: 250, cursor: 'pointer' }}
              onClick={() => onView(record.id)}
            >
              {text}
            </Text>
            <div style={{ marginTop: 4 }}>
              <Tag color={getStatusTagColor(record.status)}>
                {getStatusText(record.status)}
              </Tag>
              {record.tags && record.tags.length > 0 && (
                <Space size={[0, 4]} wrap style={{ marginLeft: 8 }}>
                  {record.tags.slice(0, 2).map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                  {record.tags.length > 2 && <Tag>...</Tag>}
                </Space>
              )}
            </div>
          </div>
          {record.cover_image && (
            <div
              style={{
                width: 96,
                height: 56,
                marginLeft: 'auto',
                overflow: 'hidden',
                borderRadius: 8,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5'
              }}
            >
              <img
                src={record.cover_image}
                alt={text}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'last_modified_date',
      key: 'last_modified_date',
      responsive: ['md' as const],
      render: (date: number) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '数据统计',
      key: 'stats',
      responsive: ['lg' as const],
      render: (_: any, record: ArticleListItem) => (
        <Space>
          <Tooltip title="点赞数">
            <span><LikeOutlined /> {record.like}</span>
          </Tooltip>
          <Tooltip title="评论数">
            <span><CommentOutlined /> {record.comment}</span>
          </Tooltip>
          <Tooltip title="浏览量">
            <span><EyeOutlined /> {record.view}</span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: ArticleListItem) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record.id)}
            />
          </Tooltip>

          {record.status === ArticleStatus.PUBLISHED && (
            <Tooltip title="查看">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onView(record.id)}
              />
            </Tooltip>
          )}

          {record.status === ArticleStatus.REJECTED && (
            <Tooltip title="重新提交">
              <Button
                icon={<ReloadOutlined />}
                size="small"
                onClick={() => onResubmit(record.id)}
              />
            </Tooltip>
          )}

          <Tooltip title="删除">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
};
