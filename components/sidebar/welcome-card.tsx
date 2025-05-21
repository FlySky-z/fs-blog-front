'use client';
import React from 'react';
import { Button, Typography, Image } from 'antd';
import SidebarCard from './sidebar-card';
import Link from 'next/link';
import ImageCard from '@/components/atoms/image-card';

const { Title, Paragraph } = Typography;

interface WelcomeCardProps {
  title: string;
  content: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  isLoggedIn?: boolean;
  userInfo?: {
    name: string;
    avatar: string;
    description?: string;
  };
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  content,
  imageUrl,
  buttonText,
  buttonLink,
  isLoggedIn,
  userInfo,
}) => {
  return (
    <SidebarCard>
      {imageUrl && (
        <ImageCard
          image_url={imageUrl}
          ratio={16 / 9}
          style={{
            borderRadius: '8px',
            marginBottom: 16,
          }}
        ></ImageCard>
      )}

      {/* 登录前显示登录，登录后显示用户基本信息 */}
      {!isLoggedIn ?
        (
          <>
            <Title level={4} style={{ marginTop: 0 }}>
              {title}
            </Title>

            <Paragraph style={{ marginBottom: buttonText ? 16 : 0 }}>
              {content}
            </Paragraph>

            {buttonText && buttonLink && (
              <Link href={buttonLink}>
                <Button type="primary" block onClick={() => {
                  
                }}>
                  {buttonText}
                </Button>
              </Link>
            )}
          </>
        ) :
        (<>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Image
              src={userInfo?.avatar}
              width={48}
              height={48}
              style={{ borderRadius: '50%', marginRight: 16 }}
              alt="用户头像"
              preview={false}
            />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {userInfo?.name}
              </Title>
              {userInfo?.description && (
                <Paragraph style={{ margin: 0, color: '#888', fontSize: 14 }}>
                  {userInfo.description}
                </Paragraph>
              )}
            </div>
          </div>
        </>)
      }

    </SidebarCard >
  );
};

export default WelcomeCard;
