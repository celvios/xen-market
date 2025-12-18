import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BarChart3, Target, TrendingUp, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  counts?: Record<string, number>;
}

export function MarketTypeFilter({ selectedType, onTypeChange, counts = {} }: MarketTypeFilterProps) {
  const marketTypes = [
    { 
      id: "all", 
      label: "All Markets", 
      icon: Filter,
      description: "All market types"
    },
    { 
      id: "binary", 
      label: "Binary", 
      icon: BarChart3,
      description: "Yes/No predictions"
    },
    { 
      id: "categorical", 
      label: "Categorical", 
      icon: Target,
      description: "Multiple outcomes"
    },
    { 
      id: "scalar", 
      label: "Scalar", 
      icon: TrendingUp,
      description: "Range predictions"
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Market Types</span>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {marketTypes.map((type) => {
          const isSelected = selectedType === type.id;
          const count = counts[type.id] || 0;
          
          return (
            <Button
              key={type.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange(type.id)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-3 px-2",
                isSelected && "bg-primary text-primary-foreground"
              )}
            >
              <type.icon className="w-4 h-4" />
              <div className="text-center">
                <div className="text-xs font-medium">{type.label}</div>
                <div className="text-xs opacity-70">{type.description}</div>
                {count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="mt-1 text-xs px-1 py-0"
                  >
                    {count}
                  </Badge>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}