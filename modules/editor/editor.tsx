"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, Form, Input, Button, Select, Switch, message, Upload, Divider, Tooltip, Spin, Skeleton } from 'antd';
import {
    SaveOutlined,
    SendOutlined,
    EyeOutlined,
    DotChartOutlined
} from '@ant-design/icons';
import styles from './editor.module.scss';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { articleService, updateArticle } from '@/modules/article/articleService';
import { createArticleRequest } from '@/modules/article/articleModel';
import { useRouter } from 'next/navigation';

const AIEditor = dynamic(() => import("@/components/editor/ai-editor"), {
    ssr: false,
    loading: () => <Skeleton.Node active={true} className={styles.editorSkeleton}>
        <DotChartOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
    </Skeleton.Node>,
});

interface EditorLayoutProps {
    articleId?: string | null;
}

export default function CreateArticlePage({ articleId }: EditorLayoutProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [content, setContent] = useState("");
    const [pageTitle, setPageTitle] = useState("发布新文章");
    const [isEdit, setIsEdit] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(!articleId); // 如果没有articleId，则内容已加载
    const router = useRouter();

    // 根据articleId判断是新建还是编辑
    useEffect(() => {
        async function fetchArticleDetail() {
            if (!articleId) return;
            
            try {
                setLoading(true);
                // 获取文章详情
                const articleDetail = await articleService.getArticleDetail(articleId);
                
                // 填充表单数据
                form.setFieldsValue({
                    title: articleDetail.header,
                    tags: articleDetail.tags,
                    // 如果是草稿，设置状态
                    isDraft: articleDetail.status === 0
                });
                
                // 设置内容和草稿状态
                setContent(articleDetail.article_detail || '');
                setIsDraft(articleDetail.status === 0);
                setPageTitle("编辑文章");
                setIsEdit(true);
                setContentLoaded(true); // 标记内容已加载
                
            } catch (error) {
                console.error('获取文章详情失败:', error);
                message.error('获取文章详情失败，请重试');
            } finally {
                setLoading(false);
            }
        }
        
        fetchArticleDetail();
    }, [articleId, form]);

    // 表单提交处理
    const handleFinish = async (values: any) => {
        try {
            setLoading(true);

            // 准备文章请求数据
            const articleRequest: createArticleRequest = {
                article_header: values.title,
                article_detail: content, // 使用编辑器内容而不是表单值
                tags: values.tags || [],
                cover_image: null, // 默认为空
                status: isDraft ? 0 : 3, // 0表示草稿，3表示正式发布
            };

            let response;
            // 根据是否有articleId决定是创建还是更新文章
            if (isEdit && articleId) {
                // 更新文章时需要传入文章ID
                articleRequest.article_id = articleId;
                response = await updateArticle(articleRequest);
            } else {
                // 创建新文章
                response = await articleService.createArticle(articleRequest);
            }

            if (response.code === 200) {
                message.success(isDraft ? '草稿保存成功！' : '文章发布成功！');

                // 不管有没有article_id都进行跳转
                if (isDraft) {
                    // 草稿跳转到创作中心的文章管理页面
                    router.push('/creatorCenter/articles/drafts');
                } else if (response.data && response.data.article_id) {
                    // 发布文章且有ID时跳转到文章详情
                    router.push(`/article/${response.data.article_id}`);
                } else {
                    // 发布文章但没有ID时跳转到文章列表
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

    return (
        <div className={styles.createArticleWrapper}>
            <div className={styles.createArticleMain}>
                <Card className={styles.createArticleCard}>
                    <h2 className={styles.title}>{pageTitle}</h2>
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
                            style={{ height: 520, width: '100%' }}
                        >
                            {contentLoaded ? (
                                <AIEditor
                                    placeholder="请输入正文内容"
                                    style={{ height: 500 }}
                                    defaultValue={content}
                                    onChange={(val) => {
                                        setContent(val);
                                        form.setFieldsValue({ content: val });
                                    }}
                                />
                            ) : (
                                <div className={styles.editorSkeleton} style={{ height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Spin tip="加载文章中..." size="large">
                                        <div className="content" />
                                    </Spin>
                                </div>
                            )}
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

                        <Divider />

                        {/* 提交按钮区 */}
                        <div className={styles.formActions}>
                            <div className={styles.formActionLeft}>
                                <Form.Item
                                    label="保存为草稿"
                                    name="isDraft"
                                    valuePropName="checked"
                                    layout='horizontal'
                                    style={{ marginBottom: 0 }}
                                >
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
                                loading={loading}
                                icon={isDraft ? <SaveOutlined /> : <SendOutlined />}
                                style={{}}
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
                                    <div dangerouslySetInnerHTML={{ __html: content }} />
                                </div>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}
