'use client';
import React from 'react';
import { Grid } from 'antd';
import RocketToTop from '../header/rocket';

const { useBreakpoint } = Grid;

interface CreatorLayoutProps {
  children: React.ReactNode;
}

/**
 * 创作中心布局模板
 * 用于统一创作中心相关页面的布局和导航
 */
const CreatorLayout: React.FC<CreatorLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <RocketToTop />
    </>
  );
};

export default CreatorLayout;
