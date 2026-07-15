import { CartProvider } from '../context/CartContext';
import SiteHeader from '@/components/SiteHeader';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navLinks = [
    {
      id: 'electronics',
      label: 'Electronics',
      href: `/products/category/electronics`,
    },
    {
      id: 'home',
      label: 'Home',
      href: `/products/category/home`,
    },
    {
      id: 'jewelery',
      label: 'Jewellery',
      href: `/products/category/jewelery`,
    },
    {
      id: 'grocery',
      label: 'Grocery',
      href: `/products/category/grocery`,
    },
  ];

  return (
    <html lang='en'>
      <body>
        <CartProvider>
          <SiteHeader links={navLinks} />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
