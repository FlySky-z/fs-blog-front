'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Divider, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons';
import SliderVerify from './SliderVerify';
import styles from './login-form.module.scss';

interface LoginFormProps {
  onLogin: (values: any) => Promise<boolean>;
  onSwitchToRegister: () => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSwitchToRegister,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [needVerify, setNeedVerify] = useState(false);
  const [verified, setVerified] = useState(false);
  
  const handleSubmit = async (values: any) => {
    if (needVerify && !verified) {
      message.error('请先完成滑块验证');
      return;
    }
    
    try {
      const success = await onLogin({
        ...values,
        loginMethod
      });
      
      if (!success) {
        // 登录失败，增加尝试次数
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        // 超过3次尝试，需要验证
        if (newAttempts >= 3) {
          setNeedVerify(true);
        }
      } else {
        // 登录成功，重置表单和尝试次数
        form.resetFields();
        setLoginAttempts(0);
        setNeedVerify(false);
        setVerified(false);
      }
    } catch (error) {
      console.error('登录表单提交错误:', error);
    }
  };
  
  const handleVerifySuccess = () => {
    setVerified(true);
    message.success('验证成功，请继续登录');
  };
  
  const renderEmailLoginForm = () => (
    <Form
      form={form}
      name="login_email"
      className={styles.loginForm}
      onFinish={handleSubmit}
    >
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
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="密码" 
          size="large"
          autoComplete="current-password" 
        />
      </Form.Item>
      
      {renderCommonFormItems()}
    </Form>
  );
  
  const renderPhoneLoginForm = () => (
    <Form
      form={form}
      name="login_phone"
      className={styles.loginForm}
      onFinish={handleSubmit}
    >
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
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="密码" 
          size="large"
          autoComplete="current-password" 
        />
      </Form.Item>
      
      {renderCommonFormItems()}
    </Form>
  );
  
  const renderCommonFormItems = () => (
    <>
      {needVerify && (
        <Form.Item>
          <SliderVerify onSuccess={handleVerifySuccess} />
        </Form.Item>
      )}
      
      <Form.Item className={styles.actions}>
        <div className={styles.remember}>
          <a className={styles.forgotLink} href="#">
            忘记密码？
          </a>
        </div>
        
        <Button
          type="primary"
          htmlType="submit"
          className={styles.submitButton}
          loading={loading}
          size="large"
          block
        >
          登录
        </Button>
      </Form.Item>
      
      <div className={styles.registerPrompt}>
        <span>还没有账号？</span>
        <Button type="link" onClick={onSwitchToRegister}>
          立即注册
        </Button>
      </div>
    </>
  );
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>欢迎回来</h2>
      
      <Tabs
        activeKey={loginMethod}
        onChange={(key) => setLoginMethod(key as 'email' | 'phone')}
        items={[
          {
            key: 'email',
            label: '邮箱登录',
            children: renderEmailLoginForm(),
          },
          {
            key: 'phone',
            label: '手机号登录',
            children: renderPhoneLoginForm(),
          },
        ]}
      />
      
      <Divider>
        <span className={styles.dividerText}>其他登录方式</span>
      </Divider>
      
      <div className={styles.socialLogin}>
        <Button shape="circle" icon={<span className={styles.socialIcon}>微</span>} size="large" />
        <Button shape="circle" icon={<span className={styles.socialIcon}>QQ</span>} size="large" />
        <Button shape="circle" icon={<span className={styles.socialIcon}>钉</span>} size="large" />
      </div>
    </div>
  );
};

export default LoginForm;
