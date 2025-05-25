import { Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';

interface NotificationButtonProps {
  hasNotification: boolean;
  onClick: () => void;
}

export default function NotificationButton({ hasNotification, onClick }: NotificationButtonProps) {
  return (
    <Button 
      icon={<BellOutlined />} 
      type="text" 
      shape="circle"
      onClick={onClick}
    />
  );
}
