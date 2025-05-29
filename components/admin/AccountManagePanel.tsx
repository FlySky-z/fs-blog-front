import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Tag,
  Space,
  Select,
  Modal,
  message,
  Avatar,
  Typography,
  Tooltip,
  Popconfirm,
  Dropdown,
  Form
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  ReloadOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { getUserList, deleteUser, blockUser, kickUser, updateUserInfo } from '@/modules/user/userService';
import { userStats, getUserListQuery, userUpdateRequest } from '@/modules/user/userModel';

const { Option } = Select;
const { Text } = Typography;

// 用户角色枚举
enum UserRole {
  USER = 0,
  ADMIN = 1
}

interface AccountManagePanelProps {
  className?: string;
}

const AccountManagePanel: React.FC<AccountManagePanelProps> = ({ className }) => {
  const [users, setUsers] = useState<userStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 用户详情弹窗状态
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<userStats | null>(null);

  // 编辑用户信息弹窗
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<userStats | null>(null);
  const [editForm] = Form.useForm();

  // 获取用户角色配置
  const getRoleConfig = (role: number) => {
    switch (role) {
      case UserRole.ADMIN:
        return { text: '管理员', color: 'purple' };
      case UserRole.USER:
        return { text: '普通用户', color: 'blue' };
      default:
        return { text: '普通用户', color: 'blue' };
    }
  };

  // 获取用户状态配置
  const getBlockStatusConfig = (isBlocked: boolean) => {
    return isBlocked
      ? { text: '已封禁', color: 'error' }
      : { text: '正常', color: 'success' };
  };

  // 获取登录状态配置
  const getLoginStatusConfig = (isLogin: boolean) => {
    return isLogin
      ? { text: '在线', color: 'success' }
      : { text: '离线', color: 'default' };
  };

  // 获取用户列表
  const fetchUsers = useCallback(async (page = 1, search = '', role?: number, isBlocked?: boolean) => {
    setLoading(true);
    try {
      let totalResponse: any = null;
      let pageResponse: any = null;

      // 仅在第一页时获取总用户数
      if (page === 1) {
        const totalQuery: getUserListQuery = {
          page: 1,
          limit: -1,
          ...(search && { key_word: search }),
          ...(role !== null && role !== undefined && { role }),
          ...(isBlocked !== null && isBlocked !== undefined && { is_blocked: isBlocked })
        };
        [totalResponse, pageResponse] = await Promise.all([
          getUserList(totalQuery),
          getUserList({
            page,
            limit: pageSize,
            ...(search && { key_word: search }),
            ...(role !== null && role !== undefined && { role }),
            ...(isBlocked !== null && isBlocked !== undefined && { is_blocked: isBlocked })
          })
        ]);
        setTotal(totalResponse.data?.length || 0); // 使用总用户数作为总数
      } else {
        pageResponse = await getUserList({
          page,
          limit: pageSize,
          ...(search && { key_word: search }),
          ...(role !== null && role !== undefined && { role }),
          ...(isBlocked !== null && isBlocked !== undefined && { is_blocked: isBlocked })
        });
      }

      setUsers(pageResponse.data || []);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // 初始化加载 - 使用useEffect的依赖项确保只加载一次
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    fetchUsers(1, value, roleFilter || undefined, statusFilter || undefined);
  };

  // 角色筛选处理
  const handleRoleFilter = (value: number | null) => {
    setRoleFilter(value);
    setCurrentPage(1);
    fetchUsers(1, searchText, value || undefined, statusFilter || undefined);
  };

  // 状态筛选处理
  const handleStatusFilter = (value: boolean | null) => {
    setStatusFilter(value);
    setCurrentPage(1);
    fetchUsers(1, searchText, roleFilter || undefined, value || undefined);
  };

  // 刷新数据
  const handleRefresh = () => {
    fetchUsers(currentPage, searchText, roleFilter || undefined, statusFilter || undefined);
  };

  // 查看用户详情
  const handleViewUser = (user: userStats) => {
    setSelectedUser(user);
    setUserModalVisible(true);
  };

  // 编辑用户信息
  const handleEditUser = (user: userStats) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar_url: user.avatar_url,
      abstract: user.abstract || ''
    });
    setEditModalVisible(true);
  };

  // 保存用户信息编辑
  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingUser) return;

      const updateData: userUpdateRequest = {
        id: editingUser.id.toString(), // 添加用户ID到更新数据对象中
        username: values.username,
        email: values.email,
        phone: values.phone,
        avatar_url: values.avatar_url,
        abstract: values.abstract
      };

      // 调用 API 更新用户信息
      const success = await updateUserInfo(updateData);

      if (success) {
        message.success('用户信息更新成功');
        setEditModalVisible(false);
        setEditingUser(null);
        editForm.resetFields();
        handleRefresh();
      } else {
        message.error('更新失败');
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
      message.error('更新失败');
    }
  };

  // 重置密码 - 设置为默认值 Default123
  const handleResetPassword = async (user: userStats) => {
    try {
      const updateData: userUpdateRequest = {
        password: 'Default123'
      };
      // TODO: API 调用重置密码
      const success = await updateUserInfo(updateData);
      if (success) {
        message.success('密码重置成功，新密码为：Default123');
      } else {
        message.error('重置密码失败');
      }
    } catch (error) {
      console.error('重置密码失败:', error);
      message.error('重置密码失败');
    }
  };

  // 封禁/解封用户
  const handleBanUser = async (user: userStats, isBan: boolean) => {
    try {
      const success = await blockUser(user.id.toString(), isBan);
      if (success) {
        const action = isBan ? '封禁' : '解封';
        message.success(`用户${action}成功`);
        handleRefresh();
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      console.error('封禁/解封用户失败:', error);
      message.error('操作失败');
    }
  };

  // 踢出用户
  const handleKickUser = async (user: userStats) => {
    try {
      const success = await kickUser(user.id.toString());
      if (success) {
        message.success('用户踢出成功');
        handleRefresh();
      } else {
        message.error('踢出失败');
      }
    } catch (error) {
      console.error('踢出用户失败:', error);
      message.error('踢出失败');
    }
  };

  // 删除用户
  const handleDeleteUser = async (user: userStats) => {
    try {
      const success = await deleteUser(user.id.toString());
      if (success) {
        message.success('用户删除成功');
        handleRefresh();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除失败');
    }
  };

  // 操作菜单
  const getActionMenuItems = (record: userStats): MenuProps['items'] => [
    {
      key: 'edit',
      label: '编辑信息',
      icon: <EditOutlined />,
      onClick: () => handleEditUser(record)
    },
    {
      key: 'kick',
      label: '踢出用户',
      icon: <ExclamationCircleOutlined />,
      onClick: () => {
        Modal.confirm({
          title: '踢出用户',
          content: `确定要踢出用户 ${record.username} 吗？`,
          onOk: () => handleKickUser(record),
        });
      }
    },
    {
      key: 'resetPassword',
      label: '重置密码',
      icon: <LockOutlined />,
      onClick: () => {
        Modal.confirm({
          title: '重置密码',
          content: `确定要重置用户 ${record.username} 的密码为 Default123 吗？`,
          onOk: () => handleResetPassword(record),
        });
      }
    },
    {
      type: 'divider'
    },
    {
      key: 'delete',
      label: '删除用户',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: '删除用户',
          content: `确定要删除用户 ${record.username} 吗？此操作不可恢复！`,
          okType: 'danger',
          onOk: () => handleDeleteUser(record),
        });
      }
    }
  ];

  const columns: ColumnsType<userStats> = [
    {
      title: '用户信息',
      key: 'user',
      width: 250,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            size={40}
            src={record.avatar_url}
            icon={<UserOutlined />}
            style={{ marginRight: 12 }}
          />
          <div>
            <div>
              <Text strong>{record.username}</Text>
              <Tag
                color={getRoleConfig(record.role).color}
                style={{ marginLeft: 8 }}
              >
                {getRoleConfig(record.role).text}
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.id}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 12 }}>{record.email || '未设置'}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.phone || '未设置'}
          </Text>
        </div>
      )
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Tag color={getBlockStatusConfig(record.is_blocked).color}>
              {getBlockStatusConfig(record.is_blocked).text}
            </Tag>
          </div>
          <Tag color={getLoginStatusConfig(record.is_login).color}>
            {getLoginStatusConfig(record.is_login).text}
          </Tag>
        </div>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 120,
      render: (time: number) => (
        <Text style={{ fontSize: 12 }}>
          {new Date(time).toLocaleDateString()}
        </Text>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>

          <Tooltip title={record.is_blocked ? "解封用户" : "封禁用户"}>
            <Popconfirm
              title={record.is_blocked ? "解封用户" : "封禁用户"}
              description={`确定要${record.is_blocked ? '解封' : '封禁'}用户 ${record.username} 吗？`}
              onConfirm={() => handleBanUser(record, !record.is_blocked)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                size="small"
                danger={!record.is_blocked}
                icon={record.is_blocked ? <UnlockOutlined /> : <LockOutlined />}
              />
            </Popconfirm>
          </Tooltip>

          <Dropdown
            menu={{ items: getActionMenuItems(record) }}
            trigger={['click']}
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
            />
          </Dropdown>
        </Space>
      )
    }
  ];

  return (
    <Card
      title="账号管理"
      className={className}
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loading}
        >
          刷新
        </Button>
      }
    >
      {/* 筛选栏 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="搜索用户名、邮箱或手机号"
          allowClear
          style={{ width: 280 }}
          onSearch={handleSearch}
          onChange={(e) => !e.target.value && handleSearch('')}
        />

        <Select
          placeholder="用户角色"
          allowClear
          style={{ width: 120 }}
          value={roleFilter}
          onChange={handleRoleFilter}
        >
          <Option value={UserRole.USER}>普通用户</Option>
          <Option value={UserRole.ADMIN}>管理员</Option>
        </Select>

        <Select
          placeholder="账号状态"
          allowClear
          style={{ width: 120 }}
          value={statusFilter}
          onChange={handleStatusFilter}
        >
          <Option value={false}>正常</Option>
          <Option value={true}>已封禁</Option>
        </Select>
      </div>

      {/* 用户列表表格 */}
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          onChange: (page) => {
            setCurrentPage(page);
            fetchUsers(page, searchText, roleFilter || undefined, statusFilter || undefined);
          },
        }}
      />

      {/* 用户详情弹窗 */}
      <Modal
        title="用户详情"
        open={userModalVisible}
        onCancel={() => {
          setUserModalVisible(false);
          setSelectedUser(null);
        }}
        footer={[
          <Button key="close" onClick={() => setUserModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedUser && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <Avatar
                size={60}
                src={selectedUser.avatar_url}
                icon={<UserOutlined />}
                style={{ marginRight: 16 }}
              />
              <div>
                <h3 style={{ margin: 0, marginBottom: 4 }}>{selectedUser.username}</h3>
                <Tag color={getRoleConfig(selectedUser.role).color}>
                  {getRoleConfig(selectedUser.role).text}
                </Tag>
                <Tag color={getBlockStatusConfig(selectedUser.is_blocked).color}>
                  {getBlockStatusConfig(selectedUser.is_blocked).text}
                </Tag>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <Text type="secondary">用户ID</Text>
                <div>{selectedUser.id}</div>
              </div>
              <div>
                <Text type="secondary">邮箱</Text>
                <div>{selectedUser.email || '未设置'}</div>
              </div>
              <div>
                <Text type="secondary">手机号</Text>
                <div>{selectedUser.phone || '未设置'}</div>
              </div>
              <div>
                <Text type="secondary">登录状态</Text>
                <div>
                  <Tag color={getLoginStatusConfig(selectedUser.is_login).color}>
                    {getLoginStatusConfig(selectedUser.is_login).text}
                  </Tag>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Text type="secondary">注册时间</Text>
                <div>{new Date(selectedUser.create_time).toLocaleString()}</div>
              </div>
              {selectedUser.abstract && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <Text type="secondary">个人简介</Text>
                  <div>{selectedUser.abstract}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑用户信息弹窗 */}
      <Modal
        title="编辑用户信息"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingUser(null);
          editForm.resetFields();
        }}
        okText="保存"
        cancelText="取消"
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            label="头像URL"
            name="avatar_url"
          >
            <Input placeholder="请输入头像URL" />
          </Form.Item>

          <Form.Item
            label="个人简介"
            name="abstract"
          >
            <Input.TextArea rows={3} placeholder="请输入个人简介" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AccountManagePanel;
