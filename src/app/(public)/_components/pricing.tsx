// components/Pricing.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

type Plan = {
  name: string;
  desc: string;
  monthly?: string;
  yearly?: string;
  custom?: boolean;
  included: string[];
  excluded?: string[];
  current?: boolean;
};

const mockPlans: Plan[] = [
  {
    name: "Starter",
    desc: "Best for small sellers.",
    monthly: "৳2,500",
    yearly: "৳25,000",
    included: [
      "1 company",
      "1 website",
      "2 users",
      "500 products",
      "1,500 orders/month",
      "1 warehouse",
      "basic order management",
      "basic inventory",
      "courier integration",
      "invoice system",
      "dashboard reports",
      "500 SMS/month",
      "email support",
    ],
  },
  {
    name: "Growth",
    desc: "Best for growing e-commerce brands.",
    monthly: "৳6,500",
    yearly: "৳65,000",
    included: [
      "3 companies",
      "3 websites",
      "10 users",
      "5,000 products",
      "15,000 orders/month",
      "5 warehouses",
      "product variants",
      "supplier module",
      "stock transfer",
      "SMS marketing",
      "promotion automation",
      "advanced reports",
      "basic finance",
      "5,000 SMS/month",
      "priority support",
    ],
  },
  {
    name: "Business",
    desc: "Best for established operators.",
    monthly: "৳12,000",
    yearly: "৳120,000",
    current: true,
    included: [
      "10 companies",
      "10 websites",
      "30 users",
      "25,000 products",
      "75,000 orders/month",
      "15 warehouses",
      "full finance module",
      "expense management",
      "role & permission matrix",
      "AI marketing assistant",
      "AI website generator",
      "API access",
      "multi-gateway config",
      "15,000 SMS/month",
      "phone support",
    ],
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-10 md:py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold tracking-widest text-sm">
            PRICING
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
            Simple, transparent pricing
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-gray-600 font-medium">Monthly</span>

            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors flex items-center px-1 ${
                isYearly ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <motion.div
                animate={{ x: isYearly ? 28 : 0 }}
                className="w-5 h-5 bg-white rounded-full shadow"
              />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Yearly</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {mockPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -12 }}
              className="relative"
            >
              {plan.current && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-6 py-1 rounded-full shadow">
                  CURRENT PLAN
                </div>
              )}

              <div
                className={`bg-white rounded-3xl p-8 h-full flex flex-col border ${plan.current ? "border-blue-500 shadow-xl" : "border-gray-100 hover:border-gray-200"} transition-all`}
              >
                {/* Plan Info */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 mt-2">{plan.desc}</p>
                </div>

                {/* Pricing */}
                <div className="mb-10">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">
                      {isYearly ? plan.yearly : plan.monthly}
                    </span>
                    <span className="text-gray-500 ml-2">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 mb-4">
                    Everything in {plan.name}:
                  </p>

                  <ul className="space-y-3">
                    {plan.included.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  className={`mt-10 w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
                    plan.current
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white! shadow-lg shadow-blue-200"
                  }`}
                >
                  {plan.current ? "Current Plan" : "Get Started"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
