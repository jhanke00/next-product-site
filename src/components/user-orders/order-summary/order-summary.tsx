import { useMemo } from 'react';
import { getProductCost, getSubTotal } from '@/src/utils/user-orders/order-calculations';
import {
  DELIVERY_CHARGE,
  ORDER_SUMMARY_LBL,
  PRODUCT_COST_LBL,
  SHIPPING_LBL,
  SUBTOTAL,
  TAXES,
  TAXES_LBL,
} from '@/src/constants/user-orders';
import { OrderSummaryProps } from '@/src/type/orders';

export const OrderSummary = ({ data }: OrderSummaryProps) => {
  const productCost = useMemo(() => getProductCost(data), [data]);
  const subTotal = getSubTotal(productCost);

  return (
    <div className='p-6 border border-gray-200 rounded-3xl w-full group transition-all duration-500 hover:border-gray-400 '>
      <h2 className='font-manrope font-bold text-3xl leading-10 text-white pb-6 border-b border-gray-200 '>
        {ORDER_SUMMARY_LBL}
      </h2>
      <div className='data py-6 border-b border-gray-200'>
        <div className='flex items-center justify-between gap-4 mb-5'>
          <p className='font-normal text-lg leading-8 text-gray-400 '>{PRODUCT_COST_LBL}</p>
          <p className='font-medium text-lg leading-8 text-white-900'>{productCost.toLocaleString()}</p>
        </div>
        <div className='flex items-center justify-between gap-4 mb-5'>
          <p className='font-normal text-lg leading-8 text-gray-400 '>{SHIPPING_LBL}</p>
          <p className='font-medium text-lg leading-8 text-white-600'>{DELIVERY_CHARGE}</p>
        </div>
        <div className='flex items-center justify-between gap-4 '>
          <p className='font-normal text-lg leading-8 text-gray-400  '>{TAXES_LBL}</p>
          <p className='font-medium text-lg leading-8 text-white-600'>{TAXES}</p>
        </div>
      </div>
      <div className='total flex items-center justify-between pt-6'>
        <p className='font-normal text-xl leading-8 text-gray-400'>{SUBTOTAL}</p>
        <h5 className='font-manrope font-bold text-2xl leading-9 text-white-600'>{subTotal.toLocaleString()}</h5>
      </div>
    </div>
  );
};
