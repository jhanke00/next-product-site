import { getUserById, getOrdersByUserId, getTotalSpentByUserId } from '@utils/users';
import { getRandomUserId } from '../utils/testHelpers';

describe('User Utility Functions', () => {
  let testUserId: string;

  beforeEach(() => {
    testUserId = getRandomUserId();
  });

  it('should return a user when given a valid user ID', async () => {
    const user = await getUserById(testUserId);
    expect(user).toBeDefined();
    expect(user?.id).toBe(testUserId);
  });

  it('should return undefined when given an invalid user ID', async () => {
    const user = await getUserById('invalid-id');
    expect(user).toBeUndefined();
  });

  it('should return paginated orders for a valid user ID', async () => {
    const result = await getOrdersByUserId(testUserId, 1, 10);
    expect(result.data).toBeDefined();
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBeGreaterThan(0);
    expect(result.totalItems).toBeGreaterThan(0);
  });

  it('should return empty data for an invalid user ID', async () => {
    const result = await getOrdersByUserId('invalid-id', 1, 10);
    expect(result.data).toHaveLength(0);
    expect(result.totalItems).toBe(0);
  });

  it('should return total spent for a valid user ID', async () => {
    const totalSpent = await getTotalSpentByUserId(testUserId);
    expect(totalSpent).toBeGreaterThan(0);
  });

  it('should return 0 for an invalid user ID', async () => {
    const totalSpent = await getTotalSpentByUserId('invalid-id');
    expect(totalSpent).toBe(0);
  });
});
