import Layout from "@/components/layout";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { FeeRevenueDashboard } from "@/components/fee-revenue-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Activity, DollarSign } from "lucide-react";

export default function Analytics() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Platform Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time insights into market performance and platform metrics
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Live Data
          </Badge>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="platform" className="space-y-6">
          <TabsList>
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Platform Analytics
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Fee Revenue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platform">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="revenue">
            <FeeRevenueDashboard />
          </TabsContent>
        </Tabs>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Market Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Spread</span>
                  <span className="font-mono">2.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Price Discovery Speed</span>
                  <span className="font-mono">Fast</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Market Depth</span>
                  <span className="font-mono">Good</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Platform VaR (95%)</span>
                  <span className="font-mono">$12.5K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Max Drawdown</span>
                  <span className="font-mono">-8.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sharpe Ratio</span>
                  <span className="font-mono">1.45</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Block Time</span>
                  <span className="font-mono">2.1s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gas Price</span>
                  <span className="font-mono">25 gwei</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Network Load</span>
                  <Badge variant="outline" className="text-green-600">Low</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}