import { DELIVERY_CHARGE, TAXES } from '@/src/constants/user-orders';

export const getProductCost = (data: any) => {
  return data?.reduce((sum: any, item: any) => {
    const price = parseFloat(item.price);
    const count = item.count;
    const itemTotal = price * count;
    return sum + itemTotal;
  }, 0);
};

export const getSubTotal = (data: any) => {
  return getProductCost(data) + DELIVERY_CHARGE + TAXES;
};
