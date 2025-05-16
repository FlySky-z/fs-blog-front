'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Upload, Select, Divider, Switch, message } from 'antd';
import { UploadOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;
const { TextArea } = Input;

const AccountSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarList, setAvatarList] = useState<UploadFile[]>([]);

  // 模拟提交表单
  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    
    try {
      console.log('提交的表单数据:', values);
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success('保存成功！');
    } catch (error) {
      message.error('保存失败，请稍后重试');
      console.error('保存失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-settings">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          username: '当前用户',
          email: 'user@example.com',
          bio: '这是一个简短的个人介绍，用来展示我的兴趣爱好和专业领域。',
          location: '北京',
          profession: 'frontend',
          notificationsEmail: true,
          notificationsSystem: true,
        }}
      >
        <h3>基本信息</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '8px' }}>头像</p>
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={avatarList}
              onChange={({ fileList }) => setAvatarList(fileList)}
              beforeUpload={() => false}
            >
              {avatarList.length < 1 && <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>}
            </Upload>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Form.Item 
              name="username"
              label="昵称"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入昵称" />
            </Form.Item>

            <Form.Item
              name="bio"
              label="个人简介"
            >
              <TextArea rows={4} placeholder="介绍一下自己吧" />
            </Form.Item>
          </div>
        </div>

        <Divider />
        
        <h3>联系方式</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" />
            </Form.Item>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Form.Item
              name="phone"
              label="手机号码"
            >
              <Input prefix={<PhoneOutlined />} placeholder="请输入手机号码" />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name="location"
          label="所在地区"
        >
          <Select placeholder="请选择所在地区">
            <Option value="beijing">北京</Option>
            <Option value="shanghai">上海</Option>
            <Option value="guangzhou">广州</Option>
            <Option value="shenzhen">深圳</Option>
            <Option value="hangzhou">杭州</Option>
            <Option value="other">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="profession"
          label="职业领域"
        >
          <Select placeholder="请选择职业领域">
            <Option value="frontend">前端开发</Option>
            <Option value="backend">后端开发</Option>
            <Option value="fullstack">全栈开发</Option>
            <Option value="design">UI/UX设计</Option>
            <Option value="product">产品经理</Option>
            <Option value="other">其他</Option>
          </Select>
        </Form.Item>

        <Divider />
        
        <h3>账户安全</h3>
        <Button 
          icon={<LockOutlined />}
          style={{ marginBottom: '20px' }}
          onClick={() => message.info('密码修改功能正在开发中')}
        >
          修改密码
        </Button>

        <Divider />
        
        <h3>消息通知</h3>
        <Form.Item
          name="notificationsEmail"
          valuePropName="checked"
          label="邮件通知"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="notificationsSystem"
          valuePropName="checked"
          label="系统通知"
        >
          <Switch />
        </Form.Item>

        <Form.Item style={{ marginTop: '40px' }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            保存更改
          </Button>
          <Button style={{ marginLeft: '10px' }}>
            取消
          </Button>
        </Form.Item>
      </Form>

      <style jsx global>{`
        .account-settings {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .account-settings h3 {
          margin-bottom: 20px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default AccountSettings;
