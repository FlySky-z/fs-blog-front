/**
 * 文件上传工具函数
 */
import { API_BASE_URL, UPLOAD_FILE_SIZE_LIMIT, ALLOWED_UPLOAD_FILE_TYPES } from '@/config/env';
import apiClient from './apiClient';

interface UploadOptions {
  file: File;
  onProgress?: (percent: number) => void;
  token?: string;
  type?: 'avatar' | 'cover' | 'article' | 'attachment';
}

interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  error?: string;
}

/**
 * 检查文件类型是否允许上传
 */
export function isFileTypeAllowed(file: File): boolean {
  const allowedTypes = ALLOWED_UPLOAD_FILE_TYPES.split(',');
  return allowedTypes.includes(file.type);
}

/**
 * 检查文件大小是否超出限制
 */
export function isFileSizeAllowed(file: File): boolean {
  return file.size <= UPLOAD_FILE_SIZE_LIMIT;
}

/**
 * 上传文件到服务器
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { file, onProgress, token, type = 'article' } = options;
  
  // 验证文件类型
  if (!isFileTypeAllowed(file)) {
    return {
      success: false,
      url: '',
      filename: file.name,
      error: '不支持此文件类型，请上传允许的文件格式'
    };
  }
  
  // 验证文件大小
  if (!isFileSizeAllowed(file)) {
    const maxSizeMB = UPLOAD_FILE_SIZE_LIMIT / (1024 * 1024);
    return {
      success: false,
      url: '',
      filename: file.name,
      error: `文件大小超出限制，最大允许 ${maxSizeMB} MB`
    };
  }
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    // 使用 XMLHttpRequest 以支持进度回调
    if (onProgress) {
      return await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                url: response.url,
                filename: response.filename
              });
            } catch (e) {
              reject(new Error('服务器响应格式错误'));
            }
          } else {
            reject(new Error(`上传失败，状态码: ${xhr.status}`));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('网络错误，上传失败'));
        });
        
        xhr.open('POST', `${API_BASE_URL}/upload`);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.send(formData);
      });
    } else {
      // 使用封装的 apiClient
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      
      const data = await response.json();
      
      return {
        success: true,
        url: data.url,
        filename: data.filename
      };
    }
  } catch (error) {
    console.error('文件上传失败:', error);
    return {
      success: false,
      url: '',
      filename: file.name,
      error: error instanceof Error ? error.message : '文件上传失败'
    };
  }
}

/**
 * 从 URL 获取文件扩展名
 */
export function getExtensionFromUrl(url: string): string {
  const filename = url.split('/').pop() || '';
  const extension = filename.split('.').pop() || '';
  return extension.toLowerCase();
}

/**
 * 根据文件扩展名判断是否为图片
 */
export function isImageByExtension(extension: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExtensions.includes(extension.toLowerCase());
}

/**
 * 导出完整的文件上传工具模块
 */
const fileUploadUtils = {
  uploadFile,
  isFileTypeAllowed,
  isFileSizeAllowed,
  getExtensionFromUrl,
  isImageByExtension
};

export default fileUploadUtils;
