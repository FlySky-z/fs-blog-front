'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Result } from 'antd';

export default function NotFound() {
  const router = useRouter();
  return (
    <Result
      status="404"
      title="404"
      subTitle="你好像迷路了，页面不存在"
      extra={<Button type="primary" onClick={() => router.push('/')}>直接回家</Button>}
    />
  );
}
