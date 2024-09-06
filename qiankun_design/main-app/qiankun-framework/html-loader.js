import cacheManager from './local-storage-cache-manager.js';

export async function loadHTML(url) {
  return await cacheManager.get(url);
}
