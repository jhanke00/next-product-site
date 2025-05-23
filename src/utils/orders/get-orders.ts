import { Order } from '@/src/type/orders';

import largeData from '@/src/mock/large/orders.json';
import smallData from '@/src/mock/small/orders.json';

export const getOrders = (): Order[] => {
  return [...(largeData as Order[]), ...smallData];
};
