"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, Form, Input, Button, Select, Switch, message, Upload, Divider, Tooltip, Spin } from 'antd';
import {
    SaveOutlined,
    SendOutlined,
    InboxOutlined,
    EyeOutlined,
    SettingOutlined
} from '@ant-design/icons';
import styles from './create.module.scss';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const AIEditor = dynamic(() => import("@/components/editor/aieditor"), {
    ssr: false,
    loading: () => <Spin style={{ margin: "0 0 0 10px" }} />,
});

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function CreateArticlePage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [content, setContent] = useState("");

    // 当content变化时，打印到控制台
    React.useEffect(() => {
        console.log('当前内容:', content);
    }, [content]);

    // 表单提交处理
    const handleFinish = async (values: any) => {
        try {
            setLoading(true);
            console.log('提交的表单数据:', values);

            // 封面图处理
            if (fileList.length > 0) {
                values.coverImage = fileList[0]; // 实际项目中应上传到服务器
            }

            // 模拟 API 提交
            await new Promise(resolve => setTimeout(resolve, 1000));

            message.success(isDraft ? '草稿保存成功！' : '文章发布成功！');

            // 实际项目中这里应该重定向到文章列表或预览页
        } catch (error) {
            console.error('提交错误:', error);
            message.error('提交失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 封面图上传配置
    const uploadProps: UploadProps = {
        listType: "picture",
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('只能上传图片文件!');
                return false;
            }
            return false; // 阻止自动上传
        },
        onChange: ({ fileList }) => {
            setFileList(fileList.slice(-1)); // 只保留最后一张
        },
        fileList,
        maxCount: 1,
        showUploadList: true,
    };

    return (
        <div className={styles.createArticleWrapper}>
            <div className={styles.createArticleMain}>
                <Card className={styles.createArticleCard}>
                    <h2 className={styles.title}>发布新文章</h2>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        className={styles.articleForm}
                        requiredMark={false}
                    >
                        {/* 文章标题 */}
                        <Form.Item
                            label="文章标题"
                            name="title"
                            rules={[{ required: true, message: '请输入文章标题' }]}
                        >
                            <Input
                                placeholder="请输入标题"
                                maxLength={100}
                                showCount
                                size="large"
                            />
                        </Form.Item>

                        {/* 封面图 */}
                        <Form.Item
                            label="文章封面"
                            name="coverImage"
                            extra="推荐尺寸 1200 x 675 像素，最大 2MB"
                        >
                            <Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
                                <p className="ant-upload-hint">
                                    支持单个图片文件上传
                                </p>
                            </Dragger>
                        </Form.Item>

                        {/* 文章正文 */}
                        <Form.Item
                            label="文章正文"
                            name="content"
                            rules={[{ required: true, message: '' }]}
                        >
                            <AIEditor
                                placeholder="请输入正文内容"
                                style={{ height: 500 }}
                                value={content}
                                onChange={(val) => setContent(val)}
                            />
                        </Form.Item>

                        {/* 文章标签 */}
                        <Form.Item
                            label="文章标签"
                            name="tags"
                            extra="最多添加 5 个标签"
                        >
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="请输入标签，按回车分隔"
                                maxTagCount={5}
                            />
                        </Form.Item>

                        {/* 文章分类 */}
                        <Form.Item label="文章分类" name="category">
                            <Select placeholder="请选择分类">
                                <Option value="tech">技术</Option>
                                <Option value="design">设计</Option>
                                <Option value="career">职场</Option>
                                <Option value="life">生活</Option>
                            </Select>
                        </Form.Item>

                        {/* 高级选项 */}
                        <div className={styles.advancedOptions}>
                            <a
                                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                                className={styles.advancedToggle}
                            >
                                <SettingOutlined /> 高级选项
                                {showAdvancedOptions ? ' ▲' : ' ▼'}
                            </a>

                            {showAdvancedOptions && (
                                <>
                                    <Form.Item label="文章摘要" name="excerpt">
                                        <TextArea
                                            placeholder="请输入文章摘要，不填将自动提取正文前 100 字"
                                            showCount
                                            maxLength={200}
                                            rows={4}
                                        />
                                    </Form.Item>

                                    <Form.Item label="元描述 (SEO)" name="meta">
                                        <TextArea
                                            placeholder="用于搜索引擎优化的描述，建议 50-160 字符"
                                            showCount
                                            maxLength={160}
                                            rows={3}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="原创声明"
                                        name="originalContent"
                                        valuePropName="checked"
                                        initialValue={true}
                                    >
                                        <Switch checkedChildren="原创" unCheckedChildren="转载" defaultChecked />
                                    </Form.Item>
                                </>
                            )}
                        </div>

                        <Divider />

                        {/* 提交按钮区 */}
                        <div className={styles.formActions}>
                            <div className={styles.formActionLeft}>
                                <Form.Item name="isDraft" valuePropName="checked" noStyle>
                                    <Switch
                                        checked={isDraft}
                                        onChange={setIsDraft}
                                        checkedChildren="存为草稿"
                                        unCheckedChildren="立即发布"
                                    />
                                </Form.Item>

                                <Tooltip title="预览文章效果">
                                    <Button
                                        icon={<EyeOutlined />}
                                        onClick={() => setShowPreview(!showPreview)}
                                        style={{ marginLeft: 16 }}
                                    >
                                        预览
                                    </Button>
                                </Tooltip>
                            </div>

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                icon={isDraft ? <SaveOutlined /> : <SendOutlined />}
                            >
                                {isDraft ? '保存草稿' : '发布文章'}
                            </Button>
                        </div>

                        {/* 预览区 */}
                        {showPreview && (
                            <div className={styles.articlePreview}>
                                <h3 className={styles.previewTitle}>文章预览</h3>
                                <div
                                    className={styles.previewContent}
                                    dangerouslySetInnerHTML={{
                                        __html: form.getFieldValue('content') || '<p>无内容预览</p>'
                                    }}
                                />
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}
