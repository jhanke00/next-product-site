'use client';
import { use } from 'react';
import { useCart } from '@/src/context/CartContext';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';

const ProductDetail = ({ params }: { params: Promise<{ productId: string }> }) => {
  const resolvedParams = use(params);
  const data = [...largeData, ...smallData];
  const product = data.find((item) => item.id === resolvedParams.productId);
  const { dispatch } = useCart();

  if (!product) {
    return <p>Product not Found</p>;
  }

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto px-4 py-8 md:py-12 lg:py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>
          {/* Product Image Section */}
          <div className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden'>
            {/* Placeholder for product image */}
            <div className='absolute inset-0 flex items-center justify-center text-gray-400'>
              <span className='text-6xl'>🖼️</span>
            </div>
          </div>

          {/* Product Details Section */}
          <div className='flex flex-col space-y-4'>
            <h1 className='text-2xl md:text-3xl lg:text-4xl font-semibold'>{product.name}</h1>

            <div className='flex items-center space-x-4'>
              <span className='text-2xl md:text-3xl font-bold'>${parseFloat(product.price).toFixed(2)}</span>
              <div className='flex items-center text-yellow-400'>
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
                <span className='ml-2 text-gray-600 text-sm'>({product.numReviews} reviews)</span>
              </div>
            </div>

            <div className='py-4 border-t border-b border-gray-200'>
              <p className='text-gray-700 text-base md:text-lg'>{product.description}</p>
            </div>

            <div className='space-y-2'>
              <p className='text-sm md:text-base flex justify-between'>
                <span className='text-gray-600'>Category:</span>
                <span className='font-medium'>{product.category}</span>
              </p>
              <p className='text-sm md:text-base flex justify-between'>
                <span className='text-gray-600'>Availability:</span>
                <span className={`font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                </span>
              </p>
            </div>

            <button
              className={`mt-6 w-full md:w-auto px-6 py-3 text-base md:text-lg font-semibold text-white rounded-lg 
                ${
                  product.countInStock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              onClick={() =>
                product.countInStock > 0 &&
                dispatch({
                  type: 'ADD_ITEM',
                  item: {
                    ...product,
                    price: parseFloat(product.price),
                    quantity: 1,
                  },
                })
              }
              disabled={product.countInStock === 0}
            >
              {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
