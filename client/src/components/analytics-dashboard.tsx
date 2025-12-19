import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, TrendingDown, Activity, Users, DollarSign, Target, Zap } from "lucide-react";

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
            <Card key={i} className="animate-pulse border-none bg-zinc-50 dark:bg-zinc-900/50">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
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

  const COLORS = ['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-10 py-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Total Volume</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">${(analytics.totalVolume / 1000000).toFixed(1)}M</span>
            <span className="text-sm font-semibold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 12%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Active Markets</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{analytics.activeMarkets}</span>
            <span className="text-sm font-medium text-slate-400">/ {analytics.totalMarkets}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Total Users</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{analytics.totalUsers.toLocaleString()}</span>
            <span className="text-sm font-semibold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 8%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Daily Active</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{analytics.dailyActiveUsers}</span>
            <span className="text-sm font-semibold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 5%
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="trends" className="space-y-8">
        <TabsList className="bg-transparent p-0 h-auto gap-8 border-b border-slate-100 dark:border-slate-800 w-full justify-start rounded-none">
          <TabsTrigger value="trends" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-sm font-bold uppercase tracking-widest text-slate-400 data-[state=active]:text-foreground shadow-none">Growth Trends</TabsTrigger>
          <TabsTrigger value="markets" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-sm font-bold uppercase tracking-widest text-slate-400 data-[state=active]:text-foreground shadow-none">Top Markets</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-sm font-bold uppercase tracking-widest text-slate-400 data-[state=active]:text-foreground shadow-none">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-0">
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { time: 'JUN 3', growth: 2300 },
                  { time: 'JUN 4', growth: 2214 },
                  { time: 'JUN 5', growth: 2595 },
                  { time: 'JUN 6', growth: 2450 },
                  { time: 'JUN 7', growth: 2512 },
                  { time: 'JUN 8', growth: 2380 },
                  { time: 'JUN 9', growth: 2512 },
                ]}
                margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{payload[0].payload.time}</p>
                          <p className="text-xl font-bold">${payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="growth"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorGrowth)"
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="markets" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.topMarkets.map((market, index) => (
              <Card key={market.marketId} className="border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-bold border-slate-200 uppercase">Tier #{index + 1}</Badge>
                    <div className={`flex items-center gap-1 text-sm font-bold ${market.volumeChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {market.volumeChange >= 0 ? '+' : ''}{market.volumeChange}%
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold leading-tight mb-1">Market #{market.marketId}</h4>
                    <p className="text-sm text-slate-400 font-medium">{market.uniqueTraders} Total Traders</p>
                  </div>
                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">24h Volume</p>
                    <p className="text-2xl font-bold">${market.volume24h.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Usage by category</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Performance breakdown</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar
                      dataKey="value"
                      fill="#2563eb"
                      radius={[0, 4, 4, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}