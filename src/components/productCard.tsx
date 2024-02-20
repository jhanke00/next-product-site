import StartRating from './starRating';
import Image from 'next/image';
import PriceTag from './priceTag';
import { Product } from '../type/products';
import { Price } from '../type/price';
import { Rating } from '../type/starRating';

const ProductCard = (card: Product) => {
  const { id, name, image, originalPrice, price, rating } = card;
  const productPrice: Price = {
    price,
    originalPrice,
    priceStyle: 'text-2xl font-bold text-slate-900',
    originalPriceStyle: 'text-xs text-slate-900 line-through ml-1.5',
  };
  const starRating: Rating = {
    count: Math.round(rating),
    width: 17,
    height: 17,
  };

  return (
    <div className='relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md'>
      <a className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl' href={`/product-details?product-id=${id}`}>
        {/* <Image
          className='object-cover hover:scale-125 ease-in duration-300'
          width={300}
          height={400}
          src={image}
          alt='product image'
        /> */}
        <img className='object-cover' src={image} alt='product image' />
      </a>
      <div className='mt-4 px-5 pb-5'>
        <a href={`/product-details?product-id=${id}`}>
          <h5 className='text-xl tracking-tight text-slate-900 min-h-4'>{name}</h5>
        </a>
        <div className='mt-2 mb-5 flex items-center justify-between'>
          <p>
            <PriceTag {...productPrice} />
          </p>
          <div className='flex items-center'>
            <StartRating {...starRating} />
            <span className='mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold'>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
