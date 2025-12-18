import { storage } from "./storage";
import { getWebSocketService } from "./websocket";

interface Order {
  id: number;
  userId: string;
  marketId: number;
  outcomeId: number;
  side: "buy" | "sell";
  price: string;
  size: string;
  filledSize: string;
  status: string;
}

export class OrderMatchingEngine {
  async matchOrders(marketId: number, outcomeId: number): Promise<void> {
    try {
      const orders = await storage.getOpenOrders(marketId);
      const outcomeOrders = orders.filter(o => o.outcomeId === outcomeId);
      
      const buyOrders = outcomeOrders
        .filter(o => o.side === "buy")
        .sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); // Highest price first
      
      const sellOrders = outcomeOrders
        .filter(o => o.side === "sell")
        .sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); // Lowest price first

      for (const buyOrder of buyOrders) {
        for (const sellOrder of sellOrders) {
          if (parseFloat(buyOrder.price) >= parseFloat(sellOrder.price)) {
            await this.executeTrade(buyOrder, sellOrder);
          }
        }
      }
    } catch (error) {
      console.error("Order matching failed:", error);
    }
  }

  private async executeTrade(buyOrder: Order, sellOrder: Order): Promise<void> {
    const buyRemaining = parseFloat(buyOrder.size) - parseFloat(buyOrder.filledSize);
    const sellRemaining = parseFloat(sellOrder.size) - parseFloat(sellOrder.filledSize);
    
    if (buyRemaining <= 0 || sellRemaining <= 0) return;

    const tradeSize = Math.min(buyRemaining, sellRemaining);
    const tradePrice = parseFloat(sellOrder.price); // Use seller's price
    const totalAmount = tradeSize * tradePrice;

    // Update order fill amounts
    const newBuyFilled = parseFloat(buyOrder.filledSize) + tradeSize;
    const newSellFilled = parseFloat(sellOrder.filledSize) + tradeSize;

    await storage.updateOrderStatus(
      buyOrder.id,
      newBuyFilled >= parseFloat(buyOrder.size) ? "filled" : "partial",
      newBuyFilled.toFixed(2)
    );

    await storage.updateOrderStatus(
      sellOrder.id,
      newSellFilled >= parseFloat(sellOrder.size) ? "filled" : "partial",
      newSellFilled.toFixed(2)
    );

    // Create trade records
    await storage.createTrade({
      userId: buyOrder.userId,
      marketId: buyOrder.marketId,
      outcomeId: buyOrder.outcomeId,
      type: "buy",
      shares: tradeSize.toFixed(2),
      price: tradePrice.toFixed(4),
      totalAmount: totalAmount.toFixed(2)
    });

    await storage.createTrade({
      userId: sellOrder.userId,
      marketId: sellOrder.marketId,
      outcomeId: sellOrder.outcomeId,
      type: "sell",
      shares: tradeSize.toFixed(2),
      price: tradePrice.toFixed(4),
      totalAmount: totalAmount.toFixed(2)
    });

    // Update positions
    await this.updatePositions(buyOrder, sellOrder, tradeSize, tradePrice);

    // Broadcast trade
    const ws = getWebSocketService();
    if (ws) {
      ws.broadcastNewTrade(buyOrder.marketId, {
        marketId: buyOrder.marketId,
        outcomeId: buyOrder.outcomeId,
        price: tradePrice,
        size: tradeSize,
        timestamp: new Date().toISOString()
      });
    }

    console.log(`Trade executed: ${tradeSize} shares at $${tradePrice}`);
  }

  private async updatePositions(buyOrder: Order, sellOrder: Order, tradeSize: number, tradePrice: number): Promise<void> {
    // Update buyer position
    const buyerPosition = await storage.getPosition(buyOrder.userId, buyOrder.marketId, buyOrder.outcomeId);
    if (buyerPosition) {
      const existingShares = parseFloat(buyerPosition.shares);
      const existingAvgPrice = parseFloat(buyerPosition.avgPrice);
      const totalCost = (existingShares * existingAvgPrice) + (tradeSize * tradePrice);
      const totalShares = existingShares + tradeSize;
      const newAvgPrice = totalCost / totalShares;

      await storage.updatePosition(buyerPosition.id, totalShares.toFixed(2), newAvgPrice.toFixed(4));
    } else {
      await storage.createPosition({
        userId: buyOrder.userId,
        marketId: buyOrder.marketId,
        outcomeId: buyOrder.outcomeId,
        shares: tradeSize.toFixed(2),
        avgPrice: tradePrice.toFixed(4)
      });
    }

    // Update seller position
    const sellerPosition = await storage.getPosition(sellOrder.userId, sellOrder.marketId, sellOrder.outcomeId);
    if (sellerPosition) {
      const remainingShares = parseFloat(sellerPosition.shares) - tradeSize;
      if (remainingShares > 0) {
        await storage.updatePosition(sellerPosition.id, remainingShares.toFixed(2), sellerPosition.avgPrice);
      } else {
        await storage.updatePosition(sellerPosition.id, "0", sellerPosition.avgPrice);
      }
    }
  }
}

export const orderMatchingEngine = new OrderMatchingEngine();