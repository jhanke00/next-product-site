'use client';
import smallAmtProducts from '@/src/mock/small/products.json';
import largeAmtProducts from '@/src/mock/large/products.json';
import Link from 'next/link';
import styles from '@/app/products/products.module.css';

export default function ProductDetail({ params }: { params: { productId: string } }) {
  const products = [...smallAmtProducts, ...largeAmtProducts];
  const product = products.find((i) => i.id === params.productId);
  return (
    <div className='flex min-h-screen flex-col p-24 font-mono'>
      <div className='mb-32'>
        <Link href={'../products'} className={styles.arrowLeft} />
        <Link href={'../products'} className={styles.pl8}>
          Go to Products
        </Link>
      </div>
      {product && (
        <div>
          <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
          <p className={`m-0 text-sm opacity-50`}>Price: {product.price}</p>
          <p className={`m-0 text-sm opacity-50`}>Description: {product.description}</p>
          <p className={`m-0 text-sm opacity-50`}>Category: {product.category}</p>
          <p className={`m-0 text-sm opacity-50`}>Rating: {product.rating}</p>
          <p className={`m-0 text-sm opacity-50`}>Reviews: {product.numReviews}</p>
          <p className={`m-0 text-sm opacity-50`}>Stock: {product.countInStock}</p>
        </div>
      )}
      {!product && <h3 className={`mb-3 text-2xl font-semibold`}>Invalid Product</h3>}
    </div>
  );
}
