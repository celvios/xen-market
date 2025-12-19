import { describe, it, expect, beforeEach } from "vitest";
import { MemStorage } from "../storage";

describe("Storage", () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  describe("User Operations", () => {
    it("should create a user", async () => {
      const user = await storage.createUser({
        walletAddress: "0x123",
        username: "testuser",
        balance: "1000.00",
      });

      expect(user).toBeDefined();
      expect(user.walletAddress).toBe("0x123");
      expect(user.balance).toBe("1000.00");
    });

    it("should get user by wallet", async () => {
      await storage.createUser({
        walletAddress: "0x123",
        username: "testuser",
        balance: "1000.00",
      });

      const user = await storage.getUserByWallet("0x123");
      expect(user).toBeDefined();
      expect(user?.username).toBe("testuser");
    });

    it("should update user balance", async () => {
      const user = await storage.createUser({
        walletAddress: "0x123",
        username: "testuser",
        balance: "1000.00",
      });

      await storage.updateUserBalance(user.id, "1500.00");
      const updated = await storage.getUser(user.id);
      expect(updated?.balance).toBe("1500.00");
    });
  });

  describe("Market Operations", () => {
    it("should create a market", async () => {
      const market = await storage.createMarket(
        {
          title: "Test Market",
          image: "test.jpg",
          category: "Test",
          endDate: "2024-12-31",
          volume: "0",
        },
        [
          { marketId: 0, label: "Yes", probability: "50.00", color: "#10b981" },
          { marketId: 0, label: "No", probability: "50.00", color: "#ef4444" },
        ]
      );

      expect(market).toBeDefined();
      expect(market.title).toBe("Test Market");
    });

    it("should resolve a market", async () => {
      const market = await storage.createMarket(
        {
          title: "Test Market",
          image: "test.jpg",
          category: "Test",
          endDate: "2024-12-31",
          volume: "0",
        },
        []
      );

      await storage.resolveMarket(market.id, 1);
      const resolved = await storage.getMarket(market.id);
      expect(resolved?.isResolved).toBe(true);
      expect(resolved?.resolvedOutcomeId).toBe(1);
    });
  });

  describe("Position Operations", () => {
    it("should create a position", async () => {
      const user = await storage.createUser({
        walletAddress: "0x123",
        username: "testuser",
        balance: "1000.00",
      });

      const market = await storage.createMarket(
        {
          title: "Test Market",
          image: "test.jpg",
          category: "Test",
          endDate: "2024-12-31",
          volume: "0",
        },
        [{ marketId: 0, label: "Yes", probability: "50.00", color: "#10b981" }]
      );

      const position = await storage.createPosition({
        userId: user.id,
        marketId: market.id,
        outcomeId: 1,
        shares: "10.00",
        avgPrice: "0.50",
      });

      expect(position).toBeDefined();
      expect(position.shares).toBe("10.00");
    });
  });
});
