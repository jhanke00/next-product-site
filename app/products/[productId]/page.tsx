import Link from 'next/link';
import Navigation from '@/src/components/Navigation';
import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import { AddToCartButton } from '@/src/components/AddToCartButton';
import { Product } from '@/src/type/products';
import { LearningResource } from '@/src/type/resources';

async function fetchProduct(productId: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/products?id=${encodeURIComponent(productId)}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.product as Product;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

async function fetchResources(productId: string): Promise<LearningResource[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/products/${productId}/resources`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.resources as LearningResource[];
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    return [];
  }
}

const productDetail = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const { productId } = await params;
  const product = await fetchProduct(productId);
  const resources = product ? await fetchResources(product.id) : [];

  if (!product) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navigation />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-20'>
            <div className='text-gray-400 text-6xl mb-4'>❌</div>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>Product Not Found</h1>
            <p className='text-gray-600 mb-8'>The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href='/products'
              className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 inline-flex items-center'
            >
              <ArrowLeftIcon className='w-5 h-5 mr-2' />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className='text-yellow-400'>
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key='half' className='text-yellow-400'>
          ☆
        </span>
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className='text-gray-300'>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb */}
        <nav className='flex items-center space-x-2 text-sm text-gray-500 mb-8'>
          <Link href='/' className='hover:text-gray-700'>
            Home
          </Link>
          <span>/</span>
          <Link href='/products' className='hover:text-gray-700'>
            Products
          </Link>
          <span>/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className='hover:text-gray-700'>
            {product.category}
          </Link>
          <span>/</span>
          <span className='text-gray-900'>{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link href='/products' className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-8'>
          <ArrowLeftIcon className='w-5 h-5 mr-2' />
          Back to Products
        </Link>

        <div className='lg:grid lg:grid-cols-2 lg:gap-12'>
          {/* Product Image Placeholder */}
          <div className='mb-8 lg:mb-0'>
            <div className='bg-gray-200 rounded-lg aspect-square flex items-center justify-center'>
              <div className='text-center text-gray-400'>
                <div className='text-6xl mb-4'>📦</div>
                <p className='text-sm'>Product Image</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>{product.name}</h1>

              {/* Price and Stock */}
              <div className='flex items-center justify-between mb-4'>
                <div className='text-4xl font-bold text-blue-600'>${parseFloat(product.price).toFixed(2)}</div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.countInStock > 10
                      ? 'text-green-700 bg-green-100'
                      : product.countInStock > 0
                        ? 'text-yellow-700 bg-yellow-100'
                        : 'text-red-700 bg-red-100'
                  }`}
                >
                  {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                </div>
              </div>

              {/* Rating */}
              <div className='flex items-center space-x-2 mb-4'>
                <div className='flex items-center'>{renderStars(product.rating)}</div>
                <span className='text-gray-600'>
                  {product.rating.toFixed(1)} ({product.numReviews} reviews)
                </span>
              </div>

              {/* Category */}
              <div className='mb-6'>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className='inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200'
                >
                  {product.category}
                </Link>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>Description</h3>
              <p className='text-gray-700 leading-relaxed'>{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className='space-y-4 pt-6'>
              <AddToCartButton product={product} size='lg' className='w-full' showQuantity={true} />

              <button className='w-full flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200'>
                <HeartIcon className='w-5 h-5 mr-2' />
                Add to Wishlist
              </button>
            </div>

            {/* Product Stats */}
            <div className='grid grid-cols-2 gap-4 pt-6 border-t border-gray-200'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>{product.rating.toFixed(1)}</div>
                <div className='text-sm text-gray-600'>Average Rating</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>{product.numReviews}</div>
                <div className='text-sm text-gray-600'>Total Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Resources */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Learning Resources</h2>
          {resources.length === 0 ? (
            <div className='bg-gray-100 border border-gray-200 rounded-xl p-6 text-gray-600'>
              No tutorials or guides have been added for this product yet.
            </div>
          ) : (
            <div className='space-y-4'>
              {resources.map((resource) => (
                <div key={resource.id} className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                    <div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-2'>{resource.title}</h3>
                      <p className='text-gray-600 mb-3'>{resource.description || 'No description provided.'}</p>
                      <a
                        href={resource.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 font-medium'
                      >
                        View Tutorial
                      </a>
                    </div>
                    <div className='text-sm text-gray-500 whitespace-nowrap'>
                      Added on {new Date(resource.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products Section */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-gray-900 mb-8'>More in {product.category}</h2>
          <div className='text-center text-gray-600 py-8'>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200'
            >
              Browse {product.category} Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default productDetail;
