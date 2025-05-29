// export interface ArticleContent {
//   type: 'text' | 'image' | 'video';
//   content: string;
//   caption?: string;
// }

/**
 * 文章列表查询参数
 */
export interface ArticleListParams {
  page: number;
  limit?: number;
  tag?: string;
  order_by?: 'time' | 'likes';
  sort_order?: 'asc' | 'desc';
  keyword?: string;
  user_id?: string;
}

export interface MyArticleRequest {
    /**
     * 每一页内容数
     */
    limit?: number;
    /**
     * 排序（时间time/热度likes）
     */
    order_by?: string;
    /**
     * 页面数
     */
    page: number;
    /**
     * asc（升序）或desc（降序）
     */
    sort_order?: string;
    /**
     * 标签
     */
    tag?: string;
}


/**
 * 文章列表项
 */
export interface ArticleListItem {
  id: string;
  header: string;
  tags: string[];
  abstract: string;
  article_detail: string;
  like: number;
  comment: number;
  view: number;
  author: string;
  author_id: string;
  create_time: number;
  last_modified_date: number;
  cover_image?: string;
  status: number;
}

/**
 * 文章列表接口响应
 */
export interface ArticleListResponse {
  code: number;
  msg: string;
  data: ArticleListItem[];
}

/**
 * 文章详情响应
 */
export interface ArticleDetailResponse {
    code: number;
    msg: string;
    data: {
        id: number | string;
        header: string;
        article_detail: string;
        tags: string[];
        like: number;
        comment: number;
        view: number;
        author_id: string;
        author: string;
        create_time: number;
        last_modified_time: string;
        cover_image?: string | null;
        status: number;
    };
}


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
