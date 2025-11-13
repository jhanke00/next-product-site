import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { notFound } from 'next/navigation';

const productDetail = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const resolvedParams = await params;
  const data = [...largeData, ...smallData];
  const product = data.find((item) => item.id === resolvedParams.productId);
  if (!product) notFound();

  return (
    <div className='flex min-h-screen flex-col p-24'>
      <h1 className='text-2xl font-semibold'>Product Information</h1>
      <h3 className={`mb-3 text-xl `}>{product.name}</h3>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: ₹{product.price}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
    </div>
  );
};

export default productDetail;
