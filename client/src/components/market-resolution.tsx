import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Gavel, AlertTriangle } from "lucide-react";

interface Market {
  id: number;
  title: string;
  isResolved: boolean;
  outcomes: Array<{
    id: number;
    label: string;
  }>;
}

interface MarketResolutionProps {
  market: Market;
  isAdmin?: boolean;
}

export function MarketResolution({ market, isAdmin = false }: MarketResolutionProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [evidence, setEvidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleResolve = async () => {
    if (!selectedOutcome || !evidence.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an outcome and provide evidence.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/markets/${market.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcomeId: selectedOutcome,
          evidence: evidence.trim(),
          proposer: "admin", // In real app, use actual user ID
        }),
      });

      if (!response.ok) throw new Error("Resolution failed");

      toast({
        title: "Resolution Proposed",
        description: "Market resolution has been submitted for processing.",
      });

      setSelectedOutcome(null);
      setEvidence("");
    } catch (error) {
      toast({
        title: "Resolution Failed",
        description: "Failed to submit resolution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (market.isResolved) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Gavel className="w-5 h-5" />
            Market Resolved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This market has been resolved and payouts have been distributed.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            Pending Resolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This market is awaiting resolution by the oracle or admin.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="w-5 h-5" />
          Resolve Market
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Select Winning Outcome
          </label>
          <div className="grid gap-2">
            {market.outcomes.map((outcome) => (
              <Button
                key={outcome.id}
                variant={selectedOutcome === outcome.id ? "default" : "outline"}
                onClick={() => setSelectedOutcome(outcome.id)}
                className="justify-start"
              >
                {outcome.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Evidence / Source
          </label>
          <Textarea
            placeholder="Provide evidence or source for the resolution..."
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={handleResolve}
          disabled={!selectedOutcome || !evidence.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Resolve Market"}
        </Button>

        <div className="text-xs text-muted-foreground">
          <Badge variant="outline" className="mr-2">Admin Only</Badge>
          Resolution will trigger automatic payout distribution to winning positions.
        </div>
      </CardContent>
    </Card>
  );
}