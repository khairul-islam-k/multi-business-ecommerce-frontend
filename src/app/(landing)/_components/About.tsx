import {
  Sparkles,
  Target,
  Heart,
  Zap,
  Users,
  Globe2,
  TrendingUp,
  Award,
} from "lucide-react";

const stats = [
  { value: "10,000+", label: "Active brands" },
  { value: "৳500Cr+", label: "GMV processed" },
  { value: "50M+", label: "Orders fulfilled" },
  { value: "0.5s", label: "Avg load time" },
];

const values = [
  {
    icon: Heart,
    title: "Merchant-obsessed",
    desc: "Every feature starts with a merchant problem. We ship what moves your revenue, not what looks good in demos.",
  },
  {
    icon: Zap,
    title: "Speed as a feature",
    desc: "From 0.5s page loads to 24/7 AI replies — we believe slow software costs you sales.",
  },
  {
    icon: Sparkles,
    title: "AI for the rest of us",
    desc: "Powerful automation should not require a developer. We make AI feel like an extra teammate, not a research project.",
  },
  {
    icon: Target,
    title: "No hidden fees",
    desc: "Zero transaction cuts. Transparent pricing. The money you make is the money you keep.",
  },
];

const milestones = [
  {
    year: "2021",
    title: "Founded in Dhaka",
    desc: "Three founders, one shared frustration with fragmented commerce tools.",
  },
  {
    year: "2022",
    title: "First 1,000 stores",
    desc: "Reached our first milestone with merchants across Bangladesh.",
  },
  {
    year: "2023",
    title: "AI Inbox launched",
    desc: "Introduced the AI-powered inbox — our flagship product.",
  },
  {
    year: "2024",
    title: "10,000+ brands",
    desc: "Crossed 10,000 active stores and expanded to South Asia.",
  },
  {
    year: "2025",
    title: "The next chapter",
    desc: "Scaling globally with built-in payments, logistics, and AI agents.",
  },
];

const team = [
  {
    name: "Arif Rahman",
    role: "Co-Founder & CEO",
    bio: "As CEO, Arif sets the vision and leads the team toward building products merchants love.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[hsl(280,70%,90%)]",
  },
  {
    name: "Nadia Hossain",
    role: "Co-Founder & CTO",
    bio: "Nadia leads engineering, architecting the platform that powers thousands of stores daily.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[hsl(30,60%,85%)]",
  },
  {
    name: "Sajid Karim",
    role: "Head of Product",
    bio: "Sajid shapes the product roadmap, turning merchant feedback into features that ship fast.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[hsl(200,40%,85%)]",
  },
  {
    name: "Tahmina Akter",
    role: "VP of Engineering",
    bio: "Tahmina scales the engineering team and keeps the platform fast, reliable, and secure.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[hsl(340,70%,90%)]",
  },
];

export const AboutHero = () => (
  <section className="relative overflow-hidden py-20 sm:py-28 px-2 md:px-0">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/15 blur-3xl" />
    </div>
    <div className="container mx-auto relative">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
          About OneComm
        </span>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
          We're building the operating system for{" "}
          <span className="text-gradient">modern commerce.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          OneComm gives founders and growing brands one platform to run their
          store, social, inbox, and operations — so they can focus on what
          matters: creating products their customers love.
        </p>
      </div>

      <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-6 text-center shadow-card hover:-translate-y-1 hover:shadow-elevated transition-all"
          >
            <div className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
              {s.value}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const AboutStory = () => (
  <section className="py-20 sm:py-28">
    <div className="container mx-auto">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 max-w-6xl mx-auto">
        <div className="lg:col-span-5">
          <span className="font-mono text-xs font-bold tracking-widest text-primary">
            01 / OUR STORY
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Born from a <span className="text-gradient">real frustration.</span>
          </h2>
        </div>
        <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
          <p>
            In 2021, our founders ran their own ecommerce brands. They were
            juggling six different tools — one for the website, another for
            inventory, another for the inbox, another for marketing — and losing
            hours every week to manual work.
          </p>
          <p>
            They couldn't find a platform that understood social commerce the
            way it actually works in South Asia: WhatsApp orders, Facebook DMs,
            courier integrations, mobile wallets. So they built one.
          </p>
          <p className="text-foreground font-medium">
            Today, OneComm powers 10,000+ brands across the region — from solo
            founders shipping their first order to scale-ups doing seven figures
            a month.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export const AboutValues = () => (
  <section className="py-20 sm:py-28 bg-accent/30">
    <div className="container mx-auto px-2 md:px-0">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs font-bold tracking-widest text-primary">
          02 / WHAT WE BELIEVE
        </span>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          The principles behind{" "}
          <span className="text-gradient">every decision.</span>
        </h2>
      </div>

      <div className="mt-14 max-w-6xl mx-auto grid sm:grid-cols-2 gap-5">
        {values.map((v) => (
          <div
            key={v.title}
            className="group rounded-3xl border border-border bg-card p-7 shadow-card hover:-translate-y-1 hover:shadow-elevated hover:border-primary/30 transition-all"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
              <v.icon className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold tracking-tight">
              {v.title}
            </h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {v.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const AboutTimeline = () => (
  <section className="py-20 sm:py-28">
    <div className="container mx-auto">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs font-bold tracking-widest text-primary">
          03 / OUR JOURNEY
        </span>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          From three founders to{" "}
          <span className="text-gradient">a movement.</span>
        </h2>
      </div>

      <div className="mt-14 max-w-3xl mx-auto relative">
        <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-px bg-border -translate-x-px" />
        <div className="space-y-10">
          {milestones.map((m, idx) => (
            <div
              key={m.year}
              className={`relative grid sm:grid-cols-2 gap-4 sm:gap-10 ${
                idx % 2 === 0 ? "" : "sm:[&>*:first-child]:order-2"
              }`}
            >
              <div className="absolute left-4 sm:left-1/2 top-3 -translate-x-1/2 grid h-3 w-3 place-items-center rounded-full gradient-primary ring-4 ring-background" />
              <div
                className={`pl-12 sm:pl-0 ${idx % 2 === 0 ? "sm:text-right sm:pr-10" : "sm:pl-10"}`}
              >
                <span className="font-mono text-sm font-bold tracking-widest text-primary">
                  {m.year}
                </span>
              </div>
              <div
                className={`pl-12 sm:pl-0 ${idx % 2 === 0 ? "sm:pl-10" : "sm:text-right sm:pr-10"}`}
              >
                <h3 className="font-display text-lg font-bold tracking-tight">
                  {m.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const AboutTeam = () => (
  <section className="py-20 sm:py-28 bg-accent/30">
    <div className="container mx-auto px-2 md:px-0">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs font-bold tracking-widest text-primary">
          04 / THE TEAM
        </span>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          The humans behind <span className="text-gradient">OneComm.</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A small team of operators, engineers, and designers who've shipped
          products at the companies you know — now building for the merchants
          you'll know next.
        </p>
      </div>

      <div className="mt-14 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((p) => (
          <div
            key={p.name}
            className="group rounded-2xl border border-border bg-card p-4 shadow-card hover:-translate-y-1 hover:shadow-elevated transition-all"
          >
            <div className={`rounded-xl overflow-hidden ${p.bg} aspect-square`}>
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-display text-base font-bold tracking-tight">
                {p.name}
              </h3>
              <p className="mt-0.5 text-sm text-primary font-medium">
                {p.role}
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {p.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const trust = [
  { icon: Users, label: "Team members", value: "60+" },
  { icon: Globe2, label: "Countries served", value: "8" },
  { icon: TrendingUp, label: "YoY growth", value: "320%" },
  { icon: Award, label: "Industry awards", value: "12" },
];

export const AboutTrust = () => (
  <section className="py-20 sm:py-28">
    <div className="container mx-auto">
      <div className="max-w-6xl mx-auto rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-elevated">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trust.map((t) => (
            <div key={t.label} className="text-center sm:text-left">
              <div className="inline-grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <div className="mt-4 font-display text-3xl font-extrabold tracking-tight">
                {t.value}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
