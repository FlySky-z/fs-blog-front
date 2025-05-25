import { apiClient } from '@/utils/apiClient';
import {
  ArticleListItem,
  ArticleListParams, ArticleListResponse,
  ArticleDetailResponse,
  ArticleDetail,
  ArticleContent,
  createArticleRequest,
  createArticleResponse,
} from './articleModel';


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
  async getArticleList(params: ArticleListParams): Promise<ArticleListItem[]> {
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

  createArticle(createRequest: createArticleRequest): Promise<createArticleResponse> {
    return new Promise((resolve, reject) => {
      apiClient.post<createArticleResponse>('/api/blog_m/create', createRequest)
        .then((response) => {
          if (response.code === 200) {
            resolve(response);
          } else {
            reject(new Error(response.msg || '创建文章失败'));
          }
        })
        .catch((error) => {
          console.error('创建文章失败:', error);
          reject(error);
        });
    });
  }
}

export const articleService = new ArticleService();
export default articleService;
