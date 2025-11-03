'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/src/components/Navigation';
import ProductFilters, { FilterState } from '@/src/components/ProductFilters';
import { Product } from '@/src/type/products';

interface ProductResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrevious: boolean;
    limit: number;
  };
  filters: any;
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<ProductResponse['pagination'] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const searchParams = useSearchParams();

  const fetchProducts = useCallback(async (searchValue: string, filterValue: FilterState, pageValue: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageValue.toString(),
        limit: '20',
      });

      if (searchValue) params.append('search', searchValue);
      if (filterValue.category) params.append('category', filterValue.category);
      if (filterValue.minPrice) params.append('minPrice', filterValue.minPrice);
      if (filterValue.maxPrice) params.append('maxPrice', filterValue.maxPrice);
      if (filterValue.minRating) params.append('minRating', filterValue.minRating);
      if (filterValue.sortBy) params.append('sortBy', filterValue.sortBy);
      if (filterValue.sortOrder) params.append('sortOrder', filterValue.sortOrder);

      const response = await fetch(`/api/products?${params}`);
      const data: ProductResponse = await response.json();

      setProducts(data.products);
      setPagination(data.pagination);

      // Update URL without causing a re-render loop
      const newSearchParams = new URLSearchParams(params);
      newSearchParams.delete('page');
      newSearchParams.delete('limit');
      if (pageValue > 1) newSearchParams.set('page', pageValue.toString());

      const newUrl = newSearchParams.toString() ? `/products?${newSearchParams.toString()}` : '/products';

      window.history.replaceState({}, '', newUrl);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);

    const newFilters = {
      category,
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minRating: searchParams.get('minRating') || '',
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: searchParams.get('sortOrder') || 'asc',
    } as FilterState;

    setSearchQuery(search);
    setFilters(newFilters);
    fetchProducts(search, newFilters, page);
  }, [searchParams, fetchProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchProducts(query, filters, 1);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    fetchProducts(searchQuery, newFilters, 1);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(searchQuery, filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className='text-yellow-400'>
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key='half' className='text-yellow-400'>
          ☆
        </span>
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className='text-gray-300'>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation onSearch={handleSearch} searchQuery={searchQuery} showSearch={true} />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Products</h1>
          {pagination && (
            <p className='text-gray-600 mt-2'>
              Showing {pagination.totalProducts} products
              {filters.category && ` in ${filters.category}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          )}
        </div>

        <div className='lg:grid lg:grid-cols-4 lg:gap-8'>
          {/* Filters Sidebar */}
          <div className='lg:col-span-1 mb-8 lg:mb-0'>
            <ProductFilters onFilterChange={handleFilterChange} initialFilters={filters} />
          </div>

          {/* Products Grid */}
          <div className='lg:col-span-3'>
            {loading ? (
              <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className='animate-pulse'>
                    <div className='bg-white rounded-lg border border-gray-200 p-6'>
                      <div className='bg-gray-300 h-6 rounded mb-3'></div>
                      <div className='bg-gray-300 h-4 rounded mb-2'></div>
                      <div className='bg-gray-300 h-4 rounded mb-2'></div>
                      <div className='bg-gray-300 h-4 rounded w-1/2'></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className='group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200'
                    >
                      <div className='mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2'>
                          {product.name}
                        </h3>
                        <p className='text-sm text-gray-600 mb-3 line-clamp-3'>{product.description}</p>
                      </div>

                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-2xl font-bold text-blue-600'>
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                            {product.category}
                          </span>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-1'>
                            {renderStars(product.rating)}
                            <span className='text-sm text-gray-600 ml-2'>({product.numReviews})</span>
                          </div>
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              product.countInStock > 10
                                ? 'text-green-600 bg-green-100'
                                : product.countInStock > 0
                                  ? 'text-yellow-600 bg-yellow-100'
                                  : 'text-red-600 bg-red-100'
                            }`}
                          >
                            {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className='flex items-center justify-between mt-8 pt-8 border-t border-gray-200'>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevious}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pagination.hasPrevious
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Previous
                    </button>

                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-gray-600'>
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pagination.hasNext
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className='text-center py-12'>
                <div className='text-gray-400 text-6xl mb-4'>🔍</div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>No products found</h3>
                <p className='text-gray-600'>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
