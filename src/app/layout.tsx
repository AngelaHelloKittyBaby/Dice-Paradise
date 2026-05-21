import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PreventBrowserZoom } from '@/components/layout';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '投骰乐园 - 快艇骰子游戏',
  description: '经典快艇骰子游戏网页版，支持单人练习、本地多人、在线联机等多种模式',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <PreventBrowserZoom />
        {children}
      </body>
    </html>
  );
}
