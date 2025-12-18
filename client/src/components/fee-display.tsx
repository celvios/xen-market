import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Info, DollarSign } from "lucide-react";

interface FeeDisplayProps {
  tradeAmount: number;
  isMaker?: boolean;
  userVolume?: number;
}

export function FeeDisplay({ tradeAmount, isMaker = false, userVolume = 0 }: FeeDisplayProps) {
  // Fee calculation (matches backend logic)
  const baseFeeRate = isMaker ? 0.001 : 0.002; // 0.1% maker, 0.2% taker
  
  // Volume discount tiers
  const getDiscount = (volume: number) => {
    if (volume >= 100000) return 0.3; // 30% off
    if (volume >= 50000) return 0.2;  // 20% off
    if (volume >= 10000) return 0.1;  // 10% off
    return 0;
  };

  const discount = getDiscount(userVolume);
  const discountedRate = baseFeeRate * (1 - discount);
  const fee = tradeAmount * discountedRate;
  const totalCost = tradeAmount + fee;

  return (
    <Card className="border-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Trading Fees
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Trade Amount</span>
          <span className="font-mono">${tradeAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            Fee Rate
            <Badge variant="outline" className="text-xs">
              {isMaker ? "Maker" : "Taker"}
            </Badge>
          </span>
          <div className="text-right">
            {discount > 0 && (
              <div className="text-xs text-green-600 line-through">
                {(baseFeeRate * 100).toFixed(2)}%
              </div>
            )}
            <span className="font-mono">{(discountedRate * 100).toFixed(2)}%</span>
          </div>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Volume Discount</span>
            <Badge variant="default" className="text-xs">
              -{(discount * 100).toFixed(0)}%
            </Badge>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Trading Fee</span>
          <span className="font-mono text-orange-600">${fee.toFixed(4)}</span>
        </div>

        <div className="border-t pt-2 flex justify-between font-medium">
          <span>Total Cost</span>
          <span className="font-mono">${totalCost.toFixed(2)}</span>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/20 p-2 rounded">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <div>
            <div>Maker orders (limit orders) pay lower fees than taker orders (market orders).</div>
            <div className="mt-1">Higher trading volume unlocks fee discounts.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}