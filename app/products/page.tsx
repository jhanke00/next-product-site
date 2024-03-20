'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@type/products';

export default function Products() {
  const products: Array<Product> = [
    {
      id: 1,
      name: 'Product 1',
      price: 100,
      description: 'This is a product',
      category: 'Category 1',
      rating: 4.5,
      numReviews: 10,
      countInStock: 6,
    },
    {
      id: 2,
      name: 'Product 2',
      price: 200,
      description: 'This is a product',
      category: 'Category 2',
      rating: 4.0,
      numReviews: 10,
      countInStock: 6,
    },
    {
      id: 3,
      name: 'Product 3',
      price: 300,
      description: 'This is a product',
      category: 'Category 3',
      rating: 3.5,
      numReviews: 10,
      countInStock: 6,
    },
    {
      id: 4,
      name: 'Product 4',
      price: 400,
      description: 'This is a product',
      category: 'Category 4',
      rating: 3.0,
      numReviews: 10,
      countInStock: 6,
    },
    {
      id: 5,
      name: 'Product 5',
      price: 500,
      description: 'This is a product',
      category: 'Category 5',
      rating: 2.5,
      numReviews: 10,
      countInStock: 6,
    },
  ];
  const { categories, rattings, minPrice, maxPrice } = useMemo(() => {
    let categories: Array<string> = [];
    let rattings: Array<number> = [];
    let minPrice: number = 0;
    let maxPrice: number = 0;

    products.map((product) => {
      categories.indexOf(product.category) === -1 && categories.push(product.category);
      rattings.indexOf(product.rating) === -1 && rattings.push(product.rating);
      if (minPrice > product.price || minPrice == 0) minPrice = product.price;
      if (maxPrice < product.price) maxPrice = product.price;
    });
    rattings = rattings.sort();
    return { categories, rattings, minPrice, maxPrice };
  }, []);

  const [selCategories, setSelCategories] = useState<Array<string>>([]);

  const filterdProducts = useMemo(() => {
    return selCategories.length > 0
      ? products.filter((product) => selCategories.indexOf(product.category) !== -1)
      : products;
  }, [selCategories]);
  const handleCategoryFilter = (e: any) => {
    e.target.checked
      ? setSelCategories((oldState) => [...oldState, e.target.value])
      : setSelCategories((oldState) => oldState.filter((cat) => e.target.value !== cat));
  };

  return (
    <main className='h-[calc(100vh-120px)] w-full absolute top-14'>
      <aside
        id='sidebar'
        className='w-[60px] lg:w-[240px] h-[calc(100vh-120px)] whitespace-nowrap fixed shadow overflow-x-hidden transition-all duration-500 ease-in-out'
      >
        <div className='relative mb-3'>
          <h6 className='mb-0'>Categories</h6>
          <ul className='mb-8 list-none pt-2'>
            {categories.map((category, index) => {
              return (
                <li key={index}>
                  <div className='inline-flex items-center'>
                    <label className='relative flex items-center p-3 rounded-full cursor-pointer' htmlFor='checkbox'>
                      <input
                        type='checkbox'
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                        value={category}
                        checked={selCategories.indexOf(category) !== -1}
                        onChange={handleCategoryFilter}
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
        <div className='relative mb-3'>
          <h6 className='mb-0'>Reports</h6>
          <ul className='mb-8 list-none pt-2'>
            {rattings.map((ratting, index) => {
              return (
                <li key={index}>
                  <div className='inline-flex items-center'>
                    <label className='relative flex items-center p-3 rounded-full cursor-pointer' htmlFor='checkbox'>
                      <input
                        type='checkbox'
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                        id='checkbox'
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
                      {ratting}
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
      <section
        id='content'
        className='w-[100wh-60px] lg:w-[100wh-250px] ml-[60px] lg:ml-[240px] p-5 right-0 transition-all duration-500 ease-in-out'
      >
        <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
          <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
            {filterdProducts.map((product) => (
              <div
                key={product.id}
                className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 shadow'
              >
                <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
