import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBoxProps {
  isMobile: boolean;
}

export default function SearchBox({ isMobile }: SearchBoxProps) {
  return (
    <Input
      placeholder="搜索..."
      prefix={<SearchOutlined />}
      style={{ width: isMobile ? 120 : 200 }}
    />
  );
}
