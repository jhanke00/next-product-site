import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import CartProvider from '@/src/context/CartContext';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shop Next',
  description: 'Shop Next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <CartProvider>
          <Toaster />
          <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow pt-16'>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
