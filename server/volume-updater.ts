import { storage } from "./storage";
import { db } from "./db";
import { markets } from "@shared/schema";
import { eq } from "drizzle-orm";

export class VolumeUpdater {
  private intervalId: NodeJS.Timeout | null = null;

  start(intervalMs: number = 60000) {
    console.log("Starting volume updater...");
    this.updateAllVolumes();
    this.intervalId = setInterval(() => this.updateAllVolumes(), intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async updateAllVolumes() {
    try {
      const allMarkets = await storage.getAllMarkets();
      
      for (const market of allMarkets) {
        const trades = await storage.getMarketTrades(market.id);
        const volume = trades.reduce((sum, trade) => sum + parseFloat(trade.totalAmount), 0);
        
        if (db && process.env.DATABASE_URL) {
          await db.update(markets).set({ volume: volume.toFixed(2) }).where(eq(markets.id, market.id));
        }
      }
      
      console.log(`Updated volumes for ${allMarkets.length} markets`);
    } catch (error) {
      console.error("Error updating volumes:", error);
    }
  }
}

export const volumeUpdater = new VolumeUpdater();
