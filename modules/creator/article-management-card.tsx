'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Table,
  Empty,
  Pagination,
  message
} from 'antd';
import { useRouter } from 'next/navigation';
import cardStyles from '@/components/creator/card.module.scss';
import articleService from '@/modules/article/articleService';
import { ArticleListItem, ArticleListParams, MyArticleRequest } from '@/modules/article/articleModel';
import { useUserStore } from '@/store/userStore';
import { useArticleColumns } from '@/components/creator/article-columns';
import ArticleToolbar from '@/components/creator/article-toolbar';
import { useDeleteArticle, useUpdateArticle, useBatchMenuItems } from '@/components/creator/article-operations';

const { Title, Text } = Typography;

/**
 * 文章状态枚举，与后端API状态码对应
 */
export enum ArticleStatus {
  DRAFT = 0,       // 草稿
  REJECTED = 1,    // 未通过
  PENDING = 2,     // 审核中
  PUBLISHED = 3,   // 已发布
}

interface ArticleManagementCardProps {
  initialParams?: Partial<ArticleListParams>;
  style?: React.CSSProperties;
}

/**
 * 文章管理卡片组件
 */
const ArticleManagementCard: React.FC<ArticleManagementCardProps> = ({
  initialParams = {},
  style
}) => {
  const router = useRouter();
  const { userInfo } = useUserStore();

  // 如果用户未登录，显示提示
  if (!userInfo) {
    return <Empty description="请先登录" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<MyArticleRequest>({
    page: 1,
    limit: 10,
    order_by: 'time',
    sort_order: 'desc',
    ...initialParams
  });

  // 使用自定义操作钩子
  const deleteArticle = useDeleteArticle();
  const updateArticle = useUpdateArticle();

  // 获取文章列表数据
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await articleService.getMyArticleList(params);
      setArticles(data || []);
    } catch (error) {
      console.error('获取文章列表失败:', error);
      message.error('获取文章列表失败，请稍后重试');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // 获取文章总数
  const fetchTotalArticles = async () => {
    try {
      const allArticles = await articleService.getMyArticleList({
        page: 1,
        limit: -1
      });
      setTotal(allArticles?.length || 0);
    } catch (error) {
      console.error('获取文章总数失败:', error);
      message.error('获取文章总数失败，请稍后重试');
      setTotal(0);
    }
  };

  // 初始化时获取文章总数
  useEffect(() => {
    fetchTotalArticles();
  }, []);

  // 参数变化时获取文章列表
  useEffect(() => {
    fetchArticles();
  }, [params]);

  // 搜索处理
  const handleSearch = (value: string) => {
    setParams(prev => ({
      ...prev,
      keyword: value,
      page: 1 // 重置到第一页
    }));
  };

  // 状态筛选处理
  const handleStatusFilter = (status: string | null) => {
    setParams(prev => ({
      ...prev,
      status: status ? parseInt(status) : undefined,
      page: 1 // 重置到第一页
    }));
  };

  // 排序方式处理
  const handleOrderChange = (value: 'time' | 'likes') => {
    setParams(prev => ({
      ...prev,
      order_by: value,
      page: 1
    }));
  };

  // 排序顺序处理
  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setParams(prev => ({
      ...prev,
      sort_order: value,
      page: 1
    }));
  };

  // 删除文章
  const handleDelete = async (id: string) => {
    const success = await deleteArticle(id);
    if (success) {
      await fetchArticles();
      await fetchTotalArticles();
    }
  };

  // 编辑文章
  const handleEdit = (id: string) => {
    router.push(`/editor?id=${id}`);
  };

  // 查看文章
  const handleView = (id: string) => {
    router.push(`/article/${id}`);
  };

  // 重新提交文章
  const handleResubmit = async (id: string) => {
    try {
      // 获取文章详情
      const articleDetail = await articleService.getArticleDetail(id);

      // 更新文章状态为待审核(2)
      if (articleDetail) {
        const result = await updateArticle({
          id: id,
          article_detail: articleDetail.article_detail,
          article_header: articleDetail.header,
          cover_image: articleDetail.cover_image || null,
          status: ArticleStatus.PENDING, // 更新为待审核状态
          tags: articleDetail.tags
        });

        if (result) {
          // 刷新列表
          await fetchArticles();
        }
      }
    } catch (error) {
      console.error('重新提交文章失败:', error);
      message.error('重新提交文章失败，请稍后重试');
    }
  };

  // 分页变化处理
  const handlePaginationChange = (page: number, pageSize?: number) => {
    setParams(prev => ({
      ...prev,
      page,
      limit: pageSize || prev.limit
    }));
  };

  // 批量操作完成后刷新
  const handleBatchOperationSuccess = async () => {
    setSelectedItems([]);
    await fetchArticles();
    await fetchTotalArticles();
  };

  // 批量操作菜单项
  const batchMenuItems = useBatchMenuItems(
    selectedItems,
    deleteArticle,
    updateArticle,
    articleService.getArticleDetail.bind(articleService),
    handleBatchOperationSuccess,
    setLoading
  );

  // 使用表格列组件
  const columns = useArticleColumns({
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDelete,
    onResubmit: handleResubmit
  });

  // 行选择配置
  const handleRowSelection = {
    selectedRowKeys: selectedItems,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedItems(selectedRowKeys as string[]);
    },
  };

  return (
    <Card className={cardStyles.cardContainer} style={style} styles={{
      body: { padding: 16 },
    }}>
      <div>
        <Title level={5} style={{ margin: '0 0 16px', flexShrink: 0 }}>文章管理</Title>

        {/* 工具栏组件 */}
        <ArticleToolbar
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onOrderChange={handleOrderChange}
          onSortOrderChange={handleSortOrderChange}
          searchText={searchText}
          setSearchText={setSearchText}
          batchMenuItems={batchMenuItems}
          selectedItemsCount={selectedItems.length}
        />
      </div>

      <Table
        style={{ overflowY: "auto", overflowX: "unset" }}
        rowKey="id"
        dataSource={articles}
        columns={columns}
        rowSelection={handleRowSelection}
        pagination={false}
        loading={loading}
        locale={{
          emptyText: (
            <Empty
              description="暂无文章数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <button
                className="ant-btn ant-btn-primary"
                onClick={() => router.push('/editor')}
              >
                创建第一篇文章
              </button>
            </Empty>
          )
        }}
      />

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {selectedItems.length > 0 && (
            <Text type="secondary">已选择 {selectedItems.length} 项</Text>
          )}
        </div>
        <Pagination
          current={params.page}
          pageSize={params.limit as number}
          onChange={handlePaginationChange}
          showSizeChanger
          showTotal={(total) => `共 ${total} 条`}
          pageSizeOptions={['10', '20', '50']}
          total={total}
        />
      </div>
    </Card>
  );
};

export default ArticleManagementCard;