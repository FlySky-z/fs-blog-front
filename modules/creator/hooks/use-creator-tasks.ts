'use client';
import { useState, useEffect } from 'react';
import { Task } from '@/components/creator/task-list-card';

// 模拟API调用获取创作任务
const mockFetchCreatorTasks = (): Promise<{ ongoingTasks: Task[], newbieTasks: Task[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ongoingTasks: [
          {
            id: 'task1',
            title: '每日创作',
            description: '连续3天发布原创文章',
            reward: '50积分',
            progress: 66,
            completed: false,
            deadline: '2025-05-25'
          },
          {
            id: 'task2',
            title: '热门话题',
            description: '参与#技术分享#话题并获得10个点赞',
            reward: '80积分',
            progress: 40,
            completed: false
          },
          {
            id: 'task3',
            title: '社区互动',
            description: '给3篇文章留下高质量评论',
            reward: '30积分',
            progress: 100,
            completed: true
          }
        ],
        newbieTasks: [
          {
            id: 'newbie1',
            title: '完善个人资料',
            description: '上传头像并完善个人简介',
            reward: '20积分',
            progress: 100,
            completed: true,
            isNew: false
          },
          {
            id: 'newbie2',
            title: '发布第一篇文章',
            description: '发布一篇300字以上的原创文章',
            reward: '50积分',
            progress: 100,
            completed: true,
            isNew: false
          },
          {
            id: 'newbie3',
            title: '获得第一个粉丝',
            description: '让至少1位用户关注你',
            reward: '30积分',
            progress: 0,
            completed: false,
            isNew: true
          }
        ]
      });
    }, 700);
  });
};

/**
 * 获取创作任务的Hook
 */
export function useCreatorTasks() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [taskData, setTaskData] = useState<{ ongoingTasks: Task[], newbieTasks: Task[] } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await mockFetchCreatorTasks();
        setTaskData(result);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch creator tasks:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch creator tasks'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    error,
    ongoingTasks: taskData?.ongoingTasks || [],
    newbieTasks: taskData?.newbieTasks || []
  };
}

export default useCreatorTasks;
