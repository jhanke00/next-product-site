'use client';
import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import type { ProductType } from '@type/products';
import Table from '@components/Table';
import Search from '@components/Search';
import Breadcrumbs from '@components/Breadcrumbs';
import Pagination from '@components/Pagination';
import Skeleton from '@components/ProductSkeleton';
import { productBreadcrumbs } from '@utils/breadcrumbsUtils';
import { productTableHeaders, fetchProducts, searchProducts, productPageConfig } from '@utils/productUtils';
import { getPageSliceData, usePagination } from '@utils/common';

const ProductHome: NextPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, getPageChange] = usePagination(1);
  const rowsPerPage = productPageConfig.rowCount;
  const redirectUrl = productPageConfig.redirectUrl;
  const paginatedProducts = getPageSliceData(products, currentPage, rowsPerPage);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string, category: string) => {
    setIsLoading(true);
    getPageChange(1);
    try {
      const data = await searchProducts(query, category);
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setSearchQuery('');
    setSelectedCategory('');
    await fetchData();
  };

  return (
    <main className='flex flex-col items-left'>
      <Breadcrumbs breadcrumbs={productBreadcrumbs} />
      <div>
        <Search
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearch={(query, category) => {
            setSearchQuery(query);
            setSelectedCategory(category);
            handleSearch(query, category);
          }}
          onReset={handleReset}
          onCategoryChange={setSelectedCategory}
        />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Table products={paginatedProducts} headers={productTableHeaders} redirectUrl={redirectUrl} />
        )}
      </div>
      {!isLoading && products.length > rowsPerPage && (
        <Pagination
          totalItems={products.length}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={getPageChange}
        />
      )}
    </main>
  );
};

export default ProductHome;
