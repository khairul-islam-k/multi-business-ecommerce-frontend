"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tier = {
  name: string;
  desc: string;
  monthly: number | "custom";
  yearly: number | "custom";
  features: string[];
  featured?: boolean;
  cta?: string;
};

const tiers: Tier[] = [
  {
    name: "Starter",
    desc: "For solo sellers just getting started.",
    monthly: 19,
    yearly: 15,
    features: [
      "1 store",
      "2 sales channels",
      "Up to 500 orders/mo",
      "Basic AI replies",
      "Email support",
    ],
  },
  {
    name: "Growth",
    desc: "For growing brands that need automation.",
    monthly: 49,
    yearly: 39,
    features: [
      "3 stores",
      "All sales channels",
      "Up to 5,000 orders/mo",
      "Advanced AI inbox",
      "Marketing automation",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Business",
    desc: "For established brands scaling operations.",
    monthly: 99,
    yearly: 79,
    features: [
      "10 stores",
      "All channels + WhatsApp API",
      "Up to 25,000 orders/mo",
      "Custom AI training",
      "Abandoned-cart automations",
      "Dedicated success manager",
    ],
  },
  {
    name: "Scale",
    desc: "For high-volume operations and teams.",
    monthly: "custom",
    yearly: "custom",
    features: [
      "Unlimited stores & orders",
      "Custom integrations",
      "API & webhook access",
      "SLA & onboarding",
      "Single sign-on (SSO)",
      "24/7 premium support",
    ],
    cta: "Contact Sales",
  },
];

export const Pricing = () => {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Pricing
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Simple plans that{" "}
            <span className="text-gradient">scale with you.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you grow. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-2 p-1 rounded-full border border-border bg-card shadow-card">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !yearly
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2 ${
                yearly
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  yearly
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {tiers.map((t) => {
            const price = yearly ? t.yearly : t.monthly;
            const isCustom = price === "custom";
            return (
              <div
                key={t.name}
                className={`relative rounded-2xl p-7 transition-all duration-300 ${
                  t.featured
                    ? "gradient-primary text-primary-foreground shadow-elevated lg:-translate-y-2"
                    : "border border-border bg-card shadow-card hover:-translate-y-1 hover:shadow-elevated"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-foreground text-background px-3 py-1 rounded-full">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </span>
                )}

                <h3 className="font-display text-lg font-bold">{t.name}</h3>

                <div className="mt-3 flex items-baseline gap-1 min-h-[3.25rem]">
                  {isCustom ? (
                    <span className="font-display text-4xl font-extrabold">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="font-display text-4xl font-extrabold tabular-nums">
                        ${price}
                      </span>
                      <span
                        className={`text-sm ${
                          t.featured
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        /mo
                      </span>
                    </>
                  )}
                </div>

                <p
                  className={`text-xs ${
                    t.featured
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  } min-h-[1rem]`}
                >
                  {!isCustom &&
                    yearly &&
                    `billed yearly · $${(t.yearly as number) * 12}/yr`}
                  {!isCustom && !yearly && "billed monthly"}
                </p>

                <p
                  className={`mt-3 text-sm ${
                    t.featured
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {t.desc}
                </p>

                <Button
                  variant={t.featured ? "glass" : "default"}
                  className="mt-6 w-full"
                >
                  {t.cta || (isCustom ? "Contact Sales" : "Start Free Trial")}
                </Button>

                <ul className="mt-6 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          t.featured
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`}
                        strokeWidth={3}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
