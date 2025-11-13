'use client';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import Toast from '@/src/components/common/Toast';

const PAGE_SIZE = 20;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { state, addItem } = useCart();
  const data = [...largeData, ...smallData];
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const productData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  // Calculate cart total
  const cartTotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartItemCount = state.items.reduce((sum, item) => sum + item.qty, 0);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: price,
      },
      1
    );
    setToastMessage('Added to cart!');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      {/* Cart Summary Header */}
      <div className='w-full max-w-5xl mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
        <div className='flex justify-between items-center'>
          <div>
            <p className='text-sm text-gray-600'>Cart Items: {cartItemCount}</p>
            <p className='text-lg font-semibold text-gray-800'>Cart Total: ₹{cartTotal.toFixed(2)}</p>
          </div>
          {cartItemCount > 0 && (
            <Link href='/cart' className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'>
              View Cart
            </Link>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {productData.map((product) => {
            const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
            return (
              <div
                key={product.id}
                className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
              >
                <Link href={`/products/${product.id}`}>
                  <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: ₹{price.toFixed(2)}</p>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
                </Link>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className='mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium'
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
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
