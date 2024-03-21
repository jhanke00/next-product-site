'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@type/products';
import Filter from '../../components/products/filter';
import FilterText from '../../components/products/filterText';
import ProductView from '../../components/products/productView';

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

  const { categories, ratings, minPrice, maxPrice } = useMemo(() => {
    let categories: Array<string> = [];
    let ratings: Array<number> = [];
    let minPrice: number = 0;
    let maxPrice: number = 0;

    products.map((product) => {
      categories.indexOf(product.category) === -1 && categories.push(product.category);
      ratings.indexOf(product.rating) === -1 && ratings.push(product.rating);
      if (minPrice > product.price || minPrice == 0) minPrice = product.price;
      if (maxPrice < product.price) maxPrice = product.price;
    });
    ratings = ratings.sort();
    return { categories, ratings, minPrice, maxPrice };
  }, []);

  const [searchKey, setSearchKey] = useState<string>('');
  const [selCategories, setSelCategories] = useState<Array<string>>([]);
  const [selRatings, setSelRatings] = useState<Array<number>>([]);

  const filterdProducts = useMemo(() => {
    const smSearchKey = searchKey?.toLowerCase()?.trim();
    return products.filter(
      (product) =>
        (searchKey == '' ||
          product?.name?.toLowerCase()?.includes(smSearchKey) ||
          product?.description?.toLowerCase()?.includes(smSearchKey)) &&
        (selCategories.length === 0 || selCategories.indexOf(product.category) !== -1) &&
        (selRatings.length === 0 || selRatings.indexOf(product.rating) !== -1)
    );
  }, [selCategories, selRatings, searchKey]);

  const handleCategoryFilter = (e: any) => {
    e.target.checked
      ? setSelCategories((oldState) => [...oldState, e.target.value])
      : setSelCategories((oldState) => oldState.filter((cat) => e.target.value !== cat));
  };

  const handleRatingsFilter = (e: any) => {
    const val = parseFloat(e.target.value);
    e.target.checked
      ? setSelRatings((oldState) => [...oldState, val])
      : setSelRatings((oldState) => oldState.filter((cat) => val !== cat));
  };

  return (
    <main className='w-full py-4'>
      <aside
        id='sidebar'
        className='w-[60px] lg:w-[240px] h-[calc(100vh-120px)] whitespace-nowrap fixed shadow overflow-x-hidden transition-all duration-500 ease-in-out px-1'
      >
        <FilterText searchKey={searchKey} setSearchKey={setSearchKey} title='Search' />
        <Filter
          filters={categories}
          selectedFilter={selCategories}
          handleFilter={handleCategoryFilter}
          title='Categories'
          setSelectedFilter={setSelCategories}
        />
        <Filter
          filters={ratings}
          selectedFilter={selRatings}
          handleFilter={handleRatingsFilter}
          title='Ratings'
          setSelectedFilter={setSelRatings}
        />
      </aside>
      <section
        id='content'
        className='w-[100wh-60px] lg:w-[100wh-250px] ml-[60px] lg:ml-[240px] p-5 right-0 transition-all duration-500 ease-in-out'
      >
        <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
          <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
            {filterdProducts.map((product) => (
              <ProductView product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
