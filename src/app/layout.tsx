import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '360智汇云',
    template: '%s | 360智汇云',
  },
  description:
    '中立、安全、可信的云计算服务平台，提供大模型、智能体、云存储、视频云等全栈云服务',
  keywords: [
    '360智汇云',
    '云计算',
    '大模型',
    '智能体',
    '对象存储',
    '视频云',
    'API市场',
    '分布式数据库',
  ],
  authors: [{ name: '360智汇云', url: 'https://zyun.360.cn' }],
  generator: '360智汇云',
  openGraph: {
    title: '360智汇云 | 中立、安全、可信的云计算服务平台',
    description:
      '提供大模型、智能体、云存储、视频云等全栈云服务，覆盖视频、物联网等多维度产品体系',
    url: 'https://zyun.360.cn',
    siteName: '360智汇云',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
