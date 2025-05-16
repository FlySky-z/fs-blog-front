'use client';
import React, { useState } from 'react';
import { Tabs, TabsProps } from 'antd';
import SidebarCard from '@/components/sidebar/sidebar-card';
import styles from './quick-entry-tabs.module.css';
import Link from 'next/link';

export interface QuickEntry {
  key: string;
  label: string;
  url?: string;
  icon?: React.ReactNode;
  items?: Array<{
    key: string;
    label: string;
    url: string;
    icon?: React.ReactNode;
  }>;
}

interface QuickEntryTabsProps {
  entries: QuickEntry[];
  title?: string;
}

const QuickEntryTabs: React.FC<QuickEntryTabsProps> = ({
  entries,
  title
}) => {
  const [activeKey, setActiveKey] = useState(entries.length > 0 ? entries[0].key : '');

  const handleChange = (key: string) => {
    setActiveKey(key);
  };

  const items: TabsProps['items'] = entries.map(entry => ({
    key: entry.key,
    label: (
      <div className={styles.tabLabel}>
        {entry.icon && <span className={styles.tabIcon}>{entry.icon}</span>}
        {entry.label}
      </div>
    ),
    children: (
      <div className={styles.tabContent}>
        {entry.items && entry.items.map(item => (
          <Link key={item.key} href={item.url} className={styles.entryItem}>
            {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        ))}
        {!entry.items && entry.url && (
          <div className={styles.singleEntry}>
            点击<Link href={entry.url}>此处</Link>访问{entry.label}
          </div>
        )}
      </div>
    ),
  }));

  return (
    <SidebarCard title={title} className={styles.quickEntryCard}>
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        items={items}
        className={styles.tabs}
        animated={{ tabPane: true }}
      />
    </SidebarCard>
  );
};

export default QuickEntryTabs;
