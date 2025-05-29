'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Upload, Select, Divider, Switch, message, Modal } from 'antd';
import { UploadOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getUserInfoById, updateUserInfo } from '@/modules/user/userService'; // 导入服务
import { useUserStore } from '@/store/userStore'; // 导入用户 store
import { uploadImage } from '@/utils/imgService'; // 导入图片上传服务
import { API_BASE_URL } from '@/config/env';

const { TextArea } = Input;

const AccountSettings: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const currentUserId = useUserStore(state => state.userInfo?.id);

  // 图片裁剪相关状态
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(1 / 1); // 正方形裁剪
  const [isCropModalVisible, setIsCropModalVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | undefined>(undefined);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | undefined>(undefined); // 用于存储裁剪后待上传的图片 URL 或已上传的图片 URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  // 获取当前用户信息并填充表单
  useEffect(() => {
    if (currentUserId) {
      const fetchUserInfo = async () => {
        try {
          setIsLoading(true);
          const userInfo = await getUserInfoById(String(currentUserId));
          form.setFieldsValue({
            username: userInfo.username,
            email: userInfo.email,
            bio: userInfo.abstract,
            phone: userInfo.phone,
            // 其他字段根据 userInfo 结构添加
          });
          if (userInfo.avatar_url) {
            // 如果 avatar_url 是相对路径,需要拼接基础 URL
            const fullAvatarUrl = userInfo.avatar_url.startsWith('http') ? userInfo.avatar_url : `${API_BASE_URL}${userInfo.avatar_url}`;
            setInitialAvatarUrl(fullAvatarUrl);
            setNewAvatarUrl(fullAvatarUrl); // 初始时，新头像和旧头像一致
          }
        } catch (error) {
          messageApi.error('获取用户信息失败');
          console.error('获取用户信息失败:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserInfo();
    }
  }, [currentUserId, form, messageApi]);

  const handleAvatarChange = (info: any) => {
    if (info.file) {
      const file = info.file as RcFile;
      setSelectedFile(file); // 保存原始文件
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(file);
      setIsCropModalVisible(true);
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      const newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          width,
          height,
        ),
        width,
        height,
      );
      setCrop(newCrop);
      setCompletedCrop(newCrop); // 初始化 completedCrop
    }
  }

  const handleCropOk = async () => {
    if (completedCrop && imgRef.current && selectedFile) {
      
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      // 目标尺寸
      const targetWidth = 128;
      const targetHeight = 128;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        messageApi.error('无法获取画布上下文');
        setIsLoading(false);
        return;
      }

      const sx = Math.round(completedCrop.x * scaleX);
      const sy = Math.round(completedCrop.y * scaleY);
      const sWidth = Math.round(completedCrop.width * scaleX);
      const sHeight = Math.round(completedCrop.height * scaleY);

      // 确保源宽高至少为1像素，防止drawImage错误
      if (sWidth <= 0 || sHeight <= 0) {
        messageApi.error('裁剪区域无效，无法生成图片。');
        setIsLoading(false);
        setIsCropModalVisible(false);
        setImgSrc('');
        return;
      }

      // 填充白色背景（防止透明背景问题）
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      ctx.drawImage(
        imgRef.current,
        sx, sy, sWidth, sHeight, // 源矩形
        0, 0, targetWidth, targetHeight // 目标矩形
      );

      // 强制使用 PNG 格式，确保兼容性
      canvas.toBlob(async (blob) => {
        if (!blob) {
          messageApi.error('无法从画布生成图片数据，请重试。');
          console.error('Canvas toBlob returned null');
          setIsLoading(false);
          setIsCropModalVisible(false);
          setImgSrc('');
          return;
        }

        try {
          setIsLoading(true);
          
          // 强制使用 PNG 格式和正确的文件名
          const fileName = 'avatar.png';
          const mimeType = 'image/png';
          
          // 创建 File 对象，确保 MIME 类型正确
          const croppedImageFile = new File([blob], fileName, { type: mimeType });

          const uploadResponse = await uploadImage(croppedImageFile, fileName);
          if (uploadResponse.code === 200 && uploadResponse.data) {
            const uploadedUrl = uploadResponse.data.startsWith('http') ? uploadResponse.data : `${API_BASE_URL}${uploadResponse.data}`;
            setNewAvatarUrl(uploadedUrl);
            messageApi.success('头像上传成功！');
          } else {
            messageApi.error(uploadResponse.msg || '头像上传失败');
          }
        } catch (uploadError) {
          messageApi.error('头像上传处理失败');
          console.error('头像上传处理失败:', uploadError);
        } finally {
          setIsLoading(false);
        }
      }, 'image/png', 0.95); // 强制使用 PNG 格式，质量 0.95
      setIsCropModalVisible(false);
      setImgSrc('');
    } else {
      messageApi.warning('请先完成裁剪操作或选择图片');
      setIsLoading(false); // 如果没有满足条件，也应该停止可能的加载状态
    }
  };


  const handleSubmit = async (values: any) => {
    if (!currentUserId) {
      messageApi.error('用户未登录');
      return;
    }
    setIsLoading(true);
    try {
      const updateData: any = {
        id: String(currentUserId),
        username: values.username,
        email: values.email,
        abstract: values.bio,
        phone: values.phone,
        // 其他字段根据表单和 userUpdateRequest 结构添加
      };

      if (newAvatarUrl && newAvatarUrl !== initialAvatarUrl) {
         // 如果 newAvatarUrl 是完整的 URL，可能需要从中提取相对路径
        // 假设后端需要的是相对路径
        updateData.avatar_url = newAvatarUrl.startsWith(API_BASE_URL) 
                               ? newAvatarUrl.substring(API_BASE_URL.length) 
                               : newAvatarUrl;
      }


      const success = await updateUserInfo(updateData);
      if (success) {
        messageApi.success('保存成功！');
        // 可选：更新 Zustand store 中的用户信息
        const updatedUserInfo = await getUserInfoById(String(currentUserId));
        useUserStore.getState().setUserInfo(updatedUserInfo);
        if (updatedUserInfo.avatar_url) {
           const fullAvatarUrl = updatedUserInfo.avatar_url.startsWith('http') ? updatedUserInfo.avatar_url : `${API_BASE_URL}${updatedUserInfo.avatar_url}`;
           setInitialAvatarUrl(fullAvatarUrl); // 更新初始头像，防止重复提交旧头像
           setNewAvatarUrl(fullAvatarUrl);
        }

      } else {
        messageApi.error('保存失败，请稍后重试');
      }
    } catch (error) {
      messageApi.error('保存失败，请稍后重试');
      console.error('保存失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-settings">
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <h3>基本信息</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '8px' }}>头像</p>
            <Upload
              listType="picture-card"
              showUploadList={false} // 不显示默认的上传列表
              beforeUpload={() => false} // 阻止自动上传，手动处理
              onChange={handleAvatarChange}
              accept="image/*" // 只接受图片类型
            >
              {newAvatarUrl ? (
                <img src={newAvatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
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

        <Divider />
        
        <h3>账户安全</h3>
        <Button 
          icon={<LockOutlined />}
          style={{ marginBottom: '20px' }}
          onClick={() => messageApi.info('密码修改功能正在开发中')}
        >
          修改密码
        </Button>

        <Divider />
        
        <Form.Item style={{ marginTop: '40px' }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            保存更改
          </Button>
          <Button style={{ marginLeft: '10px' }}>
            取消
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="裁剪头像"
        open={isCropModalVisible}
        onOk={handleCropOk}
        onCancel={() => {
          setIsCropModalVisible(false);
          setImgSrc(''); // 清空裁剪预览
        }}
        width={600}
        maskClosable={false}
        confirmLoading={isLoading}
      >
        {imgSrc && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '70vh', overflow: 'auto' }}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={128} // 最小裁剪宽度
              minHeight={128} // 最小裁剪高度
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: '60vh', objectFit: 'contain' }}
              />
            </ReactCrop>
          </div>
        )}
        {!imgSrc && <p>请选择一张图片进行裁剪。</p>}
      </Modal>

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
