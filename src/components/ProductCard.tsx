import React from 'react';
import { ProductCardProps } from '@type/products';
import '@app/globals.css';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <>
      <h1 className='cardTitle'>{product.name}</h1>
      <div className='cardBody'>
        <div className='cardContent'>
          <div className='cardContentText'>{product.description}</div>
        </div>
        <div className='cardInfo'>
          <div className='infoLabel'>Price</div>
          <div className='infoValue'>${product.price}</div>
        </div>
        <div className='cardInfoNeutral'>
          <div className='infoLabel'>Category</div>
          <div className='infoValue'>{product.category}</div>
        </div>
        <div className='cardInfo'>
          <div className='infoLabel'>Rating</div>
          <div className='infoValue'>{product.rating}</div>
        </div>
        <div className='cardInfoNeutral'>
          <div className='infoLabel'>Number of Reviews</div>
          <div className='infoValue'>{product.numReviews}</div>
        </div>
        <div className='cardInfo'>
          <div className='infoLabel'>Count in Stock</div>
          <div className='infoValue'>{product.countInStock}</div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
