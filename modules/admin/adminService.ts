/**
 * 管理员相关服务
 * 提供管理员功能的 API 调用服务
 */

import { apiClient } from '@/utils/apiClient';
import { AbnormalEventsRequest, AbnormalEventsResponse } from './adminModel';

/**
 * 管理员服务类
 * 封装所有管理员相关的 API 操作
 */
export class AdminService {
  private readonly baseUrl = '/api';

  /**
   * 构建查询参数字符串
   * @param params 参数对象
   * @returns 查询参数字符串
   */
  private buildQueryParams(params?: Record<string, any>): string {
    if (!params) return '';
    
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key].toString());
      }
    });
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * 构建完整的 API 端点 URL
   * @param endpoint 端点路径
   * @param params 查询参数
   * @returns 完整的 URL
   */
  private buildEndpoint(endpoint: string, params?: Record<string, any>): string {
    const queryString = this.buildQueryParams(params);
    return `${this.baseUrl}${endpoint}${queryString}`;
  }

  /**
   * 获取异常事件列表
   * @param params 请求参数
   * @returns Promise<AbnormalEventsResponse> 异常事件列表响应
   */
  public async getAbnormalEvents(
    params?: AbnormalEventsRequest
  ): Promise<AbnormalEventsResponse> {
    try {
      const endpoint = this.buildEndpoint('/user/abnormal_events', params);
      
      // 发送 GET 请求
      const response = await apiClient.get<AbnormalEventsResponse>(endpoint);
      
      return response;
    } catch (error) {
      console.error('获取异常事件列表失败:', error);
      throw error;
    }
  }
}

/**
 * 管理员服务单例实例
 */
export const adminService = new AdminService();

export default adminService;