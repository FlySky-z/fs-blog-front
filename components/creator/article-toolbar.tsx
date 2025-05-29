'use client';
import React from 'react';
import { Button, Space, Dropdown, Select, Input } from 'antd';
import { SearchOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { ArticleStatus } from '../../modules/creator/article-management-card';

interface ArticleToolbarProps {
  onSearch: (value: string) => void;
  onStatusFilter: (status: string | null) => void;
  onOrderChange: (value: 'time' | 'likes') => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  searchText: string;
  setSearchText: (value: string) => void;
  batchMenuItems: any[];
  selectedItemsCount: number;
}

const ArticleToolbar: React.FC<ArticleToolbarProps> = ({
  onSearch,
  onStatusFilter,
  onOrderChange,
  onSortOrderChange,
  searchText,
  setSearchText,
  batchMenuItems,
  selectedItemsCount
}) => {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', paddingBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: '8px', flexGrow: 1, overflowX: 'auto' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/editor')}
        >
          新增文章
        </Button>
        
        <Dropdown menu={{ items: batchMenuItems }} disabled={selectedItemsCount === 0}>
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
            { value: ArticleStatus.PUBLISHED.toString(), label: '已发布' },
            { value: ArticleStatus.PENDING.toString(), label: '审核中' },
            { value: ArticleStatus.REJECTED.toString(), label: '未通过' },
            { value: ArticleStatus.DRAFT.toString(), label: '草稿' },
          ]}
        />

        <Select
          placeholder="排序方式"
          style={{ width: 120 }}
          defaultValue="time"
          onChange={(value) => onOrderChange(value as 'time' | 'likes')}
          options={[
            { value: "time", label: '按时间' },
            { value: "likes", label: '按点赞' },
          ]}
        />

        <Select
          placeholder="排序顺序"
          style={{ width: 120 }}
          defaultValue="desc"
          onChange={(value) => onSortOrderChange(value as 'asc' | 'desc')}
          options={[
            { value: "desc", label: '降序' },
            { value: "asc", label: '升序' },
          ]}
        />
      </div>
      
      <Input
        prefix={<SearchOutlined />}
        placeholder="搜索文章标题"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onPressEnter={() => onSearch(searchText)}
        style={{ width: 200 }}
      />
    </div>
  );
};

export default ArticleToolbar;
