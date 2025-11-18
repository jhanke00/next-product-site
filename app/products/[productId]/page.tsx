import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { AddToCartButton } from '@/src/components/products/AddToCartButton';
import Link from 'next/link';
import { Product } from '@/src/type/products';

const productDetail = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const resolvedParams = await params;
  const data = [...largeData, ...smallData] as Product[];
  const product = data.find((item) => item.id === resolvedParams.productId);

  if (!product) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-24'>
        <h1 className='text-2xl font-semibold mb-4'>Product Not Found</h1>
        <Link href='/products' className='text-blue-600 hover:underline'>
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col p-24'>
      <Link href='/products' className='text-blue-600 hover:underline mb-6'>
        ← Back to Products
      </Link>

      <div className='max-w-4xl'>
        <h1 className='text-3xl font-bold mb-6'>{product.name}</h1>

        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h2 className='text-xl font-semibold mb-4'>Product Details</h2>
              <div className='space-y-2'>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-semibold'>Price:</span> ${product.price}
                </p>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-semibold'>Category:</span> {product.category}
                </p>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-semibold'>Rating:</span> {product.rating} / 5
                </p>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-semibold'>Reviews:</span> {product.numReviews}
                </p>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-semibold'>Stock:</span>{' '}
                  <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.countInStock > 0 ? `${product.countInStock} available` : 'Out of stock'}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h2 className='text-xl font-semibold mb-4'>Description</h2>
              <p className='text-gray-700 dark:text-gray-300'>{product.description}</p>
            </div>
          </div>
        </div>

        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default productDetail;
