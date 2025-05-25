
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
     * 手机号
     */
    phone: null | string;
    /**
     * 用户名
     */
    username: string;
}
