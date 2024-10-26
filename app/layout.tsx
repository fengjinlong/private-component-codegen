import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import localFont from 'next/font/local';

import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'ai-friendly-clean-business-component-template',
  description: 'AI友好的整洁业务组件模板'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <AntdRegistry>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </AntdRegistry>
    </html>
  );
}
