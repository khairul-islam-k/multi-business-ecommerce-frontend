import { Sparkles, Bot, Megaphone, CreditCard, Wand2 } from "lucide-react";

const highlights = [
  { icon: Sparkles, label: "All-in-One Ecommerce + Social Commerce" },
  { icon: Bot, label: "AI-Powered Business Inbox" },
  { icon: Megaphone, label: "Built-in Marketing Automation" },
  { icon: CreditCard, label: "Integrated Payments & Logistics" },
  { icon: Wand2, label: "No-Code, Beginner-Friendly Setup" },
];

export const FeaturesHero = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/15 blur-3xl" />
      </div>

      <div className="container mx-auto relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Features
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Everything you need to{" "}
            <span className="text-gradient">sell smarter</span>, in one
            platform.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            From storefront to checkout, AI inbox to analytics — OneComm packs
            every tool modern brands need to launch, grow, and scale across web
            and social.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-5xl grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-border bg-card/60 backdrop-blur shadow-card hover:shadow-elevated hover:border-primary/30 transition-all"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
                <h.icon className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <p className="text-xs font-semibold leading-snug">{h.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
