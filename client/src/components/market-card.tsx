import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BarChart3, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { Market } from "@/lib/api";

interface MarketCardProps {
  market: Market;
  featured?: boolean;
}

function formatVolume(volume: string): string {
  const num = parseFloat(volume);
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num.toFixed(0)}`;
}

export default function MarketCard({ market, featured = false }: MarketCardProps) {
  return (
    <Link href={`/market/${market.id}`}>
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-300 border border-border bg-card/60 hover:bg-card/80 flex flex-col cursor-pointer glass-panel overflow-hidden",
        featured && "md:col-span-2 lg:col-span-3 border-primary/20 bg-primary/5"
      )}>
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

        <div className="p-4 md:p-5 flex flex-col flex-1 h-full">
          {/* Header Area */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-muted/50 border border-border/50 overflow-hidden relative shadow-inner">
                <img
                  src={market.image}
                  alt={market.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
              <Badge className="absolute -bottom-2 -right-2 text-[8px] h-4 px-1 backdrop-blur-md bg-background/80 border-border/50 shadow-lg text-muted-foreground uppercase tracking-widest leading-none">
                {market.category}
              </Badge>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-display font-bold leading-[1.3] text-foreground transition-colors group-hover:text-primary",
                featured ? "text-xl md:text-2xl" : "text-[15px] line-clamp-2"
              )}>
                {market.title}
              </h3>
            </div>
          </div>

          {/* Outcomes Data Grid */}
          <div className="space-y-2 mb-4 flex-1">
            {market.outcomes.slice(0, 2).map((outcome) => {
              const prob = parseFloat(outcome.probability);
              const isLead = prob > 50;
              return (
                <div key={outcome.id} className="group/row">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 uppercase font-bold tracking-wider text-muted-foreground transition-colors group-hover/row:text-foreground">
                    <span>{outcome.label}</span>
                    <span className={cn("font-mono", isLead ? "text-success drop-shadow-[0_0_5px_rgba(34,197,94,0.3)]" : "text-foreground")}>
                      {prob.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden relative shadow-inner">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-in-out relative",
                        outcome.color === "bg-green-500" ? "bg-success" : (outcome.color === "bg-red-500" ? "bg-destructive" : outcome.color)
                      )}
                      style={{
                        width: `${prob}%`,
                        boxShadow: isLead ? '0 0 8px currentColor' : 'none'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Market Stats Footer */}
          <div className="pt-3 border-t border-border/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-muted/30 border border-border/50 flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black tracking-tighter text-muted-foreground leading-none mb-0.5">Vol</span>
                <span className="text-[11px] font-mono font-bold text-foreground leading-none">{formatVolume(market.volume)}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase font-black tracking-tighter text-muted-foreground leading-none mb-0.5">Ends In</span>
              <span className="text-[11px] font-mono font-bold text-muted-foreground leading-none">{market.endDate}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

