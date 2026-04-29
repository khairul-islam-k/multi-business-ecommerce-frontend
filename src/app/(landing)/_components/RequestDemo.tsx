"use client";

import { useState } from "react";
import { z } from "zod";
import {
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSwal } from "@/hooks/use-swal";

const teamSizeOptions = ["1-10", "11-50", "51-200", "200+"] as const;

const demoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),

  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" })
    .max(255, { message: "Email must be less than 255 characters" }),

  company: z
    .string()
    .trim()
    .min(1, { message: "Company is required" })
    .max(120, { message: "Company must be less than 120 characters" }),

  phone: z
    .string()
    .trim()
    .max(30, { message: "Phone must be less than 30 characters" })
    .optional()
    .or(z.literal("")),

  teamSize: z.enum(teamSizeOptions, {
    message: "Please choose a team size",
  }),

  goal: z
    .string()
    .trim()
    .min(1, { message: "Tell us what you want to see" })
    .max(600, { message: "Please keep this under 600 characters" }),

  consent: z.literal(true, {
    message: "Please accept to continue",
  }),
});

type DemoFormValues = z.infer<typeof demoSchema>;

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  teamSize: "" | "1-10" | "11-50" | "51-200" | "200+";
  goal: string;
  consent: boolean;
};

const initial: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  teamSize: "",
  goal: "",
  consent: false,
};

const teamSizes: Array<{ value: FormState["teamSize"]; label: string }> = [
  { value: "1-10", label: "1–10" },
  { value: "11-50", label: "11–50" },
  { value: "51-200", label: "51–200" },
  { value: "200+", label: "200+" },
];

const perks = [
  {
    icon: Sparkles,
    title: "Personalised walkthrough",
    desc: "A 30-minute live tour tailored to your business and channels.",
  },
  {
    icon: Zap,
    title: "Free store-readiness audit",
    desc: "We review your setup and share quick wins you can ship this week.",
  },
  {
    icon: ShieldCheck,
    title: "No commitment",
    desc: "Friendly chat — no sales pressure, no credit card required.",
  },
  {
    icon: Users,
    title: "Team-friendly pricing",
    desc: "Custom plans for teams scaling past 10,000 orders a month.",
  },
];

export const RequestDemoHero = () => (
  <section className="relative overflow-hidden py-16 sm:py-20">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/15 blur-3xl" />
    </div>
    <div className="container mx-auto relative">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-semibold text-foreground shadow-card">
          <CalendarCheck className="h-3.5 w-3.5 text-primary" />
          Book your free 30-min demo
        </span>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
          See OneComm <span className="text-gradient">in action.</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Tell us a bit about your business and a product specialist will reach
          out within 1 business day to schedule a personalised walkthrough.
        </p>
      </div>
    </div>
  </section>
);

export const RequestDemoForm = () => {
  const swal = useSwal();
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = demoSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      swal.error("Please check the form. Some fields need your attention.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setValues(initial);
    swal.fire({
      title: "Demo request received",
      text: "We'll email you within 1 business day to schedule your walkthrough.",
    });
  };

  const baseField =
    "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20";

  const fieldClass = (key: keyof FormState) =>
    `${baseField} ${errors[key] ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border"}`;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-elevated">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              maxLength={100}
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              className={fieldClass("name")}
              placeholder="Jane Doe"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
            >
              Work email
            </label>
            <input
              id="email"
              type="email"
              maxLength={255}
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              className={fieldClass("email")}
              placeholder="jane@brand.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="company"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
            >
              Company
            </label>
            <input
              id="company"
              type="text"
              maxLength={120}
              value={values.company}
              onChange={(e) => update("company", e.target.value)}
              className={fieldClass("company")}
              placeholder="Acme Co."
            />
            {errors.company && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.company}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
            >
              Phone{" "}
              <span className="text-muted-foreground/60 normal-case font-medium">
                (optional)
              </span>
            </label>
            <input
              id="phone"
              type="tel"
              maxLength={30}
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={fieldClass("phone")}
              placeholder="+880 1XXX-XXXXXX"
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Team size
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {teamSizes.map((t) => {
              const active = values.teamSize === t.value;
              return (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => update("teamSize", t.value)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          {errors.teamSize && (
            <p className="mt-1.5 text-xs text-destructive">{errors.teamSize}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="goal"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
          >
            What would you like to see?
          </label>
          <textarea
            id="goal"
            rows={4}
            maxLength={600}
            value={values.goal}
            onChange={(e) => update("goal", e.target.value)}
            className={`${fieldClass("goal")} resize-none`}
            placeholder="e.g. AI inbox automation, multi-channel orders, courier integrations…"
          />
          <div className="mt-1.5 flex items-center justify-between">
            {errors.goal ? (
              <p className="text-xs text-destructive">{errors.goal}</p>
            ) : (
              <span className="text-xs text-muted-foreground">
                Tell us what matters most.
              </span>
            )}
            <span className="text-xs text-muted-foreground tabular-nums">
              {values.goal.length}/600
            </span>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            I agree to be contacted by OneComm about my demo request. We'll
            never share your details.
          </span>
        </label>
        {errors.consent && (
          <p className="-mt-3 text-xs text-destructive">{errors.consent}</p>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? "Sending…" : "Request my demo"}
          {!submitting && <ArrowRight className="ml-1 h-4 w-4" />}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          We typically respond within 1 business day.
        </p>
      </form>
    </div>
  );
};

export const RequestDemoSection = () => (
  <section className="pb-20 sm:pb-28">
    <div className="container">
      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* Left: perks */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl gradient-primary text-primary-foreground p-7 sm:p-8 shadow-elevated relative overflow-hidden">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="relative">
              <span className="font-mono text-xs font-bold tracking-widest text-primary-foreground/80">
                WHAT YOU GET
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                A guided tour built around your business.
              </h2>
              <p className="mt-3 text-sm text-primary-foreground/85 leading-relaxed">
                Bring your questions — we'll show you exactly how OneComm fits
                into your workflow.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-card space-y-5">
            {perks.map((p) => (
              <div key={p.title} className="flex gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: form */}
        <div className="lg:col-span-7">
          <RequestDemoForm />
        </div>
      </div>
    </div>
  </section>
);
