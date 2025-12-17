import Layout from "@/components/layout";
import MarketCard from "@/components/market-card";
import { MOCK_MARKETS, CATEGORIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Sparkles, FilterX } from "lucide-react";
import { useRoute, Link } from "wouter";

export default function Home() {
  const [match, params] = useRoute("/markets/:category");
  const categoryId = params?.category; // undefined if route is "/"
  
  // Filter logic
  const filteredMarkets = categoryId 
    ? MOCK_MARKETS.filter(m => m.category.toLowerCase().replace(" ", "-") === categoryId || m.category.toLowerCase() === categoryId)
    : MOCK_MARKETS;

  const featuredMarket = filteredMarkets.find(m => m.isFeatured);
  const otherMarkets = filteredMarkets.filter(m => m !== featuredMarket);
  
  const categoryLabel = categoryId 
    ? CATEGORIES.find(c => c.id === categoryId)?.label 
    : "All Markets";

  return (
    <Layout>
      {/* Category Header (if filtered) */}
      {categoryId && (
        <div className="mb-8 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <h1 className="text-3xl font-display font-bold">{categoryLabel}</h1>
          <Link href="/">
             <Button variant="ghost" size="sm" className="gap-2">
               <FilterX className="w-4 h-4" /> Clear Filter
             </Button>
          </Link>
        </div>
      )}

      {/* Featured Section */}
      {featuredMarket && (
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display font-bold uppercase tracking-wide">Featured {categoryId ? categoryLabel : "Market"}</h2>
          </div>
          <MarketCard market={featuredMarket} featured />
        </section>
      )}

      {/* Trending / List Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-display font-bold uppercase tracking-wide">
              {categoryId ? `More in ${categoryLabel}` : "Trending Now"}
            </h2>
          </div>
          {!categoryId && (
            <Button variant="link" className="text-muted-foreground hover:text-primary gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {otherMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherMarkets.map((market) => (
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
        <section className="mt-16 mb-8 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 border border-primary/20 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.1),transparent_70%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-4">Trade on the Future</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join the world's most transparent prediction market. Trade with USDC, earn rewards, and hedge against real-world events.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 font-semibold text-md shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all">
              Get Started Now
            </Button>
          </div>
        </section>
      )}
    </Layout>
  );
}
