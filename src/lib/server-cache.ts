// Dùng globalThis để tránh tạo lại khi HMR
const globalCache =
  (globalThis as any).__MY_CACHE__ ||
  new Map<string, { data: any; expireAt: number }>();

(globalThis as any).__MY_CACHE__ = globalCache;

export const Cache = {
  get(key: string) {
    const item = globalCache.get(key);
    if (!item) return null;
    if (item.expireAt < Date.now()) {
      globalCache.delete(key);
      return null;
    }
    return item.data;
  },

  set(key: string, value: any, ttlMs = 1000 * 60 * 30) {
    globalCache.set(key, {
      data: value,
      expireAt: Date.now() + ttlMs,
    });
  },

  delete(key: string) {
    return globalCache.delete(key);
  },

  clear() {
    globalCache.clear();
  },
  entries(){
    return globalCache.entries();
  }
};