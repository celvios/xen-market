import Layout from "@/components/layout";
import MarketCard from "@/components/market-card";
import { MOCK_MARKETS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Sparkles } from "lucide-react";

export default function Home() {
  const featuredMarket = MOCK_MARKETS.find(m => m.isFeatured);
  const otherMarkets = MOCK_MARKETS.filter(m => m !== featuredMarket);

  return (
    <Layout>
      {/* Featured Section */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-display font-bold uppercase tracking-wide">Featured Market</h2>
        </div>
        {featuredMarket && <MarketCard market={featuredMarket} featured />}
      </section>

      {/* Trending Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-display font-bold uppercase tracking-wide">Trending Now</h2>
          </div>
          <Button variant="link" className="text-muted-foreground hover:text-primary gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
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
    </Layout>
  );
}
