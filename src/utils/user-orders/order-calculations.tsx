import { DELIVERY_CHARGE, TAXES } from '@/src/constants/user-orders';
import { Item } from '@/src/type/orders';

export const getProductCost = (data: Item[]) => {
  return data?.reduce((sum: number, item: any) => {
    const price = Number(item.price);
    const count = item.count;
    const itemTotal = price * count;
    return sum + itemTotal;
  }, 0);
};

export const getSubTotal = (total: number) => {
  return Number(`${total + DELIVERY_CHARGE + TAXES}`);
};
