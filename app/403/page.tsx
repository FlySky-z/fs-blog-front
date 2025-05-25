'use client';

import React from 'react';
import { Result, Button } from 'antd';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh'
    }}>
      <Result
        status="403"
        title="访问受限"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={[
          <Link href="/" key="back-home">
            <Button type="primary">返回首页</Button>
          </Link>,
          <Link href="/accountCenter" key="account-center">
            <Button>前往个人中心</Button>
          </Link>
        ]}
      />
    </div>
  );
}
