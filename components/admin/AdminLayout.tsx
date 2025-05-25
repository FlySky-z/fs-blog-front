'use client';
import React, { useState } from 'react';
import { Layout } from 'antd';
import SidebarMenu from './SidebarMenu';
import ArticleManagePanel from './ArticleManagePanel';
import AccountManagePanel from './AccountManagePanel';
import AbnormalDetectPanel from './AbnormalDetectPanel';
import FeedbackButton from './FeedbackButton';
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
          {activeKey === 'article' && <ArticleManagePanel />}
          {activeKey === 'account' && <AccountManagePanel />}
          {activeKey === 'abnormal' && <AbnormalDetectPanel />}
        </Content>
      </Layout>
      <RocketToTop />
      <FeedbackButton />
    </Layout>
  );
};

export default AdminLayout;
