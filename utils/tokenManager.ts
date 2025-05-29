/*
TokenManager
用于管理访问令牌和刷新令牌的工具类
*/

// JWT 解析后的对象 interface
export interface JwtPayload {
  uid: number;
  uname: string;
  tokenType: string;
  version: number;
  iat: number;
  exp: number;
}

export const TokenManager = {
  // 获取 Access Token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  // 设置 Access Token
  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', token);
  },

  // 清除 Access Token
  clearAccessToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
  },

  // 清除所有 token
  clearAllTokens(): void {
    this.clearAccessToken();
    // 清除其他相关的存储项
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_info');
    }
  },

  // 检查是否有有效的 token
  hasValidToken(): boolean {
    const token = this.getAccessToken();
    return token !== null && token.trim() !== '';
  },

  // 从JWT中安全提取用户信息
  extractUserInfoFromToken(token: string): JwtPayload | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      // base64url 解码
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      const decodedPayload = JSON.parse(decodeURIComponent(escape(window.atob(padded))));
      return decodedPayload as JwtPayload;
    } catch (error) {
      console.error('解析JWT失败:', error);
      return null;
    }
  },

  // 从响应头中提取并保存新的 access token
  extractAndSaveTokenFromHeaders(headers: Record<string, any>): string | null {
    const authHeader = headers['authorization'] || headers['Authorization'];
    if (authHeader) {
      // 去掉 "Bearer " 前缀
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;
      
      if (token) {
        this.setAccessToken(token);
        return token;
      }
    }
    return null;
  },

  // 为请求头添加 Authorization
  addAuthorizationHeader(headers: Record<string, string> = {}): Record<string, string> {
    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },
};