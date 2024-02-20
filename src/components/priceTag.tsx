import { Price } from '../type/price';

const PriceTag = (priceVal: Price) => {
  const { price, originalPrice, priceStyle, originalPriceStyle } = priceVal;
  return (
    <>
      <span className={`${priceStyle}`}>${price}</span>
      <span className={`${originalPriceStyle}`}>${originalPrice}</span>
    </>
  );
};
export default PriceTag;
