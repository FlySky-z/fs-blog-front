'use client';
import React from 'react';
import { Carousel, Image } from 'antd';
import SidebarCard from '@/components/sidebar/sidebar-card';
import styles from './promo-banner.module.css';
import Link from 'next/link';

export interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
  url: string;
}

interface PromoBannerProps {
  banners: BannerItem[];
  title?: string;
  autoplay?: boolean;
}

const PromoBanner: React.FC<PromoBannerProps> = ({
  banners,
  title,
  autoplay = true,
}) => {
  if (banners.length === 0) return null;

  return (
    <SidebarCard title={title} className={styles.promoBannerCard}>
      <Carousel 
        autoplay={autoplay && banners.length > 1}
        dots={{ className: styles.dots }}
        className={styles.carousel}
      >
        {banners.map((banner) => (
          <div key={banner.id}>
            <Link href={banner.url} className={styles.bannerLink}>
              <div className={styles.bannerContainer}>
                <Image 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  preview={false} 
                  className={styles.bannerImage}
                />
                <div className={styles.bannerTitle}>{banner.title}</div>
              </div>
            </Link>
          </div>
        ))}
      </Carousel>
    </SidebarCard>
  );
};

export default PromoBanner;
