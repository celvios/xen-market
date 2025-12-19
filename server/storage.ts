import { db } from "./db";
import {
  users, markets, outcomes, positions, trades, orders,
  type User, type InsertUser,
  type Market, type InsertMarket,
  type Outcome, type InsertOutcome,
  type Position, type InsertPosition,
  type Trade, type InsertTrade,
  type Order, type InsertOrder
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
  resolveMarket(marketId: number, outcomeId: number): Promise<void>;

  // Position operations
  getUserPositions(userId: string): Promise<(Position & { market: Market; outcome: Outcome })[]>;
  getPosition(userId: string, marketId: number, outcomeId: number): Promise<Position | undefined>;
  getMarketPositions(marketId: number): Promise<(Position & { user: User; outcome: Outcome })[]>;
  createPosition(position: InsertPosition): Promise<Position>;
  updatePosition(id: number, shares: string, avgPrice: string): Promise<void>;

  // Trade operations
  createTrade(trade: InsertTrade): Promise<Trade>;
  getUserTrades(userId: string): Promise<(Trade & { market: Market; outcome: Outcome })[]>;
  getMarketTrades(marketId: number): Promise<Trade[]>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOpenOrders(marketId: number): Promise<(Order & { user: User; outcome: Outcome })[]>;
  getUserOrders(userId: string): Promise<(Order & { market: Market; outcome: Outcome })[]>;
  updateOrderStatus(orderId: number, status: string, filledSize?: string): Promise<void>;
  cancelOrder(orderId: number): Promise<void>;

  // Leaderboard
  getLeaderboard(limit: number): Promise<{ user: User; profit: number }[]>;
}

import fs from "fs";
import path from "path";

const MOCK_DB_PATH = path.resolve(process.cwd(), "mock-db.json");

interface MockDb {
  users: Record<string, User>;
  markets: Record<number, Market>;
  outcomes: Record<number, Outcome>;
  positions: Record<number, Position>;
  trades: Record<number, Trade>;
  orders: Record<number, Order>;
  currentId: number;
}

export class DatabaseStorage implements IStorage {
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

  async getAllMarkets(): Promise<(Market & { outcomes: Outcome[] })[]> {
    const allMarkets = await db.select().from(markets).orderBy(desc(markets.isFeatured), desc(markets.createdAt));
    
    // Fetch all outcomes in a single query
    const allOutcomes = await db.select().from(outcomes);
    
    // Group outcomes by marketId
    const outcomesByMarket = allOutcomes.reduce((acc, outcome) => {
      if (!acc[outcome.marketId]) acc[outcome.marketId] = [];
      acc[outcome.marketId].push(outcome);
      return acc;
    }, {} as Record<number, Outcome[]>);
    
    // Attach outcomes to markets
    return allMarkets.map(market => ({
      ...market,
      outcomes: outcomesByMarket[market.id] || []
    }));
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
    if (marketOutcomes.length > 0) {
      await db.insert(outcomes).values(
        marketOutcomes.map(outcome => ({ ...outcome, marketId: createdMarket.id }))
      );
    }
    return createdMarket;
  }

  async resolveMarket(marketId: number, outcomeId: number): Promise<void> {
    await db.update(markets).set({ 
      isResolved: true, 
      resolvedOutcomeId: outcomeId 
    }).where(eq(markets.id, marketId));
  }

  async getUserPositions(userId: string): Promise<(Position & { market: Market; outcome: Outcome })[]> {
    const userPositions = await db.select().from(positions).where(eq(positions.userId, userId)).orderBy(desc(positions.updatedAt));
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
    const result = await db.select().from(positions).where(and(eq(positions.userId, userId), eq(positions.marketId, marketId), eq(positions.outcomeId, outcomeId))).limit(1);
    return result[0];
  }

  async getMarketPositions(marketId: number): Promise<(Position & { user: User; outcome: Outcome })[]> {
    const marketPositions = await db.select().from(positions).where(eq(positions.marketId, marketId));
    const positionsWithDetails = await Promise.all(
      marketPositions.map(async (position: Position) => {
        const user = await db.select().from(users).where(eq(users.id, position.userId)).limit(1);
        const outcome = await db.select().from(outcomes).where(eq(outcomes.id, position.outcomeId)).limit(1);
        return { ...position, user: user[0], outcome: outcome[0] };
      })
    );
    return positionsWithDetails;
  }

  async createPosition(position: InsertPosition): Promise<Position> {
    const result = await db.insert(positions).values(position).returning();
    return result[0];
  }

  async updatePosition(id: number, shares: string, avgPrice: string): Promise<void> {
    await db.update(positions).set({ shares, avgPrice, updatedAt: new Date() }).where(eq(positions.id, id));
  }

  async createTrade(trade: InsertTrade): Promise<Trade> {
    const result = await db.insert(trades).values(trade).returning();
    return result[0];
  }

  async getUserTrades(userId: string): Promise<(Trade & { market: Market; outcome: Outcome })[]> {
    const userTrades = await db.select().from(trades).where(eq(trades.userId, userId)).orderBy(desc(trades.createdAt));
    const tradesWithDetails = await Promise.all(
      userTrades.map(async (trade: Trade) => {
        const market = await db.select().from(markets).where(eq(markets.id, trade.marketId)).limit(1);
        const outcome = await db.select().from(outcomes).where(eq(outcomes.id, trade.outcomeId)).limit(1);
        return { ...trade, market: market[0], outcome: outcome[0] };
      })
    );
    return tradesWithDetails;
  }

  async getMarketTrades(marketId: number): Promise<Trade[]> {
    return await db.select().from(trades).where(eq(trades.marketId, marketId)).orderBy(desc(trades.createdAt));
  }

  async getLeaderboard(limit: number = 10): Promise<{ user: User; profit: number }[]> {
    const allUsers = await db.select().from(users).limit(limit);
    const leaderboard = await Promise.all(
      allUsers.map(async (user: User) => {
        const userPositions = await this.getUserPositions(user.id);
        const profit = userPositions.reduce((acc, pos) => {
          const shares = parseFloat(pos.shares);
          const avgPrice = parseFloat(pos.avgPrice);
          const currentPrice = parseFloat(pos.outcome.probability) / 100;
          return acc + (shares * currentPrice - shares * avgPrice);
        }, 0);
        return { user, profit };
      })
    );
    return leaderboard.sort((a, b) => b.profit - a.profit);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOpenOrders(marketId: number): Promise<(Order & { user: User; outcome: Outcome })[]> {
    const marketOrders = await db.select().from(orders).where(and(eq(orders.marketId, marketId), eq(orders.status, "open"))).orderBy(desc(orders.createdAt));
    const ordersWithDetails = await Promise.all(
      marketOrders.map(async (order: Order) => {
        const user = await db.select().from(users).where(eq(users.id, order.userId)).limit(1);
        const outcome = await db.select().from(outcomes).where(eq(outcomes.id, order.outcomeId)).limit(1);
        return { ...order, user: user[0], outcome: outcome[0] };
      })
    );
    return ordersWithDetails;
  }

  async getUserOrders(userId: string): Promise<(Order & { market: Market; outcome: Outcome })[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    const ordersWithDetails = await Promise.all(
      userOrders.map(async (order: Order) => {
        const market = await db.select().from(markets).where(eq(markets.id, order.marketId)).limit(1);
        const outcome = await db.select().from(outcomes).where(eq(outcomes.id, order.outcomeId)).limit(1);
        return { ...order, market: market[0], outcome: outcome[0] };
      })
    );
    return ordersWithDetails;
  }

  async updateOrderStatus(orderId: number, status: string, filledSize?: string): Promise<void> {
    const updates: any = { status };
    if (filledSize) updates.filledSize = filledSize;
    await db.update(orders).set(updates).where(eq(orders.id, orderId));
  }

  async cancelOrder(orderId: number): Promise<void> {
    await db.update(orders).set({ status: "cancelled" }).where(eq(orders.id, orderId));
  }
}

export class MemStorage implements IStorage {
  private db: MockDb;

  constructor() {
    if (fs.existsSync(MOCK_DB_PATH)) {
      this.db = JSON.parse(fs.readFileSync(MOCK_DB_PATH, "utf-8"));
    } else {
      this.db = {
        users: {},
        markets: {},
        outcomes: {},
        positions: {},
        trades: {},
        orders: {},
        currentId: 1
      };
      this.seedComplexMarkets();
      this.save();
    }
  }

  private save() {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(this.db, null, 2));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.db.users[id];
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Object.values(this.db.users).find(u => u.walletAddress === walletAddress);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = Math.random().toString(36).substring(2, 11);
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.db.users[id] = newUser;
    this.save();
    return newUser;
  }

  async updateUserBalance(userId: string, newBalance: string): Promise<void> {
    if (this.db.users[userId]) {
      this.db.users[userId].balance = newBalance;
      this.save();
    }
  }

  async getAllMarkets(): Promise<(Market & { outcomes: Outcome[] })[]> {
    return Object.values(this.db.markets)
      .map(m => ({
        ...m,
        createdAt: new Date(m.createdAt),
        outcomes: Object.values(this.db.outcomes).filter(o => o.marketId === m.id)
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getMarket(id: number): Promise<(Market & { outcomes: Outcome[] }) | undefined> {
    const market = this.db.markets[id];
    if (!market) return undefined;
    const marketOutcomes = Object.values(this.db.outcomes).filter(o => o.marketId === id);
    return { ...market, createdAt: new Date(market.createdAt), outcomes: marketOutcomes };
  }

  async createMarket(market: InsertMarket, marketOutcomes: InsertOutcome[]): Promise<Market> {
    const id = this.db.currentId++;
    const newMarket: Market = {
      ...market,
      id,
      createdAt: new Date(),
      conditionId: market.conditionId ?? null,
      questionId: market.questionId ?? null,
      txHash: market.txHash ?? null,
      description: market.description ?? null,
      isFeatured: market.isFeatured ?? false,
      isResolved: market.isResolved ?? false,
      resolvedOutcomeId: market.resolvedOutcomeId ?? null,
    };
    this.db.markets[id] = newMarket;

    for (const outcome of marketOutcomes) {
      const outcomeId = this.db.currentId++;
      this.db.outcomes[outcomeId] = { ...outcome, id: outcomeId, marketId: id } as Outcome;
    }

    this.save();
    return newMarket;
  }

  async resolveMarket(marketId: number, outcomeId: number): Promise<void> {
    if (this.db.markets[marketId]) {
      this.db.markets[marketId].isResolved = true;
      this.db.markets[marketId].resolvedOutcomeId = outcomeId;
      this.save();
    }
  }

  async getUserPositions(userId: string): Promise<(Position & { market: Market; outcome: Outcome })[]> {
    return Object.values(this.db.positions)
      .filter(p => p.userId === userId)
      .map(p => ({
        ...p,
        market: this.db.markets[p.marketId],
        outcome: this.db.outcomes[p.outcomeId]
      }));
  }

  async getPosition(userId: string, marketId: number, outcomeId: number): Promise<Position | undefined> {
    return Object.values(this.db.positions).find(
      p => p.userId === userId && p.marketId === marketId && p.outcomeId === outcomeId
    );
  }

  async getMarketPositions(marketId: number): Promise<(Position & { user: User; outcome: Outcome })[]> {
    return Object.values(this.db.positions)
      .filter(p => p.marketId === marketId)
      .map(p => ({
        ...p,
        user: this.db.users[p.userId],
        outcome: this.db.outcomes[p.outcomeId]
      }));
  }

  async createPosition(position: InsertPosition): Promise<Position> {
    const id = this.db.currentId++;
    const newPosition: Position = { ...position, id, createdAt: new Date(), updatedAt: new Date() };
    this.db.positions[id] = newPosition;
    this.save();
    return newPosition;
  }

  async updatePosition(id: number, shares: string, avgPrice: string): Promise<void> {
    if (this.db.positions[id]) {
      this.db.positions[id] = { ...this.db.positions[id], shares, avgPrice, updatedAt: new Date() };
      this.save();
    }
  }

  async createTrade(trade: InsertTrade): Promise<Trade> {
    const id = this.db.currentId++;
    const newTrade: Trade = { ...trade, id, createdAt: new Date() };
    this.db.trades[id] = newTrade;
    this.save();
    return newTrade;
  }

  async getUserTrades(userId: string): Promise<(Trade & { market: Market; outcome: Outcome })[]> {
    return Object.values(this.db.trades)
      .filter(t => t.userId === userId)
      .map(t => ({
        ...t,
        market: this.db.markets[t.marketId],
        outcome: this.db.outcomes[t.outcomeId]
      }));
  }

  async getMarketTrades(marketId: number): Promise<Trade[]> {
    return Object.values(this.db.trades)
      .filter(t => t.marketId === marketId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getLeaderboard(limit: number): Promise<{ user: User; profit: number }[]> {
    const leaderboard = Object.values(this.db.users).map(user => {
      const userPositions = Object.values(this.db.positions).filter(p => p.userId === user.id);
      const profit = userPositions.reduce((acc, pos) => {
        const outcome = this.db.outcomes[pos.outcomeId];
        if (!outcome) return acc;
        const shares = parseFloat(pos.shares);
        const avgPrice = parseFloat(pos.avgPrice);
        const currentPrice = parseFloat(outcome.probability) / 100;
        return acc + (shares * currentPrice - shares * avgPrice);
      }, 0);
      return { user, profit };
    });
    return leaderboard.sort((a, b) => b.profit - a.profit).slice(0, limit);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.db.currentId++;
    const newOrder: Order = { ...order, id, filledSize: order.filledSize ?? "0", status: order.status ?? "open", txHash: order.txHash ?? null, createdAt: new Date() };
    this.db.orders = this.db.orders || {};
    this.db.orders[id] = newOrder;
    this.save();
    return newOrder;
  }

  async getOpenOrders(marketId: number): Promise<(Order & { user: User; outcome: Outcome })[]> {
    if (!this.db.orders) return [];
    return Object.values(this.db.orders)
      .filter(o => o.marketId === marketId && o.status === "open")
      .map(o => ({ ...o, user: this.db.users[o.userId], outcome: this.db.outcomes[o.outcomeId] }));
  }

  async getUserOrders(userId: string): Promise<(Order & { market: Market; outcome: Outcome })[]> {
    if (!this.db.orders) return [];
    return Object.values(this.db.orders)
      .filter(o => o.userId === userId)
      .map(o => ({ ...o, market: this.db.markets[o.marketId], outcome: this.db.outcomes[o.outcomeId] }));
  }

  async updateOrderStatus(orderId: number, status: string, filledSize?: string): Promise<void> {
    if (this.db.orders && this.db.orders[orderId]) {
      this.db.orders[orderId].status = status;
      if (filledSize) this.db.orders[orderId].filledSize = filledSize;
      this.save();
    }
  }

  async cancelOrder(orderId: number): Promise<void> {
    if (this.db.orders && this.db.orders[orderId]) {
      this.db.orders[orderId].status = "cancelled";
      this.save();
    }
  }

  private seedComplexMarkets(): void {
    const categoricalId = this.db.currentId++;
    this.db.markets[categoricalId] = {
      id: categoricalId,
      title: "Who will win the 2024 US Presidential Election?",
      description: "Prediction market for the 2024 US Presidential Election winner",
      category: "Politics",
      marketType: "categorical",
      volume: "850000",
      endDate: "Nov 2024",
      image: "https://images.unsplash.com/photo-1586027021304-64a3833a9833?w=400",
      isFeatured: false,
      isResolved: false,
      createdAt: new Date(),
      conditionId: null,
      questionId: null,
      txHash: null,
      resolvedOutcomeId: null
    } as any;

    const categoricalOutcomes = [
      { label: "Joe Biden", probability: "35.5" },
      { label: "Donald Trump", probability: "42.8" },
      { label: "Ron DeSantis", probability: "12.3" },
      { label: "Nikki Haley", probability: "6.2" },
      { label: "Other", probability: "3.2" }
    ];

    categoricalOutcomes.forEach((outcome, index) => {
      const outcomeId = this.db.currentId++;
      this.db.outcomes[outcomeId] = {
        id: outcomeId,
        marketId: categoricalId,
        label: outcome.label,
        probability: outcome.probability,
        color: index === 0 ? "#3b82f6" : index === 1 ? "#ef4444" : "#6b7280"
      } as any;
    });

    const scalarId = this.db.currentId++;
    this.db.markets[scalarId] = {
      id: scalarId,
      title: "What will Bitcoin's price be at end of 2024?",
      description: "Scalar market for Bitcoin price prediction",
      category: "Crypto",
      marketType: "scalar",
      volume: "425000",
      endDate: "Dec 2024",
      image: "https://images.unsplash.com/photo-1518544866330-4e4815de2e10?w=400",
      isFeatured: false,
      isResolved: false,
      createdAt: new Date(),
      conditionId: null,
      questionId: null,
      txHash: null,
      resolvedOutcomeId: null,
      scalarRange: { min: 50000, max: 150000 }
    } as any;

    const scalarOutcomes = [
      { label: "Below $50,000", probability: "25.0" },
      { label: "Above $150,000", probability: "75.0" }
    ];

    scalarOutcomes.forEach((outcome, index) => {
      const outcomeId = this.db.currentId++;
      this.db.outcomes[outcomeId] = {
        id: outcomeId,
        marketId: scalarId,
        label: outcome.label,
        probability: outcome.probability,
        color: index === 0 ? "#ef4444" : "#10b981"
      } as any;
    });
  }
}

export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
