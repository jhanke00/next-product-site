'use client';
import largeData from '@/src/mock/large/products.json';
import { useRouter } from 'next/navigation';

const skuDetail = ({ params }: { params: { productId: string } }) => {
  const data = [...largeData];
  const router = useRouter();
  let product;
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === params.productId) {
      product = data[i];
      break;
    }
  }

  if (!product) {
    return <p>No products are active now</p>;
  }

  return (
    <div className={`flex min-h-screen flex-col p-24`}>
      <h3 className={`mb-3 text-2xl font-semibold `}>{product.name}</h3>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {Math.round(product.rating)}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
      <button className={`pt-4 underline`} onClick={() => router.back()}>
        Navigate to Main Page
      </button>
    </div>
  );
};

export default skuDetail;
