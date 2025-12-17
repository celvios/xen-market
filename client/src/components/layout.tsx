import { Link, useLocation } from "wouter";
import { Search, Bell, Menu, User, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/mock-data";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import xenLogo from "@assets/generated_images/minimalist_abstract_x_logo_for_xen_markets.png";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, login } = useStore();
  
  // Extract active category from URL /markets/:category
  const activeCategory = location.startsWith("/markets/") 
    ? location.split("/markets/")[1] 
    : "all";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
            <img src={xenLogo} alt="Xen" className="w-8 h-8 rounded-lg" />
            <span className="text-foreground">Xen<span className="text-primary">Markets</span></span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search markets..." 
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-10 rounded-full"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Link href="/portfolio">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Portfolio
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  ${user.balance.toFixed(2)}
                </Button>
              </Link>
            </div>
            
            {user.isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="hidden sm:inline">0x71...3A9</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/portfolio">
                    <DropdownMenuItem>Portfolio</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/50 text-primary"
                onClick={login}
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect</span>
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-l border-border/50">
                <nav className="flex flex-col gap-4 mt-8">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9 bg-muted/50" />
                  </div>
                  {CATEGORIES.map((cat) => (
                    <Link key={cat.id} href={cat.id === 'all' ? '/' : `/markets/${cat.id}`}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3"
                      >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 container mx-auto">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 py-8 pr-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-border/40">
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={cat.id === 'all' ? '/' : `/markets/${cat.id}`}>
                <Button
                  variant={activeCategory === cat.id ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 rounded-xl px-4 py-6 text-sm font-medium transition-all ${
                    activeCategory === cat.id 
                      ? "bg-secondary/10 text-secondary hover:bg-secondary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? "text-secondary" : ""}`} />
                  {cat.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-border/40">
            <h4 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">My Activity</h4>
            <div className="px-4 py-2 text-sm text-muted-foreground italic">
              {user.positions.length > 0 ? (
                <div className="space-y-2">
                   {user.positions.slice(0, 3).map((pos, i) => (
                     <div key={i} className="text-xs">
                        Bought {pos.shares.toFixed(0)} shares
                     </div>
                   ))}
                   <Link href="/portfolio" className="text-primary hover:underline text-xs">View all</Link>
                </div>
              ) : (
                "No recent trades"
              )}
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 py-8 px-4 lg:px-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
