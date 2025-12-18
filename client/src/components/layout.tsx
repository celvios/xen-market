import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Wallet,
  Trophy,
  BarChart3,
  TrendingUp,
  User,
  Menu,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useStore } from "@/lib/store";

import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useStore();

  const navItems = [
    { href: "/", label: "Markets", icon: LayoutDashboard },
    { href: "/portfolio", label: "Portfolio", icon: Wallet },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/activity", label: "Activity", icon: TrendingUp },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/40 backdrop-blur-2xl">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(192,132,252,0.3)] transition-transform group-hover:scale-105">
              <span className="text-primary-foreground font-black font-display italic text-2xl">X</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-display font-bold tracking-tight uppercase italic leading-none">Xen</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none mt-1">Markets</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Navigation</span>
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-xl bg-muted/20 border border-border/50 glass-panel">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Portfolio Performance</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs text-muted-foreground">Equity</span>
                <span className="font-mono text-sm font-bold text-primary">${user.balance.toFixed(2)}</span>
              </div>
              <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                <div className="h-full bg-primary/50 w-3/4 shadow-[0_0_10px_rgba(192,132,252,0.3)]" />
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-success">+$24.50 (24h)</span>
                <span className="text-muted-foreground">75% Used</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-background/95 relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-success/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/20 backdrop-blur-md sticky top-0 z-50">
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black font-display italic text-lg shadow-[0_0_15px_rgba(192,132,252,0.4)] transition-transform active:scale-95">X</div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-3 sm:gap-6">
            {user.isLoggedIn && (
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-card/40 border border-border rounded-lg glass-panel transition-all hover:border-primary/30">
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter leading-none mb-1">Portfolio Value</div>
                  <div className="text-sm font-mono font-black text-success tracking-tight">${user.balance.toFixed(2)}</div>
                </div>
                <Separator orientation="vertical" className="h-8 mx-1 opacity-20" />
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group">
                  <User className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
                </div>
              </div>
            )}

            <div className="Web3ConnectWrapper group">
              <w3m-button />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Nav Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-t border-border flex items-center justify-around px-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all p-2 rounded-xl",
              isActive ? "text-primary bg-primary/10" : "text-muted-foreground active:scale-90"
            )}>
              <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]")} />
              <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

