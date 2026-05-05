"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

type Review = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  color: string;
  metric: { value: string; label: string };
};

const reviews: Review[] = [
  {
    quote:
      "OneComm replaced 5 tools we were paying for. Our reply time dropped from 4 hours to 8 seconds — and sales doubled in just 2 months.",
    name: "Tania Rahman",
    role: "Founder",
    company: "Linen & Co.",
    initials: "TR",
    color: "from-emerald-400 to-teal-600",
    metric: { value: "2×", label: "Revenue in 60 days" },
  },
  {
    quote:
      "The AI inbox is unreal. Customers think they're chatting with a real person and our team finally has their weekends back.",
    name: "Faisal Ahmed",
    role: "CEO",
    company: "Urban Wear BD",
    initials: "FA",
    color: "from-primary to-primary-glow",
    metric: { value: "98%", label: "AI reply accuracy" },
  },
  {
    quote:
      "We launched our store in one afternoon. Pathao, bKash and Facebook all integrated in minutes. Zero technical headache.",
    name: "Nadia Hossain",
    role: "Owner",
    company: "Bloom Florals",
    initials: "NH",
    color: "from-pink-400 to-rose-600",
    metric: { value: "1 day", label: "From signup to live" },
  },
  {
    quote:
      "Marketing automation paid for OneComm in the first week. We sent one campaign and watched orders roll in overnight.",
    name: "Rakib Chowdhury",
    role: "Marketing Lead",
    company: "Nordica Home",
    initials: "RC",
    color: "from-amber-400 to-orange-600",
    metric: { value: "+47%", label: "Repeat purchase rate" },
  },
];

const AUTOPLAY_MS = 6000;

export const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) =>
      setIndex(((next % reviews.length) + reviews.length) % reviews.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % reviews.length),
      AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [paused]);

  const active = reviews[index];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-primary-glow/15 blur-3xl" />

      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left: heading */}
          <div className="lg:col-span-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Loved by sellers
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">
              Real stories from{" "}
              <span className="text-gradient">real businesses.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Thousands of brands run their entire commerce stack on OneComm.
              Here's what a few of them have to say.
            </p>

            {/* Controls */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => go(index - 1)}
                  aria-label="Previous testimonial"
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card shadow-card hover:bg-accent hover:text-primary transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => go(index + 1)}
                  aria-label="Next testimonial"
                  className="grid h-11 w-11 place-items-center rounded-full gradient-primary text-primary-foreground shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm font-semibold tabular-nums text-muted-foreground">
                <span className="text-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mx-1">/</span>
                {String(reviews.length).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Right: featured quote card */}
          <div
            className="lg:col-span-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative rounded-3xl bg-card border border-border shadow-elevated p-8 sm:p-12 overflow-hidden">
              {/* big quote glyph */}
              <Quote
                className="absolute -top-2 -right-2 h-40 w-40 text-primary/5"
                strokeWidth={1}
              />

              <div key={index} className="relative animate-fade-in">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <blockquote className="mt-6 font-display text-2xl sm:text-3xl md:text-[2rem] font-bold leading-[1.25] tracking-tight text-foreground">
                  "{active.quote}"
                </blockquote>

                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div
                      className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${active.color} text-white font-display font-extrabold text-base shadow-soft`}
                    >
                      {active.initials}
                    </div>
                    <div>
                      <div className="font-display text-base font-bold">
                        {active.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {active.role} ·{" "}
                        <span className="text-foreground/80">
                          {active.company}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right sm:border-l sm:border-border sm:pl-6">
                    <div className="font-display text-3xl font-extrabold text-gradient leading-none">
                      {active.metric.value}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {active.metric.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Autoplay progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/60">
                <div
                  key={`${index}-${paused}`}
                  className="h-full gradient-primary"
                  style={{
                    animation: paused
                      ? "none"
                      : `progress ${AUTOPLAY_MS}ms linear forwards`,
                  }}
                />
              </div>
            </div>

            {/* Avatar dot strip */}
            <div className="mt-6 flex items-center gap-3 lg:justify-end flex-wrap">
              {reviews.map((r, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={r.name}
                    onClick={() => go(i)}
                    aria-label={`Show testimonial from ${r.name}`}
                    className={`group flex items-center gap-2.5 rounded-full p-1 pr-4 border transition-all ${
                      isActive
                        ? "border-primary/30 bg-card shadow-card"
                        : "border-transparent hover:bg-card/60"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br ${r.color} text-white text-[11px] font-bold shrink-0`}
                    >
                      {r.initials}
                    </span>
                    <span
                      className={`text-xs font-semibold whitespace-nowrap transition-colors ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {r.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
      `}</style>
    </section>
  );
};
