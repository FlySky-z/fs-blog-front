import { apiClient } from '@/utils/apiClient';
import {
  ArticleListItem,
  ArticleListParams, ArticleListResponse,
  ArticleDetailResponse,
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
   */
  async getArticleList(params: ArticleListParams): Promise<ArticleListItem[]> {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('page', (params.page ?? 1).toString()); // 默认第1页
      queryParams.append('limit', (params.limit ?? 10).toString()); // 默认每页10条数据
      queryParams.append('order_by', params.order_by || 'time'); // 默认按时间排序
      queryParams.append('sort_order', params.sort_order || 'desc'); // 默认降序
      if (params.tag) queryParams.append('tag', params.tag);
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.user_id) queryParams.append('user_id', params.user_id);

      // 发起请求
      const url = `/api/blog/list?${queryParams.toString()}`;
      const response = await apiClient.get<ArticleListResponse>(url);

      if (response.code === 200 && response.data) {
        return response.data;
      }

      throw new Error(response.msg || '获取文章列表失败');
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
   * 创建文章
   * @param createRequest 创建文章请求参数
   */
  async createArticle(createRequest: createArticleRequest): Promise<createArticleResponse> {
      const response = await apiClient.post<createArticleResponse>('/api/blog_m/create', createRequest)

      if (response.code === 200) {
        return response;
      }
      throw new Error(response.msg || '创建文章失败');
  }
}

export const articleService = new ArticleService();
export default articleService;
