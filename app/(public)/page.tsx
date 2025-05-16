import FeedLayout from "@/components/templates/feed-layout";
import HomeFeed from "@/modules/article/article-feed";
import HomeSidebar from "@/modules/sidebar/home-sidebar";
import RocketToTop from "@/components/ui/rocket";

export default function Home() {
  // 这里可以根据用户登录状态来传递不同的props
  const isLoggedIn = false; // 实际应用中应该从上下文或认证服务获取
  
  return (
    <main>
      <FeedLayout
        main={<HomeFeed title="推荐阅读" />}
        sidebar={<HomeSidebar isLoggedIn={isLoggedIn} />}
      />
      <RocketToTop />
    </main>
  );
}
