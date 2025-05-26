'use client';
import HeaderComponent from '@/components/header/header-nav';
import { useAuthModal } from '@/modules/auth/AuthModal';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';

export default function HeaderNav() {
    const { 
        isLoggedIn,
        username,
        openLoginModal,
        openRegisterModal,
        logout
    } = useAuthModal();
    
    const router = useRouter();
    const pathname = usePathname();
    const { updateKeywordAndUrl } = useSearchStore();

    // 处理搜索功能
    const handleSearch = (keyword: string) => {
        if (!keyword.trim()) return;
        
        // 如果当前已经在搜索页面
        if (pathname.startsWith('/search')) {
            // 使用Store更新搜索状态
            updateKeywordAndUrl(keyword);
        } else {
            // 否则跳转到搜索页面
            router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
        }
    };

    return (
        <HeaderComponent 
            isLogin={isLoggedIn}
            user={{
                name: username? username : "未命名",
            }}
            openLoginModal={openLoginModal}
            openRegisterModal={openRegisterModal}
            handleSearch={handleSearch}
            logout={logout}
        />
    );
}
