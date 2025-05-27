'use client';

import React, { useEffect } from 'react';
import { Result, Button } from 'antd';
import Link from 'next/link';
import { useAuthModal } from '@/modules/auth/AuthModal';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
    const { openLoginModal, isLoggedIn } = useAuthModal();
    const router = useRouter();
    
    // 监听登录状态变化
    useEffect(() => {
        if (isLoggedIn) {
            // 从 seesionStorage 获取重定向 URL
            const returnUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
            // 清除重定向 URL
            sessionStorage.removeItem('redirectAfterLogin');
            router.push(returnUrl);
        }
    }, [isLoggedIn, router]);
    
    // 处理登录按钮点击，打开登录模态框
    const handleLogin = () => {
        openLoginModal();
    };
    
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
                    <Button key="login" onClick={handleLogin}>登录</Button>
                ]}
            />
        </div>
    );
}
