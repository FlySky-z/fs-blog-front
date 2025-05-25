/**
 * 根据 auth_openapi.json 自动生成的类型定义
 * 用于用户认证相关的数据模型
 */

export interface RegisterRequest {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    captcha_id: string;
    captcha_code: number;
}

export interface RegisterResponse {
    code: number;
    msg: string;
    data: Record<string, unknown>;
}

export interface LoginRequest {
    username?: string;
    email?: string;
    phone?: string;
    password: string;
}

export interface LoginResponse {
    code: number;
    msg: string;
    data?: {
        id: string;
    };
}

export interface LogoutResponse {
    code: number;
    msg: string;
    data: Record<string, unknown>;
}

export interface CheckEmailResponse {
    code: number;
    msg: string;
    data: Record<string, unknown>;
}

export interface CheckUsernameResponse {
    code: number;
    msg: string;
    data: Record<string, unknown>;
}

export interface CaptchaGetResponse {
    code: number;
    msg: string;
    data: {
        id: string;
        background: string;
        bg_width: number;
        bg_height: number;
        block: string;
        bl_width: number;
        bl_height: number;
        bl_y: number;
    };
}

export interface CaptchaCheckResponse {
    code: number;
    msg: string;
    data: Record<string, unknown>;
}

export interface RefreshTokenResponse {
    code: number;
    msg: string;
}

