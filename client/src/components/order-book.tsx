import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useWebSocket } from "../hooks/use-websocket";

interface Order {
  id: number;
  price: string;
  size: string;
  side: "buy" | "sell";
  outcomeId: number;
}

interface OrderBookProps {
  marketId: number;
}

export function OrderBook({ marketId }: OrderBookProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    // Fetch initial orders
    fetch(`/api/orders/market/${marketId}`)
      .then(res => res.json())
      .then(setOrders)
      .catch(console.error);

    // Subscribe to real-time updates
    const handleNewOrder = (order: Order) => {
      setOrders(prev => [...prev, order]);
    };

    subscribe(`market:${marketId}:orders`, handleNewOrder);

    return () => {
      unsubscribe(`market:${marketId}:orders`, handleNewOrder);
    };
  }, [marketId, subscribe, unsubscribe]);

  const buyOrders = orders
    .filter(o => o.side === "buy")
    .sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  
  const sellOrders = orders
    .filter(o => o.side === "sell")
    .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sell Orders */}
        <div>
          <h4 className="text-sm font-medium text-red-600 mb-2">Sell Orders</h4>
          <div className="space-y-1">
            {sellOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between text-sm">
                <span className="text-red-600">${order.price}</span>
                <span>{order.size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spread */}
        <div className="border-t border-b py-2">
          <div className="text-center text-sm text-muted-foreground">
            Spread: {buyOrders[0] && sellOrders[0] 
              ? `$${(parseFloat(sellOrders[0].price) - parseFloat(buyOrders[0].price)).toFixed(4)}`
              : "N/A"
            }
          </div>
        </div>

        {/* Buy Orders */}
        <div>
          <h4 className="text-sm font-medium text-green-600 mb-2">Buy Orders</h4>
          <div className="space-y-1">
            {buyOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between text-sm">
                <span className="text-green-600">${order.price}</span>
                <span>{order.size}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}