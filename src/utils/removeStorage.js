export function removeStorage(key, isLocal = true) {
  let storageVal;
  if (typeof window !== 'undefined') {
    const storage = isLocal ? localStorage : sessionStorage;
    storageVal = storage.removeItem(key);
  }
  return storageVal;
}
