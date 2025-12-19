import Layout from "@/components/layout";
import MarketCard from "@/components/market-card";
import { ComplexMarketCard } from "@/components/complex-market-card";
import { MarketTypeFilter } from "@/components/market-type-filter";
import { CATEGORIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Sparkles, FilterX, Loader2, Zap } from "lucide-react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchMarkets, type Market } from "@/lib/api";
import { useStore } from "@/lib/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";

export default function Home() {
  const [match, params] = useRoute("/markets/:category");
  const categoryId = params?.category;
  const { user } = useStore();
  const { openConnectModal } = useConnectModal();
  const [selectedMarketType, setSelectedMarketType] = useState("all");

  const { data: markets = [], isLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarkets,
  });

  // Filter logic
  let filteredMarkets = categoryId
    ? markets.filter((m: Market) => m.category.toLowerCase().replace(" ", "-") === categoryId || m.category.toLowerCase() === categoryId)
    : markets;

  // Add market type filtering
  if (selectedMarketType !== "all") {
    filteredMarkets = filteredMarkets.filter((m: any) => {
      const marketType = m.marketType || "binary"; // Default to binary for existing markets
      return marketType === selectedMarketType;
    });
  }

  // Calculate market type counts
  const marketTypeCounts = markets.reduce((acc: Record<string, number>, market: any) => {
    const type = market.marketType || "binary";
    acc[type] = (acc[type] || 0) + 1;
    acc.all = (acc.all || 0) + 1;
    return acc;
  }, {});

  const featuredMarket = filteredMarkets.find((m: Market) => m.isFeatured);
  const otherMarkets = filteredMarkets.filter((m: Market) => m !== featuredMarket);

  const categoryLabel = categoryId
    ? CATEGORIES.find(c => c.id === categoryId)?.label
    : "All Markets";

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Category Header (if filtered) */}
      {categoryId && (
        <div className="mb-8 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]" />
            <h1 className="text-3xl font-display font-black uppercase tracking-tight">{categoryLabel}</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <FilterX className="w-3 h-3 mr-2" /> Clear Filters
            </Button>
          </Link>
        </div>
      )}

      {/* Featured Section */}
      {featuredMarket && (
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Featured Market</h2>
          </div>
          <MarketCard market={featuredMarket} featured />
        </section>
      )}

      {/* Market Type Filter */}
      <section className="mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <MarketTypeFilter
          selectedType={selectedMarketType}
          onTypeChange={setSelectedMarketType}
          counts={marketTypeCounts}
        />
      </section>

      {/* Trending / List Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-success drop-shadow-[0_0_8px_hsl(var(--success))]" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">
              {categoryId ? `More in ${categoryLabel}` : "Market Board"}
            </h2>
          </div>
          {!categoryId && (
            <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
              Comprehensive List <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          )}
        </div>

        {otherMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherMarkets.map((market: any) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed border-muted">
            <h3 className="text-lg font-medium text-muted-foreground">No markets found in this category.</h3>
            <Link href="/">
              <Button variant="link" className="mt-2">View all markets</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Promo Banner - Only on Home */}
      {!categoryId && (
        <section className="mt-16 mb-8 rounded-[2rem] bg-card border border-primary/20 p-12 text-center relative overflow-hidden glass-panel group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.15),transparent_60%)] group-hover:bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.2),transparent_70%)] transition-colors duration-700" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-success/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
              <Zap className="w-3 h-3" /> Alpha Access
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent italic">
              OWN THE OUTCOME.
            </h2>
            <p className="text-muted-foreground mb-10 text-lg font-medium leading-relaxed">
              Join the technical frontier of prediction markets. Precision trading, institutional grade data, and full transparency on-chain.
            </p>
            <Button
              size="lg"
              className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                if (user.isLoggedIn) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (openConnectModal) {
                  openConnectModal();
                }
              }}
              data-testid="button-get-started"
            >
              {user.isLoggedIn ? "Access Dashboard" : "Sync Wallet Now"}
            </Button>
          </div>
        </section>
      )}
    </Layout>
  );
}
