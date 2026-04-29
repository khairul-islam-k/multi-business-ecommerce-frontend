import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  TrendingUp,
  Instagram,
} from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-mesh pt-16 pb-24 sm:pt-24 sm:pb-32 px-2 md:px-0">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-primary-glow/30 blur-3xl animate-blob [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/40 blur-3xl animate-blob [animation-delay:4s]" />
      </div>

      {/* Floating channel icons */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-24 left-[8%] h-12 w-12 rounded-2xl border border-border bg-card/80 backdrop-blur shadow-card grid place-items-center animate-float">
          <MessageCircle className="h-5 w-5 text-emerald-500" />
        </div>
        <div className="absolute top-40 right-[10%] h-12 w-12 rounded-2xl border border-border bg-card/80 backdrop-blur shadow-card grid place-items-center animate-float [animation-delay:1.5s]">
          <Instagram className="h-5 w-5 text-pink-500" />
        </div>
        <div className="absolute top-[55%] left-[5%] h-12 w-12 rounded-2xl border border-border bg-card/80 backdrop-blur shadow-card grid place-items-center animate-float [animation-delay:3s]">
          <ShoppingBag className="h-5 w-5 text-primary" />
        </div>
        <div className="absolute top-[60%] right-[6%] h-12 w-12 rounded-2xl border border-border bg-card/80 backdrop-blur shadow-card grid place-items-center animate-float [animation-delay:2.2s]">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
        </div>
      </div>

      <div className="container mx-auto relative">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-foreground shadow-card">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>New: AI Business Inbox is live</span>
            <span className="text-muted-foreground">→</span>
          </div>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Run your entire eCommerce business{" "}
            <span className="text-gradient">from one place.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            OneComm unifies your store, social channels, AI inbox, orders,
            payments and logistics — so you can sell more and stress less.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="hero" size="lg" className="w-full sm:w-auto">
              Start Free Trial <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              asChild
              variant="glass"
              size="lg"
              className="w-full sm:w-auto"
            >
              <a href="/request-demo">Book a Demo</a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>

        {/* Dashboard mockup */}
        <div
          className="relative mt-16 sm:mt-20 mx-auto max-w-6xl animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="absolute -inset-4 sm:-inset-8 gradient-primary opacity-20 blur-3xl rounded-[3rem]" />
          <div className="relative rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

const DashboardMockup = () => (
  <div className="grid grid-cols-12 min-h-[420px] sm:min-h-[520px]">
    {/* Sidebar */}
    <aside className="hidden md:flex col-span-2 border-r border-border bg-secondary/40 flex-col p-4 gap-1">
      <div className="flex items-center gap-2 mb-4">
        <div className="grid h-7 w-7 place-items-center rounded-md gradient-primary text-primary-foreground text-xs font-bold">
          O
        </div>
        <span className="text-sm font-semibold">OneComm</span>
      </div>
      {[
        "Dashboard",
        "Inbox",
        "Orders",
        "Products",
        "Customers",
        "Marketing",
        "Analytics",
      ].map((item, i) => (
        <div
          key={item}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs ${i === 1 ? "bg-card text-primary font-semibold shadow-card" : "text-muted-foreground"}`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-primary" : "bg-muted-foreground/40"}`}
          />
          {item}
        </div>
      ))}
    </aside>
    {/* Inbox column */}
    <div className="col-span-12 md:col-span-4 border-r border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-sm">Unified Inbox</h3>
        <span className="text-[10px] font-semibold text-primary bg-accent px-2 py-0.5 rounded-full">
          12 new
        </span>
      </div>
      <div className="space-y-2">
        {[
          {
            name: "Sarah K.",
            msg: "Is this still in stock?",
            channel: "WhatsApp",
            color: "bg-emerald-500",
            initials: "SK",
            time: "2m",
          },
          {
            name: "Marco D.",
            msg: "Can I get a discount?",
            channel: "Instagram",
            color: "bg-pink-500",
            initials: "MD",
            time: "5m",
          },
          {
            name: "Aisha R.",
            msg: "Order #4582 status?",
            channel: "Messenger",
            color: "bg-blue-500",
            initials: "AR",
            time: "12m",
          },
          {
            name: "John P.",
            msg: "Thanks! AI replied perfectly 🙌",
            channel: "WhatsApp",
            color: "bg-emerald-500",
            initials: "JP",
            time: "22m",
          },
        ].map((c, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg p-3 ${i === 0 ? "bg-accent" : "hover:bg-secondary/60"} transition-colors`}
          >
            <div
              className={`grid h-9 w-9 place-items-center rounded-full ${c.color} text-white text-xs font-bold shrink-0`}
            >
              {c.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold truncate">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {c.time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{c.msg}</p>
              <span className="text-[10px] text-primary font-medium">
                {c.channel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Stats / chart */}
    <div className="col-span-12 md:col-span-6 p-5 bg-secondary/20">
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          {
            label: "Revenue",
            value: "$48.2K",
            trend: "+12.4%",
            icon: TrendingUp,
          },
          {
            label: "Orders",
            value: "1,284",
            trend: "+8.1%",
            icon: ShoppingBag,
          },
          { label: "Replies", value: "98%", trend: "AI", icon: MessageCircle },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-3 shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {s.label}
              </span>
              <s.icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="mt-1 font-display text-lg font-bold">{s.value}</div>
            <div className="text-[10px] font-semibold text-emerald-600">
              {s.trend}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold">Sales overview</span>
          <span className="text-[10px] text-muted-foreground">Last 7 days</span>
        </div>
        <MiniChart />
        <div className="mt-3 flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary" /> Web
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary-glow" /> Social
          </span>
          <span className="flex items-center gap-1">
            <Instagram className="h-3 w-3 text-pink-500" /> +23%
          </span>
        </div>
      </div>
    </div>
  </div>
);

const MiniChart = () => {
  const points1 = [20, 35, 28, 45, 38, 60, 72];
  const points2 = [10, 22, 18, 30, 25, 42, 55];
  const max = 80;
  const w = 100,
    h = 40;
  const path = (pts: number[]) =>
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${h - (p / max) * h}`,
      )
      .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-24"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(244 75% 58%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(244 75% 58%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path(points1)} L ${w} ${h} L 0 ${h} Z`} fill="url(#g1)" />
      <path
        d={path(points1)}
        stroke="hsl(244 75% 58%)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d={path(points2)}
        stroke="hsl(262 83% 68%)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="2 2"
      />
    </svg>
  );
};
