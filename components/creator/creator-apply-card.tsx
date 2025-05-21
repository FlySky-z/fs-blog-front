'use client';
import React from 'react';
import { Card, Typography, Progress, Space, List, Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface RequirementItem {
  id: string;
  text: string;
  fulfilled: boolean;
}

interface CreatorApplyCardProps {
  requirements: RequirementItem[];
  progress: number;
  canApply: boolean;
  alreadyApplied: boolean;
  isCreator: boolean;
}

const CreatorApplyCard: React.FC<CreatorApplyCardProps> = ({
  requirements,
  progress,
  canApply,
  alreadyApplied,
  isCreator
}) => {
  // 如果已经是创作者，显示成功状态
  if (isCreator) {
    return (
      <Card className="w-full mb-4">
        <Title level={5}>创作者资格</Title>
        <div className="text-center py-6">
          <CheckCircleFilled style={{ fontSize: 48, color: '#52c41a' }} />
          <Paragraph className="mt-4">
            <Text strong>恭喜！</Text>
            <Text>您已成功成为创作者，可以享受创作者专属权益</Text>
          </Paragraph>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-4">
      <Title level={5}>创作者申请</Title>
      
      <Paragraph>
        成为创作者可以获得更多曝光和收益机会。请满足以下条件：
      </Paragraph>
      
      <List
        size="small"
        bordered
        dataSource={requirements}
        renderItem={item => (
          <List.Item>
            <Space>
              {item.fulfilled 
                ? <CheckCircleFilled style={{ color: '#52c41a' }} /> 
                : <CloseCircleFilled style={{ color: '#ff4d4f' }} />
              }
              <Text>{item.text}</Text>
            </Space>
          </List.Item>
        )}
        className="mb-4"
      />
      
      <div className="mb-4">
        <Text>申请条件完成度：</Text>
        <Progress 
          percent={progress} 
          status={progress >= 100 ? "success" : "active"} 
          strokeColor={progress >= 100 ? "#52c41a" : "#1677ff"}
        />
      </div>
      
      {alreadyApplied ? (
        <div className="text-center">
          <Text type="secondary">已提交申请，请等待审核</Text>
        </div>
      ) : (
        <Button 
          type="primary" 
          block 
          disabled={!canApply}
        >
          {canApply ? "申请成为创作者" : "继续努力"}
        </Button>
      )}
    </Card>
  );
};

export default CreatorApplyCard;
