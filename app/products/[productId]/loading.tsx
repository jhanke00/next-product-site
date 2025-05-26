import { ProductDetailSkeleton } from '@/app/products/[productId]/_components/product-detail-skeleton';
import { ReviewsHeadingSkeleton } from '@/app/products/[productId]/_components/reviews-heading-skeleton';
import { ReviewsSkeleton } from '@/app/products/[productId]/_components/reviews-skeleton';

export default function Loading() {
  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100'>
      <div className='container mx-auto px-4 py-8 md:px-6 lg:px-8'>
        <div className='relative'>
          <div className='relative z-10 grid gap-8 md:gap-12'>
            <div className='transform transition-all duration-300'>
              <ProductDetailSkeleton />
            </div>

            <div className='transform transition-all duration-300'>
              <ReviewsHeadingSkeleton />
              <ReviewsSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
