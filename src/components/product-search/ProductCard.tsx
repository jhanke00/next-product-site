export default function ProductCard({ product }: { product: any }) {
  return (
    <div className='flex-col p-24'>
      <h3 className={`mb-3 text-xl font-semibold`}>{product.name}</h3>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
    </div>
  );
}
