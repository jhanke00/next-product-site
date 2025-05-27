import { apiServer, HydrateClient } from '@/src/config/trpc/server';
import { Reviews } from '@/app/products/[productId]/_components/reviews';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/app/products/[productId]/_components/product-detail';
import { ReviewsHeading } from '@/app/products/[productId]/_components/reviews-heading';

const productDetail = async ({ params }: { params: { productId: string } }) => {
  const { product } = await apiServer.product.getProductById({ productId: params.productId });

  if (!product) {
    notFound();
  }

  return (
    <HydrateClient>
      <div className='flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100'>
        <div className='container mx-auto px-4 py-8 md:px-6 lg:px-8'>
          <div className='relative'>
            <div className='relative z-10 grid gap-8 md:gap-12'>
              <div className='transform transition-all duration-300'>
                <ProductDetail product={product} />
              </div>

              <div className='transform transition-all duration-300'>
                <ReviewsHeading />

                <Reviews productId={params.productId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default productDetail;
