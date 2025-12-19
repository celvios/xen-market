import { useState, useMemo } from "react";
import Layout from "@/components/layout";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import { fetchMarket, executeBuy } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useContracts } from "@/hooks/use-contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  TrendingUp,
  Info,
  AlertCircle,
  Loader2,
  LayoutDashboard,
  BarChart3
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { PriceChart } from "@/components/price-chart";
import { OrderBook } from "@/components/order-book";
import { TransactionStatus } from "@/components/transaction-status";
import { MarketResolution } from "@/components/market-resolution";
import { FeeDisplay } from "@/components/fee-display";
import { useGasEstimation } from "@/hooks/use-gas-estimation";

// Helper for generating chart data
function generateChartData() {
  const data = [];
  let val = 50;
  for (let i = 0; i < 20; i++) {
    val = Math.max(0, Math.min(100, val + (Math.random() - 0.5) * 10));
    data.push({
      time: `${i}:00`,
      value: val,
    });
  }
  return data;
}

export default function MarketDetails() {
  const [match, params] = useRoute("/market/:id");
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: market, isLoading } = useQuery({
    queryKey: ["market", id],
    queryFn: () => fetchMarket(id),
    enabled: id > 0,
  });

  const { user, refreshUser } = useStore();
  const { splitPosition } = useContracts();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [isTransacting, setIsTransacting] = useState(false);
  const [txStatus, setTxStatus] = useState<{
    isOpen: boolean;
    status: "pending" | "success" | "error";
    txHash?: string;
    error?: string;
  }>({ isOpen: false, status: "pending" });
  const { gasData, estimateGas } = useGasEstimation();

  const activeOutcome = useMemo(() => {
    if (!market) return null;
    return market.outcomes.find(o => o.id === selectedOutcome) || market.outcomes[0];
  }, [market, selectedOutcome]);

  const buyMutation = useMutation({
    mutationFn: executeBuy,
    onSuccess: () => {
      toast({
        title: "Order Filled",
        description: `Successfully purchased shares for $${amount}`,
      });
      setAmount("");
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ["portfolio", user.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Database Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBuy = async () => {
    if (!user.isLoggedIn) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to trade.",
        variant: "destructive",
      });
      return;
    }

    if (!activeOutcome || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please enter an amount.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    setIsTransacting(true);
    setTxStatus({ isOpen: true, status: "pending" });
    
    try {
      if (market?.conditionId) {
        const txHash = await splitPosition(market.conditionId, amount);
        setTxStatus({ isOpen: true, status: "success", txHash });
      }

      buyMutation.mutate({
        userId: user.id!,
        marketId: market!.id,
        outcomeId: activeOutcome.id,
        amountUSD: amountNum,
        price: parseFloat(activeOutcome.probability) / 100,
      });
    } catch (error: any) {
      setTxStatus({ 
        isOpen: true, 
        status: "error", 
        error: error.message || "Transaction failed" 
      });
    } finally {
      setIsTransacting(false);
    }
  };

  function formatVolume(volume: string): string {
    const num = parseFloat(volume);
    if (isNaN(num)) return volume;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return `${num.toFixed(0)}`;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!market) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Market not found</h2>
          <Link href="/" className="text-primary hover:underline">Back to Markets</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-700">
        {/* Market Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border shadow-xl overflow-hidden glass-panel flex-shrink-0 relative group">
              <img src={market.image} alt={market.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                <TrendingUp className="w-3 h-3" />
                {market.category} Market
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-black leading-tight text-foreground tracking-tight">
                {market.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Volume</span>
              <span className="text-lg font-mono font-black text-foreground leading-none">${formatVolume(market.volume)}</span>
            </div>
            <Separator orientation="vertical" className="h-10 mx-2 opacity-20" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Time Left</span>
              <span className="text-lg font-mono font-black text-primary leading-none">{market.endDate}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Chart & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Outcome Selector */}
            <Card className="p-4 bg-card/40 border-border glass-panel">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Select Outcome</h3>
              <div className="grid grid-cols-2 gap-3">
                {market.outcomes.map((outcome) => (
                  <button
                    key={outcome.id}
                    onClick={() => setSelectedOutcome(outcome.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all font-bold text-left",
                      selectedOutcome === outcome.id || (!selectedOutcome && outcome.id === market.outcomes[0].id)
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border bg-muted/20 hover:border-primary/50"
                    )}
                  >
                    <div className="text-sm text-muted-foreground mb-1">{outcome.label}</div>
                    <div className="text-2xl font-mono font-black">{outcome.probability}¢</div>
                  </button>
                ))}
              </div>
            </Card>
            
            {/* Price Chart */}
            <PriceChart marketId={market.id} outcomeId={activeOutcome?.id} />
            
            {/* Order Book */}
            <OrderBook marketId={market.id} />
            
            {/* Market Resolution */}
            <MarketResolution market={market} isAdmin={user.walletAddress === "0x1234"} />

            <Card className="p-6 bg-card/40 border-border glass-panel">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                <Info className="w-3 h-3" /> Market Rules & Conditions
              </h3>
              <div className="prose prose-sm prose-invert text-muted-foreground max-w-none">
                <p className="leading-relaxed">
                  This market will resolve to <span className="text-primary font-bold">"Yes"</span> if the event described in the title occurs by the end date.
                  Resolution source will be major news outlets and official announcements.
                  Standard Xen Markets protocol rules apply to all outcomes.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Trading Interface */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-primary/30 shadow-[0_0_50px_rgba(0,0,0,0.4)] glass-panel overflow-hidden">
              <div className="bg-primary/10 border-b border-primary/20 p-4">
                <h2 className="text-sm font-display font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Terminal
                </h2>
              </div>
              <CardContent className="p-6">
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-6 bg-background/50 border border-border p-1 h-12">
                    <TabsTrigger value="buy" className="font-bold uppercase tracking-widest text-xs data-[state=active]:bg-[#10b981] data-[state=active]:text-white">Buy</TabsTrigger>
                    <TabsTrigger value="sell" className="font-bold uppercase tracking-widest text-xs data-[state=active]:bg-[#ef4444] data-[state=active]:text-white">Sell</TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-6">
                    <div className="p-4 bg-muted/20 border border-border/50 rounded-xl space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Outcome Selected</span>
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">{activeOutcome?.label}</Badge>
                      </div>

                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Execution Price</span>
                        <div className="text-3xl font-mono font-black text-foreground leading-none">
                          {activeOutcome?.probability}<span className="text-sm text-muted-foreground ml-1">¢</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount (USDC)</label>
                        <button className="text-[10px] font-bold text-primary hover:underline uppercase" onClick={() => setAmount(user.balance.toString())}>MAX: ${user.balance.toFixed(2)}</button>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground font-mono transition-colors group-focus-within:text-primary">$</div>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-8 h-14 text-xl font-mono font-black bg-muted/20 border-border"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="px-4 py-3 bg-muted/10 border border-border/30 rounded-lg">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Est. Shares</div>
                        <div className="text-sm font-mono font-bold text-foreground">{amount ? (parseFloat(amount) / (parseFloat(activeOutcome!.probability) / 100)).toFixed(2) : "0.00"}</div>
                      </div>
                      <div className="px-4 py-3 bg-muted/10 border border-border/30 rounded-lg text-right">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Max Profit</div>
                        <div className="text-sm font-mono font-bold text-success">
                          ${amount ? ((parseFloat(amount) / (parseFloat(activeOutcome!.probability) / 100)) * 1).toFixed(2) : "0.00"}
                        </div>
                      </div>
                    </div>

                    {/* Fee Display */}
                    {amount && parseFloat(amount) > 0 && (
                      <FeeDisplay 
                        tradeAmount={parseFloat(amount)}
                        isMaker={false}
                        userVolume={0}
                      />
                    )}

                    <Button
                      className="w-full font-black text-sm uppercase tracking-[0.2em] h-14 bg-[#10b981] hover:bg-[#10b981]/90 text-white shadow-lg shadow-[#10b981]/20"
                      onClick={handleBuy}
                      disabled={!amount || parseFloat(amount) <= 0 || isTransacting}
                    >
                      {isTransacting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      Place Buy Order
                    </Button>

                    {!user.isLoggedIn && (
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 justify-center mt-2 bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                        <AlertCircle className="w-3 h-3" /> Connect wallet to execute
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="sell">
                    <div className="text-center py-16 text-muted-foreground glass-panel rounded-xl mt-4 border-dashed">
                      <BarChart3 className="w-10 h-10 mx-auto mb-4 opacity-10" />
                      <p className="text-[10px] font-black uppercase tracking-widest leading-loose">No Positions Detected</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Transaction Status Dialog */}
        <TransactionStatus
          isOpen={txStatus.isOpen}
          onClose={() => setTxStatus({ isOpen: false, status: "pending" })}
          status={txStatus.status}
          txHash={txStatus.txHash}
          error={txStatus.error}
          title="Trade Transaction"
          description={txStatus.status === "pending" ? "Processing your trade..." : undefined}
        />
      </div>
    </Layout>
  );
}
