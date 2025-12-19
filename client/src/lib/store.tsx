import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { authenticateWallet, fetchUser, type User } from "./api";
import { useAccount, useBalance } from "wagmi";

interface UserState {
  id: string | null;
  balance: number;
  isLoggedIn: boolean;
  walletAddress: string | null;
}

interface StoreContextType {
  user: UserState;
  refreshUser: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const [user, setUser] = useState<UserState>({
    id: null,
    balance: 0,
    isLoggedIn: false,
    walletAddress: null,
  });

  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (isConnected && address) {
        try {
          const userData = await authenticateWallet(address);
          setUser({
            id: userData.id,
            balance: parseFloat(userData.balance),
            isLoggedIn: true,
            walletAddress: userData.walletAddress,
          });

          // Only show toast on first connection, not on reload
          if (!hasShownToast) {
            toast({
              title: "Wallet Connected",
              description: `Logged in as ${address.slice(0, 6)}...${address.slice(-4)}`,
            });
            setHasShownToast(true);
          }
        } catch (error) {
          console.error("Auth failed:", error);
        }
      } else {
        setUser({
          id: null,
          balance: 0,
          isLoggedIn: false,
          walletAddress: null,
        });
        setHasShownToast(false);
      }
    };

    syncUser();
  }, [isConnected, address, toast, hasShownToast]);

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
    <StoreContext.Provider value={{ user, refreshUser }}>
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
