"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSwal } from "@/hooks/use-swal";

const channels = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@onecomm.app",
    href: "mailto:hello@onecomm.app",
    desc: "We reply within a few hours.",
  },
  {
    icon: Phone,
    label: "Call sales",
    value: "+880 1700 000000",
    href: "tel:+8801700000000",
    desc: "Sun–Thu, 10am–7pm.",
  },
  {
    icon: MessageCircle,
    label: "Live chat",
    value: "Start a conversation",
    href: "#",
    desc: "Average response under 2 min.",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: "Baridhara DOHS, Dhaka 1213, Bangladesh",
    href: "#",
    desc: "By appointment only.",
  },
];

const ContactForm = () => {
  const swal = useSwal();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      swal.fire({
        title: "Message sent!",
        text: "Our team will get back to you within a few hours.",
      });
    }, 800);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" name="firstName" placeholder="Jane" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" name="lastName" placeholder="Doe" required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@brand.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+880 17XX XXXXXX"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" placeholder="Your brand" />
      </div>

      <div className="space-y-2">
        <Label>What can we help with?</Label>
        <div className="flex flex-wrap gap-2">
          {[
            "Sales inquiry",
            "Demo request",
            "Partnership",
            "Support",
            "Other",
          ].map((t) => (
            <label
              key={t}
              className="cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-semibold border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 has-[:checked]:gradient-primary has-[:checked]:text-primary-foreground has-[:checked]:border-transparent transition-all"
            >
              <input
                type="radio"
                name="topic"
                value={t}
                className="sr-only"
                defaultChecked={t === "Sales inquiry"}
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us a little about what you're trying to build…"
          rows={5}
          required
        />
      </div>

      <div className="flex items-start gap-3 pt-2">
        <input
          id="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-border accent-primary"
        />
        <label
          htmlFor="consent"
          className="text-xs text-muted-foreground leading-relaxed"
        >
          I agree to OneComm contacting me about my inquiry and accept the{" "}
          <a href="#" className="text-primary hover:underline">
            privacy policy
          </a>
          .
        </label>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        disabled={loading}
        className="w-full sm:w-auto"
      >
        {loading ? "Sending…" : "Send message"}
        {!loading && <Send className="ml-1 h-4 w-4" />}
      </Button>
    </form>
  );
};

export const ContactSection = () => {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/15 blur-3xl" />
      </div>

      <div className="container mx-auto relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Contact
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Let's build your{" "}
            <span className="text-gradient">next big thing.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Whether you're launching your first store or scaling to millions in
            revenue — our team is here to help. We typically respond within a
            few hours.
          </p>
        </div>

        {/* Channels */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="group p-5 rounded-2xl border border-border bg-card shadow-card hover:-translate-y-1 hover:shadow-elevated hover:border-primary/30 transition-all"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                <c.icon className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {c.label}
              </p>
              <p className="mt-1 font-display text-base font-bold tracking-tight">
                {c.value}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">{c.desc}</p>
            </a>
          ))}
        </div>

        {/* Form + Side panel */}
        <div className="mt-14 max-w-6xl mx-auto grid lg:grid-cols-12 gap-6">
          {/* Form card */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-card shadow-elevated p-7 sm:p-10">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Send us a message
              </span>
            </div>
            <ContactForm />
          </div>

          {/* Side info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl gradient-primary text-primary-foreground p-7 sm:p-8 shadow-elevated relative overflow-hidden">
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
              <div className="relative">
                <h3 className="font-display text-2xl font-extrabold tracking-tight leading-tight">
                  Talk to a product specialist.
                </h3>
                <p className="mt-3 text-sm text-primary-foreground/85 leading-relaxed">
                  Get a personalised walkthrough of OneComm and a free
                  store-readiness audit.
                </p>
                <Button
                  asChild
                  variant="glass"
                  size="lg"
                  className="mt-6 w-full"
                >
                  <a href="/request-demo">
                    Book a 30-min demo <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Office hours
                </span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">
                    Sunday – Thursday
                  </span>
                  <span className="font-semibold">10:00 – 19:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Friday</span>
                  <span className="font-semibold">14:00 – 19:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-semibold text-muted-foreground">
                    Closed
                  </span>
                </li>
              </ul>
              <div className="mt-5 pt-5 border-t border-border text-xs text-muted-foreground leading-relaxed">
                24/7 chat support is always available for active customers from
                your dashboard.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
