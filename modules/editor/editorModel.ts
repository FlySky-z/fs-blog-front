export interface createArticleRequest {
    /**
     * 文章内容
     */
    article_detail: string;
    /**
     * 文章标题
     */
    article_header: string;
    /**
     * 文章的封面（指定）
     */
    cover_image: null | string;
    /**
     * 0为草稿，3为正式发布
     */
    status: number;
    /**
     * 标签列表
     */
    tags: string[];
    [property: string]: any;
}


export interface createArticleResponse {
    /**
     * 响应码，响应码 200成功 400用户失败（需要认证/审核失败）
     */
    code: number;
    /**
     * 数据，返回数据
     */
    data: {
        article_id: string;
    };
    /**
     * 消息，返回消息
     */
    msg: string;
}
