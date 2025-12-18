import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Plus, X, Target, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MultiOutcomeCreatorProps {
  onSubmit: (marketData: any) => void;
}

export function MultiOutcomeCreator({ onSubmit }: MultiOutcomeCreatorProps) {
  const [marketType, setMarketType] = useState<"binary" | "categorical" | "scalar">("binary");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [outcomes, setOutcomes] = useState<string[]>(["Yes", "No"]);
  const [scalarMin, setScalarMin] = useState("");
  const [scalarMax, setScalarMax] = useState("");
  const [endDate, setEndDate] = useState("");
  const { toast } = useToast();

  const addOutcome = () => {
    if (outcomes.length < 10) {
      setOutcomes([...outcomes, `Option ${outcomes.length + 1}`]);
    }
  };

  const removeOutcome = (index: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter((_, i) => i !== index));
    }
  };

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...outcomes];
    newOutcomes[index] = value;
    setOutcomes(newOutcomes);
  };

  const handleSubmit = () => {
    if (!question.trim() || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (marketType === "categorical" && outcomes.length < 3) {
      toast({
        title: "Invalid Outcomes",
        description: "Categorical markets need at least 3 outcomes.",
        variant: "destructive",
      });
      return;
    }

    if (marketType === "scalar" && (!scalarMin || !scalarMax)) {
      toast({
        title: "Missing Range",
        description: "Please set min and max values for scalar market.",
        variant: "destructive",
      });
      return;
    }

    const marketData = {
      question: question.trim(),
      description: description.trim(),
      marketType,
      outcomes: marketType === "scalar" ? [`Below ${scalarMin}`, `Above ${scalarMax}`] : outcomes,
      scalarRange: marketType === "scalar" ? { min: scalarMin, max: scalarMax } : null,
      endDate,
      category: "Custom"
    };

    onSubmit(marketData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Advanced Market Creation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Type Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Market Type</label>
          <Select value={marketType} onValueChange={(value: any) => setMarketType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="binary">Binary (Yes/No)</SelectItem>
              <SelectItem value="categorical">Categorical (Multiple Choice)</SelectItem>
              <SelectItem value="scalar">Scalar (Range)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question */}
        <div>
          <label className="text-sm font-medium mb-2 block">Question *</label>
          <Input
            placeholder="What will happen?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            placeholder="Additional context and resolution criteria..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Outcomes Configuration */}
        {marketType === "binary" && (
          <div>
            <label className="text-sm font-medium mb-2 block">Outcomes</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={outcomes[0]}
                onChange={(e) => updateOutcome(0, e.target.value)}
                placeholder="Yes"
              />
              <Input
                value={outcomes[1]}
                onChange={(e) => updateOutcome(1, e.target.value)}
                placeholder="No"
              />
            </div>
          </div>
        )}

        {marketType === "categorical" && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Outcomes ({outcomes.length}/10)
            </label>
            <div className="space-y-2">
              {outcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={outcome}
                    onChange={(e) => updateOutcome(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {outcomes.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeOutcome(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {outcomes.length < 10 && (
                <Button
                  variant="outline"
                  onClick={addOutcome}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Outcome
                </Button>
              )}
            </div>
          </div>
        )}

        {marketType === "scalar" && (
          <div>
            <label className="text-sm font-medium mb-2 block">Value Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min value"
                value={scalarMin}
                onChange={(e) => setScalarMin(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max value"
                value={scalarMax}
                onChange={(e) => setScalarMax(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Market will resolve based on whether the actual value falls below min or above max
            </p>
          </div>
        )}

        {/* End Date */}
        <div>
          <label className="text-sm font-medium mb-2 block">End Date *</label>
          <Input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Market Type Info */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Market Type: {marketType}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {marketType === "binary" && "Simple Yes/No prediction market"}
            {marketType === "categorical" && "Multiple choice market with 3+ outcomes"}
            {marketType === "scalar" && "Range-based market for numerical predictions"}
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Create {marketType} Market
        </Button>
      </CardContent>
    </Card>
  );
}