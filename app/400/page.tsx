'use client';

import React from 'react';
import { Result, Button } from 'antd';
import Link from 'next/link';
import { useAuthModal } from '@/modules/auth/AuthModal';

export default function ForbiddenPage() {
    const { openLoginModal } = useAuthModal();
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
        }}>
            <Result
                status="info"
                title="需要登录"
                subTitle="你需要登录才能查看这个页面。"
                extra={[
                    <Link href="/" key="back-home">
                        <Button type="primary">返回首页</Button>
                    </Link>,
                    <Link href="/accountCenter" key="account-center">
                        <Button onClick={() => {
                            openLoginModal
                        }}>登录</Button>
                    </Link>,
                ]}
            />
        </div>
    );
}
