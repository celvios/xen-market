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
    marketType: "binary",
    outcomes: ["Yes", "No"],
    scalarRange: { min: 0, max: 100 },
  });

  const marketTypeOutcomes: Record<string, string[]> = {
    binary: ["Yes", "No"],
    categorical: ["Option 1", "Option 2", "Option 3"],
    scalar: ["Range"],
  };

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
      const probability = (100 / marketForm.outcomes.length).toFixed(2);
      const colors = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"];
      
      const res = await fetch(`${config.apiUrl}/api/markets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: marketForm.title,
          description: marketForm.description,
          category: marketForm.category,
          endDate: new Date(marketForm.endDate).toISOString(),
          marketType: marketForm.marketType,
          scalarRange: marketForm.marketType === "scalar" ? marketForm.scalarRange : null,
          outcomes: marketForm.marketType === "scalar" ? [] : marketForm.outcomes.map((label, index) => ({
            label,
            probability,
            color: colors[index % colors.length],
          })),
        }),
      });
      
      if (res.ok) {
        toast({ title: "Success", description: "Market created successfully" });
        setMarketForm({ 
          title: "", 
          description: "", 
          category: "Crypto", 
          endDate: "",
          marketType: "binary",
          outcomes: ["Yes", "No"],
          scalarRange: { min: 0, max: 100 },
        });
      } else {
        const error = await res.json();
        throw new Error(error.error || "Failed to create market");
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create market", 
        variant: "destructive" 
      });
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Market Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={marketForm.marketType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setMarketForm({
                      ...marketForm,
                      marketType: newType,
                      outcomes: marketTypeOutcomes[newType] || ["Yes", "No"],
                    });
                  }}
                >
                  <option value="binary">Binary (Yes/No)</option>
                  <option value="categorical">Categorical (Multiple)</option>
                  <option value="scalar">Scalar (Range)</option>
                </select>
              </div>

              <div>
                <Label>Category</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={marketForm.category}
                  onChange={(e) => setMarketForm({ ...marketForm, category: e.target.value })}
                >
                  <option value="Crypto">Crypto</option>
                  <option value="Politics">Politics</option>
                  <option value="Sports">Sports</option>
                  <option value="Tech">Tech</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  value={marketForm.endDate}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setMarketForm({ ...marketForm, endDate: e.target.value })}
                />
              </div>
            </div>

            {marketForm.marketType === "scalar" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Value</Label>
                  <Input
                    type="number"
                    value={marketForm.scalarRange.min}
                    onChange={(e) => setMarketForm({
                      ...marketForm,
                      scalarRange: { ...marketForm.scalarRange, min: parseFloat(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label>Max Value</Label>
                  <Input
                    type="number"
                    value={marketForm.scalarRange.max}
                    onChange={(e) => setMarketForm({
                      ...marketForm,
                      scalarRange: { ...marketForm.scalarRange, max: parseFloat(e.target.value) }
                    })}
                  />
                </div>
              </div>
            )}

            {marketForm.marketType !== "scalar" && (
              <div>
                <Label>Outcomes</Label>
                <div className="space-y-2">
                  {marketForm.outcomes.map((outcome, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={outcome}
                        onChange={(e) => {
                          const newOutcomes = [...marketForm.outcomes];
                          newOutcomes[index] = e.target.value;
                          setMarketForm({ ...marketForm, outcomes: newOutcomes });
                        }}
                        placeholder={`Outcome ${index + 1}`}
                      />
                      {marketForm.outcomes.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOutcomes = marketForm.outcomes.filter((_, i) => i !== index);
                            setMarketForm({ ...marketForm, outcomes: newOutcomes });
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  {marketForm.marketType === "categorical" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMarketForm({
                          ...marketForm,
                          outcomes: [...marketForm.outcomes, `Option ${marketForm.outcomes.length + 1}`],
                        });
                      }}
                    >
                      + Add Outcome
                    </Button>
                  )}
                </div>
              </div>
            )}

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
