'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button, Divider, Tabs, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons';
import SliderVerify from '../SliderVerify';
import styles from './register-form.module.scss';
import { authService } from '@/modules/auth/authService';
import { RegisterRequest } from '@/modules/auth/authModel';

interface RegisterFormProps {
  onRegister: (values: RegisterRequest) => Promise<boolean>;
  onSwitchToLogin: () => void;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSwitchToLogin,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [regMethod, setRegMethod] = useState<'username' | 'phone'>('username');
  const [verified, setVerified] = useState(false);
  const [captchaId, setCaptchaId] = useState<string>('');
  const [captchaPosition, setCaptchaPosition] = useState<number>(0);
  const [usernameVerified, setUsernameVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // 用户名检查
  const checkUsername = useCallback(async (username: string) => {
    try {
      const isValid = await authService.checkUsername(username);
      if (isValid) {
        setUsernameVerified(true);
      } else {
        setUsernameVerified(false);
      }
      return isValid;
    } catch (error) {
      console.error('检查用户名失败:', error);
      setUsernameVerified(false);
      return false;
    }
  }, []);
  
  // 手机号检查（通常只需要验证格式，这里假设服务端也可以验证手机号是否已注册）
  const checkPhone = useCallback(async (phone: string) => {
    try {
      // 这里假设有一个checkPhone API，如果没有，可以只进行格式验证
      const isValid = /^1[3-9]\d{9}$/.test(phone);
      setPhoneVerified(isValid);
      return isValid;
    } catch (error) {
      console.error('检查手机号失败:', error);
      setPhoneVerified(false);
      return false;
    }
  }, []);

  const handleSubmit = async (values: any) => {
    // 检查是否已验证用户名/手机号
    if ((regMethod === 'username' && !usernameVerified) || 
        (regMethod === 'phone' && !phoneVerified)) {
      message.error(`请先验证${regMethod === 'username' ? '用户名' : '手机号'}`);
      return;
    }
    
    if (!verified) {
      message.error('请先完成滑块验证');
      return;
    }

    if (!captchaId) {
      message.error('验证码信息缺失，请刷新后重试');
      return;
    }

    try {
      // 构建注册请求参数
      const registerData: RegisterRequest = {
        username: values.username,
        password: values.password,
        email: values.email,
        phone: values.phone,
        captcha_id: captchaId,
        captcha_code: Math.round(captchaPosition)
      };

      // 直接使用 authService 进行注册
      const success = await authService.register(registerData);

      if (success) {
        message.success('注册成功');
        // 注册成功，重置表单
        form.resetFields();
        setVerified(false);
        setCaptchaId('');
        setCaptchaPosition(0);

        // 如果需要，可以调用传入的 onRegister 回调
        await onRegister(values);
      }
    } catch (error) {
      console.error('注册表单提交错误:', error);
      message.error('注册失败，请稍后重试');
    }
  };

  const handleVerifySuccess = (id: string, position: number) => {
    setCaptchaId(id);
    setCaptchaPosition(position);
    setVerified(true);
    message.success('验证成功，请继续注册');
  };

  // 当注册方式改变时重置验证状态
  useEffect(() => {
    // 先重置验证结果状态
    setVerified(false);
    setCaptchaId('');
    setCaptchaPosition(0);
    
    // 重置验证方式特定的状态
    if (regMethod === 'username') {
      setPhoneVerified(false);
      // 不重置用户名验证状态，保留之前的验证结果
    } else {
      setUsernameVerified(false);
      // 不重置手机验证状态，保留之前的验证结果
    }
    
    // 清空表单中与另一种注册方式相关的字段
    const currentFields = form.getFieldsValue();
    const fieldsToReset = regMethod === 'username' 
      ? ['phone', 'verificationCode'] 
      : ['username'];
    
    fieldsToReset.forEach(field => {
      if (currentFields[field]) {
        // 只重置另一种注册方式的字段
        form.setFieldValue(field, undefined);
      }
    });
  }, [regMethod, form]);

  const renderUsernameRegisterForm = () => (
    <Form
      form={form}
      name="register_username"
      className={styles.registerForm}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="username"
        validateTrigger="onBlur"
        hasFeedback
        rules={[
          { required: true, message: '请输入用户名' },
          {
            validator: async (_, value) => {
              if (value) {
                const isAvailable = await checkUsername(value);
                if (!isAvailable) {
                  return Promise.reject('用户名已被占用');
                }
              } else {
                setUsernameVerified(false);
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="用户名"
          size="large"
          autoComplete="username"
          onChange={() => setUsernameVerified(false)} // 输入变化时重置验证状态
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度至少为6位' },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
            message: '密码需包含大小写字母和数字'
          }
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
        name="phone"
        validateTrigger="onBlur"
        hasFeedback
        rules={[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
          {
            validator: async (_, value) => {
              if (value && /^1[3-9]\d{9}$/.test(value)) {
                await checkPhone(value);
              } else {
                setPhoneVerified(false);
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <Input
          prefix={<MobileOutlined />}
          placeholder="手机号"
          size="large"
          autoComplete="tel"
          onChange={() => setPhoneVerified(false)} // 输入变化时重置验证状态
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

      {renderCommonFormItems()}
    </Form>
  );

  const renderCommonFormItems = () => (
    <>
      {/* 仅当用户名或手机号验证通过时，才显示滑块验证 */}
      {((regMethod === 'username' && usernameVerified) || 
        (regMethod === 'phone' && phoneVerified)) ? (
        <Form.Item>
          <SliderVerify
            key={`verify-${regMethod}-${form.getFieldValue(regMethod === 'username' ? 'username' : 'phone')}`}
            onSuccess={handleVerifySuccess}
            onFail={() => message.error('验证失败，请重新验证')}
            userId={regMethod === 'username' ? form.getFieldValue('username') : form.getFieldValue('phone')}
          />
        </Form.Item>
      ) : (
        <div className={styles.verifyTip}>
          {regMethod === 'username' ? '请输入并验证用户名后继续' : '请输入并验证手机号后继续'}
        </div>
      )}

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
        onChange={(key) => setRegMethod(key as 'username' | 'phone')}
        items={[
          {
            key: 'username',
            label: '用户名注册',
            children: renderUsernameRegisterForm(),
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
