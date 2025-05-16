'use client';
import type { Metadata } from "next";
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./globals.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import HeaderNav from "@/components/ui/header-nav";
import { Button, ConfigProvider, Input, Space, theme } from "antd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn">
      <body>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
          }}
        >
          <HeaderNav />
          <AntdRegistry>
            <Content style={{paddingTop: 64}}>
              {children}
            </Content>
          </AntdRegistry>
          <Footer>

          </Footer>
        </ConfigProvider>
      </body>
    </html>
  );
}
