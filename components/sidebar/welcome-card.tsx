'use client';
import React from 'react';
import { Button, Typography, Image, Avatar } from 'antd';
import SidebarCard from './sidebar-card';
import { UserOutlined } from '@ant-design/icons';
import ImageCard from '@/components/atoms/image-card';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './welcome-card.module.scss';

const { Title, Paragraph } = Typography;

interface WelcomeCardProps {
  title: string;
  content: string;
  imageUrl?: string;
  buttonText?: string;
  openLoginModal?: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  content,
  imageUrl,
  buttonText,
  openLoginModal,
}) => {
  const router = useRouter();
  // 获取用户信息
  var userInfo = useUserStore((state) => state.userInfo);
  // 获取登录状态
  var isLoggedIn = useUserStore((state) => state.isLoggedIn);

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

            {buttonText && (
              <Button type="primary" block onClick={openLoginModal}>
                {buttonText}
              </Button>
            )}
          </>
        ) : (
          <Link
            href={'/accountCenter'}
            className={styles.welcomeCardInfo}
          >
            <Avatar
              src={userInfo?.avatar_url || undefined}
              icon={!userInfo?.avatar_url && <UserOutlined />}
              style={{ marginRight: 16, width: 40, height: 40, flexShrink: 0 }}
            />
            <div>
              <Title
                level={5}
                style={{ margin: 0, transition: 'color 0.2s' }}
                className={styles.welcomeCardUsername}
              >
                {userInfo?.username}
              </Title>
              {userInfo?.username && (
                <Paragraph style={{ margin: 0, color: '#888', fontSize: 14 }}
                  ellipsis={{
                    rows: 2,
                  }}>
                  {userInfo.abstract}
                </Paragraph>
              )}
            </div>
          </Link>
        )
      }

    </SidebarCard >
  );
};

export default WelcomeCard;
