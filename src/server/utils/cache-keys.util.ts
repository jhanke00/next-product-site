class CacheKeysUtil {
  generateProductKey(id: string) {
    return `product:${id}`;
  }
}

export const cacheKeys = new CacheKeysUtil();
