'use client';
import React, { useState } from 'react';
import { Card, Typography, Tabs, List, Tag, Button, Progress, Space } from 'antd';
import { CalendarOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  completed: boolean;
  deadline?: string;
  isNew?: boolean;
}

interface TaskListCardProps {
  ongoingTasks: Task[];
  newbieTasks: Task[];
}

const TaskListCard: React.FC<TaskListCardProps> = ({
  ongoingTasks,
  newbieTasks
}) => {
  const [activeTab, setActiveTab] = useState<string>('ongoing');

  const renderTaskItem = (task: Task) => (
    <List.Item 
      key={task.id}
      className="flex flex-col sm:flex-row items-start sm:items-center"
      extra={
        <div className="mt-2 sm:mt-0 sm:ml-4 sm:w-32 w-full">
          {task.completed ? (
            <Button size="small" disabled>已完成</Button>
          ) : (
            <Button size="small" type="primary">
              去完成
            </Button>
          )}
        </div>
      }
    >
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <Text strong>{task.title}</Text>
          {task.isNew && <Tag color="red" className="ml-2">新</Tag>}
        </div>
        
        <Text type="secondary" className="block mb-2">{task.description}</Text>
        
        <div className="flex flex-wrap items-center gap-2">
          <Tag color="gold" icon={<TrophyOutlined />}>奖励: {task.reward}</Tag>
          
          {task.deadline && (
            <Tag icon={<CalendarOutlined />}>截止: {task.deadline}</Tag>
          )}
        </div>
        
        {!task.completed && (
          <div className="mt-2 w-full sm:w-3/4">
            <Progress 
              percent={task.progress} 
              size="small" 
              status={task.progress === 100 ? "success" : "active"}
            />
          </div>
        )}
      </div>
    </List.Item>
  );

  return (
    <Card className="w-full mb-4">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        tabBarExtraContent={
          <Button type="link" size="small">查看更多</Button>
        }
      >
        <TabPane 
          tab={
            <Space>
              <span>进行中任务</span>
              {ongoingTasks.some(t => !t.completed) && (
                <Tag color="blue">{ongoingTasks.filter(t => !t.completed).length}</Tag>
              )}
            </Space>
          } 
          key="ongoing"
        >
          <List
            itemLayout="vertical"
            dataSource={ongoingTasks}
            renderItem={renderTaskItem}
            locale={{ emptyText: "暂无进行中任务" }}
          />
        </TabPane>
        
        <TabPane 
          tab={
            <Space>
              <span>新手任务</span>
              {newbieTasks.some(t => !t.completed) && (
                <Tag color="green">{newbieTasks.filter(t => !t.completed).length}</Tag>
              )}
            </Space>
          } 
          key="newbie"
        >
          <List
            itemLayout="vertical"
            dataSource={newbieTasks}
            renderItem={renderTaskItem}
            locale={{ emptyText: "暂无新手任务" }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TaskListCard;
