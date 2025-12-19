import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderBook } from "@/lib/api";

interface OrderBookProps {
  marketId: number;
  outcomeId?: number;
}

export function OrderBook({ marketId, outcomeId = 1 }: OrderBookProps) {
  const { data: orderBook, isLoading } = useQuery({
    queryKey: ["orderbook", marketId, outcomeId],
    queryFn: () => fetchOrderBook(marketId, outcomeId),
    refetchInterval: 3000,
  });

  if (isLoading || !orderBook) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Book</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sell Orders */}
        <div>
          <h4 className="text-sm font-medium text-red-600 mb-2">Asks (Sell)</h4>
          <div className="space-y-1">
            {orderBook.asks.length > 0 ? orderBook.asks.map((ask, i) => (
              <div key={i} className="flex justify-between text-sm font-mono">
                <span className="text-red-600">{ask.price.toFixed(2)}¢</span>
                <span>{ask.size.toFixed(2)}</span>
                <span className="text-muted-foreground">${ask.total.toFixed(2)}</span>
              </div>
            )) : (
              <div className="text-center text-muted-foreground text-sm py-2">No sell orders</div>
            )}
          </div>
        </div>

        {/* Spread */}
        <div className="border-t border-b py-2">
          <div className="text-center text-sm">
            {orderBook.lastPrice && (
              <div className="font-mono font-bold text-lg mb-1">{orderBook.lastPrice.toFixed(2)}¢</div>
            )}
            <div className="text-muted-foreground">
              Spread: {orderBook.spread ? `${orderBook.spread.toFixed(2)}¢` : "N/A"}
            </div>
          </div>
        </div>

        {/* Buy Orders */}
        <div>
          <h4 className="text-sm font-medium text-green-600 mb-2">Bids (Buy)</h4>
          <div className="space-y-1">
            {orderBook.bids.length > 0 ? orderBook.bids.map((bid, i) => (
              <div key={i} className="flex justify-between text-sm font-mono">
                <span className="text-green-600">{bid.price.toFixed(2)}¢</span>
                <span>{bid.size.toFixed(2)}</span>
                <span className="text-muted-foreground">${bid.total.toFixed(2)}</span>
              </div>
            )) : (
              <div className="text-center text-muted-foreground text-sm py-2">No buy orders</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}