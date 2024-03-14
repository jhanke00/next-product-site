'use client';
import Image from 'next/image';
import smallAmtProducts from '@/src/mock/small/products.json';
import largeAmtProducts from '@/src/mock/large/products.json';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/products/products.module.css';
import ProductDetails from '@/src/components/Products/productDetails';

const pageSize = 10;

export default function Products() {
  const products = [...smallAmtProducts, ...largeAmtProducts];
  const [currentPage, setCurrentPage] = useState(1);
  const firstProductIndexOfPage = (currentPage - 1) * pageSize;
  const lastProductIndexOfPage = firstProductIndexOfPage + pageSize;
  const productsPerPage = products.slice(firstProductIndexOfPage, lastProductIndexOfPage);
  const totalPages = Math.ceil(products.length / pageSize);
  useEffect(() => window.scrollTo(0, 10), [currentPage]);

  return (
    <main className='flex min-h-screen flex-col items-center p-24 font-mono'>
      <h1 className={`text-3xl font-bold mb-8`}>List of products</h1>
      <div className='z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {productsPerPage.map((product) => (
            <div
              key={product.id}
              className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
            >
              <Link href={`/products/${product.id}`}>
                <ProductDetails product={product} />
                <p className={styles.loadStyle}>See more</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className='p-8 w-full font-mono lg:text-right text-center'>
        <div className={styles.flex50}>
          Showing {firstProductIndexOfPage + 1}-{lastProductIndexOfPage} of {products.length}
        </div>
        <div>
          {currentPage !== 1 && (
            <button onClick={() => setCurrentPage(currentPage - 1)} className={styles.pr8}>
              <Image src='/previous.png' width={10} height={10} alt='Navigate to previous page' />
            </button>
          )}
          Page {currentPage} of {totalPages}
          {currentPage !== totalPages && (
            <button onClick={() => setCurrentPage(currentPage + 1)} className={styles.pl8}>
              <Image src='/next.png' width={10} height={10} alt='Navigate to next page' />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
