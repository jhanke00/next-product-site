import { env } from '@/src/config/env';
import Redis from 'ioredis';

export class Cache {
  private static instanceCache: Cache;

  private cache = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_USER_PASSWORD,
    username: env.REDIS_USER,
  });

  EXPIRE_TIME = {
    hours_24: 24 * 60 * 60, // 24h * 60m * 60s
    hours_12: 12 * 60 * 60, // 12h * 60m * 60s
    hours_6: 6 * 60 * 60, // 6h * 60m * 60s
    seconds_5: 5,
  };

  private constructor() {
    this.cache.on('error', (err) => {
      console.error('Cache error', err);
    });
  }

  public static get instance(): Cache {
    if (!Cache.instanceCache) {
      Cache.instanceCache = new Cache();
    }

    return Cache.instanceCache;
  }

  get(key: string) {
    return this.cache.get(key);
  }

  del(keys: string[]) {
    return this.cache.del(keys);
  }

  set(params: { key: string; value: string; expire?: number }) {
    const { expire, value, key } = params;

    if (expire !== undefined) {
      return this.cache.set(key, value, 'EX', expire);
    }

    return this.cache.set(key, value);
  }

  async cacheAside<T>(params: { key: string; onCacheMiss: () => Promise<{ value: T; expire?: number }> }) {
    const { key, onCacheMiss } = params;

    const value = await this.get(key);

    if (value) {
      console.log(`Cache hit for key ${key}`);

      return JSON.parse(value) as T;
    }

    console.log(`Cache miss for key ${key}`);

    const { value: newValue, expire } = await onCacheMiss();

    await this.set({ key, value: JSON.stringify(newValue), expire });

    console.log(`Cache set for key ${key}; value ${JSON.stringify(newValue)}`);

    return newValue;
  }
}
