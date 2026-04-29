import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-3xl gradient-primary text-primary-foreground p-10 sm:p-16 text-center shadow-elevated">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary-glow/40 blur-3xl" />
          </div>
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Start scaling your business today.
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Join 10,000+ brands selling smarter with OneComm. Free for 14 days
              — no credit card needed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <a href="/request-demo">Request a Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
