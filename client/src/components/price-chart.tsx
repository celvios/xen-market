import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
  Label,
  LabelList
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceData {
  timestamp: string;
  price: number;
  volume: number;
}

interface PriceChartProps {
  marketId: number;
  outcomeId?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border p-3 rounded-xl shadow-2xl">
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
          {new Date(data.timestamp).toLocaleString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        <div className="text-xl font-mono font-black text-foreground">
          ${data.price.toFixed(4)}
        </div>
      </div>
    );
  }
  return null;
};

export function PriceChart({ marketId, outcomeId }: PriceChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    const endpoint = outcomeId 
      ? `${apiUrl}/api/markets/${marketId}/outcomes/${outcomeId}/price-history`
      : `${apiUrl}/api/markets/${marketId}/price-history`;
    
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setPriceData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch price data:", err);
        setPriceData([]);
        setLoading(false);
      });
  }, [marketId, outcomeId]);

  const stats = useMemo(() => {
    if (!priceData.length) return null;
    const currentPrice = priceData[priceData.length - 1].price;
    const firstPrice = priceData[0].price;
    const change = currentPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;

    let high = priceData[0];
    let low = priceData[0];
    priceData.forEach(d => {
      if (d.price > high.price) high = d;
      if (d.price < low.price) low = d;
    });

    return { currentPrice, change, changePercent, high, low };
  }, [priceData]);

  if (loading) {
    return (
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground font-display font-medium uppercase tracking-widest text-xs">
          Loading Market Data...
        </CardContent>
      </Card>
    );
  }

  if (!priceData.length) {
    return (
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground font-display font-medium uppercase tracking-widest text-xs">
          No price data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-transparent shadow-none overflow-hidden group p-2 md:p-4">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-baseline justify-start space-y-2 md:space-y-0 pb-4 md:pb-8 px-0">
        <div className="flex flex-col md:flex-row items-start md:items-baseline gap-2 md:gap-4 w-full">
          <span className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-foreground">
            ${stats?.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className={`flex items-center gap-1.5 font-sans font-semibold text-base md:text-lg ${stats && stats.change >= 0 ? 'text-[#10b981]' : 'text-destructive'}`}>
            {stats && stats.change >= 0 ? <TrendingUp className="w-4 h-4 md:w-5 md:h-5" /> : <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />}
            ${Math.abs(stats?.change || 0).toFixed(2)} ({stats?.changePercent.toFixed(2)}%)
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[250px] md:h-[400px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData} margin={{ top: 20, right: 5, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                minTickGap={80}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase()}
                dy={15}
              />

              <YAxis
                orientation="right"
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(0)}
                dx={5}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPrice)"
                animationDuration={1500}
                activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
              >
                <LabelList
                  dataKey="price"
                  content={(props: any) => {
                    const { x, y, value, index } = props;
                    const isHigh = priceData[index] === stats?.high;
                    const isLow = priceData[index] === stats?.low;

                    if (isHigh || isLow) {
                      return (
                        <g>
                          <text
                            x={x}
                            y={y - 15}
                            fill="#1e293b"
                            fontSize={12}
                            fontWeight={700}
                            textAnchor="middle"
                            className="font-sans"
                          >
                            ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  }}
                />
              </Area>

              {/* Current Price Reference Line & Badge */}
              {stats && (
                <ReferenceLine
                  y={stats.currentPrice}
                  stroke="#2563eb"
                  strokeWidth={1}
                  label={(props: any) => (
                    <g transform={`translate(${props.viewBox.width + props.viewBox.x}, ${props.viewBox.y})`}>
                      <rect x={0} y={-10} width={60} height={20} rx={4} fill="#2563eb" />
                      <text x={30} y={4} fill="#fff" fontSize={10} fontWeight={700} textAnchor="middle">
                        ${stats.currentPrice.toFixed(2)}
                      </text>
                    </g>
                  )}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}