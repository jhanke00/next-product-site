import smallData from '@/src/mock/small/products.json';
import ProductLearningResources from '@/src/components/learning/ProductLearningResources';

const productDetail = async ({ params }: { params: { productId: string } }) => {
  const resolvedParams = params;
  const allProducts = smallData;
  const product = allProducts.find((item) => item.id === resolvedParams.productId);
  if (!product) {
    return <p>Product not Found</p>;
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Product Information */}
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>{product.name}</h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Product Details</h2>
              <div className='space-y-2'>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-medium'>Price:</span> ${product.price}
                </p>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-medium'>Category:</span> {product.category}
                </p>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-medium'>Rating:</span> {product.rating}/5 ({product.numReviews} reviews)
                </p>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-medium'>In Stock:</span> {product.countInStock} units
                </p>
              </div>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Description</h2>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{product.description}</p>
            </div>
          </div>
        </div>

        {/* Learning Resources */}
        <ProductLearningResources productId={resolvedParams.productId} userId='user_001' />
      </div>
    </div>
  );
};

export default productDetail;
