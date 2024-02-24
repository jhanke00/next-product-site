import ProductData from '../../src/mock/small/products-new.json';
import ProductCard from '@/src/components/productCard';
import { Product } from '@/src/type/products';
export default function Products() {
  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-3 lg:text-left'>
          <>
            {ProductData.map((product: Product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </>
        </div>
      </div>
    </main>
  );
}
