import { apiClient } from '@/utils/apiClient';
import { ArticleContent } from '@/components/article/article-detail-card';

/**
 * 文章列表查询参数
 */
export interface ArticleListParams {
  page: number;
  limit?: number;
  tag?: string;
  order_by?: 'time' | 'hot';
  sort_order?: 'asc' | 'desc';
  keyword?: string;
  user_id?: string;
}

/**
 * 文章列表项
 */
export interface ArticleListItem {
  id: string;
  title: string;
  tags: string[];
  abstract: string;
  like: string;
  author: string;
  last_modified_date: number;
  cover_image?: string;
  status: number;
}

/**
 * 文章列表接口响应
 */
export interface ArticleListResponse {
  code: number;
  msg: string;
  data: ArticleListItem[];
}

/**
 * 文章详情响应
 */
export interface ArticleDetailResponse {
    code: number;
    msg: string;
    data: {
        id: number | string;
        title: string;
        article_detail: string;
        tags: string[];
        likes: number;
        author_id: string;
        author: string;
        create_time: number;
        last_modified_time: string;
        cover_image?: string | null;
        status: number;
    };
}

/**
 * 前端使用的文章详情格式
 */
export interface ArticleDetail {
  id: string;
  title: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    level?: number;
    bio?: string;
    articleCount?: number;
    followerCount?: number;
    likeCount?: number;
  };
  content: ArticleContent[];
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  // 其他前端需要的字段
}

/**
 * 文章服务
 */
class ArticleService {
  /**
   * 创建延迟函数，用于请求失败后的延迟重试
   * @param ms 延迟毫秒数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取文章列表
   * @param params 查询参数
   * @param retryCount 当前重试次数
   * @param maxRetries 最大重试次数
   */
  async getArticleList(params: ArticleListParams, retryCount = 0, maxRetries = 3): Promise<ArticleListItem[]> {
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.tag) queryParams.append('tag', params.tag);
      if (params.order_by) queryParams.append('order_by', params.order_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.user_id) queryParams.append('user_id', params.user_id);
      
      // 发起请求
      const url = `/api/blog/list?${queryParams.toString()}`;
      const response = await apiClient.get<ArticleListResponse>(url);
      
      if (response.code === 200 && response.data) {
        return response.data;
      }
      
      throw new Error(response.msg || '获取文章列表失败');
    } catch (error) {
      console.error(`获取文章列表失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, error);
      
      // 如果还有重试次数，延迟5秒后重试
      if (retryCount < maxRetries) {
        console.log(`5秒后重试获取文章列表 (页码: ${params.page})...`);
        await this.delay(5000); // 延迟5秒
        return this.getArticleList(params, retryCount + 1, maxRetries);
      }
      
      console.error('获取文章列表失败，已达到最大重试次数:', error);
      throw error;
    }
  }
  
  /**
   * 获取文章详情
   * @param id 文章ID
   */
  async getArticleDetail(id: string | number): Promise<ArticleDetailResponse['data']> {
    try {
      const response = await apiClient.get<ArticleDetailResponse>(`/api/blog/info/${id}`);
      
      if (response.code === 200 && response.data) {
        return response.data;
      }
      
      throw new Error(response.msg || '获取文章详情失败');
    } catch (error) {
      console.error(`获取文章详情失败 (ID: ${id}):`, error);
      throw error;
    }
  }
  
  /**
   * 将后端返回的文章详情转换为前端使用的格式
   * @param id 文章ID
   * @param data 后端返回的文章详情
   */
  convertArticleDetail(id: string, data: ArticleDetailResponse['data']): ArticleDetail {
    // 这里需要根据实际情况解析后端返回的文章内容
    // 例如，将Markdown或HTML内容解析为ArticleContent[]
    
    // 简单示例，实际应用中需要根据后端返回格式调整
    const content: ArticleContent[] = [
      {
        type: 'text',
        content: data.article_detail || '无内容'
      }
    ];
    
    return {
      id,
      title: '', // 后端数据中缺少标题字段，需要从其他地方获取
      author: {
        id: '',
        username: data.author,
      },
      content,
      publishedAt: new Date(data.create_time).toISOString(),
      updatedAt: data.last_modified_time,
      tags: data.tags,
    };
  }
}

export const articleService = new ArticleService();
export default articleService;
