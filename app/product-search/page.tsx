'use client';

import { useState, useEffect } from 'react';
import { ProductSearchBar } from '../../src/components/product-search/ProductSearchBar';
import { ProductList } from '../../src/components/product-search/ProductList';
import { searchProducts } from '../../src/utils/product-search/searchUtils';
import { Product } from '../../src/type/products/types';

export default function ProductSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true);
      // Use the utility function to search products
      searchProducts(searchQuery)
        .then((results) => {
          setProducts(results);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error searching products:', error);
          setLoading(false);
        });
    } else {
      setProducts([]);
    }
  }, [searchQuery]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Product Search</h1>
      <ProductSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {loading ? (
        <div className='flex justify-center my-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}
