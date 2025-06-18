import { headers } from 'next/headers';
import { Product } from '@type/products';

import { StatusCodes } from 'http-status-codes';

export default async function ProductDetail({ params }: { params: { productId: string } }) {
  const productId = params.productId;
  const host = headers().get('host');

  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  try {
    // Future improvement: instead of calling API endpoint, we could get product from database directly.
    // Here I wanted to show the usage of `headers()` to get the host dynamically
    const res = await fetch(`${protocol}://${host}/api/products/${productId}`);

    if (res.status === StatusCodes.NOT_FOUND) {
      return <p className='p-24'>Product not found.</p>;
    }

    if (!res.ok) throw new Error('Failed to fetch');
    const product: Product = await res.json();

    return (
      <div className='flex min-h-screen flex-col p-24'>
        <h1 className='text-2xl font-semibold'>Product Description</h1>
        <h3 className='mb-3 text-xl'>{product.name}</h3>
        <p className='m-0 max-w-[30ch] text-sm opacity-50'>Price: {product.price}</p>
        <p className='m-0 max-w-[30ch] text-sm opacity-50'>Description: {product.description}</p>
        <p className='m-0 max-w-[30ch] text-sm opacity-50'>Category: {product.category}</p>
        <p className='m-0 max-w-[30ch] text-sm opacity-50'>Rating: {product.rating}</p>
        <p className='m-0 max-w-[30ch] text-sm opacity-50'>Reviews: {product.numReviews}</p>
        <p className='m-0 max-w-[30ch] text-sm opacity-50'>Stock: {product.countInStock}</p>
      </div>
    );
  } catch (err) {
    console.error(err);
    return <p className='p-24'>Could not fetch product.</p>;
  }
}
