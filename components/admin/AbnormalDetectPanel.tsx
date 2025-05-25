import React, { useState, useEffect } from 'react';
import { Card, Table, Input, DatePicker, Button, Modal, Avatar, message, Tag, Space, Tooltip } from 'antd';
import { UserOutlined, EyeOutlined, SettingOutlined, ReloadOutlined, ExpandAltOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { adminService } from '@/modules/admin/adminService';
import { userService } from '@/modules/user/userService';
import { AbnormalEvent } from '@/modules/admin/adminModel';
import { userInfo } from '@/modules/user/userModel';
import type { ColumnsType } from 'antd/es/table';
import UserDetailModal from './UserDetailModal';

const AbnormalDetectPanel: React.FC = () => {
  const [abnormals, setAbnormals] = useState<AbnormalEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // 用户详情弹窗状态
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<userInfo | null>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  
  // 异常详情弹窗状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<string>('');
  
  const router = useRouter();

  // 获取异常事件列表
  const fetchAbnormalEvents = async (page = 1, search = '', startTime?: string, endTime?: string) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        count: pageSize,
      };
      
      if (search) params.search = search;
      if (startTime) params.start_time = startTime;
      if (endTime) params.end_time = endTime;
      
      const response = await adminService.getAbnormalEvents(params);
      
      if (response.code === 200) {
        // 为每个异常事件生成唯一的ID，以防API没有返回唯一ID
        const eventsWithUniqueIds = response.data.map((event: AbnormalEvent, index: number) => ({
          ...event,
          id: event.id || `${event.user_id}_${Date.now()}_${index}`
        }));
        setAbnormals(eventsWithUniqueIds);
        // 注意：这里假设API会返回总数，如果没有需要调整
        setTotal(eventsWithUniqueIds.length);
      } else {
        message.error(response.msg || '获取异常事件失败');
      }
    } catch (error) {
      console.error('获取异常事件失败:', error);
      message.error('获取异常事件失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取用户详情
  const fetchUserDetail = async (userId: string) => {
    setUserDetailLoading(true);
    try {
      const userDetail = await userService.getUserInfoById(userId);
      setSelectedUser(userDetail);
      setUserModalVisible(true);
    } catch (error) {
      console.error('获取用户详情失败:', error);
      message.error('获取用户详情失败');
    } finally {
      setUserDetailLoading(false);
    }
  };

  // 搜索处理
  const onSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    const [startTime, endTime] = dateRange || [];
    fetchAbnormalEvents(1, value, startTime, endTime);
  };

  // 日期范围变化处理
  const onDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings[0] && dateStrings[1] ? dateStrings : null);
    setCurrentPage(1);
    fetchAbnormalEvents(1, searchText, dateStrings[0], dateStrings[1]);
  };

  // 导出功能
  const onExport = () => {
    // 这里可以实现导出逻辑
    message.info('导出功能开发中...');
  };

  // 手动刷新数据
  const onRefresh = () => {
    const [startTime, endTime] = dateRange || [];
    fetchAbnormalEvents(currentPage, searchText, startTime, endTime);
    message.success('数据已刷新');
  };

  // 跳转到账户管理
  const goToAccountManage = (userId: string) => {
    router.push(`/adminCenter?tab=account&filter=${userId}`);
  };

  // 显示完整异常详情
  const showFullDetail = (detail: string) => {
    setSelectedDetail(detail);
    setDetailModalVisible(true);
  };

  // 截断文本显示
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  // 初始化数据
  useEffect(() => {
    fetchAbnormalEvents();
  }, []);

  // 表格列配置
  const columns: ColumnsType<AbnormalEvent> = [
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 120,
    },
    {
      title: '用户名称',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (text: string, record: AbnormalEvent) => (
        <Button
          type="link"
          onClick={() => fetchUserDetail(record.user_id)}
          loading={userDetailLoading}
          style={{ padding: 0, height: 'auto' }}
        >
          {record.username || '未命名'}
        </Button>
      ),
    },
    {
      title: '异常类型',
      dataIndex: 'detail',
      key: 'detail',
      render: (text: string) => {
        let color = 'default';
        if (text.includes('登录')) {
          color = 'orange';
        } else if (text.includes('审查')) {
          color = 'red';
        } else if (text.includes('行为')) {
          color = 'purple';
        }
        
        const truncatedText = truncateText(text, 20);
        const isTextTruncated = text.length > 20;
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag color={color}>{truncatedText}</Tag>
            {isTextTruncated && (
              <Tooltip title="查看完整内容">
                <Button
                  type="link"
                  size="small"
                  icon={<ExpandAltOutlined />}
                  onClick={() => showFullDetail(text)}
                  style={{ padding: '4px 8px', minWidth: 'auto' }}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: AbnormalEvent) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => fetchUserDetail(record.user_id)}
          >
            查看
          </Button>
          <Button
            size="small"
            icon={<SettingOutlined />}
            onClick={() => goToAccountManage(record.user_id)}
          >
            管理
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="异常感知">
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <DatePicker.RangePicker 
            style={{ marginRight: 8 }} 
            onChange={onDateRangeChange}
            placeholder={['开始时间', '结束时间']}
          />
          <Input.Search 
            placeholder="搜索用户名或ID" 
            onSearch={onSearch} 
            style={{ width: 200 }}
            allowClear
          />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={onRefresh} 
            loading={loading}
          >
            刷新
          </Button>
          <Button onClick={onExport}>导出</Button>
        </div>
        <Table
          loading={loading}
          dataSource={abnormals}
          columns={columns}
          rowKey="id"
          scroll={{ x: 800 }}
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
              fetchAbnormalEvents(page, searchText, startTime, endTime);
            },
          }}
        />
      </Card>

      {/* 用户详情弹窗 */}
      <UserDetailModal
        visible={userModalVisible}
        user={selectedUser}
        onClose={() => {
          setUserModalVisible(false);
          setSelectedUser(null);
        }}
        onManage={goToAccountManage}
      />

      {/* 异常详情弹窗 */}
      <Modal
        title="异常详情"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedDetail('');
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={500}
      >
        <div style={{ 
          padding: '16px 0',
          fontSize: '14px',
          lineHeight: '1.5',
          wordBreak: 'break-word'
        }}>
          {selectedDetail}
        </div>
      </Modal>
    </>
  );
};

export default AbnormalDetectPanel;
