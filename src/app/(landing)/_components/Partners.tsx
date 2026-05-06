import Image from "next/image";
import { CreditCard, Truck, ArrowDown } from "lucide-react";

import bkash from "@/assets/partners/bkash.svg";
import nagad from "@/assets/partners/nagad.svg";
import sslcommerz from "@/assets/partners/ssl-commerz.svg";
import stripe from "@/assets/partners/stripe.svg";
import upay from "@/assets/partners/upay.svg";
import pathao from "@/assets/partners/pathao.svg";
import steadfast from "@/assets/partners/steadfast.svg";
import redx from "@/assets/partners/redx.svg";
import paperfly from "@/assets/partners/paperfly.svg";
import rxCourier from "@/assets/partners/rx-courier.svg";

type FloatItem = {
  src: string;
  alt: string;
  /** Tailwind position classes */
  pos: string;
  /** Card padding */
  pad: string;
  /** z-index */
  z: string;
  /** image max height */
  imgH: string;
  delay: string;
};

const PaymentCloud = () => {
  const items: FloatItem[] = [
    {
      src: stripe,
      alt: "Stripe",
      pos: "top-[6%] left-[2%]",
      pad: "p-5",
      z: "z-30",
      imgH: "h-7",
      delay: "0s",
    },
    {
      src: bkash,
      alt: "bKash",
      pos: "top-[42%] left-[40%]",
      pad: "p-4",
      z: "z-40",
      imgH: "h-7",
      delay: "1.2s",
    },
    {
      src: sslcommerz,
      alt: "SSLCommerz",
      pos: "bottom-[8%] left-[6%]",
      pad: "p-3.5",
      z: "z-20",
      imgH: "h-6",
      delay: "0.6s",
    },
    {
      src: nagad,
      alt: "Nagad",
      pos: "top-[14%] right-[2%]",
      pad: "p-3",
      z: "z-10",
      imgH: "h-7",
      delay: "1.8s",
    },
    {
      src: upay,
      alt: "Upay",
      pos: "bottom-[10%] right-[14%]",
      pad: "p-3",
      z: "z-10",
      imgH: "h-9",
      delay: "0.9s",
    },
  ];
  return <FloatingCluster items={items} accent="primary" />;
};

const LogisticsCloud = () => {
  const items: FloatItem[] = [
    {
      src: pathao,
      alt: "Pathao",
      pos: "top-[8%] right-[2%]",
      pad: "p-5",
      z: "z-30",
      imgH: "h-7",
      delay: "0.3s",
    },
    {
      src: steadfast,
      alt: "Steadfast",
      pos: "top-[46%] right-[40%]",
      pad: "p-4",
      z: "z-40",
      imgH: "h-7",
      delay: "1.5s",
    },
    {
      src: redx,
      alt: "RedX",
      pos: "bottom-[10%] right-[8%]",
      pad: "p-3.5",
      z: "z-20",
      imgH: "h-6",
      delay: "0.8s",
    },
    {
      src: paperfly,
      alt: "Paperfly",
      pos: "top-[18%] left-[2%]",
      pad: "p-3",
      z: "z-10",
      imgH: "h-6",
      delay: "2s",
    },
    {
      src: rxCourier,
      alt: "RX Courier",
      pos: "bottom-[6%] left-[18%]",
      pad: "p-2.5",
      z: "z-10",
      imgH: "h-9",
      delay: "1.1s",
    },
  ];
  return <FloatingCluster items={items} accent="glow" />;
};

const FloatingCluster = ({
  items,
  accent,
}: {
  items: FloatItem[];
  accent: "primary" | "glow";
}) => {
  const shadow =
    accent === "primary"
      ? "shadow-[0_20px_40px_-15px_hsl(244_75%_58%/0.25)]"
      : "shadow-[0_20px_40px_-15px_hsl(262_83%_68%/0.3)]";
  return (
    <div className="relative w-full aspect-square max-w-[360px] mx-auto">
      {items.map((it, i) => (
        <div
          key={it.alt}
          className={`absolute ${it.pos} ${it.z} ${it.pad} bg-card rounded-2xl border border-border ${i < 2 ? shadow : "shadow-card"} hover:-translate-y-1.5 hover:rotate-0 transition-transform duration-500`}
          style={{
            animation: `partner-float 6s ease-in-out ${it.delay} infinite`,
          }}
        >
          <Image
            src={it.src}
            alt={`${it.alt} logo`}
            width={100}
            height={100}
            className={`${it.imgH} w-auto object-contain`}
          />
        </div>
      ))}
    </div>
  );
};

export const Partners = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-card">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.06] blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-glow/[0.08] blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto relative">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-card">
            Trusted Partners
          </span>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
            Gliding seamlessly from <br className="hidden sm:block" />
            <span className="text-gradient">checkout to front-door.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            In partnership with our dedicated logistics & payment partners —
            sequencing global payment captures with hyper-local dispatch
            networks.
          </p>
        </div>

        {/* Journey */}
        <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-2 gap-y-20 lg:gap-x-16 items-center max-w-5xl mx-auto">
          {/* Center vertical runway (desktop) */}
          <div className="hidden lg:block absolute top-[8%] bottom-[8%] left-1/2 -translate-x-1/2 w-px z-0">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-primary/40 to-transparent opacity-60" />
          </div>

          {/* Handoff pill (desktop) */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest z-50 shadow-elevated ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Order Handoff
          </div>

          {/* Step 1: Payment text (left) */}
          <div className="lg:text-right relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-primary font-semibold text-[10px] uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Capture
            </div>
            <div className="mt-4 inline-flex lg:flex lg:justify-end items-center gap-3">
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Frictionless
                <br />
                payment routing
              </h3>
              <div className="lg:order-first grid h-11 w-11 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-soft shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-muted-foreground lg:ml-auto lg:max-w-[42ch]">
              Instant authorization across the most trusted financial networks.
              We secure the funds before the customer even closes the tab.
            </p>
          </div>

          {/* Step 1: Payment cloud (right) */}
          <div className="relative z-10">
            <PaymentCloud />
          </div>

          {/* Mobile handoff indicator */}
          <div className="lg:hidden flex justify-center -my-8 relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background shadow-elevated">
                <ArrowDown className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Order Handoff
              </span>
            </div>
          </div>

          {/* Step 2: Logistics cloud (left) */}
          <div className="relative z-10 lg:row-start-2 order-last lg:order-none">
            <LogisticsCloud />
          </div>

          {/* Step 2: Logistics text (right) */}
          <div className="relative z-10 lg:row-start-2 lg:pl-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-glow/10 text-primary-glow font-semibold text-[10px] uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
              Fulfillment
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-soft shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Hyper-local
                <br />
                dispatch network
              </h3>
            </div>
            <p className="mt-4 text-muted-foreground max-w-[42ch]">
              Algorithmic carrier selection ensures every package takes the
              fastest, most reliable route — from warehouse floor to customer's
              hands.
            </p>
          </div>
        </div>

        {/* Stats footer */}
        <div className="mt-20 rounded-3xl border border-border bg-card shadow-card p-8 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "10+", l: "Payment gateways" },
            { v: "12+", l: "Logistics partners" },
            { v: "64", l: "Districts covered" },
            { v: "99.9%", l: "Settlement uptime" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-gradient">
                {s.v}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes partner-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};
