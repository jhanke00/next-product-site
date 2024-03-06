export function setStorage(key: any, value: any, isLocal = true) {
  let storageVal;
  if (typeof window !== 'undefined') {
    const storage = isLocal ? localStorage : sessionStorage;
    storageVal = storage.setItem(key, JSON.stringify(value));
  }
  return storageVal;
}
