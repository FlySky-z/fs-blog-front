'use client';
import type { Metadata } from "next";
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./globals.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import HeaderNav from "@/components/ui/header-nav";
import { ConfigProvider, Layout, theme } from "antd";
import AuthWrapper from "@/modules/auth/AuthWrapper";
import { ModalProvider } from "@/modules/auth/ModalContext";
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
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
          }}
        >
          <ModalProvider>
            <AuthWrapper>
              <Layout>

                <HeaderNav />
                <AntdRegistry>
                  <Content style={{ paddingTop: 64 }}>
                    {children}
                  </Content>
                </AntdRegistry>
                <Footer>

                </Footer>
              </Layout>

            </AuthWrapper>
          </ModalProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
