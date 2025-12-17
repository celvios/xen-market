import { Market } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BarChart3, MessageSquare } from "lucide-react";

interface MarketCardProps {
  market: Market;
  featured?: boolean;
}

export default function MarketCard({ market, featured = false }: MarketCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-border/50 hover:border-primary/20 bg-card",
      featured ? "col-span-1 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row" : "flex flex-col"
    )}>
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden",
        featured ? "w-full md:w-1/3 min-h-[200px]" : "w-full h-32"
      )}>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
        <img 
          src={market.image} 
          alt={market.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 z-20">
          <Badge variant="secondary" className="backdrop-blur-md bg-background/50 hover:bg-background/80 border-none text-xs font-medium">
            {market.category}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-4 md:p-5">
        <div className="flex-1">
          <h3 className={cn(
            "font-display font-semibold leading-tight mb-4 group-hover:text-primary transition-colors",
            featured ? "text-2xl md:text-3xl" : "text-lg line-clamp-2"
          )}>
            {market.title}
          </h3>

          {/* Outcomes */}
          <div className="space-y-3 mb-4">
            {market.outcomes.map((outcome) => (
              <div key={outcome.id} className="relative group/bar">
                <div className="flex items-center justify-between text-sm mb-1 z-10 relative">
                  <span className="font-medium text-muted-foreground group-hover/bar:text-foreground transition-colors">
                    {outcome.label}
                  </span>
                  <span className={cn(
                    "font-bold font-mono",
                    outcome.probability > 50 ? "text-primary" : "text-foreground"
                  )}>
                    {outcome.probability}%
                  </span>
                </div>
                {/* Progress Bar Container */}
                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden relative">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500 ease-out", outcome.color)}
                    style={{ width: `${outcome.probability}%` }}
                  />
                  {/* Glowing effect for leader */}
                  {outcome.probability > 50 && (
                    <div 
                      className={cn("absolute top-0 bottom-0 right-0 w-4 blur-sm bg-white/50", outcome.color)} 
                      style={{ left: `${outcome.probability}%`, transform: 'translateX(-50%)' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="font-mono">{market.volume} Vol.</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{Math.floor(Math.random() * 100)}</span>
            </div>
             <span className="text-muted-foreground/50">•</span>
             <span>Ends {market.endDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
