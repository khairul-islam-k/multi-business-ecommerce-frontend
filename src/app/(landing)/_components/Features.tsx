import {
  Store,
  Share2,
  Bot,
  Package,
  CreditCard,
  Megaphone,
} from "lucide-react";

const features = [
  {
    icon: Store,
    title: "One-Click Store Setup",
    desc: "Launch a fully branded storefront in minutes — no code, no designers.",
  },
  {
    icon: Share2,
    title: "Multi-Channel Integration",
    desc: "Sell on Facebook, Instagram, WhatsApp, TikTok and your website from one place.",
  },
  {
    icon: Bot,
    title: "AI Business Inbox",
    desc: "Human-like AI replies 24/7 across every channel. Never miss a sale.",
    featured: true,
  },
  {
    icon: Package,
    title: "Orders & Inventory",
    desc: "Track stock in real time, automate fulfillment, prevent over-selling.",
  },
  {
    icon: CreditCard,
    title: "Payments & Logistics",
    desc: "Native bKash, Nagad, SSLCommerz, Pathao and Steadfast integrations.",
  },
  {
    icon: Megaphone,
    title: "Marketing Automation",
    desc: "Schedule social posts, run email & SMS campaigns, automate retargeting.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Everything you need
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            One platform. Every channel.{" "}
            <span className="text-gradient">Zero chaos.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Replace 6+ disconnected tools with one beautifully integrated
            workspace.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                f.featured
                  ? "border-transparent gradient-primary text-primary-foreground shadow-elevated"
                  : "border-border bg-card hover:shadow-soft hover:border-primary/30"
              }`}
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl ${f.featured ? "bg-white/15 backdrop-blur" : "bg-accent text-primary"}`}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3
                className={`mt-5 font-display text-lg font-bold ${f.featured ? "" : ""}`}
              >
                {f.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed ${f.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}
              >
                {f.desc}
              </p>
              {f.featured && (
                <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
