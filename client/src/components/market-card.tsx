import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Gift, Bookmark, BarChart3, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Market } from "@/lib/api";

interface MarketCardProps {
  market: Market;
  featured?: boolean;
}

function formatVolume(volume: string): string {
  const num = parseFloat(volume);
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}m`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}k`;
  }
  return `$${num.toFixed(0)}`;
}

export default function MarketCard({ market, featured = false }: MarketCardProps) {
  const outcomes = market.outcomes || [];
  const isBinary = outcomes.length === 2;
  const leadProbability = isBinary ? parseFloat(outcomes[0].probability) : 0;

  return (
    <Card className={cn(
      "group relative flex flex-col overflow-hidden transition-all duration-300 border border-border bg-card/40 hover:bg-card/60 glass-panel",
      featured && "md:col-span-2 lg:col-span-2 border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(var(--primary),0.05)]"
    )}>
      <Link href={`/market/${market.id}`} className="flex flex-col flex-1 p-3 md:p-4">
        {/* Top Section: Icon & Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border/50 bg-muted/20">
            <img
              src={market.image}
              alt=""
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
          </div>
          <h3 className={cn(
            "font-display font-black leading-tight text-foreground transition-colors group-hover:text-primary tracking-tight",
            featured ? "text-lg md:text-xl" : "text-sm line-clamp-2"
          )}>
            {market.title}
          </h3>

          {/* Circular Chart for Featured Binary Markets */}
          {featured && isBinary && (
            <div className="ml-auto flex-shrink-0 relative w-12 h-12">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle className="stroke-muted/20" cx="18" cy="18" r="16" fill="none" strokeWidth="3" />
                <circle
                  className="stroke-success transition-all duration-1000 ease-out"
                  cx="18" cy="18" r="16" fill="none" strokeWidth="3"
                  strokeDasharray={`${leadProbability}, 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono font-black text-success leading-none">{leadProbability}%</span>
                <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none mt-0.5">{outcomes[0].label.slice(0, 4)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Middle Section: Outcomes List */}
        <div className="flex-1 space-y-2 mb-4">
          {!featured ? (
            // Standard List View (Polymarket Style)
            outcomes.slice(0, 3).map((outcome) => (
              <div key={outcome.id} className="flex items-center justify-between group/row p-1 rounded-sm hover:bg-white/5 transition-colors">
                <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[120px]">
                  {outcome.label}
                </span>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-foreground">
                    {parseFloat(outcome.probability).toFixed(0)}%
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-black uppercase tracking-tighter bg-success/10 text-success hover:bg-success hover:text-success-foreground border-none">
                      {parseFloat(outcome.probability).toFixed(0)}¢
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Featured Large Button View
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button className="h-10 bg-success/20 hover:bg-success text-success hover:text-success-foreground border border-success/30 font-black uppercase tracking-widest text-[11px] flex flex-col leading-none py-1">
                <span>{outcomes[0].label}</span>
                <span className="text-[10px] font-mono mt-1 opacity-80">{outcomes[0].probability}%</span>
              </Button>
              <Button className="h-10 bg-destructive/20 hover:bg-destructive text-destructive hover:text-destructive-foreground border border-destructive/30 font-black uppercase tracking-widest text-[11px] flex flex-col leading-none py-1">
                <span>{outcomes[1]?.label || "No"}</span>
                <span className="text-[10px] font-mono mt-1 opacity-80">{outcomes[1]?.probability || "0"}%</span>
              </Button>
            </div>
          )}

          {outcomes.length > 3 && !featured && (
            <div className="text-[9px] font-black text-primary/60 uppercase tracking-widest flex items-center justify-center pt-1 border-t border-border/10 cursor-pointer hover:text-primary transition-colors">
              + {outcomes.length - 3} More Outcomes <ChevronRight className="w-3 h-3 ml-0.5" />
            </div>
          )}
        </div>

        {/* Bottom Section: Stats & Icons */}
        <div className="mt-auto pt-3 border-t border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono font-black text-muted-foreground group-hover:text-foreground transition-colors">
                {formatVolume(market.volume)} Vol.
              </span>
            </div>
            <div className="h-3 w-px bg-border/30" />
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary/60" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
                {market.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors">
              <Gift className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors">
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
