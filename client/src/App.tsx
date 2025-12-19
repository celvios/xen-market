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
import CreateMarket from "@/pages/create-market";
import Analytics from "@/pages/analytics";
import ComplexMarketsDemo from "@/pages/complex-markets-demo";
import AdminPage from "@/pages/admin";
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
      <Route path="/create" component={CreateMarket} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/complex-markets" component={ComplexMarketsDemo} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/markets/:category" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { Web3Provider } from "@/components/providers/Web3Provider";
import { ErrorBoundary } from "@/components/error-boundary";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <StoreProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </StoreProvider>
        </Web3Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
