import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { authenticateWallet, fetchUser, type User } from "./api";

interface UserState {
  id: string | null;
  balance: number;
  isLoggedIn: boolean;
  walletAddress: string | null;
}

interface StoreContextType {
  user: UserState;
  login: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<UserState>({
    id: null,
    balance: 0,
    isLoggedIn: false,
    walletAddress: null,
  });

  const login = async () => {
    try {
      // Generate a mock wallet address for demo
      const mockWallet = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
      
      const userData = await authenticateWallet(mockWallet);
      
      setUser({
        id: userData.id,
        balance: parseFloat(userData.balance),
        isLoggedIn: true,
        walletAddress: userData.walletAddress,
      });

      toast({
        title: "Wallet Connected",
        description: "You've successfully connected your wallet.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshUser = async () => {
    if (!user.id) return;
    
    try {
      const userData = await fetchUser(user.id);
      setUser(prev => ({
        ...prev,
        balance: parseFloat(userData.balance),
      }));
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  return (
    <StoreContext.Provider value={{ user, login, refreshUser }}>
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
