'use client';
import React from 'react';
import { Button, Typography, Image } from 'antd';
import SidebarCard from './sidebar-card';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

interface WelcomeCardProps {
  title: string;
  content: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  content,
  imageUrl,
  buttonText,
  buttonLink,
}) => {
  return (
    <SidebarCard>
      {imageUrl && (
        <div style={{ marginBottom: 16 }}>
          <Image
            src={imageUrl}
            alt={title}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            preview={false}
          />
        </div>
      )}
      
      <Title level={4} style={{ marginTop: 0 }}>
        {title}
      </Title>
      
      <Paragraph style={{ marginBottom: buttonText ? 16 : 0 }}>
        {content}
      </Paragraph>
      
      {buttonText && buttonLink && (
        <Link href={buttonLink}>
          <Button type="primary" block>
            {buttonText}
          </Button>
        </Link>
      )}
    </SidebarCard>
  );
};

export default WelcomeCard;
