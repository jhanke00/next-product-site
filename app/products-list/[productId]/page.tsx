import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { ProductCard }  from '@components/ProductCard'

// Product Details page to display product information

const productDetail = ({ params }: { params: { productId: string } }) => {
  const data = [...largeData, ...smallData];
  const product = data.find((item) => item.id === params.productId);
  // Product not found while searching with productId params will display Product not found message
  if (!product) {
    return <p>Product not Found</p>;
  }

  return (
    <div className='flex min-h-screen flex-col p-24'>
      <a
        href='/products-list'
        className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
            &lt;
          </span>{' '}
          Back
        </h2>
      </a>
      <h1 className='mb-6 text-2xl font-semibold'>Product Description</h1>
      <hr/>
      {/* Product Card Component to Display Product Details */}
      <ProductCard product={product} />
    </div>
  );
};

export default productDetail;
