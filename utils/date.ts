/**
 * 格式化时间戳为日期字符串
 * @param timestamp 时间戳，单位为秒
 * @returns 
 */

export const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };