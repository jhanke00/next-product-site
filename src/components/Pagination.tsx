import React from 'react';
import { PaginationPropsType } from '@type/common';

const Pagination: React.FC<PaginationPropsType> = ({ totalItems, rowsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const pageNumbers: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  let startPage = currentPage - 5 < 1 ? 1 : currentPage - 5;
  let endPage = currentPage + 4 > totalPages ? totalPages : currentPage + 4;

  if (currentPage <= 6) {
    endPage = Math.min(10, totalPages);
  }
  if (currentPage + 5 >= totalPages) {
    startPage = Math.max(totalPages - 9, 1);
  }

  const startRecord = (currentPage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className='flex flex-col items-center space-y-2 my-4'>
      <div className='text-lg text-gray-700'>
        Showing {startRecord} to {endRecord} of {totalItems} records
      </div>
      <div className='flex justify-center items-center space-x-1'>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className='px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300'
        >
          Prev
        </button>
        {pageNumbers.slice(startPage - 1, endPage).map((number) => (
          <button
            key={number}
            className={`px-3 py-1 rounded-md ${number === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'} hover:bg-blue-400 hover:text-white`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className='px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300'
        >
          Next
        </button>
        <select
          onChange={(e) => onPageChange(Number(e.target.value))}
          value={currentPage}
          className='px-2 py-1 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
        >
          {pageNumbers.map((number) => (
            <option key={number} value={number}>
              Page {number}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
