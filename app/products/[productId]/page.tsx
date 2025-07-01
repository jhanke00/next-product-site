'use client';
import { addItem } from '@/app/redux/features/cartSlice';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
const productDetail = ({ params }: { params: { productId: string } }) => {
  const data = [...largeData, ...smallData];

  const product = data.find((item) => item.id === params.productId);
  if (!product) {
    return <p>Product not Found</p>;
  }
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const addToCart = (selectedProduct: any) => {
    // Get current query parameters from URL
    const currentParams = searchParams ? searchParams.toString() : ''; // returns id=123&ref=abc
    const url = currentParams ? `/cartview?${currentParams}` : '/cartview';

    // Navigate to /cartview with query string
    router.push(url);
    dispatch(addItem(selectedProduct));
  };
  return (
    <div className='flex min-h-screen flex-col p-4 md:p-24'>
      <h1 className='text-2xl font-semibold'>Product Description</h1>
      <h3 className={`mb-3 text-xl`}>{product.name}</h3>
      <p className={`m-0 max-w-full text-sm opacity-50`}>Price: {product.price}</p>
      <p className={`m-0 max-w-full text-sm opacity-50`}>Description: {product.description}</p>
      <p className={`m-0 max-w-full text-sm opacity-50`}>Category: {product.category}</p>
      <p className={`m-0 max-w-full text-sm opacity-50`}>Rating: {product.rating}</p>
      <p className={`m-0 max-w-full text-sm opacity-50`}>Reviews: {product.numReviews}</p>
      <p className={`m-0 max-w-full text-sm opacity-50`}>Stock: {product.countInStock}</p>
      <div className='mt-4 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0'>
        <button
          onClick={() => router.push('/products')}
          className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 flex items-center justify-center'
        >
          <svg
            className='w-5 h-5 mr-2'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Back to Products
        </button>

        <button
          onClick={() => addToCart(product)}
          className='rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 flex items-center justify-center'
        >
          <svg
            className='w-5 h-5 mr-2'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default productDetail;
