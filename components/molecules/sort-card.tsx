import { Card, Radio, Space, Typography } from "antd";
import { SortAscendingOutlined, FireOutlined, FieldTimeOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd/es/radio/interface";
import { useSearchStore } from "@/store/searchStore";
const { Title } = Typography;

interface SearchCardProps {
  sortOrder?: 'comprehensive' | 'latest' | 'hottest';
  onSortChange?: (value: 'comprehensive' | 'latest' | 'hottest') => void;
}

export default function SortCard({
    sortOrder: initialSortOrder,
    onSortChange,
}: SearchCardProps) {
    const { sortOrder, setSortOrder } = useSearchStore();
    // 当前排序方式
    const currentSortOrder = initialSortOrder || sortOrder || 'comprehensive';
    // 处理排序变更
    const handleSortChange = (e: RadioChangeEvent) => {
        const value = e.target.value as 'comprehensive' | 'latest' | 'hottest';
        if (onSortChange) {
            onSortChange(value);
        } else {
            setSortOrder(value);
        }
    };

    return (
        <Card
            title={<Title level={5}>排序方式</Title>}
            style={{ marginBottom: 16 }}
        >
            <Radio.Group
                value={currentSortOrder}
                onChange={handleSortChange}
                style={{ width: '100%' }}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="comprehensive">
                        <Space>
                            <SortAscendingOutlined />
                            综合排序
                        </Space>
                    </Radio>
                    <Radio value="latest">
                        <Space>
                            <FieldTimeOutlined />
                            最新优先
                        </Space>
                    </Radio>
                    <Radio value="hottest">
                        <Space>
                            <FireOutlined />
                            最热优先
                        </Space>
                    </Radio>
                </Space>
            </Radio.Group>
        </Card>
    )
}
