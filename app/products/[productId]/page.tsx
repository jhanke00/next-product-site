import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import ReviewSection from '@/src/components/reviews/ReviewSection';

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetail({ params }: PageProps) {
  const { productId } = await params;

  const data = [...(largeData as any[]), ...(smallData as any[])];
  const product = data.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className='flex min-h-screen flex-col p-24'>
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col p-24 gap-4'>
      <h1 className='text-2xl font-semibold'>Product Description</h1>
      <h3 className='mb-3 text-xl'>{product.name}</h3>
      <p className='text-sm opacity-70'>Price: {product.price}</p>
      <p className='text-sm opacity-70'>Description: {product.description}</p>
      <p className='text-sm opacity-70'>Category: {product.category}</p>
      <p className='text-sm opacity-70'>Rating: {Number(product.rating).toFixed(1)}</p>
      <p className='text-sm opacity-70'>Reviews: {product.numReviews}</p>
      <p className='text-sm opacity-70'>Stock: {product.countInStock}</p>

      <ReviewSection productId={product.id} />
    </div>
  );
}
