import React from 'react';
import type { Product } from '@type/products';

export default function Filter({
  filters,
  selectedFilter,
  handleFilter,
  title,
  setSelectedFilter,
}: Readonly<{
  filters: Array<Product>;
  selectedFilter: Array<string | number>;
  handleFilter: React.ChangeEventHandler;
  title: string;
  setSelectedFilter: Function;
}>) {
  return (
    <div className='relative mb-3'>
      <h6 className='flex flex-row gap-2 justify-between'>
        <span>{title}</span>
        {selectedFilter.length > 0 && (
          <div className='relative grid select-none items-center whitespace-nowrap rounded-lg bg-gray-900 py-1.5 px-3 font-sans text-xs font-bold uppercase text-white'>
            <button
              className='flex items-center gap-1 px-1/2 py-1/2 font-sans text-xs font-bold text-center text-white align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-white-10 active:bg-white-30'
              type='button'
              onClick={() => setSelectedFilter([])}
            >
              <div>Clear</div>
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='w-4 h-4'
                  stroke-width='2'
                >
                  <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12'></path>
                </svg>
              </div>
            </button>
          </div>
        )}
      </h6>
      <ul className='mb-8 list-none pt-2'>
        {filters.map((category, index) => {
          return (
            <li key={index}>
              <div className='inline-flex items-center'>
                <label className='relative flex items-center p-3 rounded-full cursor-pointer' htmlFor='checkbox'>
                  <input
                    type='checkbox'
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                    value={category}
                    checked={selectedFilter.indexOf(category) !== -1}
                    onChange={handleFilter}
                  />
                  <span className='absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3.5 w-3.5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      stroke='currentColor'
                      stroke-width='1'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clip-rule='evenodd'
                      ></path>
                    </svg>
                  </span>
                </label>
                <label className='mt-px font-light text-gray-700 cursor-pointer select-none' htmlFor='check'>
                  {category}
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
