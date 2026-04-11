// components/FeaturesSection.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Car, Radio, Landmark } from "lucide-react";

import automotive from "../_assets/automotive.avif";
import finance from "../_assets/finance.avif";
import retail from "../_assets/retail.avif";
import telecom from "../_assets/telecom.avif";
import Image from "next/image";

const industries = [
  {
    key: "retail",
    label: "Retail",
    icon: ShoppingBag,
    title: "Retail",
    description:
      "Power your retail operations with flexible product management, real-time inventory, and seamless multi-channel selling across all touchpoints.",
    img: retail,
  },
  {
    key: "automotive",
    label: "Automotive",
    icon: Car,
    title: "Automotive",
    description:
      "Manage complex automotive catalogs with configurable parts, compatibility checks, and dealer management systems built for scale.",
    img: automotive,
  },
  {
    key: "telecom",
    label: "Telecom",
    icon: Radio,
    title: "Telecom",
    description:
      "Handle subscription plans, usage-based billing, and complex service bundles with our flexible commerce engine built for telecom providers.",
    img: telecom,
  },
  {
    key: "finance",
    label: "Finance",
    icon: Landmark,
    title: "Finance",
    description:
      "Ensure security, compliance, and scalability within complex financial products and services. Our robust platform supports recurring billing, payment integrations, and adaptable customer account management.",
    img: finance,
  },
];

export default function FeaturesSection() {
  const [active, setActive] = useState("finance");
  const current = industries.find((i) => i.key === active)!;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Solve Your Industry&apos;s Challenges
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The more complex the commerce challenge, the better equipped we are
            to deliver tailored solutions.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isActive = ind.key === active;

            return (
              <motion.button
                key={ind.key}
                onClick={() => setActive(ind.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white! shadow-xl shadow-emerald-500/30"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`}
                />
                {ind.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content Area with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-8 p-10 md:p-16 items-center">
              <div>
                <h3 className="text-4xl font-bold text-gray-900 mb-6">
                  {current.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {current.description}
                </p>

                <motion.a
                  href="#"
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-3 mt-10 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Learn more
                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </motion.a>
              </div>

              {/* Visual Placeholder */}
              <div className="hidden md:block">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 h-96 rounded-2xl flex items-center justify-center">
                  <Image
                    src={current.img}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-2xl"
                    alt="Image"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
