import { Calendar, Mail, Tag, BarChart3 } from "lucide-react";

const tools = [
  {
    icon: Calendar,
    title: "Social Scheduling",
    desc: "Plan posts across all channels weeks in advance.",
  },
  {
    icon: Mail,
    title: "Email & SMS Campaigns",
    desc: "Drag-and-drop builder with AI-written copy.",
  },
  {
    icon: Tag,
    title: "Offers & Promotions",
    desc: "Flash sales, coupons and bundle deals — built in.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    desc: "See what's working and double down — instantly.",
  },
];

export const Marketing = () => {
  return (
    <section className="py-20 sm:py-28 bg-secondary/40">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-6 gradient-primary opacity-10 blur-3xl rounded-3xl" />
              <div className="relative rounded-2xl border border-border bg-card shadow-elevated p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Campaign performance
                    </div>
                    <div className="font-display text-xl font-bold">
                      Spring Sale 2025
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { l: "Reach", v: "248K", c: "+34%" },
                    { l: "CTR", v: "6.8%", c: "+12%" },
                    { l: "Revenue", v: "$18.2K", c: "+47%" },
                  ].map((m) => (
                    <div key={m.l} className="rounded-lg bg-secondary/60 p-3">
                      <div className="text-[10px] uppercase text-muted-foreground font-medium">
                        {m.l}
                      </div>
                      <div className="font-display font-bold text-base">
                        {m.v}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        {m.c}
                      </div>
                    </div>
                  ))}
                </div>
                <BarChart />
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Email</span>
                  <span className="h-2 w-2 rounded-full bg-primary-glow ml-3" />
                  <span className="text-muted-foreground">Social</span>
                  <span className="h-2 w-2 rounded-full bg-pink-400 ml-3" />
                  <span className="text-muted-foreground">SMS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Marketing & Growth
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Tools that turn browsers{" "}
              <span className="text-gradient">into buyers.</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Everything you need to attract, convert and retain customers —
              built into one platform.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {tools.map((t) => (
                <div
                  key={t.title}
                  className="rounded-xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BarChart = () => {
  const data = [
    [40, 60, 30],
    [55, 45, 50],
    [70, 80, 40],
    [60, 90, 65],
    [85, 70, 55],
    [95, 85, 75],
    [110, 100, 90],
  ];
  return (
    <svg viewBox="0 0 280 100" className="w-full h-32">
      {data.map((group, i) => (
        <g key={i} transform={`translate(${i * 40 + 8}, 0)`}>
          <rect
            x="0"
            y={100 - group[0]}
            width="7"
            height={group[0]}
            rx="2"
            fill="hsl(244 75% 58%)"
          />
          <rect
            x="9"
            y={100 - group[1]}
            width="7"
            height={group[1]}
            rx="2"
            fill="hsl(262 83% 68%)"
          />
          <rect
            x="18"
            y={100 - group[2]}
            width="7"
            height={group[2]}
            rx="2"
            fill="hsl(330 80% 70%)"
          />
        </g>
      ))}
    </svg>
  );
};
