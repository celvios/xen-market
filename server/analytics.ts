import { storage } from "./storage";
import { cacheService } from "./cache";

export interface MarketAnalytics {
  marketId: number;
  volume24h: number;
  volumeChange: number;
  liquidity: number;
  efficiency: number;
  volatility: number;
  uniqueTraders: number;
  avgTradeSize: number;
}

export interface PlatformAnalytics {
  totalVolume: number;
  totalMarkets: number;
  activeMarkets: number;
  totalUsers: number;
  dailyActiveUsers: number;
  topMarkets: MarketAnalytics[];
  volumeByCategory: Record<string, number>;
}

export class AnalyticsService {
  async getMarketAnalytics(marketId: number): Promise<MarketAnalytics> {
    const cacheKey = `analytics:market:${marketId}`;
    const cached = await cacheService.get<MarketAnalytics>(cacheKey);
    if (cached) return cached;

    const trades = await storage.getMarketTrades(marketId);
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const trades24h = trades.filter(t => new Date(t.createdAt) > yesterday);
    const volume24h = trades24h.reduce((sum, t) => sum + parseFloat(t.totalAmount), 0);
    
    const previousDay = new Date(yesterday.getTime() - 24 * 60 * 60 * 1000);
    const tradesPrevious = trades.filter(t => {
      const tradeDate = new Date(t.createdAt);
      return tradeDate > previousDay && tradeDate <= yesterday;
    });
    const volumePrevious = tradesPrevious.reduce((sum, t) => sum + parseFloat(t.totalAmount), 0);
    
    const volumeChange = volumePrevious > 0 ? ((volume24h - volumePrevious) / volumePrevious) * 100 : 0;
    
    const uniqueTraders = new Set(trades24h.map(t => t.userId)).size;
    const avgTradeSize = trades24h.length > 0 ? volume24h / trades24h.length : 0;
    
    // Calculate price volatility
    const prices = trades24h.map(t => parseFloat(t.price));
    const volatility = this.calculateVolatility(prices);
    
    const analytics: MarketAnalytics = {
      marketId,
      volume24h,
      volumeChange,
      liquidity: volume24h * 0.1, // Mock liquidity calculation
      efficiency: Math.min(100, volume24h / 1000), // Mock efficiency score
      volatility,
      uniqueTraders,
      avgTradeSize
    };

    await cacheService.set(cacheKey, analytics, 300); // Cache for 5 minutes
    return analytics;
  }

  async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    const cacheKey = "analytics:platform";
    const cached = await cacheService.get<PlatformAnalytics>(cacheKey);
    if (cached) return cached;

    const markets = await storage.getAllMarkets();
    const totalMarkets = markets.length;
    const activeMarkets = markets.filter(m => !m.isResolved).length;

    // Calculate total volume across all markets
    let totalVolume = 0;
    const volumeByCategory: Record<string, number> = {};
    
    for (const market of markets) {
      const volume = parseFloat(market.volume);
      totalVolume += volume;
      
      if (!volumeByCategory[market.category]) {
        volumeByCategory[market.category] = 0;
      }
      volumeByCategory[market.category] += volume;
    }

    // Get top markets by analytics
    const topMarkets: MarketAnalytics[] = [];
    for (const market of markets.slice(0, 10)) {
      const analytics = await this.getMarketAnalytics(market.id);
      topMarkets.push(analytics);
    }
    topMarkets.sort((a, b) => b.volume24h - a.volume24h);

    const analytics: PlatformAnalytics = {
      totalVolume,
      totalMarkets,
      activeMarkets,
      totalUsers: 1000, // Mock data
      dailyActiveUsers: 150, // Mock data
      topMarkets: topMarkets.slice(0, 5),
      volumeByCategory
    };

    await cacheService.set(cacheKey, analytics, 600); // Cache for 10 minutes
    return analytics;
  }

  async getMarketCorrelation(marketId1: number, marketId2: number): Promise<number> {
    const trades1 = await storage.getMarketTrades(marketId1);
    const trades2 = await storage.getMarketTrades(marketId2);
    
    const prices1 = trades1.map(t => parseFloat(t.price));
    const prices2 = trades2.map(t => parseFloat(t.price));
    
    return this.calculateCorrelation(prices1, prices2);
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
    
    return Math.sqrt(variance) * 100; // Return as percentage
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;

    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }
}

export const analyticsService = new AnalyticsService();