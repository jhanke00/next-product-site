import { CartProvider } from '../context/CartContext';
import '../styles/globals.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <div className='container'>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  );
}

export default MyApp;
