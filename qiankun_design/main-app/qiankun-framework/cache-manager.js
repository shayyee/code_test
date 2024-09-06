class CacheManager {
    constructor() {
      if (new.target === CacheManager) {
        throw new Error("Cannot instantiate abstract class CacheManager directly.");
      }
    }
  
    getCacheKey(url) {
      throw new Error("getCacheKey method must be implemented.");
    }
  
    async get(url) {
      throw new Error("get method must be implemented.");
    }
  
    clear() {
      throw new Error("clear method must be implemented.");
    }
  }
  
  export default CacheManager;
  