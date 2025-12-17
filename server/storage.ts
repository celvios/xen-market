import { db } from "./db";
import { 
  users, markets, outcomes, positions, trades,
  type User, type InsertUser, 
  type Market, type InsertMarket,
  type Outcome, type InsertOutcome,
  type Position, type InsertPosition,
  type Trade, type InsertTrade
} from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: string, newBalance: string): Promise<void>;
  
  // Market operations
  getAllMarkets(): Promise<(Market & { outcomes: Outcome[] })[]>;
  getMarket(id: number): Promise<(Market & { outcomes: Outcome[] }) | undefined>;
  createMarket(market: InsertMarket, marketOutcomes: InsertOutcome[]): Promise<Market>;
  
  // Position operations
  getUserPositions(userId: string): Promise<(Position & { market: Market; outcome: Outcome })[]>;
  getPosition(userId: string, marketId: number, outcomeId: number): Promise<Position | undefined>;
  createPosition(position: InsertPosition): Promise<Position>;
  updatePosition(id: number, shares: string, avgPrice: string): Promise<void>;
  
  // Trade operations
  createTrade(trade: InsertTrade): Promise<Trade>;
  getUserTrades(userId: string): Promise<(Trade & { market: Market; outcome: Outcome })[]>;
  
  // Leaderboard
  getLeaderboard(limit: number): Promise<{ user: User; profit: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUserBalance(userId: string, newBalance: string): Promise<void> {
    await db.update(users).set({ balance: newBalance }).where(eq(users.id, userId));
  }

  // Market operations
  async getAllMarkets(): Promise<(Market & { outcomes: Outcome[] })[]> {
    const allMarkets = await db.select().from(markets).orderBy(desc(markets.isFeatured), desc(markets.createdAt));
    
    const marketsWithOutcomes = await Promise.all(
      allMarkets.map(async (market: Market) => {
        const marketOutcomes = await db.select().from(outcomes).where(eq(outcomes.marketId, market.id));
        return { ...market, outcomes: marketOutcomes };
      })
    );
    
    return marketsWithOutcomes;
  }

  async getMarket(id: number): Promise<(Market & { outcomes: Outcome[] }) | undefined> {
    const result = await db.select().from(markets).where(eq(markets.id, id)).limit(1);
    if (!result[0]) return undefined;
    
    const marketOutcomes = await db.select().from(outcomes).where(eq(outcomes.marketId, id));
    return { ...result[0], outcomes: marketOutcomes };
  }

  async createMarket(market: InsertMarket, marketOutcomes: InsertOutcome[]): Promise<Market> {
    const result = await db.insert(markets).values(market).returning();
    const createdMarket = result[0];
    
    // Insert outcomes with the market ID
    await db.insert(outcomes).values(
      marketOutcomes.map(outcome => ({ ...outcome, marketId: createdMarket.id }))
    );
    
    return createdMarket;
  }

  // Position operations
  async getUserPositions(userId: string): Promise<(Position & { market: Market; outcome: Outcome })[]> {
    const userPositions = await db
      .select()
      .from(positions)
      .where(eq(positions.userId, userId))
      .orderBy(desc(positions.updatedAt));
    
    const positionsWithDetails = await Promise.all(
      userPositions.map(async (position: Position) => {
        const market = await db.select().from(markets).where(eq(markets.id, position.marketId)).limit(1);
        const outcome = await db.select().from(outcomes).where(eq(outcomes.id, position.outcomeId)).limit(1);
        return { ...position, market: market[0], outcome: outcome[0] };
      })
    );
    
    return positionsWithDetails;
  }

  async getPosition(userId: string, marketId: number, outcomeId: number): Promise<Position | undefined> {
    const result = await db
      .select()
      .from(positions)
      .where(
        and(
          eq(positions.userId, userId),
          eq(positions.marketId, marketId),
          eq(positions.outcomeId, outcomeId)
        )
      )
      .limit(1);
    return result[0];
  }

  async createPosition(position: InsertPosition): Promise<Position> {
    const result = await db.insert(positions).values(position).returning();
    return result[0];
  }

  async updatePosition(id: number, shares: string, avgPrice: string): Promise<void> {
    await db.update(positions)
      .set({ shares, avgPrice, updatedAt: new Date() })
      .where(eq(positions.id, id));
  }

  // Trade operations
  async createTrade(trade: InsertTrade): Promise<Trade> {
    const result = await db.insert(trades).values(trade).returning();
    return result[0];
  }

  async getUserTrades(userId: string): Promise<(Trade & { market: Market; outcome: Outcome })[]> {
    const userTrades = await db
      .select()
      .from(trades)
      .where(eq(trades.userId, userId))
      .orderBy(desc(trades.createdAt));
    
    const tradesWithDetails = await Promise.all(
      userTrades.map(async (trade: Trade) => {
        const market = await db.select().from(markets).where(eq(markets.id, trade.marketId)).limit(1);
        const outcome = await db.select().from(outcomes).where(eq(outcomes.id, trade.outcomeId)).limit(1);
        return { ...trade, market: market[0], outcome: outcome[0] };
      })
    );
    
    return tradesWithDetails;
  }

  // Leaderboard (mock calculation for now)
  async getLeaderboard(limit: number = 10): Promise<{ user: User; profit: number }[]> {
    // For now, return users with randomized profits
    // In a real app, this would calculate actual P&L
    const allUsers = await db.select().from(users).limit(limit);
    return allUsers.map((user: User) => ({
      user,
      profit: Math.random() * 50000
    })).sort((a: { user: User; profit: number }, b: { user: User; profit: number }) => b.profit - a.profit);
  }
}

export const storage = new DatabaseStorage();
