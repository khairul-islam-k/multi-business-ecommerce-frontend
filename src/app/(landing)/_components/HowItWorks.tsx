const steps = [
  {
    n: "01",
    title: "Create your store",
    desc: "Pick a theme, add products, go live in under 10 minutes.",
  },
  {
    n: "02",
    title: "Connect your channels",
    desc: "Plug in Facebook, Instagram, WhatsApp, TikTok in one click.",
  },
  {
    n: "03",
    title: "Manage from one dashboard",
    desc: "Orders, messages, inventory and payments — all unified.",
  },
  {
    n: "04",
    title: "Automate & grow with AI",
    desc: "Let AI handle replies, retargeting and repeat campaigns.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            How it works
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            From signup to scale in{" "}
            <span className="text-gradient">4 simple steps.</span>
          </h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="rounded-2xl border border-border bg-card p-7 h-full shadow-card hover:shadow-soft transition-all">
                <div className="font-display text-3xl font-extrabold text-gradient">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <div className="h-px w-6 bg-gradient-to-r from-primary/50 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
