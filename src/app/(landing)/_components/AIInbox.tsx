import { ArrowRight, Check, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

export const AIInbox = () => {
  return (
    <section
      id="ai-inbox"
      className="py-20 sm:py-28 bg-secondary/40 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 -translate-y-1/2 h-96 w-96 rounded-full gradient-primary opacity-10 blur-3xl" />
      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              AI-Powered Inbox
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Reply like a human. <br />
              <span className="text-gradient">Sell while you sleep.</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              OneComm's AI understands context, tone and product details —
              sending instant replies that feel personal and convert browsers
              into buyers.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Instant 24/7 replies across all channels",
                "Human-like, brand-aware conversations",
                "Works on Messenger, Instagram & WhatsApp",
                "Hand-off to your team when needed",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="grid h-5 w-5 mt-0.5 place-items-center rounded-full gradient-primary text-primary-foreground shrink-0">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button variant="hero" size="lg">
                See How It Works <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat mockup */}
          <div className="relative">
            <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-3xl" />
            <div className="relative rounded-2xl border border-border bg-card shadow-elevated p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white font-bold text-sm">
                    SK
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Sarah Khan</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                      via WhatsApp
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider gradient-primary text-primary-foreground px-2 py-1 rounded-full">
                  AI Active
                </span>
              </div>

              <div className="space-y-3">
                <ChatBubble side="left">
                  Hi! Is the linen shirt available in size M?
                </ChatBubble>
                <ChatBubble side="right" ai>
                  Hi Sarah! 👋 Yes, the linen shirt in M is in stock. Would you
                  like beige or sage?
                </ChatBubble>
                <ChatBubble side="left">
                  Sage please. How long for delivery to Dhaka?
                </ChatBubble>
                <ChatBubble side="right" ai>
                  Great choice! 2–3 business days via Pathao. Tap below to
                  checkout — I've reserved it for 15 minutes.
                </ChatBubble>
                <div className="rounded-xl border border-border bg-secondary/60 p-3 ml-auto max-w-[80%] flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md gradient-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">
                      Linen Shirt — Sage M
                    </div>
                    <div className="text-xs text-muted-foreground">
                      $42.00 · Free shipping
                    </div>
                  </div>
                  <Button size="sm" variant="hero" className="h-8 text-xs px-3">
                    Buy
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                Avg. response time{" "}
                <span className="font-semibold text-foreground">0.8s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ChatBubble = ({
  side,
  ai,
  children,
}: {
  side: "left" | "right";
  ai?: boolean;
  children: React.ReactNode;
}) => (
  <div className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
        side === "right"
          ? "gradient-primary text-primary-foreground rounded-br-sm"
          : "bg-secondary text-foreground rounded-bl-sm"
      }`}
    >
      {ai && (
        <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-0.5">
          AI
        </div>
      )}
      {children}
    </div>
  </div>
);
