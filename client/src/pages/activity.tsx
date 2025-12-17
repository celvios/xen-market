import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownLeft, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_ACTIVITY = [
  { id: 1, type: "Buy", market: "Bitcoin to hit $100k", outcome: "Yes", amount: 150.00, shares: 230.5, price: 0.65, date: "2 mins ago" },
  { id: 2, type: "Sell", market: "GTA VI release 2025", outcome: "No", amount: 45.00, shares: 100, price: 0.45, date: "2 hours ago" },
  { id: 3, type: "Buy", market: "Super Bowl LIX Winner", outcome: "Chiefs", amount: 500.00, shares: 2500, price: 0.20, date: "1 day ago" },
  { id: 4, type: "Deposit", market: "-", outcome: "-", amount: 1000.00, shares: 0, price: 1.00, date: "2 days ago" },
  { id: 5, type: "Buy", market: "AGI by 2027", outcome: "Yes", amount: 75.50, shares: 343, price: 0.22, date: "3 days ago" },
  { id: 6, type: "Sell", market: "SpaceX Mars 2030", outcome: "No", amount: 200.00, shares: 400, price: 0.50, date: "1 week ago" },
];

export default function Activity() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold">Activity Log</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
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
                {MOCK_ACTIVITY.map((tx) => (
                  <TableRow key={tx.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Badge variant={tx.type === "Buy" || tx.type === "Deposit" ? "default" : "destructive"} className="w-16 justify-center">
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {tx.market}
                    </TableCell>
                    <TableCell>
                      {tx.outcome !== "-" ? (
                        <span className={tx.outcome === "Yes" || tx.outcome === "Chiefs" ? "text-primary" : "text-muted-foreground"}>
                          {tx.outcome}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {tx.price < 1 ? `${(tx.price * 100).toFixed(0)}¢` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {tx.shares > 0 ? tx.shares.toFixed(1) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      ${tx.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {tx.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
