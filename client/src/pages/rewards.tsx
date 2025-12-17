import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Gift, Zap, Users, ArrowRight, Star } from "lucide-react";

export default function Rewards() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Rewards & Quests</h1>
            <p className="text-muted-foreground mt-1">Complete quests to earn XP and exclusive badges.</p>
          </div>
          <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-primary/20 p-2 rounded-full">
                <Star className="w-6 h-6 text-primary" fill="currentColor" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase">Current Level</div>
                <div className="text-xl font-bold">Level 5 <span className="text-sm font-normal text-muted-foreground">/ Veteran Trader</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card className="border-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Daily Streak: 12 Days
            </CardTitle>
            <CardDescription>Login every day to boost your reward multiplier.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2 text-sm">
              <span>Progress to next reward</span>
              <span className="text-primary font-mono">80%</span>
            </div>
            <Progress value={80} className="h-2" />
            <div className="grid grid-cols-7 gap-2 mt-6">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${i < 4 ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-transparent'}`}>
                  <span className="text-xs text-muted-foreground">Day {i + 1}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i < 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {i < 4 ? <Zap className="w-4 h-4" fill="currentColor" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" /> Trading Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">First Blood</h4>
                    <p className="text-xs text-muted-foreground">Make your first trade &gt; $100</p>
                  </div>
                  <Button size="sm" variant="outline" disabled className="text-green-500 border-green-500/30 bg-green-500/10">Completed</Button>
                </div>
                <Progress value={100} className="h-1.5 bg-muted" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Market Maker</h4>
                    <p className="text-xs text-muted-foreground">Trade on 5 different markets</p>
                  </div>
                  <Button size="sm">Claim XP</Button>
                </div>
                <Progress value={100} className="h-1.5 bg-muted" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Diamond Hands</h4>
                    <p className="text-xs text-muted-foreground">Hold a position until resolution</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">0/1</span>
                </div>
                <Progress value={0} className="h-1.5 bg-muted" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" /> Community & Social
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Referral Master</h4>
                    <p className="text-xs text-muted-foreground">Invite 3 friends to trade</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">1/3</span>
                </div>
                <Progress value={33} className="h-1.5 bg-muted" />
              </div>

              <div className="bg-gradient-to-br from-secondary/10 to-transparent p-4 rounded-xl border border-secondary/20 mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-8 h-8 text-secondary" />
                  <div>
                    <h4 className="font-bold text-secondary">Invite Friends</h4>
                    <p className="text-xs text-muted-foreground">Get 500 XP for every referral</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <input className="bg-background/50 border border-border rounded px-3 py-1 text-xs font-mono flex-1" readOnly value="xen.markets/ref/user123" />
                  <Button size="sm" variant="secondary" className="h-7 text-xs">Copy</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
