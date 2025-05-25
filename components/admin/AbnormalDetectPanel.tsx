import React from 'react';
import { Card, Table, Input, DatePicker, Button } from 'antd';
// import { useAdminAbnormal } from '@/modules/admin/hooks';

const AbnormalDetectPanel: React.FC = () => {
  // const { abnormals, loading, onSearch, onExport } = useAdminAbnormal();
  // 这里用 mock 数据占位
  const abnormals = [];
  const loading = false;
  const onSearch = () => {};
  const onExport = () => {};

  return (
    <Card title="异常感知">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <DatePicker.RangePicker style={{ marginRight: 8 }} />
        <Input.Search placeholder="搜索账号" onSearch={onSearch} style={{ width: 200 }} />
        <Button onClick={onExport}>导出</Button>
      </div>
      <Table
        loading={loading}
        dataSource={abnormals}
        columns={[]}
        rowKey="id"
      />
    </Card>
  );
};

export default AbnormalDetectPanel;
