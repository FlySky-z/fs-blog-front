'use client';
import { message } from 'antd';
import { createArticleRequest } from '@/modules/article/articleModel';
import { apiClient } from '@/utils/apiClient';
import { ArticleStatus } from '../../modules/creator/article-management-card';

// 删除文章函数
export const useDeleteArticle = () => {
  return async (id: string | number): Promise<boolean> => {
    try {
      const response = await apiClient.delete<{ code: number; msg: string }>(`/api/blog_m/delete/${id}`);
      if (response.code === 200) {
        message.success('删除文章成功');
        return true;
      }
      message.error(response.msg || '删除文章失败');
      return false;
    } catch (error) {
      message.error('删除文章失败，请稍后重试');
      return false;
    }
  };
};

// 更新文章函数
export const useUpdateArticle = () => {
  return async (updateRequest: createArticleRequest): Promise<any> => {
    try {
      const response = await apiClient.post<any>(`/api/blog_m/update`, updateRequest);
      if (response.code === 200) {
        message.success('更新文章成功');
        return response;
      }
      message.error(response.msg || '修改文章失败');
      return null;
    } catch (error) {
      message.error('修改文章失败，请稍后重试');
      return null;
    }
  };
};

// 批量操作菜单项生成函数
export const useBatchMenuItems = (
  selectedItems: string[],
  deleteArticle: (id: string | number) => Promise<boolean>,
  updateArticle: (updateRequest: createArticleRequest) => Promise<any>,
  getArticleDetail: (id: string | number) => Promise<any>,
  onSuccess: () => void,
  setLoading: (loading: boolean) => void
) => {
  return [
    {
      key: 'delete',
      label: '批量删除',
      disabled: selectedItems.length === 0,
      danger: true,
      onClick: async () => {
        if (selectedItems.length === 0) return;
        
        setLoading(true);
        try {
          // 批量删除所选文章
          const results = await Promise.all(selectedItems.map(id => deleteArticle(id)));
          if (results.every(result => result)) {
            message.success(`成功删除 ${results.filter(Boolean).length} 篇文章`);
            onSuccess();
          }
        } catch (error) {
          message.error('批量删除文章失败，请稍后重试');
        } finally {
          setLoading(false);
        }
      }
    },
    {
      key: 'draft',
      label: '移至草稿箱',
      disabled: selectedItems.length === 0,
      onClick: async () => {
        if (selectedItems.length === 0) return;
        
        setLoading(true);
        try {
          // 获取所选文章的详情并更新状态为草稿
          const results = await Promise.all(
            selectedItems.map(async (id) => {
              const article = await getArticleDetail(id);
              if (!article) return false;
              
              return updateArticle({
                id: id,
                article_detail: article.article_detail,
                article_header: article.header,
                cover_image: article.cover_image || null,
                status: ArticleStatus.DRAFT,
                tags: article.tags
              });
            })
          );
          
          if (results.some(Boolean)) {
            message.success(`成功将 ${results.filter(Boolean).length} 篇文章移至草稿箱`);
            onSuccess();
          }
        } catch (error) {
          message.error('批量移至草稿箱失败，请稍后重试');
        } finally {
          setLoading(false);
        }
      }
    },
    {
      key: 'review',
      label: '提交审核',
      disabled: selectedItems.length === 0,
      onClick: async () => {
        if (selectedItems.length === 0) return;
        
        setLoading(true);
        try {
          // 获取所选文章的详情并更新状态为待审核
          const results = await Promise.all(
            selectedItems.map(async (id) => {
              const article = await getArticleDetail(id);
              if (!article) return false;
              
              return updateArticle({
                id: id,
                article_detail: article.article_detail,
                article_header: article.header,
                cover_image: article.cover_image || null,
                status: ArticleStatus.PENDING,
                tags: article.tags
              });
            })
          );
          
          if (results.some(Boolean)) {
            message.success(`成功提交 ${results.filter(Boolean).length} 篇文章审核`);
            onSuccess();
          }
        } catch (error) {
          message.error('批量提交审核失败，请稍后重试');
        } finally {
          setLoading(false);
        }
      }
    },
  ];
};
