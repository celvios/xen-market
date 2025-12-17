import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTradeSchema, insertPositionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // ===== MARKETS ROUTES =====
  
  // Get all markets
  app.get("/api/markets", async (req, res) => {
    try {
      const markets = await storage.getAllMarkets();
      res.json(markets);
    } catch (error) {
      console.error("Error fetching markets:", error);
      res.status(500).json({ error: "Failed to fetch markets" });
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
          balance: "1000.00"
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

  // ===== TRADING ROUTES =====
  
  // Buy shares
  app.post("/api/trade/buy", async (req, res) => {
    try {
      const { userId, marketId, outcomeId, amountUSD, price } = req.body;
      
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

      if (balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // Calculate shares
      const priceDecimal = parseFloat(price);
      const shares = amount / priceDecimal;

      // Update user balance
      const newBalance = (balance - amount).toFixed(2);
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

      // Record trade
      const trade = await storage.createTrade({
        userId,
        marketId,
        outcomeId,
        type: "buy",
        shares: shares.toFixed(2),
        price: priceDecimal.toFixed(4),
        totalAmount: amount.toFixed(2)
      });

      res.json({ trade, newBalance });
    } catch (error) {
      console.error("Error executing buy:", error);
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

  return httpServer;
}
