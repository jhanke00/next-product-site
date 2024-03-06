import type { Metadata } from 'next';
import contactUs from '../../src/components/ContactUs';
export const metadata: Metadata = {
  title: 'Products',
  description: 'Example product page with mock data',
};

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='eng'>
      <body>{children}</body>
    </html>
  );
}
