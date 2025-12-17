import Layout from "@/components/layout";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2, Info, TrendingUp, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMarket, executeBuy, type Market } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Mock chart data generator
const generateChartData = () => {
  const data = [];
  let val = 50;
  for (let i = 0; i < 24; i++) {
    val = val + (Math.random() * 10 - 5);
    if (val > 99) val = 99;
    if (val < 1) val = 1;
    data.push({ time: `${i}:00`, value: val });
  }
  return data;
};

export default function MarketDetails() {
  const [match, params] = useRoute("/market/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: market, isLoading } = useQuery({
    queryKey: ["market", id],
    queryFn: () => fetchMarket(id),
    enabled: id > 0,
  });
  
  const { user, refreshUser } = useStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [chartData] = useState(generateChartData());

  const buyMutation = useMutation({
    mutationFn: executeBuy,
    onSuccess: ({ newBalance }) => {
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
        title: "Trade Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!market) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold mb-4">Market not found</h2>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Default to first outcome if none selected
  const activeOutcome = selectedOutcome 
    ? market.outcomes.find(o => o.id === selectedOutcome) 
    : market.outcomes[0];

  const handleBuy = () => {
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

    buyMutation.mutate({
      userId: user.id!,
      marketId: market.id,
      outcomeId: activeOutcome.id,
      amountUSD: amountNum,
      price: parseFloat(activeOutcome.probability) / 100,
    });
  };

  function formatVolume(volume: string): string {
    const num = parseFloat(volume);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return `${num.toFixed(0)}`;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="mb-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Markets
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Market Info & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 rounded-lg border border-border">
                <AvatarImage src={market.image} className="object-cover" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold leading-tight mb-2">
                  {market.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                   <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> ${formatVolume(market.volume)} Vol</span>
                   <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Ends {market.endDate}</span>
                </div>
              </div>
            </div>

            {/* Chart Card */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-sm text-muted-foreground">Probability</div>
                  <div className="text-3xl font-mono font-bold text-primary">
                    {activeOutcome ? parseFloat(activeOutcome.probability).toFixed(0) : 0}%
                  </div>
                </div>
                <div className="flex gap-2">
                  {market.outcomes.map(outcome => (
                    <Button 
                      key={outcome.id}
                      variant={activeOutcome?.id === outcome.id ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setSelectedOutcome(outcome.id)}
                      className={activeOutcome?.id === outcome.id ? outcome.color + " text-white border-transparent" : ""}
                      data-testid={`button-outcome-${outcome.id}`}
                    >
                      {outcome.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Description / Rules */}
            <Card className="p-6">
               <h3 className="font-semibold mb-4 flex items-center gap-2">
                 <Info className="w-4 h-4 text-primary" /> Market Rules
               </h3>
               <div className="prose prose-sm prose-invert text-muted-foreground">
                 <p>
                   This market will resolve to "Yes" if the event described in the title occurs by the end date. 
                   Resolution source will be major news outlets and official announcements. 
                   Standard Xen Markets rules apply.
                 </p>
               </div>
            </Card>
          </div>

          {/* Right Column: Trading Interface */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-primary/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <CardContent className="p-6">
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-6">
                    <TabsTrigger value="buy">Buy</TabsTrigger>
                    <TabsTrigger value="sell">Sell</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="buy" className="space-y-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Outcome</span>
                      <span className="font-medium text-primary">{activeOutcome?.label}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">{activeOutcome?.probability}¢</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Amount (USDC)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-7 text-lg font-mono bg-background/50"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Balance: ${user.balance.toFixed(2)}</span>
                        <button className="text-primary hover:underline" onClick={() => setAmount(user.balance.toString())}>Max</button>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Shares</span>
                        <span className="font-mono font-medium">
                          {amount ? (parseFloat(amount) / (activeOutcome!.probability / 100)).toFixed(2) : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Potential Return</span>
                        <span className="font-mono font-medium text-green-400">
                          ${amount ? ((parseFloat(amount) / (activeOutcome!.probability / 100)) * 1).toFixed(2) : "0.00"} 
                          <span className="text-xs text-muted-foreground ml-1">
                            ({amount ? (((1 / (activeOutcome!.probability / 100)) - 1) * 100).toFixed(0) : "0"}%)
                          </span>
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full font-bold text-lg h-12 mt-4" 
                      onClick={handleBuy}
                      disabled={!amount || parseFloat(amount) <= 0}
                    >
                      Buy {activeOutcome?.label}
                    </Button>
                    
                    {!user.isLoggedIn && (
                      <div className="flex items-center gap-2 text-xs text-amber-500 justify-center mt-2 bg-amber-500/10 p-2 rounded">
                        <AlertCircle className="w-3 h-3" /> Connect wallet to trade
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="sell">
                     <div className="text-center py-8 text-muted-foreground">
                       <p>You don't have any positions to sell in this outcome.</p>
                     </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
