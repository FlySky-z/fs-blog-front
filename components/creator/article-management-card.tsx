'use client';
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Dropdown,
  Menu,
  Tooltip,
  Empty
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export enum ArticleStatus {
  PUBLISHED = 'PUBLISHED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  DRAFT = 'DRAFT'
}

export interface Article {
  id: string;
  title: string;
  status: ArticleStatus;
  thumbnail?: string;
  updatedAt: string;
  readCount: number;
  commentCount: number;
  likeCount: number;
}

interface ArticleManagementCardProps {
  articles: Article[];
  loading: boolean;
  onSearch: (query: string) => void;
  onStatusFilter: (status: string | null) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onResubmit: (id: string) => void;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const getStatusTagColor = (status: ArticleStatus) => {
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

const getStatusText = (status: ArticleStatus) => {
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

const ArticleManagementCard: React.FC<ArticleManagementCardProps> = ({
  articles,
  loading,
  onSearch,
  onStatusFilter,
  onDelete,
  onEdit,
  onView,
  onResubmit,
  pagination
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const columns = [
    {
      title: '文章信息',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Article) => (
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Text
              strong
              ellipsis={{ tooltip: text }}
              style={{ maxWidth: 250, cursor: 'pointer' }}
              onClick={() => router.push(`/article/${record.id}`)}
            >
              {text}
            </Text>
            <div style={{ marginTop: 4 }}>
              <Tag color={getStatusTagColor(record.status)}>
                {getStatusText(record.status)}
              </Tag>
            </div>
          </div>
          {record.thumbnail && (
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
                src={record.thumbnail}
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
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      responsive: ['md' as const],
    },
    {
      title: '阅读量',
      dataIndex: 'readCount',
      key: 'readCount',
      responsive: ['lg' as const],
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Article) => (
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

  const batchActionMenu = (
    <Menu
      items={[
        {
          key: 'delete',
          label: '批量删除',
          disabled: selectedItems.length === 0,
          danger: true,
        },
        {
          key: 'draft',
          label: '移至草稿箱',
          disabled: selectedItems.length === 0,
        },
        {
          key: 'review',
          label: '提交审核',
          disabled: selectedItems.length === 0,
        },
      ]}
    />
  );

  const handleRowSelection = {
    selectedRowKeys: selectedItems,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedItems(selectedRowKeys as string[]);
    },
  };

  return (
    <Card>
      <div>
        <Title level={5} style={{ margin: '0 0 16px', flexShrink: 0 }}>文章管理</Title>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', paddingBottom: '6px', alignItems: 'center', flexWrap: 'wrap' }}>


          <div style={{ display: 'flex', gap: '8px', flexGrow: 1, overflowX: 'auto' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/create')}
            >
              新增文章
            </Button>
            <Dropdown overlay={batchActionMenu} disabled={selectedItems.length === 0}>
              <Button>
                <Space>
                  批量操作
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Select
              placeholder="状态筛选"
              allowClear
              style={{ width: 120 }}
              onChange={onStatusFilter}
              options={[
                { value: "", label: '全部' },
                { value: ArticleStatus.PUBLISHED, label: '已发布' },
                { value: ArticleStatus.PENDING, label: '审核中' },
                { value: ArticleStatus.REJECTED, label: '未通过' },
                { value: ArticleStatus.DRAFT, label: '草稿' },
              ]}
            />

          </div>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索文章标题"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={() => onSearch(searchText)}
          />
        </div>
      </div>

      <Table
        style={{ overflowY: "auto", overflowX: "unset" }}
        rowKey="id"
        dataSource={articles}
        columns={columns}
        rowSelection={handleRowSelection}
        pagination={pagination}
        loading={loading}
        locale={{
          emptyText: (
            <Empty
              description="暂无文章数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                onClick={() => router.push('/create')}
              >
                创建第一篇文章
              </Button>
            </Empty>
          )
        }}
      />
    </Card>
  );
};

export default ArticleManagementCard;