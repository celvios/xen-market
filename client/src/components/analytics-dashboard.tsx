import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Activity, Users, DollarSign, Target } from "lucide-react";

interface AnalyticsData {
  totalVolume: number;
  totalMarkets: number;
  activeMarkets: number;
  totalUsers: number;
  dailyActiveUsers: number;
  topMarkets: Array<{
    marketId: number;
    volume24h: number;
    volumeChange: number;
    volatility: number;
    uniqueTraders: number;
  }>;
  volumeByCategory: Record<string, number>;
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/platform");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      // Mock data for demo
      setAnalytics({
        totalVolume: 2500000,
        totalMarkets: 156,
        activeMarkets: 89,
        totalUsers: 12500,
        dailyActiveUsers: 850,
        topMarkets: [
          { marketId: 1, volume24h: 45000, volumeChange: 12.5, volatility: 8.2, uniqueTraders: 234 },
          { marketId: 2, volume24h: 38000, volumeChange: -5.1, volatility: 15.7, uniqueTraders: 189 },
          { marketId: 3, volume24h: 32000, volumeChange: 8.9, volatility: 6.3, uniqueTraders: 156 },
        ],
        volumeByCategory: {
          "Politics": 850000,
          "Sports": 650000,
          "Crypto": 500000,
          "Entertainment": 300000,
          "Technology": 200000
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const categoryData = Object.entries(analytics.volumeByCategory).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / analytics.totalVolume) * 100).toFixed(1)
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">${(analytics.totalVolume / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Markets</p>
                <p className="text-2xl font-bold">{analytics.activeMarkets}</p>
                <p className="text-xs text-muted-foreground">of {analytics.totalMarkets} total</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Active Users</p>
                <p className="text-2xl font-bold">{analytics.dailyActiveUsers}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="markets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="markets">Top Markets</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="markets">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Markets (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topMarkets.map((market, index) => (
                  <div key={market.marketId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">Market {market.marketId}</p>
                        <p className="text-sm text-muted-foreground">{market.uniqueTraders} traders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold">${market.volume24h.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        {market.volumeChange >= 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${market.volumeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {market.volumeChange >= 0 ? '+' : ''}{market.volumeChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Volume by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000)}K`} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']} />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Trend analysis coming soon...</p>
                <p className="text-sm">Historical data collection in progress</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}