import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { config } from "@/lib/config";
import { useStore } from "@/lib/store";

interface WithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function WithdrawDialog({ isOpen, onClose, onSuccess }: WithdrawDialogProps) {
  const [amount, setAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();
  const { user, refreshUser } = useStore();

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!address || !user.id) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) > parseFloat(user.balance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);

    try {
      const response = await fetch(`${config.apiUrl}/api/users/${user.id}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) throw new Error("Failed to withdraw");

      toast({
        title: "Withdrawal Successful",
        description: `Withdrew ${amount} USDC`,
      });

      setAmount("");
      await refreshUser();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw USDC</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="text-sm text-muted-foreground">
            Available Balance: ${parseFloat(user.balance).toFixed(2)} USDC
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Amount (USDC)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isWithdrawing}
              className="text-lg"
            />
          </div>
          <Button onClick={handleWithdraw} className="w-full" disabled={isWithdrawing}>
            {isWithdrawing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Withdrawing...
              </>
            ) : (
              "Withdraw"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
