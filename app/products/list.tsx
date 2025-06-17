'use client';
import React, { useEffect } from 'react';
import { useFilter } from '@context/products';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { useFetchProducts } from '@/src/hooks/products/useFetchProducts';
import { Loading } from '@components/Loading';

const ProductList: React.FC = () => {
  const { filters, currentPage, setCurrentPage } = useFilter();

  const { data, pagination, isLoading } = useFetchProducts({
    ...filters,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1); // react-paginate uses indexes from 0. Issue #167
  };

  if (isLoading) return <Loading />;

  if (!data || !data.length) {
    return <p>Not products found</p>;
  }

  return (
    <div className='w-3/4'>
      <div className='z-10 w-full items-center justify-between text-sm lg:flex'>
        <div className='grid w-full lg:grid-cols-3 lg:gap-6 lg:text-left'>
          {data.map((product) => (
            <div
              key={product.id}
              className='group rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-gray-800 transition-colors duration-300 hover:bg-gray-700'
            >
              <Link href={`/products/${product.id}`}>
                <div className='p-5'>
                  <h3 className={`mb-3 text-white text-2xl font-semibold`}>{product.name}</h3>
                  <p className={`m-0 max-w-[30ch] text-white text-sm opacity-50`}>Price: {product.price}</p>
                  <p className={`m-0 max-w-[30ch] text-white text-sm opacity-50`}>Description: {product.description}</p>
                  <p className={`m-0 max-w-[30ch] text-white text-sm opacity-50`}>Category: {product.category}</p>
                  <p className={`m-0 max-w-[30ch] text-white text-sm opacity-50`}>Rating: {product.rating}</p>
                  <p className={`m-0 max-w-[30ch] text-white text-sm opacity-50`}>Reviews: {product.numReviews}</p>
                  <p className={`m-0 max-w-[30ch] text-white text-sm opacity-50`}>Stock: {product.countInStock}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-around w-full border-t-2 pt-4 mt-8'>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pagination!.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          forcePage={currentPage - 1} // component uses zero index
          onPageChange={handlePageClick}
          breakClassName={'break-me'}
          containerClassName={'flex justify-center items-center space-x-2 mt-4'}
          pageClassName={'px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700'}
          activeClassName={'!bg-blue-500'}
          previousClassName={'px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700'}
          nextClassName={'px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700'}
          disabledClassName={'opacity-50 cursor-not-allowed'}
          activeLinkClassName={'text-white'}
        />
      </div>
    </div>
  );
};

export default ProductList;
