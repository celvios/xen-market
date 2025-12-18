import Layout from "@/components/layout";
import { ComplexMarketCard } from "@/components/complex-market-card";
import { MarketTypeFilter } from "@/components/market-type-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, BarChart3, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function ComplexMarketsDemo() {
  const [selectedType, setSelectedType] = useState("all");

  // Demo complex markets
  const complexMarkets = [
    {
      id: 101,
      title: "Who will win the 2024 US Presidential Election?",
      description: "Multi-candidate prediction market",
      category: "Politics",
      marketType: "categorical" as const,
      outcomes: [
        { id: 1, label: "Joe Biden", probability: "35.5", color: "#3b82f6" },
        { id: 2, label: "Donald Trump", probability: "42.8", color: "#ef4444" },
        { id: 3, label: "Ron DeSantis", probability: "12.3", color: "#6b7280" },
        { id: 4, label: "Nikki Haley", probability: "6.2", color: "#8b5cf6" },
        { id: 5, label: "Other", probability: "3.2", color: "#f59e0b" }
      ],
      volume: "850000",
      endDate: "Nov 2024",
      image: "https://images.unsplash.com/photo-1586027021304-64a3833a9833?w=400"
    },
    {
      id: 102,
      title: "What will Bitcoin's price be at end of 2024?",
      description: "Range-based price prediction",
      category: "Crypto",
      marketType: "scalar" as const,
      outcomes: [
        { id: 1, label: "Below $50,000", probability: "25.0", color: "#ef4444" },
        { id: 2, label: "Above $150,000", probability: "75.0", color: "#10b981" }
      ],
      volume: "425000",
      endDate: "Dec 2024",
      image: "https://images.unsplash.com/photo-1518544866330-4e4815de2e10?w=400",
      scalarRange: { min: 50000, max: 150000 }
    },
    {
      id: 103,
      title: "Which team will win the 2024 World Cup?",
      description: "Multi-team tournament prediction",
      category: "Sports",
      marketType: "categorical" as const,
      outcomes: [
        { id: 1, label: "Brazil", probability: "22.5", color: "#10b981" },
        { id: 2, label: "Argentina", probability: "18.3", color: "#3b82f6" },
        { id: 3, label: "France", probability: "16.7", color: "#ef4444" },
        { id: 4, label: "England", probability: "14.2", color: "#8b5cf6" },
        { id: 5, label: "Spain", probability: "12.8", color: "#f59e0b" },
        { id: 6, label: "Other", probability: "15.5", color: "#6b7280" }
      ],
      volume: "320000",
      endDate: "Jul 2024",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"
    },
    {
      id: 104,
      title: "Tesla stock price range by Q4 2024?",
      description: "Scalar market for TSLA price prediction",
      category: "Finance",
      marketType: "scalar" as const,
      outcomes: [
        { id: 1, label: "Below $200", probability: "40.0", color: "#ef4444" },
        { id: 2, label: "Above $400", probability: "60.0", color: "#10b981" }
      ],
      volume: "180000",
      endDate: "Dec 2024",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
      scalarRange: { min: 200, max: 400 }
    }
  ];

  const filteredMarkets = selectedType === "all" 
    ? complexMarkets 
    : complexMarkets.filter(m => m.marketType === selectedType);

  const marketTypeCounts = {
    all: complexMarkets.length,
    categorical: complexMarkets.filter(m => m.marketType === "categorical").length,
    scalar: complexMarkets.filter(m => m.marketType === "scalar").length,
    binary: 0
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <Badge variant="outline" className="text-primary border-primary/30">
              Advanced Markets
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">Complex Prediction Markets</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience advanced market types including categorical markets with multiple outcomes 
            and scalar markets for range-based predictions.
          </p>
        </div>

        {/* Market Type Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Binary Markets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Traditional Yes/No prediction markets with two possible outcomes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Categorical Markets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Multiple choice markets with 3-10 possible outcomes, perfect for elections or tournaments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Scalar Markets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Range-based predictions for numerical outcomes like prices or scores.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Market Type Filter */}
        <MarketTypeFilter 
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          counts={marketTypeCounts}
        />

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <ComplexMarketCard key={market.id} market={market} />
          ))}
        </div>

        {/* Call to Action */}
        <Card className="text-center p-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="space-y-4">
            <h3 className="text-2xl font-bold">Create Your Own Complex Market</h3>
            <p className="text-muted-foreground">
              Use our advanced market creation tools to build categorical or scalar prediction markets.
            </p>
            <Link href="/create">
              <Button size="lg" className="mt-4">
                Create Advanced Market
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}