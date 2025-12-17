import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MarketDetails from "@/pages/market-details";
import Portfolio from "@/pages/portfolio";
import Rewards from "@/pages/rewards";
import Activity from "@/pages/activity";
import Leaderboard from "@/pages/leaderboard";
import { StoreProvider } from "@/lib/store";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/market/:id" component={MarketDetails} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/activity" component={Activity} />
      <Route path="/leaderboard" component={Leaderboard} />
      {/* Category route re-uses Home but we can handle params inside Home if we update it, 
          or just filter inside Home with query params. 
          For now, Home handles 'all', let's stick to Home for simplicity or add a specific route if needed. 
      */}
      <Route path="/markets/:category" component={Home} /> 
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
