'use client';
import FeedLayout from "@/components/templates/feed-layout";
import HomeFeed from "@/modules/article/article-feed";
import HomeSidebar from "@/modules/sidebar/home-sidebar";
import RocketToTop from "@/components/header/rocket";

export default function Home() {
  return (
    <main>
      <FeedLayout
        main={<HomeFeed title="推荐内容" />}
        sidebar={<HomeSidebar/>}
      />
      <RocketToTop />
    </main>
  );
}
