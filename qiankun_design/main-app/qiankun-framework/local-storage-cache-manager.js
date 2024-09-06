import CacheManager from './cache-manager.js';

class LocalStorageCacheManager extends CacheManager {
  constructor() {
    super();
    this.cacheKeyPrefix = 'micro-frontend-cache:';
    this.cacheExpiration = 24 * 60 * 60 * 1000; // 1 day
  }

  getCacheKey(url) {
    return `${this.cacheKeyPrefix}${url}`;
  }

  async get(url) {
    const cacheKey = this.getCacheKey(url);
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));

    if (cachedData && (Date.now() - cachedData.timestamp) < this.cacheExpiration) {
      return cachedData.content;
    }

    const response = await fetch(url);
    const content = await response.text();
    localStorage.setItem(cacheKey, JSON.stringify({ content, timestamp: Date.now() }));
    return content;
  }

  clear() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.cacheKeyPrefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export default new LocalStorageCacheManager();
