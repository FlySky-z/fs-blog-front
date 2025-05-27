'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Divider, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, WechatOutlined, QqOutlined, GithubOutlined } from '@ant-design/icons';
import SliderVerify from '../SliderVerify';
import styles from './login-form.module.scss';
// import { hashPassword } from '@/utils/passwordUtils';

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
  const [loginMethod, setLoginMethod] = useState<'username' | 'phone'>('username');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [needVerify, setNeedVerify] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isHashingPassword, setIsHashingPassword] = useState(false);

  const handleSubmit = async (values: any) => {
    if (needVerify && !verified) {
      message.error('请先完成滑块验证');
      return;
    }

    try {
      // 设置哈希处理中状态
      setIsHashingPassword(true);
      
      // TODO: 在发送前对密码进行哈希处理
      // const hashedPassword = await hashPassword(values.password);
      const hashedPassword = values.password;
      
      const success = await onLogin({
        ...values,
        password: hashedPassword,
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
    } finally {
      // 无论成功还是失败，都重置哈希处理状态
      setIsHashingPassword(false);
    }
  };

  const handleVerifySuccess = () => {
    setVerified(true);
    message.success('验证成功，请继续登录');
  };

  const renderEmailLoginForm = () => (
    <Form
      form={form}
      name="login_username"
      className={styles.loginForm}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { type: 'string', message: '请输入有效的用户名' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="用户名"
          size="large"
          autoComplete="username"
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
            <SliderVerify onSuccess={handleVerifySuccess} userId={form.getFieldValue('username')} />
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
          loading={loading || isHashingPassword}
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
        onChange={(key) => setLoginMethod(key as 'username' | 'phone')}
        items={[
          {
            key: 'username',
            label: '用户名登录',
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
        <Button shape="circle" icon={<WechatOutlined />} size="large" />
        <Button shape="circle" icon={<QqOutlined />} size="large" />
        <Button shape="circle" icon={<GithubOutlined />} size="large" />
      </div>
    </div>
  );
};

export default LoginForm;
