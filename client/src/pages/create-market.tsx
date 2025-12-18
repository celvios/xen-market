import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useCreateMarket } from '../hooks/use-market-factory';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MultiOutcomeCreator } from '../components/multi-outcome-creator';
import { toast } from 'sonner';
import { Target, Zap } from 'lucide-react';

const CATEGORIES = ['Politics', 'Sports', 'Crypto', 'Entertainment', 'Science', 'Other'];

export default function CreateMarket() {
  const { address } = useAccount();
  const { createMarket, isPending, isConfirming, isSuccess } = useCreateMarket();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    endDate: '',
    outcomes: ['Yes', 'No'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const endTime = Math.floor(new Date(formData.endDate).getTime() / 1000);
      await createMarket(
        formData.title,
        endTime,
        formData.outcomes.length,
        address // Using creator as oracle for now
      );
      
      toast.success('Market creation transaction submitted');
    } catch (error) {
      console.error('Error creating market:', error);
      toast.error('Failed to create market');
    }
  };

  const handleAdvancedSubmit = async (marketData: any) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      // Create market via API for advanced types
      const response = await fetch('/api/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: marketData.question,
          description: marketData.description,
          category: marketData.category,
          endDate: marketData.endDate,
          outcomes: marketData.outcomes.map((label: string, index: number) => ({
            label,
            probability: (100 / marketData.outcomes.length).toFixed(2),
            color: index === 0 ? '#10b981' : '#ef4444'
          }))
        })
      });

      if (response.ok) {
        toast.success('Advanced market created successfully!');
      } else {
        throw new Error('Failed to create market');
      }
    } catch (error) {
      console.error('Error creating advanced market:', error);
      toast.error('Failed to create advanced market');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Create New Market</h1>
      </div>
      
      <Tabs defaultValue="simple" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Simple Market
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Advanced Market
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple">
          <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Market Question</Label>
            <Input
              id="title"
              placeholder="Will Bitcoin reach $100k by end of 2024?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about resolution criteria..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isPending || isConfirming || !address}
          >
            {isPending || isConfirming ? 'Creating Market...' : 'Create Market'}
          </Button>
        </form>
      </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <MultiOutcomeCreator onSubmit={handleAdvancedSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
