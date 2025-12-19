import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coins, Loader2 } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, type Address } from "viem";

interface MockUSDCFaucetProps {
  userId: string;
  walletAddress: string;
  onSuccess: () => void;
}

const USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582" as Address; // Polygon Amoy testnet

const USDC_ABI = [
  {
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function MockUSDCFaucet({ userId, walletAddress, onSuccess }: MockUSDCFaucetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();

  const claimFaucet = async () => {
    setIsLoading(true);
    try {
      // Mint 1000 USDC on testnet
      const txHash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "faucet",
        args: [],
      });

      // Update database balance
      const response = await fetch(`/api/users/${userId}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: "1000", txHash }),
      });

      if (!response.ok) throw new Error("Database update failed");

      toast({
        title: "USDC Claimed!",
        description: "1000 USDC minted to your wallet",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Claim Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Coins className="w-4 h-4" />
          Mock USDC Faucet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          Get free test USDC to start trading
        </p>
        <Button
          onClick={claimFaucet}
          disabled={isLoading}
          size="sm"
          className="w-full"
        >
          {isLoading && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
          Claim $1000 USDC
        </Button>
      </CardContent>
    </Card>
  );
}
