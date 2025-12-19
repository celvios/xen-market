import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { user } = useStore();
  const { openConnectModal } = useConnectModal();

  return (
    <Layout>
      {/* Promo Banner */}
      {(
        <section className="mt-16 mb-8 rounded-[2rem] bg-card border border-primary/20 p-12 text-center relative overflow-hidden glass-panel group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.15),transparent_60%)] group-hover:bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.2),transparent_70%)] transition-colors duration-700" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-success/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
              <Zap className="w-3 h-3" /> Alpha Access
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent italic">
              OWN THE OUTCOME.
            </h2>
            <p className="text-muted-foreground mb-10 text-lg font-medium leading-relaxed">
              Join the technical frontier of prediction markets. Precision trading, institutional grade data, and full transparency on-chain.
            </p>
            <Button
              size="lg"
              className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                if (user.isLoggedIn) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (openConnectModal) {
                  openConnectModal();
                }
              }}
              data-testid="button-get-started"
            >
              {user.isLoggedIn ? "Access Dashboard" : "Sync Wallet Now"}
            </Button>
          </div>
        </section>
    </Layout>
  );
}
