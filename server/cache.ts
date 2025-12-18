import Redis from 'ioredis';

class CacheService {
  private redis: Redis | null = null;
  private mockCache = new Map<string, { value: any; expiry: number }>();

  constructor() {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);
    } else {
      console.log("Running in mock cache mode (no REDIS_URL provided)");
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.redis) {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } else {
      const cached = this.mockCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return cached.value;
      }
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    if (this.redis) {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    } else {
      this.mockCache.set(key, {
        value,
        expiry: Date.now() + (ttlSeconds * 1000)
      });
    }
  }

  async del(key: string): Promise<void> {
    if (this.redis) {
      await this.redis.del(key);
    } else {
      this.mockCache.delete(key);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (this.redis) {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } else {
      for (const key of this.mockCache.keys()) {
        if (key.includes(pattern.replace('*', ''))) {
          this.mockCache.delete(key);
        }
      }
    }
  }

  // Market-specific cache methods
  async cacheMarketData(marketId: number, data: any): Promise<void> {
    await this.set(`market:${marketId}`, data, 60); // 1 minute TTL
  }

  async getCachedMarketData(marketId: number): Promise<any> {
    return await this.get(`market:${marketId}`);
  }

  async cacheOrderBook(marketId: number, orderBook: any): Promise<void> {
    await this.set(`orderbook:${marketId}`, orderBook, 30); // 30 seconds TTL
  }

  async getCachedOrderBook(marketId: number): Promise<any> {
    return await this.get(`orderbook:${marketId}`);
  }

  async cachePriceHistory(marketId: number, history: any): Promise<void> {
    await this.set(`price_history:${marketId}`, history, 300); // 5 minutes TTL
  }

  async getCachedPriceHistory(marketId: number): Promise<any> {
    return await this.get(`price_history:${marketId}`);
  }
}

export const cacheService = new CacheService();