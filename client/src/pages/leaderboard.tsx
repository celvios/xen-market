import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, TrendingUp, Medal, Crown } from "lucide-react";

const LEADERBOARD_DATA = [
  { rank: 1, name: "CryptoWhale", handle: "@cwhale", profit: 45200.50, winRate: 78, avatar: "https://github.com/shadcn.png" },
  { rank: 2, name: "PredictionKing", handle: "@predking", profit: 32150.00, winRate: 65, avatar: "https://github.com/shadcn.png" },
  { rank: 3, name: "FutureSeer", handle: "@seer_v1", profit: 28900.25, winRate: 71, avatar: "https://github.com/shadcn.png" },
  { rank: 4, name: "AlphaHunter", handle: "@alpha_h", profit: 15400.00, winRate: 55, avatar: null },
  { rank: 5, name: "MarketMaker", handle: "@mm_bot", profit: 12300.80, winRate: 92, avatar: null },
  { rank: 6, name: "Satoshi_Fan", handle: "@sat_fan", profit: 9800.50, winRate: 48, avatar: null },
  { rank: 7, name: "ElonMuskFan", handle: "@doge_lover", profit: 8500.00, winRate: 42, avatar: null },
  { rank: 8, name: "PolymarketUser", handle: "@poly_migrant", profit: 6200.20, winRate: 58, avatar: null },
  { rank: 9, name: "Degenerate", handle: "@yolo_trader", profit: 4100.00, winRate: 12, avatar: null },
  { rank: 10, name: "SafeBet", handle: "@safe_hands", profit: 3500.50, winRate: 88, avatar: null },
];

export default function Leaderboard() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-display font-bold flex items-center justify-center gap-3">
            <Crown className="w-10 h-10 text-yellow-500" fill="currentColor" /> 
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">Top traders by realized profit this season.</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-12">
          {/* 2nd Place */}
          <Card className="bg-card/50 border-muted order-2 md:order-1 h-64 relative overflow-hidden group hover:border-muted-foreground/50 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-300" />
            <CardContent className="flex flex-col items-center justify-center h-full pt-8">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 border-4 border-gray-300">
                  <AvatarImage src={LEADERBOARD_DATA[1].avatar || undefined} />
                  <AvatarFallback>{LEADERBOARD_DATA[1].name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-gray-900 px-2 py-0.5 rounded text-xs font-bold">#2</div>
              </div>
              <h3 className="font-bold text-lg">{LEADERBOARD_DATA[1].name}</h3>
              <p className="text-muted-foreground text-sm mb-2">{LEADERBOARD_DATA[1].handle}</p>
              <div className="text-2xl font-mono text-green-400 font-bold">+${LEADERBOARD_DATA[1].profit.toLocaleString()}</div>
            </CardContent>
          </Card>

          {/* 1st Place */}
          <Card className="bg-gradient-to-b from-yellow-500/10 to-card border-yellow-500/50 order-1 md:order-2 h-80 relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.1)] z-10 scale-105">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
            <CardContent className="flex flex-col items-center justify-center h-full pt-8">
              <div className="relative mb-6">
                <Crown className="w-8 h-8 text-yellow-500 absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce" fill="currentColor" />
                <Avatar className="w-24 h-24 border-4 border-yellow-500">
                  <AvatarImage src={LEADERBOARD_DATA[0].avatar || undefined} />
                  <AvatarFallback>{LEADERBOARD_DATA[0].name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-950 px-3 py-0.5 rounded text-sm font-bold">#1</div>
              </div>
              <h3 className="font-bold text-xl">{LEADERBOARD_DATA[0].name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{LEADERBOARD_DATA[0].handle}</p>
              <div className="text-3xl font-mono text-green-400 font-bold">+${LEADERBOARD_DATA[0].profit.toLocaleString()}</div>
              <div className="mt-2 text-xs text-yellow-500/80 font-mono">Win Rate: {LEADERBOARD_DATA[0].winRate}%</div>
            </CardContent>
          </Card>

          {/* 3rd Place */}
          <Card className="bg-card/50 border-muted order-3 h-56 relative overflow-hidden group hover:border-orange-700/50 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-700" />
            <CardContent className="flex flex-col items-center justify-center h-full pt-8">
              <div className="relative mb-4">
                <Avatar className="w-16 h-16 border-4 border-orange-700">
                  <AvatarImage src={LEADERBOARD_DATA[2].avatar || undefined} />
                  <AvatarFallback>{LEADERBOARD_DATA[2].name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-700 text-white px-2 py-0.5 rounded text-xs font-bold">#3</div>
              </div>
              <h3 className="font-bold text-lg">{LEADERBOARD_DATA[2].name}</h3>
              <p className="text-muted-foreground text-sm mb-2">{LEADERBOARD_DATA[2].handle}</p>
              <div className="text-xl font-mono text-green-400 font-bold">+${LEADERBOARD_DATA[2].profit.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Rest of the list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Runners Up</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {LEADERBOARD_DATA.slice(3).map((user) => (
                <div key={user.rank} className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                  <div className="w-12 text-center font-mono font-bold text-muted-foreground">#{user.rank}</div>
                  <Avatar className="w-10 h-10 border border-border mr-4">
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.handle}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-green-400">+${user.profit.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Win Rate: {user.winRate}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
