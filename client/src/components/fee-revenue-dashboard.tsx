import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, Users, Percent, Zap, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

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
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase(),
      tradingFees: 200 + Math.random() * 400,
      creationFees: 50 + Math.random() * 150,
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
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground font-display font-medium uppercase tracking-widest text-xs">
        Loading Revenue Streams...
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Total Revenue (7d)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span className="text-sm font-semibold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 15%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Trading Fees</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">${totalTradingFees.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span className="text-sm font-medium text-slate-400">{((totalTradingFees / totalRevenue) * 100).toFixed(0)}% share</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Avg Daily</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">${avgDailyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span className="text-sm font-semibold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 4%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Health Index</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">98.2</span>
            <Badge variant="outline" className="text-[9px] font-bold border-emerald-200 text-emerald-600 bg-emerald-50/50 uppercase">Optimal</Badge>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Protocol Revenue Streams</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Trading</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Creation</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrading" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="colorCreation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                dy={15}
              />
              <YAxis
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-2xl space-y-3 min-w-[200px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{payload[0].payload.date}</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-600">Trading</span>
                            <span className="font-bold">${Number(payload[0].value).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-600">Creation</span>
                            <span className="font-bold">${Number(payload[1].value).toFixed(2)}</span>
                          </div>
                          <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center text-base">
                            <span className="font-bold text-slate-900">Total</span>
                            <span className="font-bold text-primary">${((payload[0].value as number) + (payload[1].value as number)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="tradingFees"
                stackId="1"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTrading)"
              />
              <Area
                type="monotone"
                dataKey="creationFees"
                stackId="1"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCreation)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fee Structure Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100 dark:border-slate-800/50">
        <div className="space-y-6">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Execution Layers</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm font-semibold text-slate-600">Maker (Limit Orders)</span>
              <span className="font-bold font-mono">0.1%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm font-semibold text-slate-600">Taker (Market Orders)</span>
              <span className="font-bold font-mono">0.2%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm font-semibold text-slate-600">Market Deployment</span>
              <span className="font-bold font-mono">$10.00</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Volume Discounts</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm font-semibold text-slate-600">$10K - $50K Tier</span>
              <span className="font-bold text-emerald-500">-10%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm font-semibold text-slate-600">$50K - $100K Tier</span>
              <span className="font-bold text-emerald-500">-20%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm font-semibold text-slate-600">$100K+ Institutional</span>
              <span className="font-bold text-emerald-500">-35%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}