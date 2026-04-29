"use client";

import { useState } from "react";
import { Plus, MessageCircleQuestion, Sparkles } from "lucide-react";

type Category = "Getting started" | "Billing" | "Features" | "Support";

const faqs: { q: string; a: string; category: Category }[] = [
  {
    category: "Getting started",
    q: "How quickly can I launch my store on OneComm?",
    a: "Most merchants go live within a single afternoon. Pick a theme, import your catalog (CSV or one-click from Shopify/WooCommerce), connect a payment partner, and you're selling — no developer required.",
  },
  {
    category: "Features",
    q: "Does OneComm work with Facebook, Instagram, and WhatsApp?",
    a: "Yes. The unified inbox pulls comments, DMs, and WhatsApp messages into one screen, with AI-suggested replies, order capture, and one-click invoice generation built in.",
  },
  {
    category: "Billing",
    q: "Are there any transaction fees or hidden charges?",
    a: "Zero transaction fees on every plan. You only pay your payment gateway's standard processing rate — we never take a cut of your sales.",
  },
  {
    category: "Features",
    q: "Which payment and delivery partners are supported?",
    a: "bKash, Nagad, Upay, SSLCommerz, and Stripe for payments. Pathao, Steadfast, RedX, Paperfly, and RX Courier for nationwide fulfillment — all integrated natively.",
  },
  {
    category: "Support",
    q: "What kind of support do I get?",
    a: "Every plan includes 24/7 chat support, a full knowledge base, and onboarding sessions. Growth and Scale plans add a dedicated success manager and priority response SLAs.",
  },
  {
    category: "Billing",
    q: "Can I switch plans or cancel anytime?",
    a: "Absolutely. Upgrade, downgrade, or cancel from your dashboard at any time. Annual plans are prorated and there are no lock-in contracts.",
  },
];

const categories: ("All" | Category)[] = [
  "All",
  "Getting started",
  "Features",
  "Billing",
  "Support",
];

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  const [active, setActive] = useState<(typeof categories)[number]>("All");

  const filtered = faqs.filter(
    (f) => active === "All" || f.category === active,
  );

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 bg-background relative overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-primary-glow/10 blur-3xl" />
      </div>

      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left — editorial intro */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1.5">
                <MessageCircleQuestion className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  FAQ
                </span>
              </div>
              <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Questions,
                <br />
                <span className="text-gradient">answered.</span>
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
                Everything you need to know before launching your storefront.
                Can't find what you're looking for? Our team replies in minutes.
              </p>

              {/* Category pills */}
              <div className="mt-7 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setActive(c);
                      setOpen(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      active === c
                        ? "bg-foreground text-background shadow-elevated"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Help card */}
              <div className="mt-8 hidden lg:block rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Still curious?</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Talk to a product specialist and get a personalised
                  walkthrough of OneComm.
                </p>
                <a
                  href="/request-demo"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Book a demo →
                </a>
              </div>
            </div>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-7">
            <div className="space-y-3">
              {filtered.map((item, idx) => {
                const isOpen = open === idx;
                return (
                  <div
                    key={item.q}
                    className={`group rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "border-foreground/20 bg-card shadow-elevated"
                        : "border-border bg-card/60 hover:border-foreground/15 hover:bg-card"
                    }`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : idx)}
                      className="w-full flex items-start gap-5 p-5 sm:p-6 text-left"
                    >
                      <span className="shrink-0 mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight leading-snug">
                          {item.q}
                        </h3>
                      </div>
                      <span
                        className={`shrink-0 grid place-items-center h-9 w-9 rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "bg-foreground text-background border-foreground rotate-45"
                            : "border-border text-foreground group-hover:border-foreground/40"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 sm:px-6 pb-6 pl-[calc(1.25rem+2rem)] sm:pl-[calc(1.5rem+2rem)]">
                          <p className="text-muted-foreground leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile help card */}
            <div className="mt-6 lg:hidden rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Still curious?</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Talk to a product specialist and get a personalised walkthrough.
              </p>
              <a
                href="/request-demo"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Book a demo →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
