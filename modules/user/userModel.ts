
export interface userInfo {
    /**
     * 用户简介text
     */
    abstract: string;
    /**
     * 用户图标
     */
    avatar_url: string;
    /**
     * 注册时间
     */
    create_time: string;
    /**
     * 邮箱
     */
    email: null | string;
    /**
     * 用户id
     */
    id: number;
    /**
     * 是否被拉黑
     */
    is_blocked: null | boolean;
    /**
     * 是否登录
     */
    is_login: boolean;
    /**
     * 密码hash
     */
    password_hash: null | string;
    /**
     * 手机号
     */
    phone: null | string;
    /**
     * 角色
     */
    role: number;
    /**
     * 用户名
     */
    username: string;
    /**
     * 用户等级
     */
    level: number;
    /**
     * 用户标签
     */
    tags: string[];
    /**
     * 用户数据
     */
    stats: {
        /**
         * 粉丝数
         */
        followers: number;
        /**
         * 关注数
         */
        following: number;
        /**
         * 点赞数
         */
        likes: number;
    }
}


export interface getUserListQuery {
    /**
     * 升序/降序，0表示升序，1表示降序
     */
    asc?: number;
    /**
     * 每一页数量
     */
    limit?: number;
    /**
     * 查询关键词
     */
    key_word?: string;
    /**
     * 排序字段
     */
    order_by?: string;
    /**
     * 页面数，从1开始
     */
    page?: number;
    [property: string]: any;
}

export interface userStats {
    /**
     * 用户图标url
     */
    avatar_url: string;
    email: null | string;
    /**
     * 用户id
     */
    id: number;
    /**
     * 是否黑名单
     */
    is_blocked: boolean;
    /**
     * 是否已经登录
     */
    is_login: boolean;
    /**
     * 加密后的密码
     */
    password_hash: string;
    phone: null | string;
    /**
     * 角色（管理员）0/1【枚举】
     */
    role: number;
    /**
     * 名称
     */
    username: string;
    [property: string]: any;
}

export interface getUserListResponse {
    /**
     * 响应码，响应码
     */
    code: number;
    /**
     * 用户状态信息
     */
    data: userStats[];
    /**
     * 消息，返回消息
     */
    msg: string;
    [property: string]: any;
}

export interface userUpdateRequest {
    /**
     * 简介
     */
    abstract?: string;
    /**
     * 头像URL
     */
    avatar_url?: string;
    /**
     * 邮箱，邮箱可选
     */
    email?: string;
    /**
     * 密码，做hash
     */
    password?: string;
    /**
     * 手机号
     */
    phone?: string;
    /**
     * 用户名
     */
    username?: string;
    [property: string]: any;
}