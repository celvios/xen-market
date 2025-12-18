import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, Users, Percent } from "lucide-react";

interface FeeRevenue {
  date: string;
  tradingFees: number;
  creationFees: number;
  totalRevenue: number;
}

export function FeeRevenueDashboard() {
  const [revenueData, setRevenueData] = useState<FeeRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock revenue data
    const mockData: FeeRevenue[] = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      tradingFees: Math.random() * 500 + 100,
      creationFees: Math.random() * 100 + 20,
      totalRevenue: 0
    }));

    mockData.forEach(day => {
      day.totalRevenue = day.tradingFees + day.creationFees;
    });

    setRevenueData(mockData);
    setLoading(false);
  }, []);

  const totalRevenue = revenueData.reduce((sum, day) => sum + day.totalRevenue, 0);
  const totalTradingFees = revenueData.reduce((sum, day) => sum + day.tradingFees, 0);
  const avgDailyRevenue = totalRevenue / revenueData.length;

  if (loading) {
    return <div className="animate-pulse">Loading revenue data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue (7d)</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trading Fees</p>
                <p className="text-2xl font-bold">${totalTradingFees.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {((totalTradingFees / totalRevenue) * 100).toFixed(1)}% of total
                </p>
              </div>
              <Percent className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Daily Revenue</p>
                <p className="text-2xl font-bold">${avgDailyRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fee Structure</p>
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">Maker: 0.1%</Badge>
                  <Badge variant="outline" className="text-xs">Taker: 0.2%</Badge>
                </div>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${value.toFixed(2)}`, 
                  name === 'tradingFees' ? 'Trading Fees' : 'Creation Fees'
                ]}
              />
              <Bar dataKey="tradingFees" stackId="a" fill="#10b981" name="tradingFees" />
              <Bar dataKey="creationFees" stackId="a" fill="#3b82f6" name="creationFees" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fee Structure Info */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Structure & Volume Discounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Trading Fees</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Maker Fee (Limit Orders)</span>
                  <Badge variant="outline">0.1%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Taker Fee (Market Orders)</span>
                  <Badge variant="outline">0.2%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Market Creation</span>
                  <Badge variant="outline">$10</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Volume Discounts</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>$10K+ Volume (30d)</span>
                  <Badge variant="default" className="bg-green-500">-10%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>$50K+ Volume (30d)</span>
                  <Badge variant="default" className="bg-blue-500">-20%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>$100K+ Volume (30d)</span>
                  <Badge variant="default" className="bg-purple-500">-30%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}