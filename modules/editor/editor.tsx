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
import styles from './editor.module.scss';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { articleService } from '@/modules/article/articleService';
import { createArticleRequest } from '@/modules/article/articleModel';
import { useRouter } from 'next/navigation';

const AIEditor = dynamic(() => import("@/components/editor/ai-editor"), {
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
    const router = useRouter();

    // 当content变化时，打印到控制台
    React.useEffect(() => {
        console.log('当前内容:', content);
    }, [content]);

    // 表单提交处理
    const handleFinish = async (values: any) => {
        try {
            setLoading(true);
            console.log('提交的表单数据:', values);

            // 准备文章请求数据
            const articleRequest: createArticleRequest = {
                article_header: values.title,
                article_detail: content, // 使用编辑器内容而不是表单值
                tags: values.tags || [],
                cover_image: null, // 默认为空
                status: isDraft ? 0 : 3, // 0表示草稿，3表示正式发布
            };

            // 封面图处理
            if (fileList.length > 0 && fileList[0].originFileObj) {
                // 这里应该有上传图片到服务器的逻辑，获取到图片URL
                // 假设上传成功后得到URL
                // articleRequest.cover_image = 上传后的URL;
                console.log('需要上传封面图片:', fileList[0].name);
            }

            // 提交到服务器
            const response = await articleService.createArticle(articleRequest);
            
            if (response.code === 200) {
                message.success(isDraft ? '草稿保存成功！' : '文章发布成功！');
                
                // 直接跳转，不使用setTimeout，避免可能的问题
                console.log('准备跳转...');
                
                // 不管有没有article_id都进行跳转
                if (isDraft) {
                    // 草稿跳转到创作中心的文章管理页面
                    console.log('跳转到草稿箱');
                    router.push('/creatorCenter/articles/drafts');
                } else if (response.data && response.data.article_id) {
                    // 发布文章且有ID时跳转到文章详情
                    console.log('跳转到文章详情:', response.data.article_id);
                    router.push(`/article/${response.data.article_id}`);
                } else {
                    // 发布文章但没有ID时跳转到文章列表
                    console.log('跳转到文章列表');
                    router.push('/creatorCenter/articles');
                }
            } else {
                throw new Error(response.msg || '提交失败');
            }
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

                        {/* 文章正文 */}
                        <Form.Item
                            label="文章正文"
                            name="content"
                            rules={[{ required: true, message: '请输入文章内容' }]}
                            style={{ height: 520 }}
                        >
                            <AIEditor
                                placeholder="请输入正文内容"
                                style={{ height: 500 }}
                                value={content}
                                onChange={(val) => {
                                    setContent(val);
                                    form.setFieldsValue({ content: val });
                                }}
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
                                <Option value="tech">JavaScript</Option>
                                <Option value="design">Go</Option>
                                <Option value="career">Java</Option>
                                <Option value="life">HTML</Option>
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
                                <div className={styles.previewContent}>
                                    <h4>{form.getFieldValue('title')}</h4>
                                    <p>{content}</p>
                                </div>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}
