import { apiClient } from '@/utils/apiClient';
import {
  ArticleListItem,
  ArticleListParams, ArticleListResponse,
  ArticleDetailResponse,
  createArticleRequest,
  createArticleResponse,
  MyArticleRequest,
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
   * 获取Tag
   * @returns 返回所有标签
   */
  async getTags(): Promise<string[]> {
    try {
      const response = await apiClient.get<{ code: number; msg: string; data: string[] }>('/api/blog/tags');
      if (response.code === 200) {
        return response.data || [];
      }
      throw new Error(response.msg || '获取标签失败');
    } catch (error) {
      console.error('获取标签失败:', error);
      throw error;
    }
  }

  /**
   * 获取文章列表(管理员可获取任意文章，普通用户只能获取公开文章)
   * @param params 查询参数
   * limit -1 表示不限制数量
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
      // 预处理摘要，去除HTML 标签
      response.data.forEach(article => {
        if (article.abstract) {
          article.abstract = article.abstract.replace(/<[^>]+>/g, ''); // 去除HTML标签
        }
      });
      return response.data;
    }

    throw new Error(response.msg || '获取文章列表失败');
  }

  /**
   * 获取自己文章列表
   * @param params 查询参数
   * limit -1 表示不限制数量
   */
  async getMyArticleList(params: MyArticleRequest): Promise<ArticleListItem[]> {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('page', (params.page ?? 1).toString());
    queryParams.append('limit', (params.limit ?? 10).toString());
    queryParams.append('order_by', params.order_by || 'time');
    queryParams.append('sort_order', params.sort_order || 'desc');
    if (params.tag) queryParams.append('tag', params.tag);

    try {
      const response = await apiClient.get<ArticleListResponse>(`/api/user/list_blog?${queryParams.toString()}`);

      if (response.code === 200 && response.data) {
        // 预处理摘要，去除HTML 标签
        response.data.forEach(article => {
          if (article.abstract) {
            article.abstract = article.abstract.replace(/<[^>]+>/g, ''); // 去除HTML标签
          }
        });
        return response.data;
      }

      throw new Error(response.msg || '获取我的文章列表失败');
    } catch (error) {
      console.error('获取我的文章列表失败:', error);
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

/**
 * 更新文章
 * @param updateRequest 修改文章请求参数
 */
async function updateArticle(updateRequest: createArticleRequest): Promise<createArticleResponse> {
  const response = await apiClient.post<createArticleResponse>(`/api/blog_m/update`, updateRequest);

  if (response.code === 200) {
    return response;
  }
  throw new Error(response.msg || '修改文章失败');
}

/**
 * 删除文章
 * @param id 文章ID
 * @description 用于删除文章
 * @returns 
 */
async function deleteArticle(id: string | number): Promise<boolean> {
  const response = await apiClient.delete<{ code: number; msg: string }>(`/api/blog_m/delete/${id}`);
  if (response.code === 200) {
    return true;
  }
  throw new Error(response.msg || '删除文章失败');
}

export const articleService = new ArticleService();
export { updateArticle, deleteArticle };
export default articleService;
