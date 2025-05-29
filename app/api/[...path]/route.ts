import { NextRequest, NextResponse } from 'next/server'
import config from '@/config/env'

// 后端接口地址
const BACKEND_BASE = config.apiBaseUrl

/**
 * 通用的请求转发处理函数
 * @param req 原始请求
 * @param method HTTP方法
 */
async function handleRequest(req: NextRequest, method: string) {
  // 1. 构建目标URL
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  if (pathSegments[0] === 'api') pathSegments.shift();
  
  const apiPath = pathSegments.join('/');
  const query = url.searchParams.toString();
  const backendUrl = `${BACKEND_BASE}/api/${apiPath}${query ? `?${query}` : ''}`;
  
  console.log(`[API Proxy] ${method} ${url.pathname} -> ${backendUrl}`);
  
  // 2. 准备请求头
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // 3. 准备请求选项
  const options: RequestInit = { method, headers };
  
  // 4. 处理请求体 (只对包含请求体的方法)
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    try {
      const contentType = headers.get('content-type') || '';
      
      // 使用更底层和直接的方式处理请求体
      if (contentType.includes('multipart/form-data')) {
        // 保留原始的Content-Type，包括boundary信息
        const originalContentType = req.headers.get('content-type');
        if (originalContentType) {
          headers.set('Content-Type', originalContentType);
        }
        
        // 使用更底层的方式获取请求体数据
        const body = await req.arrayBuffer();
        options.body = body;
      }
      // 对于JSON和其他类型，也直接传递原始数据
      else if (contentType) {
        options.body = await req.arrayBuffer();
      }
    } catch (e) {
      console.error('Error processing request body:', e);
    }
  }
  
  // 5. 发送请求并获取响应
  const response = await fetch(backendUrl, options);
  
  // 6. 处理响应头
  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (!['content-length', 'connection'].includes(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });
  
  // 7. 处理响应体并返回
  const contentType = response.headers.get('content-type') || '';
  
  // 保持原始响应类型，避免不必要的解析和转换
  const responseBody = await response.blob();
  
  return new NextResponse(responseBody, {
    status: response.status,
    headers: responseHeaders  
  });
}

// 导出各种 HTTP 方法的处理函数
export async function GET(req: NextRequest) {
  return handleRequest(req, 'GET');
}

export async function POST(req: NextRequest) {
  return handleRequest(req, 'POST');
}

export async function PUT(req: NextRequest) {
  return handleRequest(req, 'PUT');
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req, 'DELETE');
}

export async function PATCH(req: NextRequest) {
  return handleRequest(req, 'PATCH');
}

export async function OPTIONS(req: NextRequest) {
  return handleRequest(req, 'OPTIONS');
}

export async function HEAD(req: NextRequest) {
  return handleRequest(req, 'HEAD');
}
