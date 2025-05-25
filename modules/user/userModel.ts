
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
    /**
     * 用户等级
     */
    level: number;
    /**
     * 用户标签
     */
    tags: [string];
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
