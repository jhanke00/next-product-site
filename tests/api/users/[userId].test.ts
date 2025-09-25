import { GET as getUserHandler } from '@/app/api/users/[userId]/route';
import { GET as getOrdersHandler } from '@/app/api/users/[userId]/orders/route';
import { GET as getTotalSpentHandler } from '@/app/api/users/[userId]/total-spent/route';
import { getRandomUserId, createMockRequest } from '../../utils/testHelpers';

describe('User API Endpoints', () => {
  let validUserId: string;

  beforeEach(() => {
    validUserId = getRandomUserId();
  });

  it('should return user data for valid user ID', async () => {
    const req = createMockRequest(`http://localhost/api/users/${validUserId}`);
    const res = await getUserHandler(req, { params: { userId: validUserId } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', validUserId);
  });

  it('should return 404 for invalid user ID', async () => {
    const req = createMockRequest('http://localhost/api/users/invalid-id');
    const res = await getUserHandler(req, { params: { userId: 'invalid-id' } });
    expect(res.status).toBe(404);
  });

  it('should return paginated orders for valid user ID', async () => {
    const req = createMockRequest(`http://localhost/api/users/${validUserId}/orders?page=1&limit=10`);
    const res = await getOrdersHandler(req, { params: { userId: validUserId } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('currentPage');
    expect(data).toHaveProperty('totalPages');
    expect(data).toHaveProperty('totalItems');
  });

  it('should return total spent for valid user ID', async () => {
    const req = createMockRequest(`http://localhost/api/users/${validUserId}/total-spent`);
    const res = await getTotalSpentHandler(req, { params: { userId: validUserId } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('totalSpent');
  });
});
