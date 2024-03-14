'use client';
import { Product } from '@/src/type/products';
import { usePathname } from 'next/navigation';

export default function ProductDetails({ product }: { product: any }) {
  const urlPath = usePathname();
  const isProductListPage = urlPath?.endsWith('/products');
  return (
    <div>
      <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
      <p className={`m-0 text-sm opacity-50`}>Price: {product.price}</p>
      {!isProductListPage && (
        <>
          <p className={`m-0 text-sm opacity-50`}>Description: {product.description}</p>
          <p className={`m-0 text-sm opacity-50`}>Category: {product.category}</p>
          <p className={`m-0 text-sm opacity-50`}>Rating: {product.rating}</p>
          <p className={`m-0 text-sm opacity-50`}>Reviews: {product.numReviews}</p>
          <p className={`m-0 text-sm opacity-50`}>Stock: {product.countInStock}</p>
        </>
      )}
    </div>
  );
}
