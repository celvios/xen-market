import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BarChart3, Target, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

interface ComplexMarket {
  id: number;
  title: string;
  description?: string;
  category: string;
  marketType: "binary" | "categorical" | "scalar";
  outcomes: Array<{
    id: number;
    label: string;
    probability: string;
    color?: string;
  }>;
  volume: string;
  endDate: string;
  image: string;
  scalarRange?: { min: number; max: number };
}

interface ComplexMarketCardProps {
  market: ComplexMarket;
}

export function ComplexMarketCard({ market }: ComplexMarketCardProps) {
  const getMarketTypeIcon = () => {
    switch (market.marketType) {
      case "categorical": return <Target className="w-3 h-3" />;
      case "scalar": return <TrendingUp className="w-3 h-3" />;
      default: return <BarChart3 className="w-3 h-3" />;
    }
  };

  const getMarketTypeColor = () => {
    switch (market.marketType) {
      case "categorical": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "scalar": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default: return "bg-green-500/10 text-green-600 border-green-500/20";
    }
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  return (
    <Link href={`/market/${market.id}`}>
      <Card className="group relative overflow-hidden transition-all duration-300 border border-border bg-card/60 hover:bg-card/80 cursor-pointer">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-muted/50 border border-border/50 overflow-hidden">
              <img
                src={market.image}
                alt={market.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn("text-xs px-2 py-0.5", getMarketTypeColor())}>
                  {getMarketTypeIcon()}
                  <span className="ml-1 capitalize">{market.marketType}</span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {market.category}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {market.title}
              </h3>
            </div>
          </div>

          {/* Outcomes Display */}
          {market.marketType === "binary" && (
            <div className="space-y-2 mb-4">
              {market.outcomes.slice(0, 2).map((outcome) => {
                const prob = parseFloat(outcome.probability);
                return (
                  <div key={outcome.id} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{outcome.label}</span>
                    <span className="text-xs font-mono font-bold">{prob.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          )}

          {market.marketType === "categorical" && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-1 mb-2">
                {market.outcomes.slice(0, 4).map((outcome) => {
                  const prob = parseFloat(outcome.probability);
                  return (
                    <div key={outcome.id} className="text-center p-1 bg-muted/20 rounded text-xs">
                      <div className="font-medium truncate">{outcome.label}</div>
                      <div className="font-mono text-xs text-muted-foreground">{prob.toFixed(0)}%</div>
                    </div>
                  );
                })}
              </div>
              {market.outcomes.length > 4 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{market.outcomes.length - 4} more outcomes
                </div>
              )}
            </div>
          )}

          {market.marketType === "scalar" && market.scalarRange && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Range</span>
                <span className="font-mono">{market.scalarRange.min} - {market.scalarRange.max}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {market.outcomes.map((outcome) => {
                  const prob = parseFloat(outcome.probability);
                  return (
                    <div key={outcome.id} className="text-center p-1 bg-muted/20 rounded text-xs">
                      <div className="font-medium truncate">{outcome.label}</div>
                      <div className="font-mono text-xs text-muted-foreground">{prob.toFixed(0)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-mono">{formatVolume(market.volume)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{market.endDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}