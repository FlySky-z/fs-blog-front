import React from 'react';
import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import styles from './feedback-button.module.scss';

const FeedbackButton: React.FC = () => {
  // 这里可弹出反馈表单，暂用 alert 占位
  const handleClick = () => alert('反馈表单弹窗');
  return (
    <Button
      className={styles.feedbackButton}
      shape="circle"
      icon={<MessageOutlined />}
      onClick={handleClick}
    />
  );
};

export default FeedbackButton;
