import { Card } from 'antd';
import { EditOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import Link from 'next/link';


export default function QuickHeader() {
    return (
        <div>
          <Card
            styles={{
              body: {
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                gap: 16,
              }
            }}
            style={{
              marginBottom: 16,
            }}
          >
            {/* 创建文章 */}
            <Link
              href="/editor"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#1677ff',
                fontWeight: 500,
                fontSize: 16,
                gap: 8,
              }}
            >
              <EditOutlined />
              创建文章
            </Link>
            {/* 进入创作中心 */}
            <Link
              href="/creatorCenter"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#52c41a',
                fontWeight: 500,
                fontSize: 16,
                gap: 8,
              }}
            >
              <FundProjectionScreenOutlined />
              创作中心
            </Link>
          </Card>
        </div>
    )
}