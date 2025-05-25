import React from 'react';
import { Card, Table, Input } from 'antd';
// import { useAdminAccounts } from '@/modules/admin/hooks';

const AccountManagePanel: React.FC = () => {
  // const { accounts, loading, onSearch, onBan, onUnban } = useAdminAccounts();
  // 这里用 mock 数据占位
  const accounts = [];
  const loading = false;
  const onSearch = () => {};

  return (
    <Card title="账号管理">
      <Input.Search placeholder="搜索账号ID/昵称" onSearch={onSearch} style={{ width: 300, marginBottom: 16 }} />
      <Table
        loading={loading}
        dataSource={accounts}
        columns={[]}
        rowKey="id"
      />
    </Card>
  );
};

export default AccountManagePanel;
