export function getStorage(key: any, isLocal = true) {
  let storageVal;
  if (typeof window !== 'undefined') {
    const storage = isLocal ? localStorage : sessionStorage;
    storageVal = JSON.parse(storage.getItem(key));
  }
  return storageVal;
}
