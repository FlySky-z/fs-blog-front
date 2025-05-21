'use client';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  token: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

interface LoginData {
  email?: string;
  phone?: string;
  password: string;
  loginMethod: 'email' | 'phone';
}

interface RegisterData {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  registerMethod: 'email' | 'phone';
}

/**
 * 认证相关的API请求
 */
export const authApi = {
  // 登录请求
  login: async (data: LoginData): Promise<LoginResponse> => {
    // 实际项目中应该发送请求到后端API
    console.log('发送登录请求:', data);
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟返回数据
    return {
      user: {
        id: 'user_123',
        username: data.email ? data.email.split('@')[0] : `user_${data.phone}`,
        email: data.email,
        phone: data.phone,
        avatar: ''
      },
      token: 'mock_jwt_token_123456789'
    };
  },
  
  // 注册请求
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    // 实际项目中应该发送请求到后端API
    console.log('发送注册请求:', data);
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟返回数据
    return {
      success: true,
      message: '注册成功'
    };
  },
  
  // 登出请求
  logout: async (): Promise<boolean> => {
    // 实际项目中应该发送请求到后端API
    console.log('发送登出请求');
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  },
  
  // 获取当前用户信息
  getCurrentUser: async (): Promise<LoginResponse['user'] | null> => {
    // 实际项目中应该发送请求到后端API
    console.log('获取当前用户信息');
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查本地存储中是否有用户信息
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    
    return null;
  }
};
