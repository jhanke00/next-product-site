'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@components/Breadcrumbs';
import ProductCard from '@components/ProductCard';
import ProductCardSkeleton from '@components/ProductCardSkeleton';
import { ProductType } from '@type/products';
import { productDetailsBreadcrumbs } from '@utils/breadcrumbsUtils';
import { defaultProduct, isValidProduct, fetchSelectedProducts } from '@utils/productUtils';
import ErrorPage from '@components/ErrorPage';

const ProductDetailsPage = () => {
  const pathname = usePathname();
  const productId = pathname?.split('/').pop() || '';
  const [product, setProduct] = useState<ProductType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSelectedData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSelectedProducts(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchSelectedData();
  }, [fetchSelectedData]);

  return (
    <main className='flex flex-col items-left p-4'>
      <Breadcrumbs breadcrumbs={productDetailsBreadcrumbs} />
      {isLoading ? (
        <ProductCardSkeleton />
      ) : product && isValidProduct(product) ? (
        <ProductCard product={product} />
      ) : (
        <ErrorPage
          message={`The product with ID: ${productId} was not found.`}
          page='Product Details'
          eType='NOT FOUND'
        />
      )}
    </main>
  );
};

export default ProductDetailsPage;
