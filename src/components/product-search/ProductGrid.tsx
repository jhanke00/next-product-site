import React from 'react';
import { Product } from '@/src/type/products';

type Props = {
  products: Product[];
};

const ProductGrid: React.FC<Props> = ({ products }) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto'>
      {products.map((product) => (
        <div key={product.id} className='border p-4 rounded shadow'>
          <h2 className='font-semibold'>{product.name}</h2>
          <p className='text-sm text-gray-500'>{product.category}</p>
          <p className='text-sm font-medium'>${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
