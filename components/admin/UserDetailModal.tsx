import React from 'react';
import { Modal, Descriptions, Avatar, Button, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { userInfo } from '@/modules/user/userModel';

interface UserDetailModalProps {
  /**
   * Modal是否可见
   */
  visible: boolean;
  /**
   * 用户信息数据
   */
  user: userInfo | null;
  /**
   * 关闭Modal的回调函数
   */
  onClose: () => void;
  /**
   * 管理用户的回调函数
   */
  onManage?: (userId: string) => void;
  /**
   * Modal标题
   */
  title?: string;
  /**
   * Modal宽度
   */
  width?: number;
  /**
   * 是否显示管理按钮
   */
  showManageButton?: boolean;
}

/**
 * 用户详情弹窗组件
 * 可复用的用户信息展示Modal
 */
const UserDetailModal: React.FC<UserDetailModalProps> = ({
  visible,
  user,
  onClose,
  onManage,
  title = '用户详情',
  width = 600,
  showManageButton = true
}) => {
  const handleManage = () => {
    if (user && onManage) {
      onManage(user.id.toString());
      onClose();
    }
  };

  const footer = [
    <Button key="close" onClick={onClose}>
      关闭
    </Button>
  ];

  if (showManageButton && user && onManage) {
    footer.push(
      <Button
        key="manage"
        type="primary"
        onClick={handleManage}
      >
        管理用户
      </Button>
    );
  }

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={footer}
      width={width}
    >
      {user && (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="头像" span={2}>
            <Avatar
              size={64}
              src={user.avatar_url}
              icon={<UserOutlined />}
            />
          </Descriptions.Item>
          <Descriptions.Item label="用户ID">
            {user.id}
          </Descriptions.Item>
          <Descriptions.Item label="用户名">
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {user.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            {user.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="用户等级">
            <Tag color="blue">Lv.{user.level}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {user.create_time ? new Date(user.create_time).toLocaleString() : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="个人简介" span={2}>
            {user.abstract || '暂无简介'}
          </Descriptions.Item>
          <Descriptions.Item label="关注数">
            {user.stats?.following || 0}
          </Descriptions.Item>
          <Descriptions.Item label="粉丝数">
            {user.stats?.followers || 0}
          </Descriptions.Item>
          <Descriptions.Item label="获赞数" span={2}>
            {user.stats?.likes || 0}
          </Descriptions.Item>
          {user.tags && user.tags.length > 0 && (
            <Descriptions.Item label="标签" span={2}>
              {user.tags.map((tag, index) => (
                <Tag key={index} color="geekblue">
                  {tag}
                </Tag>
              ))}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
};

export default UserDetailModal;
