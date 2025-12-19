import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTradeSchema, insertPositionSchema } from "@shared/schema";
import { z } from "zod";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { getWebSocketService } from "./websocket";
import { requireAdmin } from "./middleware/auth";
import { apiLimiter, tradeLimiter, authLimiter } from "./middleware/rate-limit";
import { validateRequest, tradeSchema, resolutionSchema, depositSchema } from "./middleware/validation";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Apply global rate limiting
  app.use("/api/", apiLimiter);
  // Config endpoint to serve contract addresses
  app.get("/api/config", (req, res) => {
    try {
      const addressesPath = path.resolve(process.cwd(), "addresses.json");
      if (fs.existsSync(addressesPath)) {
        const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));
        res.json(addresses);
      } else {
        res.status(404).json({ error: "addresses.json not found" });
      }
    } catch (error) {
      console.error("Error reading addresses.json:", error);
      res.status(500).json({ error: "Failed to read config" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Database migration endpoint
  app.get("/api/admin/migrate", async (req, res) => {
    try {
      const { db } = await import("./db");
      if (!db) {
        return res.status(500).json({ error: "Database not configured" });
      }
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          wallet_address TEXT UNIQUE,
          username TEXT UNIQUE,
          balance DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS markets (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          image TEXT NOT NULL,
          category TEXT NOT NULL,
          end_date TEXT NOT NULL,
          volume DECIMAL(12,2) NOT NULL DEFAULT 0,
          is_featured BOOLEAN DEFAULT false,
          is_resolved BOOLEAN DEFAULT false,
          resolved_outcome_id INTEGER,
          condition_id TEXT,
          question_id TEXT,
          tx_hash TEXT,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS outcomes (
          id SERIAL PRIMARY KEY,
          market_id INTEGER NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
          label TEXT NOT NULL,
          probability DECIMAL(5,2) NOT NULL,
          color TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS positions (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          market_id INTEGER NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
          outcome_id INTEGER NOT NULL REFERENCES outcomes(id) ON DELETE CASCADE,
          shares DECIMAL(10,2) NOT NULL,
          avg_price DECIMAL(5,4) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS trades (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          market_id INTEGER NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
          outcome_id INTEGER NOT NULL REFERENCES outcomes(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          shares DECIMAL(10,2) NOT NULL,
          price DECIMAL(5,4) NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          market_id INTEGER NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
          user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          outcome_id INTEGER NOT NULL REFERENCES outcomes(id) ON DELETE CASCADE,
          side TEXT NOT NULL,
          price DECIMAL(5,4) NOT NULL,
          size DECIMAL(10,2) NOT NULL,
          filled_size DECIMAL(10,2) NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'open',
          tx_hash TEXT,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `);
      
      res.json({ success: true, message: "Database migrated successfully" });
    } catch (error: any) {
      console.error("Migration error:", error);
      res.status(500).json({ error: error.message || "Migration failed" });
    }
  });

  // Seed database endpoint
  app.get("/api/admin/seed", async (req, res) => {
    try {
      const { seedDatabase } = await import("./seed");
      await seedDatabase();
      res.json({ success: true, message: "Database seeded successfully" });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ error: "Seeding failed" });
    }
  });

  // ===== MARKETS ROUTES =====

  // Get all markets
  app.get("/api/markets", async (req, res) => {
    try {
      const { cacheService } = await import("./cache");
      const cacheKey = "markets:all";
      
      let markets = await cacheService.get(cacheKey);
      if (!markets) {
        markets = await storage.getAllMarkets();
        
        // Calculate real volume from trades
        markets = await Promise.all(markets.map(async (market) => {
          const trades = await storage.getMarketTrades(market.id);
          const volume = trades.reduce((sum, trade) => sum + parseFloat(trade.totalAmount), 0);
          return { ...market, volume: volume.toFixed(2) };
        }));
        
        await cacheService.set(cacheKey, markets, 60); // Cache for 1 minute
      }
      
      res.json(markets);
    } catch (error) {
      console.error("Error fetching markets:", error);
      res.status(500).json({ error: "Failed to fetch markets" });
    }
  });

  // Create market
  app.post("/api/markets", async (req, res) => {
    try {
      const { title, description, image, category, endDate, conditionId, txHash, outcomes, marketType, scalarRange } = req.body;

      console.log("Received market creation request:", { title, category, endDate, marketType, outcomesCount: outcomes?.length });

      if (!title || !category || !endDate) {
        return res.status(400).json({ error: "Missing required fields: title, category, or endDate" });
      }

      // Validate market type specific requirements
      if (marketType === "binary" && (!outcomes || outcomes.length !== 2)) {
        return res.status(400).json({ error: "Binary markets need exactly 2 outcomes" });
      }

      if (marketType === "categorical" && (!outcomes || outcomes.length < 3)) {
        return res.status(400).json({ error: "Categorical markets need at least 3 outcomes" });
      }

      if (marketType === "scalar" && !scalarRange) {
        return res.status(400).json({ error: "Scalar markets need min/max range" });
      }

      const market = await storage.createMarket(
        {
          title,
          description: description || null,
          image: image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
          category,
          endDate,
          volume: "0",
          isFeatured: false,
          isResolved: false,
          conditionId: conditionId || null,
          txHash: txHash || null,
          marketType: marketType || "binary",
          scalarRange: scalarRange || null,
        } as any,
        outcomes && outcomes.length > 0 ? outcomes.map((outcome: any, index: number) => ({
          marketId: 0,
          label: outcome.label || outcome,
          probability: outcome.probability || (100 / outcomes.length).toFixed(2),
          color: outcome.color || (index === 0 ? "#10b981" : "#ef4444"),
        })) : []
      );

      // Invalidate cache
      const { cacheService } = await import("./cache");
      await cacheService.invalidatePattern("markets:*");

      console.log("Market created successfully:", market.id);
      res.json(market);
    } catch (error: any) {
      console.error("Error creating market:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ error: error.message || "Failed to create market" });
    }
  });

  // Get market by ID
  app.get("/api/markets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const market = await storage.getMarket(id);

      if (!market) {
        return res.status(404).json({ error: "Market not found" });
      }

      res.json(market);
    } catch (error) {
      console.error("Error fetching market:", error);
      res.status(500).json({ error: "Failed to fetch market" });
    }
  });

  // Get market price history
  app.get("/api/markets/:id/price-history", async (req, res) => {
    try {
      const marketId = parseInt(req.params.id);
      const trades = await storage.getMarketTrades(marketId);
      
      if (trades.length === 0) {
        return res.json([]);
      }
      
      // Generate price history from trades
      const priceHistory = trades
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(trade => ({
          timestamp: trade.createdAt,
          price: parseFloat(trade.price) * 100, // Convert to cents
          volume: parseFloat(trade.totalAmount)
        }));
      
      res.json(priceHistory);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  // Get outcome-specific price history
  app.get("/api/markets/:marketId/outcomes/:outcomeId/price-history", async (req, res) => {
    try {
      const marketId = parseInt(req.params.marketId);
      const outcomeId = parseInt(req.params.outcomeId);
      const trades = await storage.getMarketTrades(marketId);
      
      const outcomeTrades = trades.filter(t => t.outcomeId === outcomeId);
      
      if (outcomeTrades.length === 0) {
        return res.json([]);
      }
      
      const priceHistory = outcomeTrades
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(trade => ({
          timestamp: trade.createdAt,
          price: parseFloat(trade.price) * 100,
          volume: parseFloat(trade.totalAmount)
        }));
      
      res.json(priceHistory);
    } catch (error) {
      console.error("Error fetching outcome price history:", error);
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  // ===== USER ROUTES =====

  // Get or create user by wallet address
  app.post("/api/auth/wallet", async (req, res) => {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      let user = await storage.getUserByWallet(walletAddress);

      if (!user) {
        user = await storage.createUser({
          walletAddress,
          username: `user_${walletAddress.slice(0, 6)}`,
          balance: "0.00"
        });
      }

      res.json(user);
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Deposit USDC
  app.post("/api/users/:id/deposit", validateRequest(depositSchema), async (req, res) => {
    try {
      const { amount, txHash } = req.body;
      const userId = req.params.id;

      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newBalance = (parseFloat(user.balance) + parseFloat(amount)).toFixed(2);
      await storage.updateUserBalance(userId, newBalance);

      res.json({ success: true, newBalance, txHash });
    } catch (error) {
      console.error("Error processing deposit:", error);
      res.status(500).json({ error: "Deposit failed" });
    }
  });

  // Withdraw USDC
  app.post("/api/users/:id/withdraw", async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = req.params.id;

      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentBalance = parseFloat(user.balance);
      if (currentBalance < parseFloat(amount)) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      const newBalance = (currentBalance - parseFloat(amount)).toFixed(2);
      await storage.updateUserBalance(userId, newBalance);

      res.json({ success: true, newBalance });
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ error: "Withdrawal failed" });
    }
  });

  // ===== TRADING ROUTES =====

  // Place order (buy/sell)
  app.post("/api/orders", async (req, res) => {
    try {
      const { userId, marketId, outcomeId, side, price, size, txHash } = req.body;

      if (!userId || !marketId || !outcomeId || !side || !price || !size) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const order = await storage.createOrder({
        userId,
        marketId,
        outcomeId,
        side,
        price,
        size,
        filledSize: "0",
        status: "open",
        txHash
      });

      // Broadcast new order via WebSocket
      const ws = getWebSocketService();
      if (ws) {
        ws.broadcastNewOrder(marketId, order);
      }

      // Trigger order matching
      const { orderMatchingEngine } = await import("./order-matching");
      setTimeout(() => {
        orderMatchingEngine.matchOrders(marketId, outcomeId).catch(console.error);
      }, 100);

      res.json(order);
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  // Get open orders for market
  app.get("/api/orders/market/:marketId", async (req, res) => {
    try {
      const marketId = parseInt(req.params.marketId);
      const orders = await storage.getOpenOrders(marketId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get order book for outcome
  app.get("/api/markets/:marketId/outcomes/:outcomeId/orderbook", async (req, res) => {
    try {
      const marketId = parseInt(req.params.marketId);
      const outcomeId = parseInt(req.params.outcomeId);
      
      const orders = await storage.getOpenOrders(marketId);
      const outcomeOrders = orders.filter(o => o.outcomeId === outcomeId);
      
      const buyOrders = outcomeOrders
        .filter(o => o.side === "buy")
        .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        .slice(0, 10);
      
      const sellOrders = outcomeOrders
        .filter(o => o.side === "sell")
        .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        .slice(0, 10);
      
      const bestBid = buyOrders[0] ? parseFloat(buyOrders[0].price) : null;
      const bestAsk = sellOrders[0] ? parseFloat(sellOrders[0].price) : null;
      const spread = bestBid && bestAsk ? bestAsk - bestBid : null;
      const lastPrice = await getLastTradePrice(marketId, outcomeId);
      
      res.json({
        bids: buyOrders.map(o => ({
          price: parseFloat(o.price),
          size: parseFloat(o.size) - parseFloat(o.filledSize),
          total: (parseFloat(o.size) - parseFloat(o.filledSize)) * parseFloat(o.price)
        })),
        asks: sellOrders.map(o => ({
          price: parseFloat(o.price),
          size: parseFloat(o.size) - parseFloat(o.filledSize),
          total: (parseFloat(o.size) - parseFloat(o.filledSize)) * parseFloat(o.price)
        })),
        bestBid,
        bestAsk,
        spread,
        lastPrice
      });
    } catch (error) {
      console.error("Error fetching order book:", error);
      res.status(500).json({ error: "Failed to fetch order book" });
    }
  });

  async function getLastTradePrice(marketId: number, outcomeId: number): Promise<number | null> {
    try {
      const trades = await storage.getMarketTrades(marketId);
      const outcomeTrades = trades.filter(t => t.outcomeId === outcomeId);
      return outcomeTrades.length > 0 ? parseFloat(outcomeTrades[0].price) : null;
    } catch {
      return null;
    }
  }

  // Get user orders
  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const orders = await storage.getUserOrders(req.params.userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Cancel order
  app.post("/api/orders/:orderId/cancel", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      await storage.cancelOrder(orderId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ error: "Failed to cancel order" });
    }
  });

  // Buy shares
  app.post("/api/trade/buy", tradeLimiter, validateRequest(tradeSchema), async (req, res) => {
    try {
      const { userId, marketId, outcomeId, amountUSD, price, isMaker = false } = req.body;

      // Validate inputs
      if (!userId || !marketId || !outcomeId || !amountUSD || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get user to check balance
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const balance = parseFloat(user.balance);
      const amount = parseFloat(amountUSD);

      // Calculate trading fee
      const { FeeService } = await import("./fee-service");
      const userVolume = 0; // TODO: Calculate 30-day volume
      const { fee, feeRate } = FeeService.calculateTradingFee(amount, isMaker, userVolume);
      const totalCost = amount + fee;

      if (balance < totalCost) {
        return res.status(400).json({ error: "Insufficient balance (including fees)" });
      }

      // Calculate shares
      const priceDecimal = parseFloat(price);
      const shares = amount / priceDecimal;

      // Update user balance (deduct amount + fee)
      const newBalance = (balance - totalCost).toFixed(2);
      await storage.updateUserBalance(userId, newBalance);

      // Check if position exists
      const existingPosition = await storage.getPosition(userId, marketId, outcomeId);

      if (existingPosition) {
        // Update existing position
        const existingShares = parseFloat(existingPosition.shares);
        const existingAvgPrice = parseFloat(existingPosition.avgPrice);

        const totalCost = (existingShares * existingAvgPrice) + amount;
        const totalShares = existingShares + shares;
        const newAvgPrice = totalCost / totalShares;

        await storage.updatePosition(
          existingPosition.id,
          totalShares.toFixed(2),
          newAvgPrice.toFixed(4)
        );
      } else {
        // Create new position
        await storage.createPosition({
          userId,
          marketId,
          outcomeId,
          shares: shares.toFixed(2),
          avgPrice: priceDecimal.toFixed(4)
        });
      }

      // Record trade with fee information
      const trade = await storage.createTrade({
        userId,
        marketId,
        outcomeId,
        type: "buy",
        shares: shares.toFixed(2),
        price: priceDecimal.toFixed(4),
        totalAmount: amount.toFixed(2),
        feesPaid: fee.toFixed(4),
        feeRate: feeRate.toFixed(6),
        isMaker
      } as any);

      // Broadcast trade via WebSocket
      const ws = getWebSocketService();
      if (ws) {
        ws.broadcastNewTrade(marketId, trade);
      }

      res.json({ trade, newBalance, fee: fee.toFixed(4), feeRate: (feeRate * 100).toFixed(2) + '%' });
    } catch (error) {
      console.error("Error executing buy:", error);
      res.status(500).json({ error: "Trade execution failed" });
    }
  });

  // Sell shares
  app.post("/api/trade/sell", tradeLimiter, validateRequest(tradeSchema), async (req, res) => {
    try {
      const { userId, marketId, outcomeId, shares, price } = req.body;

      if (!userId || !marketId || !outcomeId || !shares || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get position to check if user has shares
      const position = await storage.getPosition(userId, marketId, outcomeId);
      if (!position) {
        return res.status(404).json({ error: "Position not found" });
      }

      const availableShares = parseFloat(position.shares);
      const sharesToSell = parseFloat(shares);

      if (availableShares < sharesToSell) {
        return res.status(400).json({ error: "Insufficient shares" });
      }

      // Calculate proceeds
      const priceDecimal = parseFloat(price);
      const proceeds = sharesToSell * priceDecimal;

      // Update user balance
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newBalance = (parseFloat(user.balance) + proceeds).toFixed(2);
      await storage.updateUserBalance(userId, newBalance);

      // Update position
      const remainingShares = availableShares - sharesToSell;
      if (remainingShares > 0) {
        await storage.updatePosition(
          position.id,
          remainingShares.toFixed(2),
          position.avgPrice
        );
      } else {
        // Position fully closed - could delete or set to 0
        await storage.updatePosition(position.id, "0", position.avgPrice);
      }

      // Record trade
      const trade = await storage.createTrade({
        userId,
        marketId,
        outcomeId,
        type: "sell",
        shares: sharesToSell.toFixed(2),
        price: priceDecimal.toFixed(4),
        totalAmount: proceeds.toFixed(2)
      });

      // Broadcast trade via WebSocket
      const ws = getWebSocketService();
      if (ws) {
        ws.broadcastNewTrade(marketId, trade);
      }

      res.json({ trade, newBalance });
    } catch (error) {
      console.error("Error executing sell:", error);
      res.status(500).json({ error: "Trade execution failed" });
    }
  });

  // ===== PORTFOLIO ROUTES =====

  // Get user positions
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const positions = await storage.getUserPositions(req.params.userId);
      res.json(positions);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  // ===== ACTIVITY ROUTES =====

  // Get user trades
  app.get("/api/activity/:userId", async (req, res) => {
    try {
      const trades = await storage.getUserTrades(req.params.userId);
      res.json(trades);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  // ===== LEADERBOARD ROUTES =====

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // ===== RESOLUTION ROUTES =====

  // Propose market resolution
  app.post("/api/markets/:id/resolve", authLimiter, requireAdmin, validateRequest(resolutionSchema), async (req, res) => {
    try {
      const marketId = parseInt(req.params.id);
      const { outcomeId, evidence, proposer } = req.body;

      if (!outcomeId || !evidence || !proposer) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { resolutionService } = await import("./resolution");
      await resolutionService.proposeResolution(marketId, outcomeId, evidence, proposer);
      
      res.json({ success: true, message: "Resolution proposed" });
    } catch (error) {
      console.error("Error proposing resolution:", error);
      res.status(500).json({ error: "Failed to propose resolution" });
    }
  });

  // ===== ANALYTICS ROUTES =====

  // Get platform analytics
  app.get("/api/analytics/platform", async (req, res) => {
    try {
      const { analyticsService } = await import("./analytics");
      const analytics = await analyticsService.getPlatformAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching platform analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Get market analytics
  app.get("/api/analytics/market/:id", async (req, res) => {
    try {
      const marketId = parseInt(req.params.id);
      const { analyticsService } = await import("./analytics");
      const analytics = await analyticsService.getMarketAnalytics(marketId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching market analytics:", error);
      res.status(500).json({ error: "Failed to fetch market analytics" });
    }
  });

  // Get market correlation
  app.get("/api/analytics/correlation/:id1/:id2", async (req, res) => {
    try {
      const marketId1 = parseInt(req.params.id1);
      const marketId2 = parseInt(req.params.id2);
      const { analyticsService } = await import("./analytics");
      const correlation = await analyticsService.getMarketCorrelation(marketId1, marketId2);
      res.json({ correlation });
    } catch (error) {
      console.error("Error calculating correlation:", error);
      res.status(500).json({ error: "Failed to calculate correlation" });
    }
  });

  // ===== FEE REVENUE ROUTES =====

  // Get fee revenue data
  app.get("/api/fees/revenue", async (req, res) => {
    try {
      // Mock fee revenue data
      const revenueData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tradingFees: Math.random() * 500 + 100,
        creationFees: Math.random() * 100 + 20,
        withdrawalFees: Math.random() * 50 + 10,
        totalRevenue: 0
      }));

      revenueData.forEach(day => {
        day.totalRevenue = day.tradingFees + day.creationFees + day.withdrawalFees;
      });

      res.json(revenueData);
    } catch (error) {
      console.error("Error fetching fee revenue:", error);
      res.status(500).json({ error: "Failed to fetch fee revenue" });
    }
  });

  // Get fee structure
  app.get("/api/fees/structure", async (req, res) => {
    try {
      const { FeeService } = await import("./fee-service");
      const structure = FeeService.getFeeStructure();
      const tiers = FeeService.getVolumeTiers();
      
      res.json({ structure, tiers });
    } catch (error) {
      console.error("Error fetching fee structure:", error);
      res.status(500).json({ error: "Failed to fetch fee structure" });
    }
  });

  return httpServer;
}
