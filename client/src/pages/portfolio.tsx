import Layout from "@/components/layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowUpRight, TrendingUp, Wallet, PieChart, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPortfolio } from "@/lib/api";
import { PnLCalculator } from "@/components/pnl-calculator";
import { DepositDialog } from "@/components/deposit-dialog";
import { WithdrawDialog } from "@/components/withdraw-dialog";
import { useState } from "react";

export default function Portfolio() {
  const { user, login, refreshUser } = useStore();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const { data: positions = [], isLoading } = useQuery({
    queryKey: ["portfolio", user.id],
    queryFn: () => fetchPortfolio(user.id!),
    enabled: !!user.id,
  });

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
          <Button size="lg" onClick={login} className="font-semibold px-8" data-testid="button-connect">
            Connect Wallet
          </Button>
        </div>
      </Layout>
    );
  }

  const portfolioValue = positions.reduce((acc, pos) => {
    const shares = parseFloat(pos.shares);
    const avgPrice = parseFloat(pos.avgPrice);
    return acc + (shares * avgPrice);
  }, 0);

  const totalValue = parseFloat(user.balance) + portfolioValue;

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
              <div className="text-3xl font-mono font-bold text-foreground" data-testid="text-total-value">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              <div className="text-3xl font-mono font-bold text-foreground" data-testid="text-balance">
                ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs" 
                  data-testid="button-deposit"
                  onClick={() => setDepositOpen(true)}
                >
                  Deposit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs" 
                  onClick={() => setWithdrawOpen(true)}
                >
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Positions Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-foreground" data-testid="text-positions-value">
                ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
               <div className="text-xs text-muted-foreground mt-1 flex items-center">
                 <PieChart className="w-3 h-3 mr-1" /> {positions.length} Active Positions
               </div>
            </CardContent>
          </Card>
        </div>

        {/* P&L Calculator */}
        {positions.length > 0 && <PnLCalculator positions={positions} />}

        {/* Positions Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Positions</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : positions.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <div className="flex flex-col items-center gap-4">
                <TrendingUp className="w-12 h-12 text-muted-foreground/50" />
                <div>
                  <h3 className="text-lg font-medium">No active positions</h3>
                  <p className="text-muted-foreground text-sm">Start trading to build your portfolio</p>
                </div>
                <Link href="/">
                  <Button variant="secondary" data-testid="button-explore">Explore Markets</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {positions.map((pos, idx) => {
                const shares = parseFloat(pos.shares);
                const avgPrice = parseFloat(pos.avgPrice);
                const invested = shares * avgPrice;
                const currentPrice = parseFloat(pos.outcome.probability) / 100;
                const currentValue = shares * currentPrice;
                const pnl = currentValue - invested;
                
                return (
                  <Card key={`${pos.marketId}-${pos.outcomeId}-${idx}`} className="overflow-hidden hover:border-primary/30 transition-colors" data-testid={`card-position-${pos.id}`}>
                    <div className="flex flex-col md:flex-row items-center p-4 gap-4">
                      <img src={pos.market.image} alt="" className="w-12 h-12 rounded bg-muted object-cover" />
                      
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <Link href={`/market/${pos.market.id}`}>
                           <h3 className="font-medium truncate hover:text-primary transition-colors">{pos.market.title}</h3>
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          Outcome: <span className="text-primary">{pos.outcome.label}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-8 text-right text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs uppercase">Shares</div>
                          <div className="font-mono">{parseFloat(pos.shares).toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs uppercase">Avg Price</div>
                          <div className="font-mono">{parseFloat(pos.avgPrice).toFixed(2)}¢</div>
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
        
        <DepositDialog 
          isOpen={depositOpen} 
          onClose={() => setDepositOpen(false)} 
          onSuccess={refreshUser}
        />
        
        <WithdrawDialog 
          isOpen={withdrawOpen} 
          onClose={() => setWithdrawOpen(false)} 
          onSuccess={refreshUser}
        />
      </div>
    </Layout>
  );
}
