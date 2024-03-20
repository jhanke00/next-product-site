import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Header from '/components/common/header';
import Footer from '/components/common/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Search & Filter Demo App',
  description: 'Product Search & Filter Demo App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
