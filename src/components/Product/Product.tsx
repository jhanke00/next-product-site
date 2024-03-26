import { Product } from '@/src/type/products';
import Link from 'next/link';
import React from 'react';

type ProductProps = {
  product: Product;
};

const ProductItem: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
      <Link href={`/products/${product.id}`}>
        <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
      </Link>
    </div>
  );
};

export default ProductItem;
