const cache = new Map<string, { data: any; expiry: number }>();

export function getCachedData<T>(key: string): T | undefined {
  const item = cache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.data as T;
  }
  cache.delete(key);
  return undefined;
}

export function setCachedData<T>(key: string, data: T, ttl: number = 60000): void {
  cache.set(key, { data, expiry: Date.now() + ttl });
}
