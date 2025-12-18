import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PriceData {
  timestamp: string;
  price: number;
  volume: number;
}

interface PriceChartProps {
  marketId: number;
}

export function PriceChart({ marketId }: PriceChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch price history
    fetch(`/api/markets/${marketId}/price-history`)
      .then(res => res.json())
      .then(data => {
        setPriceData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch price data:", err);
        // Generate mock data for now
        const mockData = Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
          price: 0.5 + Math.random() * 0.4 - 0.2,
          volume: Math.random() * 1000
        }));
        setPriceData(mockData);
        setLoading(false);
      });
  }, [marketId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            Loading chart...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis 
              domain={[0, 1]}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number) => [`$${value.toFixed(4)}`, "Price"]}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}