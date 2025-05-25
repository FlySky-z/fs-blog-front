import { NextRequest, NextResponse } from 'next/server'
import config from '@/config/env'

// 你的后端接口地址（只支持 HTTP）
const BACKEND_BASE = config.apiBaseUrl

// 通用的请求处理函数
async function handleRequest(req: NextRequest, method: string) {
  // 从 URL 中提取路径和查询参数
  const url = new URL(req.url);
  const pathname = url.pathname;
  const query = url.searchParams.toString();
  
  // 提取路径段：移除 /api/ 前缀
  const pathSegments = pathname.split('/').filter(Boolean);
  // 第一个段是 'api'，移除它
  if (pathSegments[0] === 'api') {
    pathSegments.shift();
  }
  
  const apiPath = pathSegments.join('/');
  const backendUrl = `${BACKEND_BASE}/api/${apiPath}${query ? `?${query}` : ''}`;
  
  // 获取并转发所有请求头（排除掉 host 和 connection 等特殊头）
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  
  // 如果没有设置 Content-Type，添加默认值
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // 构建请求选项
  const options: RequestInit = {
    method,
    headers,
  };
  
  // 对于有请求体的方法，添加请求体
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    // 根据 Content-Type 决定如何处理请求体
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        const json = await req.json();
        options.body = JSON.stringify(json);
      } catch (e) {
        const text = await req.text();
        if (text) {
          options.body = text;
        }
      }
    } else {
      // 其他类型（表单数据、文本等）直接转发
      const body = await req.text();
      if (body) {
        options.body = body;
      }
    }
  }
  
  // 发送请求到后端
  const response = await fetch(backendUrl, options);
  
  // 处理响应
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();
  
  // 创建响应对象，并转发响应头
  const responseHeaders = new Headers({ 'Content-Type': contentType });
  response.headers.forEach((value, key) => {
    if (!['content-length', 'connection'].includes(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });
  
  return new NextResponse(isJson ? JSON.stringify(data) : data, {
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
