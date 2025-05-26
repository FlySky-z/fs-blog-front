import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBoxProps {
  isMobile: boolean;
  handleSearch: (keyword: string) => void;
}

export default function SearchBox({ isMobile, handleSearch }: SearchBoxProps) {
  return (
    <Input
      placeholder="搜索..."
      prefix={<SearchOutlined />}
      style={{ width: isMobile ? 120 : 200 }}
      onPressEnter={(e) => {
        const keyword = (e.target as HTMLInputElement).value.trim();
        console.log('搜索关键词:', keyword);
        if (keyword) {
          // 调用父组件传入的搜索处理函数
          handleSearch(keyword);
        }
      }}
    />
  );
}
