/**
 * AbnormalEventsRequest
 * @description 获取异常事件列表的请求参数
 */
export interface AbnormalEventsRequest {
    /**
     * 每页内容数
     */
    count?: number;
    /**
     * 页面数
     */
    page?: number;
    /**
     * 搜索关键词
     */
    search?: string;
    /**
     * 开始时间
     */
    start_time?: string;
    /**
     * 结束时间
     */
    end_time?: string;
    [property: string]: any;
}


/**
 * AbnormalEventsResponse
 * @description 获取异常事件列表的响应数据
 */
export interface AbnormalEventsResponse {
    /**
     * 响应码，响应码
     */
    code: number;
    /**
     * 数据，返回异常事件列表
     */
    data: AbnormalEvent[];
    /**
     * 消息，返回消息
     */
    msg: string;
    [property: string]: any;
}

export interface AbnormalEvent {
    /**
     * 异常事件ID (唯一标识)
     */
    id?: string;
    /**
     * 异常的原因【异地登录/登录过于频繁】
     */
    detail: string;
    /**
     * 异常用户id
     */
    user_id: string;
    /**
     * 异常用户名称
     */
    username: string;
    /**
     * 创建时间
     */
    create_time?: string;
    /**
     * 异常类型
     */
    type?: string;
    /**
     * 异常状态
     */
    status?: string;
    [property: string]: any;
}
