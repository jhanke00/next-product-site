import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/src/contexts/CartContext';
import { CheckoutProvider } from '@/src/contexts/CheckoutContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Product Site - E-Commerce',
  description: 'A modern e-commerce site built with Next.js',
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
          <CheckoutProvider>{children}</CheckoutProvider>
        </CartProvider>
      </body>
    </html>
  );
}
