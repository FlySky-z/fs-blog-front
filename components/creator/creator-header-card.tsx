'use client';
import React from 'react';
import { Card, Avatar, Typography, Space, Carousel, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './creator-header-card.module.scss';
import UserMeta from '@/components/molecules/user-meta';
import { useUIStore } from '@/store/uiStore';

const { Title, Text } = Typography;

interface CreatorAnnouncement {
  id: string;
  content: string;
  date: string;
}

interface CreatorHeaderCardProps {
  id: string;
  avatar?: string;
  nickname: string;
  level: number;
  announcements: CreatorAnnouncement[];
  style?: React.CSSProperties;
}

const CreatorHeaderCard: React.FC<CreatorHeaderCardProps> = ({
  id,
  avatar,
  nickname,
  level,
  announcements,
  style,
}) => {

  return (
    <Card className={styles.cardContainer} style={style}>
      <div className={styles.headerWrapper}>
        <UserMeta
          id={id}
          username={nickname}
          avatar={avatar}
          level={level}
        ></UserMeta>

        <div className={styles.announcementSection} >
          <div
            className={styles.announcementContainer}
            style={{
              background: useUIStore((state) => state.theme) === 'dark' ? '#1f1f1f' : '#f6f6f6',
            }}
          >
            <Text type="secondary" className={styles.announcementTitle}>创作公告</Text>
            <Carousel
              autoplay
              dots={false}
              arrows={true}
              draggable={true}
              className={styles.carousel}
            >
              {announcements.map(announcement => (
                <div key={announcement.id} className={styles.announcementItem}>
                  <Space style={{ overflow: 'hidden', width: '100%' }}>
                    <Text
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '70%',
                      }}
                    >
                      {announcement.content}
                    </Text>
                    <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
                      {announcement.date}
                    </Text>
                  </Space>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreatorHeaderCard;
