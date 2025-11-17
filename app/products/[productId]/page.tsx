import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import ProductDetails from './productdetails';
import { Product } from '@/src/type/products';

const productDetail = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const resolvedParams = await params;
  const data = [...largeData, ...smallData];
  const p = data.find((item) => item.id === resolvedParams.productId);
  const product: Product | null = p ? { ...p, price: Number.parseFloat(p.price) } : null;
  if (!product) {
    return <p>Product not Found</p>;
  }

  return <ProductDetails {...product} />;
};

export default productDetail;
