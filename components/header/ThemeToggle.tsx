import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

interface ThemeToggleProps {
  currentTheme: string;
  toggleTheme: () => void;
}

export default function ThemeToggle({ currentTheme, toggleTheme }: ThemeToggleProps) {
  return (
    <Button
      icon={currentTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
      onClick={toggleTheme}
      type="text"
      shape="circle"
    />
  );
}
