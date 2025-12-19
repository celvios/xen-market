import { useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Database, Rocket, RefreshCw, Loader2 } from "lucide-react";
import { config } from "@/lib/config";

export default function AdminPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [marketForm, setMarketForm] = useState({
    title: "",
    description: "",
    category: "Crypto",
    endDate: "",
  });

  const handleMigrate = async () => {
    setLoading("migrate");
    try {
      const res = await fetch(`${config.apiUrl}/api/admin/migrate`);
      const data = await res.json();
      toast({
        title: data.success ? "Success" : "Error",
        description: data.message || data.error,
        variant: data.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({ title: "Error", description: "Migration failed", variant: "destructive" });
    }
    setLoading(null);
  };

  const handleSeed = async () => {
    setLoading("seed");
    try {
      const res = await fetch(`${config.apiUrl}/api/admin/seed`);
      const data = await res.json();
      toast({
        title: data.success ? "Success" : "Error",
        description: data.message || data.error,
        variant: data.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({ title: "Error", description: "Seeding failed", variant: "destructive" });
    }
    setLoading(null);
  };

  const handleCreateMarket = async () => {
    setLoading("create");
    try {
      const res = await fetch(`${config.apiUrl}/api/markets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...marketForm,
          outcomes: [
            { label: "Yes", probability: "50.00", color: "#10b981" },
            { label: "No", probability: "50.00", color: "#ef4444" },
          ],
        }),
      });
      
      if (res.ok) {
        toast({ title: "Success", description: "Market created successfully" });
        setMarketForm({ title: "", description: "", category: "Crypto", endDate: "" });
      } else {
        throw new Error("Failed to create market");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create market", variant: "destructive" });
    }
    setLoading(null);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Database Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleMigrate}
                disabled={loading === "migrate"}
                className="w-full"
                variant="outline"
              >
                {loading === "migrate" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Run Migrations
              </Button>
              
              <Button
                onClick={handleSeed}
                disabled={loading === "seed"}
                className="w-full"
                variant="outline"
              >
                {loading === "seed" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                Seed Database
              </Button>
            </CardContent>
          </Card>

          {/* Contract Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Deployed Contracts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">ConditionalTokens</div>
                <code className="text-xs bg-muted p-2 rounded block break-all">
                  0xa0a04094b602f65d053c7d957b71c47734431a68
                </code>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">MarketFactory</div>
                <code className="text-xs bg-muted p-2 rounded block break-all">
                  0x701e59e245b25851d9a8e4c92741aa98eb1e922f
                </code>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">OrderBook</div>
                <code className="text-xs bg-muted p-2 rounded block break-all">
                  0xf166cf88288e8479af84211d9fa9f53567863cf0
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Create Market */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Create Market</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Market Title</Label>
              <Input
                placeholder="Will Bitcoin reach $100k by end of 2025?"
                value={marketForm.title}
                onChange={(e) => setMarketForm({ ...marketForm, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Market description and resolution criteria..."
                value={marketForm.description}
                onChange={(e) => setMarketForm({ ...marketForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input
                  value={marketForm.category}
                  onChange={(e) => setMarketForm({ ...marketForm, category: e.target.value })}
                />
              </div>
              
              <div>
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  value={marketForm.endDate}
                  onChange={(e) => setMarketForm({ ...marketForm, endDate: e.target.value })}
                />
              </div>
            </div>

            <Button
              onClick={handleCreateMarket}
              disabled={loading === "create" || !marketForm.title || !marketForm.endDate}
              className="w-full"
            >
              {loading === "create" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Create Market
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
