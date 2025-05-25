import React from 'react';
import { Card, Table, Input, Button, Tag } from 'antd';
// import { useAdminArticles } from '@/modules/admin/hooks';

const ArticleManagePanel: React.FC = () => {
  // const { articles, loading, onSearch, onEdit, onDelete } = useAdminArticles();
  // 这里用 mock 数据占位
  const articles = [];
  const loading = false;
  const onSearch = () => {};

  return (
    <Card title="文章管理">
      <Input.Search placeholder="按账号ID/昵称搜索" onSearch={onSearch} style={{ width: 300, marginBottom: 16 }} />
      <Table
        loading={loading}
        dataSource={articles}
        columns={[]}
        rowKey="id"
      />
    </Card>
  );
};

export default ArticleManagePanel;
