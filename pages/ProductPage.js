import React, { useState } from 'react';
import ReviewList from '../src/components/ReviewList';
import ReviewForm from '../src/components/ReviewForm';
import styles from './ProductPage.module.css';

const productData = [
  {
    id: '0e5e5900-29dd-46d6-af40-f8be36445b81',
    name: 'Luxurious Concrete Bacon',
    price: '920.00',
    description:
      'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    category: 'Jewelery',
    rating: 3.3075761899817735,
    numReviews: 40,
    countInStock: 87,
  },
];

export default function ProductPage({ userId }) {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className={styles.container}>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {productData.map((product) => (
            <div key={product.id} className={styles.product}>
              <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                {' '}
                <strong>Price:</strong> {product.price} $
              </p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                {' '}
                <strong>Description:</strong> {product.description}
              </p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                {' '}
                <strong>Category:</strong> {product.category}
              </p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                {' '}
                <strong> Stock: </strong> {product.countInStock}
              </p>

              <ReviewForm productId={product.id} userId={userId} onReviewSubmitted={() => setRefresh(!refresh)} />
              <ReviewList productId='0e5e5900-29dd-46d6-af40-f8be36445b81' key={refresh} sortBy='newest' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
