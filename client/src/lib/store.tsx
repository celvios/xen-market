import React, { createContext, useContext, useState, useEffect } from "react";
import { Market, MOCK_MARKETS } from "./mock-data";
import { useToast } from "@/hooks/use-toast";

interface Position {
  marketId: string;
  outcomeId: string; // 'yes' | 'no' etc
  shares: number;
  avgPrice: number; // 0.00 - 1.00
}

interface UserState {
  balance: number;
  portfolioValue: number;
  positions: Position[];
  isLoggedIn: boolean;
}

interface StoreContextType {
  user: UserState;
  login: () => void;
  buyShares: (marketId: string, outcomeId: string, amountUSD: number, price: number) => void;
  sellShares: (marketId: string, outcomeId: string, percentage: number, price: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<UserState>({
    balance: 1000.00,
    portfolioValue: 0,
    positions: [],
    isLoggedIn: false,
  });

  const login = () => {
    setUser(prev => ({ ...prev, isLoggedIn: true }));
    toast({
      title: "Wallet Connected",
      description: "You've successfully connected your wallet.",
    });
  };

  const buyShares = (marketId: string, outcomeId: string, amountUSD: number, price: number) => {
    if (!user.isLoggedIn) {
      toast({ title: "Connect Wallet", description: "Please connect your wallet to trade.", variant: "destructive" });
      return;
    }
    if (user.balance < amountUSD) {
      toast({ title: "Insufficient Funds", description: "Deposit more USDC to trade.", variant: "destructive" });
      return;
    }

    const shares = amountUSD / price;

    setUser(prev => {
      const existingPositionIndex = prev.positions.findIndex(p => p.marketId === marketId && p.outcomeId === outcomeId);
      let newPositions = [...prev.positions];

      if (existingPositionIndex >= 0) {
        const existing = newPositions[existingPositionIndex];
        const totalCost = (existing.shares * existing.avgPrice) + amountUSD;
        const totalShares = existing.shares + shares;
        newPositions[existingPositionIndex] = {
          ...existing,
          shares: totalShares,
          avgPrice: totalCost / totalShares
        };
      } else {
        newPositions.push({ marketId, outcomeId, shares, avgPrice: price });
      }

      return {
        ...prev,
        balance: prev.balance - amountUSD,
        positions: newPositions
      };
    });

    toast({
      title: "Order Filled",
      description: `Bought ${(amountUSD / price).toFixed(1)} shares.`,
    });
  };

  const sellShares = (marketId: string, outcomeId: string, percentage: number, price: number) => {
    // Simplified sell logic for prototype
    toast({ title: "Sell Order", description: "Selling functionality coming in next update." });
  };

  // Recalculate portfolio value mock
  useEffect(() => {
    const value = user.positions.reduce((acc, pos) => {
      // In a real app, we'd look up current price. Here we just use avgPrice for simplicity or mock current price
      return acc + (pos.shares * pos.avgPrice); 
    }, 0);
    setUser(prev => ({ ...prev, portfolioValue: value }));
  }, [user.positions]);

  return (
    <StoreContext.Provider value={{ user, login, buyShares, sellShares }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
