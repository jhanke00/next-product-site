'use client';

import { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?q=${query}`);
        if (!res.ok) {
          const errorData = await res.json();
          setProducts([]);
          console.warn(errorData.message);
          return;
        }

        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error('Fetch failed:', err);
        setProducts([]);
      }
    };

    const delay = setTimeout(fetchProducts, 300);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <>
      <input
        type='text'
        placeholder='Search products...'
        className='w-full p-3 border border-gray-300 rounded-lg mb-6'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ProductGrid products={products} />
    </>
  );
}
