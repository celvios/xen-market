import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownLeft, Filter, Download, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { fetchActivity } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

export default function Activity() {
  const { user, login } = useStore();

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ["activity", user.id],
    queryFn: () => fetchActivity(user.id!),
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
              Connect your wallet to view your transaction history and activity log.
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
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold">Activity Log</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-filter">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-export">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : trades.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <p>No transactions yet. Start trading to see your activity here.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={trade.id} className="group hover:bg-muted/50 transition-colors" data-testid={`row-trade-${trade.id}`}>
                      <TableCell>
                        <Badge variant={trade.type === "buy" ? "default" : "destructive"} className="w-16 justify-center capitalize">
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {trade.market.title}
                      </TableCell>
                      <TableCell>
                        <span className="text-primary">
                          {trade.outcome.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {(parseFloat(trade.price) * 100).toFixed(0)}¢
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {parseFloat(trade.shares).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        ${parseFloat(trade.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
