"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ShoppingBag,
  TrendingUp,
  Users,
  CreditCard,
  Package,
  Star,
} from "lucide-react";

const Sparkline = ({
  points,
  stroke = "currentColor",
}: {
  points: number[];
  stroke?: string;
}) => {
  const w = 120;
  const h = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10 overflow-visible">
      <defs>
        <linearGradient id="shop-spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#shop-spark-fill)" />
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const initial = {
  revenue: 248930,
  orders: 1842,
  conversion: 4.7,
  aov: 1351,
};

// Live order ticker rows
const liveOrders = [
  {
    id: "#A8421",
    city: "Dhaka",
    item: "Linen Shirt · M",
    amount: "৳ 1,890",
    method: "bKash",
  },
  {
    id: "#A8420",
    city: "Chattogram",
    item: "Sneakers · 42",
    amount: "৳ 3,450",
    method: "Stripe",
  },
  {
    id: "#A8419",
    city: "Sylhet",
    item: "Tote Bag",
    amount: "৳ 990",
    method: "Nagad",
  },
  {
    id: "#A8418",
    city: "Khulna",
    item: "Hoodie · L",
    amount: "৳ 2,150",
    method: "SSLCommerz",
  },
  {
    id: "#A8417",
    city: "Rajshahi",
    item: "Cap · Black",
    amount: "৳ 690",
    method: "Upay",
  },
];

export const Analytics = () => {
  const [m, setM] = useState(initial);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setM((cur) => ({
        revenue: cur.revenue + Math.round(Math.random() * 1800 + 200),
        orders: cur.orders + (Math.random() > 0.4 ? 1 : 0),
        conversion: +Math.max(
          3.8,
          Math.min(5.6, cur.conversion + (Math.random() * 0.2 - 0.1)),
        ).toFixed(2),
        aov: Math.round(
          Math.max(1200, Math.min(1500, cur.aov + (Math.random() * 30 - 15))),
        ),
      }));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* soft ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary-glow/10 blur-3xl" />
      </div>

      <div className="container mx-auto relative">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Live store performance
              </span>
            </div>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Sell more.
              <br />
              <span className="text-gradient">Grow faster.</span>
            </h2>
            <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">
              From the first add-to-cart to the final delivery, OneComm tracks
              every metric that moves the needle — revenue, conversion, AOV,
              repeat customers — all in real time.
            </p>
          </div>

          {/* Today snapshot */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Today
                </div>
                <div className="text-xs text-muted-foreground tabular-nums">
                  Updated · {String(tick).padStart(3, "0")}
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Gross revenue
                  </div>
                  <div className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tabular-nums">
                    ৳ {m.revenue.toLocaleString()}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight className="h-3.5 w-3.5" /> +18.2% vs yesterday
                  </div>
                </div>
                <div className="text-primary w-32">
                  <Sparkline
                    points={[12, 18, 14, 22, 19, 27, 24, 31, 28, 35, 33, 41]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: ShoppingBag,
              label: "Orders today",
              value: m.orders.toLocaleString(),
              delta: "+12.4%",
              spark: [4, 6, 5, 8, 7, 10, 9, 12, 11, 14, 13, 16],
            },
            {
              icon: TrendingUp,
              label: "Conversion rate",
              value: `${m.conversion}%`,
              delta: "+0.8 pts",
              spark: [
                3.1, 3.4, 3.2, 3.8, 3.6, 4.1, 3.9, 4.4, 4.2, 4.7, 4.5, 4.9,
              ],
            },
            {
              icon: CreditCard,
              label: "Avg. order value",
              value: `৳ ${m.aov.toLocaleString()}`,
              delta: "+6.1%",
              spark: [10, 12, 11, 14, 13, 15, 14, 17, 16, 18, 17, 20],
            },
            {
              icon: Users,
              label: "Repeat buyers",
              value: "38%",
              delta: "+4.2%",
              spark: [6, 8, 7, 10, 9, 12, 11, 13, 12, 15, 14, 17],
            },
          ].map((k) => (
            <div
              key={k.label}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-primary/10 ring-1 ring-primary/15 p-2.5">
                  <k.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {k.delta}
                </span>
              </div>
              <div className="mt-5 font-display text-3xl font-extrabold tracking-tight tabular-nums">
                {k.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {k.label}
              </div>
              <div className="mt-4 text-primary">
                <Sparkline points={k.spark} />
              </div>
            </div>
          ))}
        </div>

        {/* Live orders + best sellers */}
        <div className="mt-6 grid lg:grid-cols-5 gap-5">
          {/* Live orders */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Live orders</span>
              </div>
              <span className="text-xs text-muted-foreground">streaming</span>
            </div>
            <ul className="divide-y divide-border">
              {liveOrders.map((o, i) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5 text-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        i === 0
                          ? "bg-emerald-500 animate-pulse"
                          : "bg-muted-foreground/40"
                      }`}
                    />
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {o.id}
                    </span>
                    <span className="truncate font-medium">{o.item}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden sm:inline text-xs text-muted-foreground">
                      {o.city}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {o.method}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {o.amount}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Best sellers */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Top products</span>
              </div>
              <span className="text-xs text-muted-foreground">last 24h</span>
            </div>
            <ul className="p-2">
              {[
                { name: "Linen Summer Shirt", sold: 184, share: 92 },
                { name: "Everyday Sneakers", sold: 142, share: 71 },
                { name: "Canvas Tote Bag", sold: 119, share: 60 },
                { name: "Classic Hoodie", sold: 96, share: 48 },
              ].map((p) => (
                <li
                  key={p.name}
                  className="px-3 py-3 rounded-xl hover:bg-muted/50 transition"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">{p.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {p.sold}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                      style={{ width: `${p.share}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
