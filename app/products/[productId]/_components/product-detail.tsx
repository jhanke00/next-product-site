import { HydrateClient } from '@/src/config/trpc/server';
import { Tag } from 'lucide-react';
import { RatingStar } from '@/app/products/[productId]/_components/rating-star';
import { Product } from '@type/products';

type Props = {
  product: Product;
};

export const ProductDetail = async ({ product }: Props) => {
  return (
    <HydrateClient>
      <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'>
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-6'>
          <h1 className='text-3xl font-bold text-white mb-2'>Product Description</h1>
          <h3 className='text-2xl font-medium text-white/90'>{product.name}</h3>
        </div>

        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-baseline'>
              <span className='text-3xl font-bold text-gray-900'>${product.price}</span>
            </div>

            <div className='bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full'>
              In Stock: {product.countInStock}
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <h4 className='text-sm font-medium text-gray-500 uppercase tracking-wider'>Description</h4>
              <p className='mt-1 text-gray-800'>{product.description}</p>
            </div>

            <div className='flex flex-wrap gap-4'>
              <div className='bg-gray-50 rounded-lg p-3 flex-1'>
                <h4 className='text-xs font-medium text-gray-500 uppercase'>Category</h4>
                <div className='mt-1 flex items-center'>
                  <Tag className='h-5 w-5 text-gray-400 mr-2' />
                  <span className='text-gray-800 font-medium'>{product.category}</span>
                </div>
              </div>

              <div className='bg-gray-50 rounded-lg p-3 flex-1'>
                <h4 className='text-xs font-medium text-gray-500 uppercase'>Rating</h4>
                <div className='mt-1 flex items-center'>
                  <div className='flex'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <RatingStar key={star} isActive={star <= (product?.rating ?? 0)} />
                    ))}
                  </div>
                  <span className='ml-2 text-gray-600'>({product.numReviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};
