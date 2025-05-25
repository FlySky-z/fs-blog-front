'use client';
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import HeaderNav from "@/modules/navigator/header";
import { ConfigProvider, Layout, theme } from "antd";
import { ModalProvider } from "@/modules/auth/AuthModal";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { StyleProvider } from '@ant-design/cssinjs';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { theme: currentTheme } = useUIStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <html lang="cn" data-theme={currentTheme}>
      <body>
        <AntdRegistry>
          <StyleProvider layer>
            <ConfigProvider
              theme={{
                algorithm: currentTheme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
                components: {
                  Layout: {
                    siderBg: currentTheme === 'light' ? '#fff' : '#141414',
                  },
                },
              }}
            >
              <ModalProvider>
                <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                  <HeaderNav /> {/* Props removed as HeaderNav now uses the store */}

                  <Layout.Content style={{ paddingTop: 64 }}>
                    <AuthInitializer>
                      {children}
                    </AuthInitializer>
                  </Layout.Content>
                  
                </Layout>
              </ModalProvider>
            </ConfigProvider>
          </StyleProvider>

        </AntdRegistry>
      </body>
    </html>
  );
}
