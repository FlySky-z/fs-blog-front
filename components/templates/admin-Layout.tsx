'use client';
import React, { useState } from 'react';
import { Layout } from 'antd';
import SidebarMenu from '../admin/SidebarMenu';
import ArticleManagePanel from '../admin/ArticleManagePanel';
import AccountManagePanel from '../admin/AccountManagePanel';
import AbnormalDetectPanel from '../admin/AbnormalDetectPanel';
import DashBoardPanel from '../admin/DashBoardPanel';
import styles from './admin-layout.module.scss';
import RocketToTop from '../header/rocket';

const { Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 64,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};
const AdminLayout: React.FC = () => {
  const [activeKey, setActiveKey] = useState('article');
  return (
    <Layout hasSider className={styles.adminLayout}>
      <Sider
        style={siderStyle}
      >
        <SidebarMenu activeKey={activeKey} onChange={setActiveKey} />
      </Sider>
      <Layout>
        <Content className={styles.content}>
          {activeKey === 'dashboard' && <DashBoardPanel />}
          {activeKey === 'article' && <ArticleManagePanel />}
          {activeKey === 'account' && <AccountManagePanel />}
          {activeKey === 'abnormal' && <AbnormalDetectPanel />}
        </Content>
      </Layout>
      <RocketToTop />
    </Layout>
  );
};

export default AdminLayout;
