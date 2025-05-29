import axios from 'axios';
import apiClient from './apiClient';

/**
 * API 响应体结构 (服务器返回的完整响应)
 */
interface UploadImageResponse {
    code: number;
    msg: string;
    data: string; // 图片路径
}

/**
 * 上传图片到服务器
 * @param image 图片文件 File 对象
 * @param imageName 图片名称
 * @returns Promise<UploadImageResponse> 包含上传结果的对象
 */
export const uploadImage = async (
    image: File,
    imageName: string,
): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('image_name', imageName);

    try {
        // const response = await axios.put<UploadImageResponse>(
        //     'http://localhost:8000/api/image/upload',
        //     formData, // data 参数
        //     {
        //         headers: {
        //             'Content-Type': 'multipart/form-data', // 设置为 multipart/form-data
        //             'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // 如果需要身份验证
        //         }
        //     },
        // );
        // 对于 FormData，通常不需要手动设置 Content-Type，axios 会自动处理
        const response = await apiClient.put<UploadImageResponse>(
            '/api/image/upload',
            formData, // data 参数
            {
                headers: {
                    'Content-Type': undefined,
                },
            },
        );

        // 检查响应状态码
        if (response.code !== 200) {
            throw new Error(response.msg || '图片上传失败');
        }
        return response;
    } catch (error) {
        console.error('图片上传失败:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('图片上传服务发生未知错误');
    }
};
