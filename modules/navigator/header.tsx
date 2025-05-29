'use client';
import HeaderComponent from '@/components/header/header-nav';
import { useAuthModal } from '@/modules/auth/AuthModal';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';
import { useUserStore } from '@/store/userStore';

export default function HeaderNav() {
    const { 
        isLoggedIn,
        username,
        openLoginModal,
        openRegisterModal,
        logout
    } = useAuthModal();
    
    // 从userStore获取用户信息
    const { userInfo, isLoggedIn: isUserStoreLoggedIn } = useUserStore();
    
    const router = useRouter();
    const pathname = usePathname();
    const { updateKeywordAndUrl } = useSearchStore();

    // 处理搜索功能
    const handleSearch = (keyword: string) => {
        if (!keyword.trim()) return;
        
        const trimmedKeyword = keyword.trim();
        
        // 如果当前已经在搜索页面
        if (pathname.startsWith('/search')) {
            // 使用Store更新搜索状态并更新URL
            updateKeywordAndUrl(trimmedKeyword);
        } else {
            // 否则跳转到搜索页面
            router.push(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
        }
    };

    return (
        <HeaderComponent 
            isLogin={isLoggedIn || isUserStoreLoggedIn}
            isAdmin={isUserStoreLoggedIn && userInfo ? userInfo.role === 1 : false}
            user={{
                name: isUserStoreLoggedIn && userInfo ? userInfo.username || userInfo.id.toString() : (username || "未命名"),
                avatar: isUserStoreLoggedIn && userInfo ? userInfo.avatar_url : undefined
            }}
            openLoginModal={openLoginModal}
            openRegisterModal={openRegisterModal}
            handleSearch={handleSearch}
            logout={logout}
        />
    );
}
