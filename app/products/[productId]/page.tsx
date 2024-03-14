'use client';
import { Product } from '@/src/type/products';
import smallAmtProducts from '@/src/mock/small/products.json';
import largeAmtProducts from '@/src/mock/large/products.json';
import Link from 'next/link';
import styles from '@/app/products/products.module.css';
import ProductDetails from '@/src/components/Products/productDetails';

export default function ProductDetail({ params }: { params: { productId: string } }) {
  const products = [...smallAmtProducts, ...largeAmtProducts];
  const selectedProduct = products.find((i) => i.id === params.productId);
  return (
    <div className='flex min-h-screen flex-col p-24 font-mono'>
      <div className='mb-32'>
        <Link href={'../products'} className={styles.arrowLeft} />
        <Link href={'../products'} className={styles.pl8}>
          Go to Products
        </Link>
      </div>
      {selectedProduct && <ProductDetails product={selectedProduct} />}
      {!selectedProduct && <h3 className={`mb-3 text-2xl font-semibold`}>Invalid Product</h3>}
    </div>
  );
}
