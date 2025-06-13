import React from 'react';
import { Product } from '@/src/type/products';

type Props = {
  products: Product[];
  selected: string;
  onSelect: (val: string) => void;
};

const CategorySelect: React.FC<Props> = ({ products, selected, onSelect }) => {
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
      className='w-50 p-2 mb-4 border border-gray-300 rounded'
    >
      <option value=''>Select category</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
