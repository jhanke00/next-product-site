'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/src/type/products';
import rawProducts from '@/src/mock/small/products.json' assert { type: 'json' };
import SearchBar from '@/src/components/product-search/SearchBar';
import CategorySelect from '@/src/components/product-search/CategorySelect';
import ProductGrid from '@/src/components/product-search/ProductGrid';
import { filterByName, filterByCategory } from '@/src/utils/product-search/filterProducts';

const productsData = rawProducts as Product[];

export default function ProductSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData);

  useEffect(() => {
    let results: Product[] = productsData;

    if (searchTerm.length >= 5) {
      results = filterByName(results, searchTerm);
    }

    if (selectedCategory) {
      results = filterByCategory(results, selectedCategory);
    }

    setFilteredProducts(results);
  }, [searchTerm, selectedCategory]);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Product Search</h1>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <CategorySelect products={productsData} selected={selectedCategory} onSelect={setSelectedCategory} />
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
