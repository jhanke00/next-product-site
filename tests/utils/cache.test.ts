import { getCachedData, setCachedData } from '@utils/cache';

describe('Cache Utility Functions', () => {
  it('should set and get cached data', () => {
    const key = 'test-key';
    const data = { foo: 'bar' };
    setCachedData(key, data);
    const cachedData = getCachedData(key);
    expect(cachedData).toEqual(data);
  });

  it('should return undefined for expired cache data', async () => {
    const key = 'expired-key';
    const data = { foo: 'bar' };
    setCachedData(key, data, 1); // 1ms TTL
    await new Promise((resolve) => setTimeout(resolve, 2));
    const cachedData = getCachedData(key);
    expect(cachedData).toBeUndefined();
  });
});
