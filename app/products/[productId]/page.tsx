import ProductResources from '@/src/components/ProductResources/ProductResources';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';

type Product = (typeof largeData)[number];

const ProductDetail = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const { productId } = await params;
  const data: Product[] = [...largeData, ...smallData];
  const product = data.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-24 text-center'>
        <h1 className='text-2xl font-semibold'>Product not found</h1>
        <p className='mt-2 text-sm opacity-70'>We couldn&apos;t locate a product for the requested identifier.</p>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col gap-8 p-6 md:p-24'>
      <section className='max-w-3xl space-y-2'>
        <h1 className='text-3xl font-semibold'>{product.name}</h1>
        <p className='text-sm uppercase tracking-wide text-neutral-500'>Category: {product.category}</p>
        <dl className='mt-4 grid gap-3 text-sm text-neutral-700 md:grid-cols-2'>
          <div>
            <dt className='font-semibold text-neutral-900'>Price</dt>
            <dd>${product.price}</dd>
          </div>
          <div>
            <dt className='font-semibold text-neutral-900'>Rating</dt>
            <dd>{product.rating.toFixed ? product.rating.toFixed(2) : product.rating}</dd>
          </div>
          <div>
            <dt className='font-semibold text-neutral-900'>Reviews</dt>
            <dd>{product.numReviews}</dd>
          </div>
          <div>
            <dt className='font-semibold text-neutral-900'>Stock</dt>
            <dd>{product.countInStock}</dd>
          </div>
        </dl>
        <p className='mt-4 max-w-prose text-base text-neutral-700'>{product.description}</p>
      </section>

      <section className='max-w-3xl'>
        <ProductResources productId={product.id} />
      </section>
    </div>
  );
};

export default ProductDetail;
