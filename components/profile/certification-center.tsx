'use client';
import React, { useState } from 'react';
import { Steps, Form, Input, Upload, Button, Select, Card, Alert, message } from 'antd';
import { UploadOutlined, UserOutlined, IdcardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const CertificationCenter: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [idCardFiles, setIdCardFiles] = useState<UploadFile[]>([]);
  const [certificateFiles, setCertificateFiles] = useState<UploadFile[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleStepChange = (current: number) => {
    // 表单验证
    if (current > currentStep) {
      form.validateFields()
        .then(() => {
          setCurrentStep(current);
        })
        .catch(() => {
          message.error('请填写完所有必填项');
        });
    } else {
      setCurrentStep(current);
    }
  };
  
  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    
    try {
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('认证申请已提交，请等待审核结果');
      setIsSubmitted(true);
    } catch (error) {
      message.error('提交失败，请稍后重试');
      console.error('提交失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setIsSubmitted(false);
    setCurrentStep(0);
    form.resetFields();
    setIdCardFiles([]);
    setCertificateFiles([]);
  };
  
  if (isSubmitted) {
    return (
      <div className="certification-center">
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 24 }} />
            <h2>认证申请已提交</h2>
            <p style={{ marginBottom: 24 }}>我们将在3-5个工作日内完成审核，请注意查收系统通知</p>
            <Button type="primary" onClick={handleReset}>返回</Button>
          </div>
        </Card>
        
        <style jsx global>{`
          .certification-center {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
        `}</style>
      </div>
    );
  }
  
  return (
    <div className="certification-center">
      <Alert
        message="实名认证说明"
        description="实名认证后可获得认证用户标识，提高个人信誉度。认证用户发布的内容将获得更高的展示优先级。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      <Steps current={currentStep} onChange={handleStepChange} style={{ marginBottom: 30 }}>
        <Step title="填写个人信息" icon={<UserOutlined />} />
        <Step title="上传证件" icon={<IdcardOutlined />} />
        <Step title="提交审核" icon={<CheckCircleOutlined />} />
      </Steps>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
          <Form.Item
            name="realName"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入您的真实姓名" />
          </Form.Item>
          
          <Form.Item
            name="idNumber"
            label="身份证号"
            rules={[
              { required: true, message: '请输入身份证号' },
              { 
                pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, 
                message: '请输入有效的身份证号' 
              }
            ]}
          >
            <Input placeholder="请输入您的身份证号" />
          </Form.Item>
          
          <Form.Item
            name="profession"
            label="职业"
          >
            <Input placeholder="请输入您的职业" />
          </Form.Item>
          
          <Form.Item
            name="company"
            label="所在单位/公司"
          >
            <Input placeholder="请输入您的所在单位或公司" />
          </Form.Item>
          
          <Form.Item
            name="field"
            label="专业领域"
          >
            <Select placeholder="请选择您的专业领域" mode="multiple">
              <Option value="frontend">前端开发</Option>
              <Option value="backend">后端开发</Option>
              <Option value="mobile">移动开发</Option>
              <Option value="ai">人工智能</Option>
              <Option value="bigdata">大数据</Option>
              <Option value="devops">DevOps</Option>
              <Option value="security">网络安全</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
        </div>
        
        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
          <Form.Item
            name="idCard"
            label="身份证照片"
            required
            rules={[{ 
              validator: () => {
                if (idCardFiles.length === 0) {
                  return Promise.reject('请上传身份证照片');
                }
                return Promise.resolve();
              }
            }]}
          >
            <div>
              <p style={{ marginBottom: 8 }}>请上传身份证正反面照片（支持 jpg, png 格式）</p>
              <Upload
                listType="picture"
                maxCount={2}
                fileList={idCardFiles}
                onChange={({ fileList }) => setIdCardFiles(fileList)}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
            </div>
          </Form.Item>
          
          <Form.Item
            name="certificates"
            label="资格证书（选填）"
          >
            <div>
              <p style={{ marginBottom: 8 }}>请上传相关资格证书或专业证明（支持 jpg, png, pdf 格式）</p>
              <Upload
                listType="picture"
                fileList={certificateFiles}
                onChange={({ fileList }) => setCertificateFiles(fileList)}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
            </div>
          </Form.Item>
        </div>
        
        <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
          <Form.Item
            name="introduction"
            label="专业介绍"
          >
            <TextArea 
              rows={4} 
              placeholder="请简短介绍您的专业背景和擅长领域（不超过500字）" 
              maxLength={500} 
              showCount 
            />
          </Form.Item>
          
          <Alert
            message="提交须知"
            description="请确认您提供的所有信息真实有效，虚假信息将导致认证失败并可能冻结账号。认证信息仅用于平台认证，我们将严格保护您的隐私。"
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) => 
                  value ? Promise.resolve() : Promise.reject('请阅读并同意认证协议')
              }
            ]}
          >
            <div style={{ marginBottom: 16 }}>
              <input type="checkbox" id="agreement" />
              <label htmlFor="agreement" style={{ marginLeft: 8 }}>
                我已阅读并同意<a href="#">《认证服务协议》</a>和<a href="#">《个人信息保护声明》</a>
              </label>
            </div>
          </Form.Item>
        </div>
        
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)}>
              上一步
            </Button>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {currentStep < 2 && (
              <Button type="primary" onClick={() => handleStepChange(currentStep + 1)}>
                下一步
              </Button>
            )}
            {currentStep === 2 && (
              <Button type="primary" htmlType="submit" loading={isLoading}>
                提交认证
              </Button>
            )}
          </div>
        </div>
      </Form>
      
      <style jsx global>{`
        .certification-center {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default CertificationCenter;
