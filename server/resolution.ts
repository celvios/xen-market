import { storage } from "./storage";
import { getWebSocketService } from "./websocket";

export interface ResolutionData {
  marketId: number;
  winningOutcomeId: number;
  evidence: string;
  resolvedBy: string;
}

export class ResolutionService {
  async resolveMarket(data: ResolutionData): Promise<void> {
    try {
      // Update market as resolved
      await this.updateMarketResolution(data.marketId, data.winningOutcomeId);
      
      // Calculate and distribute payouts
      await this.calculatePayouts(data.marketId, data.winningOutcomeId);
      
      // Broadcast resolution
      const ws = getWebSocketService();
      if (ws) {
        ws.broadcastMarketResolution(data.marketId, data.winningOutcomeId);
      }
      
      console.log(`Market ${data.marketId} resolved to outcome ${data.winningOutcomeId}`);
    } catch (error) {
      console.error("Resolution failed:", error);
      throw error;
    }
  }

  private async updateMarketResolution(marketId: number, winningOutcomeId: number): Promise<void> {
    // In a real implementation, this would update the database
    // For now, we'll use the storage interface
    console.log(`Resolving market ${marketId} to outcome ${winningOutcomeId}`);
  }

  private async calculatePayouts(marketId: number, winningOutcomeId: number): Promise<void> {
    // Get all positions for this market
    const positions = await storage.getUserPositions(""); // This would need to be modified to get all positions
    
    // Calculate payouts for winning positions
    for (const position of positions) {
      if (position.marketId === marketId && position.outcomeId === winningOutcomeId) {
        const payout = parseFloat(position.shares) * 1.0; // $1 per winning share
        
        // Update user balance
        const user = await storage.getUser(position.userId);
        if (user) {
          const newBalance = (parseFloat(user.balance) + payout).toFixed(2);
          await storage.updateUserBalance(position.userId, newBalance);
        }
      }
    }
  }

  async proposeResolution(marketId: number, outcomeId: number, evidence: string, proposer: string): Promise<void> {
    // In a real system, this would create a resolution proposal
    // For now, auto-resolve after a delay
    setTimeout(() => {
      this.resolveMarket({
        marketId,
        winningOutcomeId: outcomeId,
        evidence,
        resolvedBy: proposer
      });
    }, 5000); // 5 second delay for demo
  }
}

export const resolutionService = new ResolutionService();