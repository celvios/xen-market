import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coins, Loader2 } from "lucide-react";

interface MockUSDCFaucetProps {
  userId: string;
  onSuccess: () => void;
}

export function MockUSDCFaucet({ userId, onSuccess }: MockUSDCFaucetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const claimFaucet = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: "1000", txHash: "mock-faucet" }),
      });

      if (!response.ok) throw new Error("Faucet claim failed");

      toast({
        title: "Mock USDC Claimed!",
        description: "Added $1000 to your balance",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Please try again",
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
