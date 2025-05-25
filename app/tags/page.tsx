'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
const TagsPage: React.FC = () => {
    const router = useRouter();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/');
        }, 2000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div style={{ textAlign: 'center', marginTop: '20vh', fontSize: 20 }}>
            开发中，稍后开放
        </div>
    );
};

export default TagsPage;