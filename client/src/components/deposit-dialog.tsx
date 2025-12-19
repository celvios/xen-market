import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from "wagmi";
import { parseUnits, formatUnits, type Address } from "viem";
import { config } from "@/lib/config";
import { useStore } from "@/lib/store";

const USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582" as Address; // Polygon Amoy USDC
const USDC_ABI = [
  {
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface DepositDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DepositDialog({ isOpen, onClose, onSuccess }: DepositDialogProps) {
  const [amount, setAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();
  const { user, refreshUser } = useStore();
  const { writeContractAsync } = useWriteContract();

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const handleDeposit = async () => {
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

    setIsDepositing(true);

    try {
      // Transfer USDC to platform (for now, just update database)
      const tx = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "transfer",
        args: [address, parseUnits(amount, 6)], // Self-transfer for demo
      });

      // Update user balance in database
      const response = await fetch(`${config.apiUrl}/api/users/${user.id}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, txHash: tx }),
      });

      if (!response.ok) throw new Error("Failed to update balance");

      toast({
        title: "Deposit Successful",
        description: `Deposited ${amount} USDC`,
      });

      setAmount("");
      await refreshUser();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Deposit Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit USDC</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {usdcBalance && (
            <div className="text-sm text-muted-foreground">
              Wallet Balance: {formatUnits(usdcBalance as bigint, 6)} USDC
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-2 block">Amount (USDC)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isDepositing}
              className="text-lg"
            />
          </div>
          <Button onClick={handleDeposit} className="w-full" disabled={isDepositing}>
            {isDepositing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Depositing...
              </>
            ) : (
              "Deposit"
            )}
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            Get testnet USDC from{" "}
            <a
              href="https://faucet.polygon.technology/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Polygon Faucet
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
