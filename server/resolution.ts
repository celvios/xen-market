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
      await storage.resolveMarket(data.marketId, data.winningOutcomeId);
      await this.calculatePayouts(data.marketId, data.winningOutcomeId);
      
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

  private async calculatePayouts(marketId: number, winningOutcomeId: number): Promise<void> {
    const positions = await storage.getMarketPositions(marketId);
    
    for (const position of positions) {
      if (position.outcomeId === winningOutcomeId) {
        const payout = parseFloat(position.shares) * 1.0;
        const user = position.user;
        
        if (user) {
          const newBalance = (parseFloat(user.balance) + payout).toFixed(2);
          await storage.updateUserBalance(position.userId, newBalance);
          console.log(`Paid out ${payout} to user ${position.userId}`);
        }
      }
    }
  }

  async proposeResolution(marketId: number, outcomeId: number, evidence: string, proposer: string): Promise<void> {
    setTimeout(() => {
      this.resolveMarket({
        marketId,
        winningOutcomeId: outcomeId,
        evidence,
        resolvedBy: proposer
      });
    }, 1000);
  }
}

export const resolutionService = new ResolutionService();
