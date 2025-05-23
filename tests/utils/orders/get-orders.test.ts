import { mockLargeOrders, mockSmallOrders } from '@/tests/mocks/orders';
import { getOrders } from '@/src/utils/orders/get-orders';

jest.mock('@/src/mock/large/orders.json', () => mockLargeOrders);
jest.mock('@/src/mock/small/orders.json', () => mockSmallOrders);

describe('getOrders', () => {
  test('returns a combined array of orders', () => {
    const expected = [...mockLargeOrders, ...mockSmallOrders];

    const result = getOrders();
    expect(result).toEqual(expected);
  });
});
