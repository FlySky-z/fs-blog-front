'use client';
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./globals.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import HeaderNav from "@/modules/navigator/header";
import { ConfigProvider, Layout, theme } from "antd";
import { ModalProvider } from "@/modules/auth/AuthModal";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <html lang="cn">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              algorithm: theme.defaultAlgorithm,
            }}
          >
            <ModalProvider>
              <Layout style={{ minHeight: '101vh', display: 'flex', flexDirection: 'column' }}>

                <HeaderNav />

                <Content style={{ paddingTop: 64, flex: '1 0 auto' }}>
                  <AuthInitializer>
                    {children}
                  </AuthInitializer>

                </Content>
                <Footer style={{ flexShrink: 0 }}>

                </Footer>

              </Layout>
            </ModalProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
