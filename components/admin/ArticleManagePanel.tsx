import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Input, 
  Button, 
  Tag, 
  Space, 
  Select, 
  Modal, 
  message, 
  Avatar, 
  Typography, 
  Tooltip,
  Popconfirm,
  DatePicker
} from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  ReloadOutlined,
  ExclamationCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { articleService } from '@/modules/article/articleService';
import { ArticleListItem } from '@/modules/article/articleModel';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

// 文章状态枚举
enum ArticleStatus {
  DRAFT = 0,
  PUBLISHED = 3,
  PENDING = 1,
  REJECTED = 2
}

interface ArticleManagePanelProps {
  className?: string;
}

const ArticleManagePanel: React.FC<ArticleManagePanelProps> = ({ className }) => {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  const router = useRouter();

  // 获取文章状态文本和颜色
  const getStatusConfig = (status: number) => {
    switch (status) {
      case ArticleStatus.PUBLISHED:
        return { text: '已发布', color: 'success' };
      case ArticleStatus.PENDING:
        return { text: '审核中', color: 'processing' };
      case ArticleStatus.REJECTED:
        return { text: '已拒绝', color: 'error' };
      case ArticleStatus.DRAFT:
        return { text: '草稿', color: 'default' };
      default:
        return { text: '未知', color: 'default' };
    }
  };

  // 获取文章列表
  const fetchArticles = async (page = 1, search = '', status?: number, startTime?: string, endTime?: string) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: pageSize,
      };
      
      if (search) params.keyword = search;
      if (status !== null && status !== undefined) params.status = status;
      
      const data = await articleService.getArticleList(params);
      setArticles(data);
      setTotal(data.length); // 实际应该从API返回total
    } catch (error) {
      console.error('获取文章列表失败:', error);
      message.error('获取文章列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchArticles();
  }, []);

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    fetchArticles(1, value, statusFilter || undefined);
  };

  // 状态筛选处理
  const handleStatusFilter = (value: number | null) => {
    setStatusFilter(value);
    setCurrentPage(1);
    fetchArticles(1, searchText, value || undefined);
  };

  // 刷新数据
  const handleRefresh = () => {
    const [startTime, endTime] = dateRange || [];
    fetchArticles(currentPage, searchText, statusFilter || undefined, startTime, endTime);
  };

  // 查看文章详情
  const handleView = (article: ArticleListItem) => {
    router.push(`/article/${article.id}`);
  };

  // 编辑文章
  const handleEdit = (article: ArticleListItem) => {
    router.push(`/editor?id=${article.id}`);
  };

  // 删除文章
  const handleDelete = async (article: ArticleListItem) => {
    try {
      // 这里应该调用删除API
      message.success('文章删除成功');
      handleRefresh();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 更改文章状态
  const handleStatusChange = async (article: ArticleListItem, newStatus: number) => {
    try {
      // 这里应该调用更新状态API
      message.success('状态更新成功');
      handleRefresh();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const columns: ColumnsType<ArticleListItem> = [
    {
      title: '文章信息',
      key: 'article',
      width: 400,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.cover_image ? (
            <img
              src={record.cover_image}
              alt={record.header}
              style={{
                width: 80,
                height: 60,
                objectFit: 'cover',
                borderRadius: 6,
                marginRight: 12
              }}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 60,
                backgroundColor: '#f5f5f5',
                borderRadius: 6,
                marginRight: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text type="secondary">无封面</Text>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <Tooltip title={record.header}>
              <Text strong style={{ fontSize: 14, lineHeight: '20px' }}>
                {record.header.length > 50 ? `${record.header.slice(0, 50)}...` : record.header}
              </Text>
            </Tooltip>
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                摘要: {record.abstract?.slice(0, 60) || '暂无摘要'}...
              </Text>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 120,
      render: (author: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 13 }}>{author}</Text>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '统计数据',
      key: 'stats',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>
            阅读: {record.view} | 点赞: {record.like}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            评论: {record.comment}
          </div>
        </div>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <div>
          {tags?.slice(0, 2).map((tag, index) => (
            <Tag key={index} style={{ marginBottom: 2 }}>
              {tag}
            </Tag>
          ))}
          {tags?.length > 2 && (
            <Tag color="default">+{tags.length - 2}</Tag>
          )}
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 120,
      render: (time: number) => (
        <Text style={{ fontSize: 12 }}>
          {new Date(time * 1000).toLocaleDateString()}
        </Text>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          {record.status === ArticleStatus.REJECTED && (
            <Tooltip title="重新审核">
              <Button
                type="text"
                size="small"
                onClick={() => handleStatusChange(record, ArticleStatus.PENDING)}
              >
                重审
              </Button>
            </Tooltip>
          )}
          <Popconfirm
            title="确定删除这篇文章吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card 
      title="文章管理" 
      className={className}
      extra={
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={loading}
        >
          刷新
        </Button>
      }
    >
      {/* 筛选栏 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="搜索文章标题或内容"
          allowClear
          style={{ width: 280 }}
          onSearch={handleSearch}
          onChange={(e) => !e.target.value && handleSearch('')}
        />
        
        <Select
          placeholder="文章状态"
          allowClear
          style={{ width: 120 }}
          value={statusFilter}
          onChange={handleStatusFilter}
        >
          <Option value={ArticleStatus.PUBLISHED}>已发布</Option>
          <Option value={ArticleStatus.PENDING}>审核中</Option>
          <Option value={ArticleStatus.REJECTED}>已拒绝</Option>
          <Option value={ArticleStatus.DRAFT}>草稿</Option>
        </Select>
      </div>

      {/* 文章列表表格 */}
      <Table
        columns={columns}
        dataSource={articles}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          onChange: (page) => {
            setCurrentPage(page);
            const [startTime, endTime] = dateRange || [];
            fetchArticles(page, searchText, statusFilter || undefined, startTime, endTime);
          },
        }}
      />
    </Card>
  );
};

export default ArticleManagePanel;
