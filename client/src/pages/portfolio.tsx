import Layout from "@/components/layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_MARKETS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowUpRight, TrendingUp, Wallet, PieChart } from "lucide-react";

export default function Portfolio() {
  const { user, login } = useStore();

  if (!user.isLoggedIn) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center animate-pulse">
            <Wallet className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Connect Your Wallet</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Connect your wallet to view your portfolio, track your positions, and manage your trading history.
            </p>
          </div>
          <Button size="lg" onClick={login} className="font-semibold px-8">
            Connect Wallet
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-display font-bold">My Portfolio</h1>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-foreground">
                ${(user.balance + user.portfolioValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-green-400 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +0.0% (24h)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Cash Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-foreground">
                ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <Button variant="outline" size="sm" className="mt-4 h-8 text-xs w-full">Deposit</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Positions Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-foreground">
                ${user.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
               <div className="text-xs text-muted-foreground mt-1 flex items-center">
                 <PieChart className="w-3 h-3 mr-1" /> {user.positions.length} Active Positions
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Positions Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Positions</h2>
          {user.positions.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <div className="flex flex-col items-center gap-4">
                <TrendingUp className="w-12 h-12 text-muted-foreground/50" />
                <div>
                  <h3 className="text-lg font-medium">No active positions</h3>
                  <p className="text-muted-foreground text-sm">Start trading to build your portfolio</p>
                </div>
                <Link href="/">
                  <Button variant="secondary">Explore Markets</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {user.positions.map((pos, idx) => {
                const market = MOCK_MARKETS.find(m => m.id === pos.marketId);
                const outcome = market?.outcomes.find(o => o.id === pos.outcomeId);
                const currentValue = pos.shares * (outcome?.probability || 0) / 100; // Mock current value based on prob
                
                if (!market || !outcome) return null;

                return (
                  <Card key={`${pos.marketId}-${pos.outcomeId}-${idx}`} className="overflow-hidden hover:border-primary/30 transition-colors">
                    <div className="flex flex-col md:flex-row items-center p-4 gap-4">
                      <img src={market.image} alt="" className="w-12 h-12 rounded bg-muted object-cover" />
                      
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <Link href={`/market/${market.id}`}>
                           <h3 className="font-medium truncate hover:text-primary transition-colors">{market.title}</h3>
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          Outcome: <span className={outcome.id === 'yes' ? 'text-primary' : 'text-destructive'}>{outcome.label}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-8 text-right text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs uppercase">Shares</div>
                          <div className="font-mono">{pos.shares.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs uppercase">Avg Price</div>
                          <div className="font-mono">{pos.avgPrice.toFixed(2)}¢</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs uppercase">Value</div>
                          <div className="font-mono font-medium">${currentValue.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
