/**
 * 环境配置文件
 * 用于管理开发环境和生产环境的不同配置
 */

/**
 * API基础URL
 * 开发环境: http://localhost:3000/api
 * 生产环境: http://你的公网IP:8000/api
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * 站点URL
 * 开发环境: http://localhost:3000
 * 生产环境: http://你的公网IP
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * 上传文件大小限制（单位：字节）
 * 默认为 5MB
 */
export const UPLOAD_FILE_SIZE_LIMIT = Number(process.env.NEXT_PUBLIC_UPLOAD_FILE_SIZE_LIMIT) || 5 * 1024 * 1024;

/**
 * 允许的上传文件类型
 */
export const ALLOWED_UPLOAD_FILE_TYPES = process.env.NEXT_PUBLIC_ALLOWED_UPLOAD_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp';

/**
 * 图片CDN基础URL（如果有）
 */
export const IMAGE_CDN_URL = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || '';

/**
 * 每页显示的文章数量
 */
export const ARTICLES_PER_PAGE = Number(process.env.NEXT_PUBLIC_ARTICLES_PER_PAGE) || 10;

/**
 * 判断是否为开发环境
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 判断是否为生产环境
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * 判断是否为测试环境
 */
export const isTest = process.env.NODE_ENV === 'test';

/**
 * 配置对象，包含所有环境变量
 */
const config = {
  apiBaseUrl: API_BASE_URL,
  siteUrl: SITE_URL,
  uploadFileSizeLimit: UPLOAD_FILE_SIZE_LIMIT,
  allowedUploadFileTypes: ALLOWED_UPLOAD_FILE_TYPES.split(','),
  imageCdnUrl: IMAGE_CDN_URL,
  articlesPerPage: ARTICLES_PER_PAGE,
  isDevelopment,
  isProduction,
  isTest,
};

export default config;
