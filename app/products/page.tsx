'use client';
import Image from 'next/image';
import smallAmtProducts from '@/src/mock/small/products.json';
import largeAmtProducts from '@/src/mock/large/products.json';
import { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/products/products.module.css';

const pageSize = 30;

export default function Products() {
  const products = [...smallAmtProducts, ...largeAmtProducts];
  const [currentPage, setCurrentPage] = useState(1);
  const firstProductIndex = (currentPage - 1) * pageSize;
  const lastProductIndex = firstProductIndex + pageSize;
  const productsPerPage = products.slice(firstProductIndex, lastProductIndex);
  const totalPages = Math.ceil(products.length / pageSize);

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {productsPerPage.map((product) => (
            <div
              key={product.id}
              className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
            >
              <Link href={`/products/${product.id}`}>
                <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className='p-8 w-full font-mono lg:text-right text-center'>
        <div className={styles.flex50}>
          Showing {firstProductIndex + 1}-{lastProductIndex} of {products.length}
        </div>
        <div>
          <button onClick={() => setCurrentPage(currentPage - 1)} className={styles.pr8}>
            {currentPage !== 1 && <Image src='/previous.png' width={10} height={10} alt='Navigate to previous page' />}
          </button>
          Page {currentPage} of {totalPages}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className={styles.pl8}
            disabled={currentPage === totalPages}
          >
            {currentPage !== totalPages && <Image src='/next.png' width={10} height={10} alt='Navigate to next page' />}
          </button>
        </div>
      </div>
    </main>
  );
}
