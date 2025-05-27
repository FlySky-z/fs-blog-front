/**
 * 一些随机相关的工具函数
 * @module utils/random
 */

/**
 * 获取一个随机颜色
 * @return {string} 随机颜色名称
 */
export function getRandomColor() {
    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
};