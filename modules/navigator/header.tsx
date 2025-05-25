'use client';
import HeaderComponent from '@/components/header/header-nav';
import { useAuthModal } from '@/modules/auth/AuthModal';

export default function HeaderNav() {
    const { 
        isLoggedIn,
        username,
        openLoginModal,
        openRegisterModal,
        logout
    } = useAuthModal();

    return (
        <HeaderComponent 
            isLogin={isLoggedIn}
            user={{
                name: username? username : "未命名",
            }}
            openLoginModal={openLoginModal}
            openRegisterModal={openRegisterModal}
            logout={logout}
        />
    );
}
