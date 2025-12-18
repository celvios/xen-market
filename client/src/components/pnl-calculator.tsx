import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Position {
  id: number;
  shares: string;
  avgPrice: string;
  market: {
    id: number;
    title: string;
    isResolved: boolean;
  };
  outcome: {
    id: number;
    label: string;
    probability: string;
  };
}

interface PnLCalculatorProps {
  positions: Position[];
}

export function PnLCalculator({ positions }: PnLCalculatorProps) {
  const pnlData = useMemo(() => {
    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalRealized = 0;
    let totalUnrealized = 0;

    positions.forEach(position => {
      const shares = parseFloat(position.shares);
      const avgPrice = parseFloat(position.avgPrice);
      const currentPrice = parseFloat(position.outcome.probability) / 100;
      
      const invested = shares * avgPrice;
      const currentValue = shares * currentPrice;
      
      totalInvested += invested;
      
      if (position.market.isResolved) {
        // Resolved positions - calculate realized P&L
        const payout = shares * 1.0; // $1 per winning share
        totalRealized += payout - invested;
      } else {
        // Open positions - calculate unrealized P&L
        totalCurrentValue += currentValue;
        totalUnrealized += currentValue - invested;
      }
    });

    const totalPnL = totalRealized + totalUnrealized;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalCurrentValue,
      totalRealized,
      totalUnrealized,
      totalPnL,
      totalPnLPercent,
    };
  }, [positions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {pnlData.totalPnL >= 0 ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
          Portfolio P&L
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Invested</p>
            <p className="text-lg font-mono font-bold">
              ${pnlData.totalInvested.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Value</p>
            <p className="text-lg font-mono font-bold">
              ${pnlData.totalCurrentValue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Realized P&L</p>
            <p className={`text-lg font-mono font-bold ${
              pnlData.totalRealized >= 0 ? "text-green-500" : "text-red-500"
            }`}>
              ${pnlData.totalRealized >= 0 ? "+" : ""}
              {pnlData.totalRealized.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Unrealized P&L</p>
            <p className={`text-lg font-mono font-bold ${
              pnlData.totalUnrealized >= 0 ? "text-green-500" : "text-red-500"
            }`}>
              ${pnlData.totalUnrealized >= 0 ? "+" : ""}
              {pnlData.totalUnrealized.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Total P&L</p>
            <div className="flex items-center gap-2">
              <Badge variant={pnlData.totalPnL >= 0 ? "default" : "destructive"}>
                {pnlData.totalPnLPercent >= 0 ? "+" : ""}
                {pnlData.totalPnLPercent.toFixed(1)}%
              </Badge>
              <p className={`text-xl font-mono font-bold ${
                pnlData.totalPnL >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                ${pnlData.totalPnL >= 0 ? "+" : ""}
                {pnlData.totalPnL.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}