'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Divider, Tabs, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons';
import SliderVerify from './SliderVerify';
import styles from './register-form.module.scss';

const { Option } = Select;

interface RegisterFormProps {
  onRegister: (values: any) => Promise<boolean>;
  onSwitchToLogin: () => void;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSwitchToLogin,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [regMethod, setRegMethod] = useState<'email' | 'phone'>('email');
  const [verified, setVerified] = useState(false);
  
  const handleSubmit = async (values: any) => {
    if (!verified) {
      message.error('请先完成滑块验证');
      return;
    }
    
    try {
      const success = await onRegister({
        ...values,
        registerMethod: regMethod
      });
      
      if (success) {
        // 注册成功，重置表单
        form.resetFields();
        setVerified(false);
      }
    } catch (error) {
      console.error('注册表单提交错误:', error);
    }
  };
  
  const handleVerifySuccess = () => {
    setVerified(true);
    message.success('验证成功，请继续注册');
  };
  
  const renderEmailRegisterForm = () => (
    <Form
      form={form}
      name="register_email"
      className={styles.registerForm}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="用户名" 
          size="large" 
          autoComplete="username"
        />
      </Form.Item>
      
      <Form.Item
        name="email"
        rules={[
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input 
          prefix={<MailOutlined />} 
          placeholder="邮箱" 
          size="large" 
          autoComplete="email"
        />
      </Form.Item>
      
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码长度至少为8位' }
        ]}
        hasFeedback
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="密码" 
          size="large" 
          autoComplete="new-password"
        />
      </Form.Item>
      
      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: '请确认密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="确认密码" 
          size="large" 
          autoComplete="new-password"
        />
      </Form.Item>
      
      {renderCommonFormItems()}
    </Form>
  );
  
  const renderPhoneRegisterForm = () => (
    <Form
      form={form}
      name="register_phone"
      className={styles.registerForm}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="用户名" 
          size="large" 
          autoComplete="username"
        />
      </Form.Item>
      
      <Form.Item
        name="phone"
        rules={[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
        ]}
      >
        <Input 
          prefix={<MobileOutlined />} 
          placeholder="手机号" 
          size="large" 
          autoComplete="tel"
        />
      </Form.Item>
      
      <Form.Item
        name="verificationCode"
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <div className={styles.verifyCodeContainer}>
          <Input 
            prefix={<SafetyOutlined />} 
            placeholder="验证码" 
            size="large" 
          />
          <Button className={styles.verifyCodeButton}>
            获取验证码
          </Button>
        </div>
      </Form.Item>
      
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码长度至少为8位' }
        ]}
        hasFeedback
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="密码" 
          size="large" 
          autoComplete="new-password"
        />
      </Form.Item>
      
      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: '请确认密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="确认密码" 
          size="large" 
          autoComplete="new-password"
        />
      </Form.Item>
      
      {renderCommonFormItems()}
    </Form>
  );
  
  const renderCommonFormItems = () => (
    <>
      <Form.Item>
        <SliderVerify onSuccess={handleVerifySuccess} />
      </Form.Item>
      
      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          { 
            validator: (_, value) => 
              value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意条款')) 
          }
        ]}
      >
        <div className={styles.agreement}>
          <input type="checkbox" id="agreement" />
          <label htmlFor="agreement">
            我已阅读并同意 <a href="#">《用户协议》</a>和<a href="#">《隐私政策》</a>
          </label>
        </div>
      </Form.Item>
      
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className={styles.submitButton}
          loading={loading}
          size="large"
          block
        >
          注册
        </Button>
      </Form.Item>
      
      <div className={styles.loginPrompt}>
        <span>已有账号？</span>
        <Button type="link" onClick={onSwitchToLogin}>
          登录
        </Button>
      </div>
    </>
  );
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>注册新账号</h2>
      
      <Tabs
        activeKey={regMethod}
        onChange={(key) => setRegMethod(key as 'email' | 'phone')}
        items={[
          {
            key: 'email',
            label: '邮箱注册',
            children: renderEmailRegisterForm(),
          },
          {
            key: 'phone',
            label: '手机号注册',
            children: renderPhoneRegisterForm(),
          },
        ]}
      />
    </div>
  );
};

export default RegisterForm;
