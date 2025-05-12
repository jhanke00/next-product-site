import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: any[] }) {
  if (!products.length) return <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>No products found.</p>;

  return (
    <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
