'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import StarRating from '@/src/components/StarRating';

const PAGE_SIZE = 20;

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL parameters (handle possibly null searchParams)
  const pageParam = searchParams?.get('page');
  const searchParam = searchParams?.get('search');
  const categoryParam = searchParams?.get('category');
  const initialPage = pageParam ? parseInt(pageParam) : 1;
  const initialSearch = searchParam || '';
  const initialCategory = categoryParam || '';

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchText, setSearchText] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryPinned, setCategoryPinned] = useState(false);
  const didMount = useRef(false);

  // Data from API
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  // Build current query params for deep-linking to product details
  const listingParams = new URLSearchParams();
  if (currentPage > 1) listingParams.set('page', currentPage.toString());
  if (searchQuery) listingParams.set('search', searchQuery);
  if (selectedCategory) listingParams.set('category', selectedCategory);

  // Update URL parameters when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);

    const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [currentPage, searchQuery, selectedCategory]);

  // Fetch products from API whenever page/search/category changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('pageSize', PAGE_SIZE.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    const controller = new AbortController();
    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        setProducts(json?.data ?? []);
        setTotal(json?.total ?? 0);
        setTotalPages(json?.totalPages ?? 1);
        setCategories(json?.categories ?? []);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      });
    return () => controller.abort();
  }, [currentPage, searchQuery, selectedCategory]);

  // Save scroll position and current page before navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('productsScrollPosition', window.scrollY.toString());
      sessionStorage.setItem('productsCurrentPage', currentPage.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentPage]);

  // Restore scroll position and page when returning to the page
  // Prefer URL page param and only fall back to sessionStorage if not present
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('productsScrollPosition');
    const pageParam = searchParams?.get('page');

    if (!pageParam) {
      const savedPage = sessionStorage.getItem('productsCurrentPage');
      if (savedPage) {
        setCurrentPage(parseInt(savedPage));
        sessionStorage.removeItem('productsCurrentPage');
      }
    }

    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
      sessionStorage.removeItem('productsScrollPosition');
    }
  }, []);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  // Debounce search text into searchQuery to limit API calls
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchQuery(searchText);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchText]);

  return (
    <main className='flex min-h-screen flex-col items-center p-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Our Products</h1>

      <div className='w-full max-w-5xl mb-8'>
        {/* Search and Filter Controls */}
        <div className='flex flex-col md:flex-row gap-4 mb-4'>
          {/* Search Bar */}
          <div className='flex-grow'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search products by name, description or category...'
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm'
              />
              <button
                className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600'
                onClick={() => {
                  setSearchQuery(searchText);
                  setCurrentPage(1);
                  window.scrollTo(0, 0);
                }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Category Filter with Icon */}
          <div
            className='md:w-auto relative'
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => {
              if (!categoryPinned) setCategoryOpen(false);
            }}
          >
            <button
              className='flex items-center px-4 py-3 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-blue-600 text-white hover:bg-blue-700'
              onClick={() => {
                const nextPinned = !categoryPinned;
                setCategoryPinned(nextPinned);
                setCategoryOpen(nextPinned || true);
              }}
              aria-haspopup='true'
              aria-expanded={categoryOpen || categoryPinned}
            >
              <span className='mr-2'>{selectedCategory || 'Category'}</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                />
              </svg>
            </button>
            <div
              className={`${categoryOpen || categoryPinned ? 'block' : 'hidden'} absolute z-50 mt-1 w-56 bg-blue-50 border border-blue-200 rounded-lg shadow-lg`}
            >
              <div className='p-2 max-h-60 overflow-y-auto text-gray-900'>
                <div
                  className={`px-4 py-2 hover:bg-blue-100 cursor-pointer rounded ${!selectedCategory ? 'bg-blue-200 text-blue-800' : ''}`}
                  onClick={() => {
                    setSelectedCategory('');
                    setCategoryPinned(false);
                    setCategoryOpen(false);
                    setCurrentPage(1);
                    window.scrollTo(0, 0);
                  }}
                >
                  All Categories
                </div>
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`px-4 py-2 hover:bg-blue-100 cursor-pointer rounded ${selectedCategory === category ? 'bg-blue-200 text-blue-800' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCategoryPinned(false);
                      setCategoryOpen(false);
                      setCurrentPage(1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory) && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {searchQuery && (
              <div className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center'>
                Search: {searchQuery}
                <button
                  onClick={() => {
                    setSearchText('');
                    setSearchQuery('');
                    setCurrentPage(1);
                    window.scrollTo(0, 0);
                  }}
                  className='ml-2 text-blue-500 hover:text-blue-700'
                >
                  ×
                </button>
              </div>
            )}
            {selectedCategory && (
              <div className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center'>
                Category: {selectedCategory}
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setCurrentPage(1);
                    window.scrollTo(0, 0);
                  }}
                  className='ml-2 text-green-500 hover:text-green-700'
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className='w-full max-w-6xl'>
        {products.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-gray-500'>No products found. Try a different search term.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((product) => (
              <div
                key={product.id}
                className='bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow'
              >
                <div className='h-48 bg-gray-200 overflow-hidden'>
                  <img
                    src={
                      ((product as any)?.image as string | undefined) ||
                      'https://via.placeholder.com/300x200?text=Product'
                    }
                    alt={product.name}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='p-4'>
                  <Link
                    prefetch={false}
                    href={`/products/${product.id}${listingParams.toString() ? `?${listingParams.toString()}` : ''}`}
                  >
                    <h3 className='text-lg font-semibold mb-2 text-gray-900 hover:text-blue-600'>{product.name}</h3>
                  </Link>
                  {typeof (product as any)?.rating !== 'undefined' && (
                    <div className='mb-2'>
                      <StarRating rating={Number((product as any)?.rating) || 0} size='sm' />
                    </div>
                  )}
                  {Boolean((product as any)?.category) && (
                    <div className='mb-2'>
                      <span className='inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full'>
                        {(product as any)?.category}
                      </span>
                    </div>
                  )}
                  <p className='text-sm text-gray-600 mb-2 line-clamp-2'>{product.description}</p>
                  <div className='flex justify-between items-center mt-4'>
                    <span className='text-blue-600 font-bold'>${product.price}</span>
                    <Link
                      prefetch={false}
                      href={`/products/${product.id}${listingParams.toString() ? `?${listingParams.toString()}` : ''}`}
                    >
                      <span className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 inline-block'>
                        View Details
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {total > 0 && (
          <div className='flex justify-center items-center mt-8 space-x-4'>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            <span className='text-gray-700'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className='flex justify-around w-full border-t-2 pt-4'>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </main>
  );
}
