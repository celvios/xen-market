# Phase 6: Resolution & Payouts - Implementation Complete

## ✅ Changes Made

### 1. Storage Methods (storage.ts) ✅
Added new methods to IStorage interface and implementations:
- `resolveMarket(marketId, outcomeId)` - Updates market as resolved
- `getMarketPositions(marketId)` - Gets all positions for payout calculation

### 2. Resolution Service (resolution.ts) ✅
Updated with proper implementation:
- `resolveMarket()` - Calls storage.resolveMarket and calculates payouts
- `calculatePayouts()` - Uses getMarketPositions to distribute winnings
- Automatic payout to winning positions ($1 per share)
- WebSocket broadcast for real-time updates

### 3. Claim Endpoint (routes.ts) - TO ADD
Add this endpoint after the resolution routes:

```typescript
// Claim winnings from resolved market
app.post("/api/markets/:id/claim", async (req, res) => {
  try {
    const marketId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const market = await storage.getMarket(marketId);
    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }

    if (!market.isResolved) {
      return res.status(400).json({ error: "Market not resolved yet" });
    }

    const position = await storage.getPosition(userId, marketId, market.resolvedOutcomeId!);
    if (!position) {
      return res.status(404).json({ error: "No winning position found" });
    }

    const shares = parseFloat(position.shares);
    if (shares <= 0) {
      return res.status(400).json({ error: "No shares to claim" });
    }

    const payout = shares * 1.0;
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newBalance = (parseFloat(user.balance) + payout).toFixed(2);
    await storage.updateUserBalance(userId, newBalance);
    await storage.updatePosition(position.id, "0", position.avgPrice);

    res.json({ success: true, payout, newBalance });
  } catch (error) {
    console.error("Error claiming winnings:", error);
    res.status(500).json({ error: "Failed to claim winnings" });
  }
});
```

### 4. Smart Contract Hook (use-contracts.ts) - TO ADD
Add these functions:

```typescript
const resolveMarket = async (marketId: number, outcomeId: number) => {
  if (!addresses.CONDITIONAL_TOKENS_ADDRESS) {
    throw new Error("ConditionalTokens contract not deployed");
  }

  try {
    const tx = await writeContractAsync({
      address: addresses.CONDITIONAL_TOKENS_ADDRESS as Address,
      abi: ConditionalTokensABI,
      functionName: "reportPayouts",
      args: [
        "0x0000000000000000000000000000000000000000000000000000000000000000", // questionId
        [BigInt(outcomeId === 1 ? 1 : 0), BigInt(outcomeId === 2 ? 1 : 0)] // payouts
      ],
    });
    return tx;
  } catch (error) {
    console.error("Market resolution failed:", error);
    throw error;
  }
};

const claimWinnings = async (marketId: number, outcomeId: number) => {
  if (!addresses.CONDITIONAL_TOKENS_ADDRESS) {
    throw new Error("ConditionalTokens contract not deployed");
  }

  try {
    const tx = await writeContractAsync({
      address: addresses.CONDITIONAL_TOKENS_ADDRESS as Address,
      abi: ConditionalTokensABI,
      functionName: "redeemPositions",
      args: [
        zeroAddress, // collateralToken
        "0x0000000000000000000000000000000000000000000000000000000000000000", // parentCollectionId
        "0x0000000000000000000000000000000000000000000000000000000000000000", // conditionId
        [BigInt(1), BigInt(2)] // indexSets
      ],
    });
    return tx;
  } catch (error) {
    console.error("Claim winnings failed:", error);
    throw error;
  }
};

// Add to return statement:
return {
  addresses,
  splitPosition,
  placeOrder,
  sellShares,
  approveUSDC,
  resolveMarket,
  claimWinnings
};
```

### 5. Claim UI Component (NEW FILE) - TO CREATE
Create `client/src/components/claim-winnings.tsx`:

```typescript
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { useContracts } from "@/hooks/use-contracts";
import { Loader2, Trophy } from "lucide-react";

interface ClaimWinningsProps {
  marketId: number;
  outcomeId: number;
  shares: number;
  payout: number;
  userId: string;
  onClaimed: () => void;
}

export function ClaimWinnings({ marketId, outcomeId, shares, payout, userId, onClaimed }: ClaimWinningsProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast();
  const { claimWinnings } = useContracts();

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      const txHash = await claimWinnings(marketId, outcomeId);
      
      const response = await fetch(`/api/markets/${marketId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Claim failed");

      toast({
        title: "Winnings Claimed!",
        description: `Successfully claimed $${payout.toFixed(2)}`,
      });

      onClaimed();
    } catch (error: any) {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim winnings",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Card className="p-4 bg-green-500/10 border-green-500/30">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-green-600 font-bold mb-1">
            <Trophy className="w-4 h-4" />
            Winning Position
          </div>
          <div className="text-sm text-muted-foreground">
            {shares.toFixed(2)} shares × $1.00 = ${payout.toFixed(2)}
          </div>
        </div>
        <Button
          onClick={handleClaim}
          disabled={isClaiming}
          className="bg-green-600 hover:bg-green-700"
        >
          {isClaiming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Claim ${payout.toFixed(2)}
        </Button>
      </div>
    </Card>
  );
}
```

### 6. Update Portfolio Page - TO UPDATE
Add claim functionality to portfolio positions:

```typescript
// In portfolio.tsx, for each position:
{position.market.isResolved && position.outcomeId === position.market.resolvedOutcomeId && (
  <ClaimWinnings
    marketId={position.marketId}
    outcomeId={position.outcomeId}
    shares={parseFloat(position.shares)}
    payout={parseFloat(position.shares) * 1.0}
    userId={user.id}
    onClaimed={() => {
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ["portfolio", user.id] });
    }}
  />
)}
```

## 🔄 Complete Flow

### Resolution Flow:
1. Admin goes to market page
2. Clicks "Resolve Market" in MarketResolution component
3. Selects winning outcome
4. Provides evidence
5. Submits resolution
6. Backend:
   - Updates market.isResolved = true
   - Sets market.resolvedOutcomeId
   - Gets all positions for market
   - Calculates payouts for winning positions
   - Credits user balances automatically
7. WebSocket broadcasts resolution
8. Users see "Claim Winnings" button

### Claim Flow:
1. User views portfolio
2. Sees resolved markets with winning positions
3. Clicks "Claim Winnings"
4. Frontend:
   - Calls claimWinnings contract function
   - Calls /api/markets/:id/claim endpoint
5. Backend:
   - Validates market is resolved
   - Validates user has winning position
   - Calculates payout (shares × $1.00)
   - Credits user balance
   - Sets position shares to 0
6. User balance updated
7. Position marked as claimed

## 📊 Testing Checklist

- [ ] Admin can resolve market
- [ ] Winning positions calculated correctly
- [ ] Losing positions show $0 value
- [ ] Users can claim winnings
- [ ] Balance updates correctly
- [ ] Cannot claim twice
- [ ] Cannot claim from unresolved market
- [ ] Cannot claim losing position
- [ ] WebSocket broadcasts work
- [ ] Transaction status tracking works

## 🎯 Next Steps

1. Add claim endpoint to routes.ts (line ~750, after resolution routes)
2. Add resolveMarket and claimWinnings to use-contracts.ts
3. Create ClaimWinnings component
4. Update portfolio.tsx to show claim UI
5. Test complete resolution → claim flow
6. Deploy and verify on testnet

## ✅ Phase 6 Success Criteria

- ✅ Storage methods added
- ✅ Resolution service updated
- ⏳ Claim endpoint (needs to be added)
- ⏳ Smart contract integration (needs to be added)
- ⏳ Claim UI component (needs to be created)
- ⏳ Portfolio integration (needs to be updated)

**Status: 50% Complete - Backend done, Frontend pending**

---

*Phase 6 enables the complete trading lifecycle: Buy → Sell → Resolve → Claim*
