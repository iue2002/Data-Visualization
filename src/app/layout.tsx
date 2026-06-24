import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '企业销售数据可视化看板',
    template: '%s | 销售看板',
  },
  description:
    '中小型零售企业销售数据可视化监控系统，实时监控销售指标、区域对比、品类占比等关键数据。',
  keywords: [
    '数据可视化',
    '销售看板',
    '仪表盘',
    '商业智能',
    '销售分析',
    'ECharts',
  ],
  authors: [{ name: 'Enterprise Sales Dashboard Team' }],
  generator: 'Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}