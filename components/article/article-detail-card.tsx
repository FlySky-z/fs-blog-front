'use client';
import React, { useEffect, useRef } from 'react';
import { Card, Typography, Divider, Image, Space } from 'antd';
import UserMeta from '@/components/molecules/user-meta';
import ArticleActions from '@/components/molecules/article-actions';
import styles from './article-detail-card.module.scss';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Script from 'next/script';
import Head from 'next/head';

const { Title, Paragraph } = Typography;

// 定义一个空的Prism对象类型，这样TypeScript不会报错
declare global {
  interface Window {
    Prism: any;
  }
}

export interface ArticleContent {
  type: 'text' | 'image' | 'video' | 'html' | 'markdown';
  content: string;
  caption?: string;
}

export interface ArticleDetailCardProps {
  id: string;
  title: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    level?: number;
  };
  publishedAt: string;
  content: ArticleContent[];
  likeCount: number;
  favoriteCount: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  onLike?: (id: string, liked: boolean) => Promise<void>;
  onFavorite?: (id: string, favorited: boolean) => Promise<void>;
  onShare?: (id: string) => void;
  onReport?: (id: string, reason: string) => Promise<void>;
}

const ArticleDetailCard: React.FC<ArticleDetailCardProps> = ({
  id,
  title,
  author,
  publishedAt,
  content,
  likeCount,
  favoriteCount,
  isLiked,
  isFavorited,
  onLike,
  onFavorite,
  onShare,
  onReport,
}) => {
  // 创建引用，用于记录内容是否已加载完成
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 将发布时间格式化为可读形式
  const formattedDate = new Date(publishedAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // 处理DOMPurify配置和代码块处理
  useEffect(() => {
    // 为代码块添加高亮
    DOMPurify.addHook('afterSanitizeAttributes', function(node: Element) {
      // 处理pre>code标签结构（针对HTML内容中的代码块）
      if (node.tagName === 'PRE' && node.firstElementChild && node.firstElementChild.tagName === 'CODE') {
        const code = node.firstElementChild;
        // 从code标签上获取language-*类名或data-language属性
        // 使用可选链确保code存在且安全访问className
        const classMatch = code?.className ? code.className.match(/language-(\w+)/) : null;
        const language = classMatch?.[1] || code.getAttribute('data-language');
        
        if (language) {
          code.className = `language-${language}`;
          // 为pre标签添加data-language属性用于显示语言标签
          node.setAttribute('data-language', language);
        } else {
          // 默认使用html
          code.className = 'language-html';
          node.setAttribute('data-language', 'html');
        }
      }
      
      // 处理独立的pre标签
      if (node.tagName === 'PRE' && (!node.firstElementChild || node.firstElementChild.tagName !== 'CODE')) {
        // 安全地检查className是否存在
        const classMatch = node.className ? node.className.match(/language-(\w+)/) : null;
        if (classMatch?.[1]) {
          const language = classMatch[1];
          const wrapper = document.createElement('code');
          wrapper.className = `language-${language}`;
          // 将pre标签内容移至code标签
          wrapper.innerHTML = node.innerHTML;
          node.innerHTML = '';
          node.appendChild(wrapper);
          // 添加data-language属性
          node.setAttribute('data-language', language);
        } else {
          // 对于没有指定语言的pre标签，默认设置为HTML
          const wrapper = document.createElement('code');
          wrapper.className = 'language-html';
          wrapper.innerHTML = node.innerHTML;
          node.innerHTML = '';
          node.appendChild(wrapper);
          node.setAttribute('data-language', 'html');
        }
      }
      
      // 为链接添加target="_blank"和rel="noopener noreferrer"
      if (node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    // 等待Prism加载完成后再高亮代码
    const highlightCodeBlocks = () => {
      if (typeof window !== 'undefined' && window.Prism) {
        // 手动触发Prism.js高亮处理
        window.Prism.highlightAll();
      }
    };
    
    // 等待Prism脚本加载完成
    setTimeout(highlightCodeBlocks, 500);
    
    // 创建MutationObserver来监听内容变化
    if (contentRef.current && typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => {
        // 内容变化后执行高亮
        setTimeout(highlightCodeBlocks, 100);
      });
      
      // 监听内容区域的变化
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true
      });
      
      // 组件卸载时断开观察者
      return () => {
        observer.disconnect();
        DOMPurify.removeHook('afterSanitizeAttributes');
      };
    }
    
    // 组件卸载时清理
    return () => {
      DOMPurify.removeHook('afterSanitizeAttributes');
    };
  }, [content]);

  // 渲染文章内容（文本、图片、视频等）
  const renderContent = () => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'html':
          return (
            <div key={index} className={styles.textParagraph}>
              {parse(DOMPurify.sanitize(item.content, {
                USE_PROFILES: { html: true },
                ADD_ATTR: ['target', 'rel', 'class', 'data-language'], // 允许更多属性
                ALLOW_DATA_ATTR: true, // 允许data属性用于代码高亮
                ADD_TAGS: ['pre', 'code'] // 确保允许代码标签
              }))}
            </div>
          );
        case 'markdown':
          return (
            <div key={index} className={styles.markdownContent}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]} // 支持GitHub风格的Markdown（表格、任务列表等）
                rehypePlugins={[rehypeRaw, rehypeSanitize]} // 允许HTML并进行安全处理
                components={{
                  // 自定义各类元素的渲染方式，使用Ant Design样式
                  h1: ({node, ...props}) => <Typography.Title level={1} {...props} />,
                  h2: ({node, ...props}) => <Typography.Title level={2} {...props} />,
                  h3: ({node, ...props}) => <Typography.Title level={3} {...props} />,
                  h4: ({node, ...props}) => <Typography.Title level={4} {...props} />,
                  h5: ({node, ...props}) => <Typography.Title level={5} {...props} />,
                  h6: ({node, ...props}) => <Typography.Title level={5} {...props} />,
                  p: ({node, ...props}) => <Typography.Paragraph {...props} />,
                  a: ({node, ...props}) => <a className={styles.link} target="_blank" rel="noopener noreferrer" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className={styles.blockquote} {...props} />,
                  pre: ({node, ...props}) => <pre className={styles.codeBlock} {...props} />,
                  code: ({node, className, children, ...props}) => {
                    // 检测语言类型
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : 'html'; // 默认使用html
                    return match ? (
                      // 代码块
                      <pre className={styles.codeBlock} data-language={language}>
                        <code
                          className={`language-${language}`}
                          {...props}
                        >
                          {children}
                        </code>
                      </pre>
                    ) : (
                      // 内联代码
                      <code className={`${styles.inlineCode} ${className || ''}`} {...props} />
                    );
                  },
                  ul: ({node, ...props}) => <ul className={styles.list} {...props} />,
                  ol: ({node, ...props}) => <ol className={styles.list} {...props} />,
                  li: ({node, ...props}) => <li className={styles.listItem} {...props} />,
                  table: ({node, ...props}) => <table className={styles.table} {...props} />,
                }}
              >
                {item.content}
              </ReactMarkdown>
            </div>
          );
        case 'image':
          return (
            <div key={index} className={styles.mediaContainer}>
              <Image
                src={item.content}
                alt={item.caption || `图片${index + 1}`}
                className={styles.imageContent}
              />
              {item.caption && (
                <div className={styles.captionText}>
                  {item.caption}
                </div>
              )}
            </div>
          );
        case 'video':
          return (
            <div key={index} className={styles.mediaContainer}>
              <video
                src={item.content}
                controls
                className={styles.videoContent}
                poster={`/thumbnails/${id}-${index}.jpg`} // 假设有视频缩略图
              />
              {item.caption && (
                <div className={styles.captionText}>
                  {item.caption}
                </div>
              )}
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <>
      {/* 添加Prism.js的CSS和JS */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" />
      <Script
        src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.Prism && window.Prism.plugins && window.Prism.plugins.autoloader) {
            window.Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
            window.Prism.highlightAll();
          }
        }}
      />
      
      <Card
        className={styles.articleCard}
      >
        <div className={styles.cardBody}>
          {/* 文章头部：标题 */}
          <Title level={1} className={styles.articleTitle}>
            {title}
          </Title>

          {/* 用户信息 */}
          <Space direction="vertical" size={16} className={styles.contentWrapper}>
            <div className={styles.userInfoContainer}>
              <UserMeta
                id={author.id}
                username={author.username}
                avatar={author.avatar}
                level={author.level}
                createdAt={formattedDate}
                showTime={true}
                size="default"
              />
            </div>

            <Divider className={styles.dividerNormal} />

            {/* 文章内容 */}
            <div className={styles.articleContent} ref={contentRef}>
              {renderContent()}
            </div>

            <Divider className={styles.dividerLarge} />

            {/* 文章操作区 */}
            <div className={styles.actionsContainer}>
              <ArticleActions
                articleId={id}
                likeCount={likeCount}
                favoriteCount={favoriteCount}
                isLiked={isLiked}
                isFavorited={isFavorited}
                onLike={onLike}
                onFavorite={onFavorite}
                onShare={onShare}
                onReport={onReport}
              />
            </div>
          </Space>
        </div>
      </Card>
    </>
  );
};

export default ArticleDetailCard;
