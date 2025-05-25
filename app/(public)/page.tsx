'use client';
import FeedLayout from "@/components/templates/feed-layout";
import HomeFeed from "@/modules/article/article-feed";
import HomeSidebar from "@/modules/sidebar/home-sidebar";
import RocketToTop from "@/components/header/rocket";
import { useUserStore } from "@/store/userStore";

export default function Home() {
  // 根据用户登录状态来传递不同的props
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  return (
    <main>
      <FeedLayout
        main={<HomeFeed title="推荐内容" />}
        sidebar={<HomeSidebar isLoggedIn={isLoggedIn} />}
      />
      <RocketToTop />
    </main>
  );
}
