import smallProducts from '@/src/mock/small/products.json';
import smallUsers from '@/src/mock/small/users.json';
import smallOrders from '@/src/mock/small/orders.json';
import largeProducts from '@/src/mock/large/products.json';
import largeUsers from '@/src/mock/large/users.json';
import largeOrders from '@/src/mock/large/orders.json';

export type MockKind = 'small' | 'large';

export async function loadMocks(kind: MockKind = 'small') {
  if (kind === 'small') {
    return { products: smallProducts, users: smallUsers, orders: smallOrders };
  } else {
    return { products: largeProducts, users: largeUsers, orders: largeOrders };
  }
}
