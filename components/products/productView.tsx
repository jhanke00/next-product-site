import { Interface } from 'readline';
import type { Product } from '@type/products';

export default function ProductList({
  product,
}: Readonly<{
  product: Product;
}>) {
  return (
    <div
      key={product.id}
      className='group rounded-lg border border-transparent my-2 mx-2 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-300 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 shadow backdrop-blur-2xl backdrop-saturate-200'
    >
      <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
    </div>
  );
}
