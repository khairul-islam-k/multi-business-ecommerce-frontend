"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Car, Radio, Landmark } from "lucide-react";

import automotive from "../_assets/automotive.avif";
import finance from "../_assets/finance.avif";
import retail from "../_assets/retail.avif";
import telecom from "../_assets/telecom.avif";

const industries = [
  {
    key: "retail",
    label: "Retail",
    icon: ShoppingBag,
    title: "Retail",
    description:
      "Power your retail operations with flexible product management, real-time inventory, and seamless multi-channel selling across all touchpoints.",
    highlight: {
      title: "Sell Everywhere. Seamlessly.",
      desc: "Unified commerce across online, offline, and marketplaces.",
    },
    img: retail,
  },
  {
    key: "automotive",
    label: "Automotive",
    icon: Car,
    title: "Automotive",
    description:
      "Manage complex automotive catalogs with configurable parts, compatibility checks, and dealer management systems built for scale.",
    highlight: {
      title: "Built for Complex Catalogs",
      desc: "Handle variants, compatibility, and dealer workflows effortlessly.",
    },
    img: automotive,
  },
  {
    key: "telecom",
    label: "Telecom",
    icon: Radio,
    title: "Telecom",
    description:
      "Handle subscription plans, usage-based billing, and complex service bundles with our flexible commerce engine built for telecom providers.",
    highlight: {
      title: "Flexible Billing Engine",
      desc: "Subscriptions, usage, and bundles — all in one system.",
    },
    img: telecom,
  },
  {
    key: "finance",
    label: "Finance",
    icon: Landmark,
    title: "Finance",
    description:
      "Ensure security, compliance, and scalability within complex financial products and services. Our robust platform supports recurring billing, payment integrations, and adaptable customer account management.",
    highlight: {
      title: "Secure. Scalable. Compliant.",
      desc: "Built for modern financial systems and high-volume transactions.",
    },
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
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isActive = ind.key === active;

            return (
              <motion.button
                key={ind.key}
                onClick={() => setActive(ind.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-blue-700 text-white! shadow-lg"
                    : "bg-white! text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                />
                {ind.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white! rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 items-center">
              {/* LEFT CONTENT */}
              <div className="p-10 md:p-16 relative z-10">
                <h3 className="text-4xl font-bold text-gray-900 mb-6">
                  {current.title}
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {current.description}
                </p>

                <motion.a
                  href="#"
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-3 mt-10 text-blue-700 font-semibold hover:text-blue-700 transition-colors"
                >
                  Learn more →
                </motion.a>
              </div>

              {/* RIGHT VISUAL WITH MASK */}
              <div className="hidden md:block relative h-105 overflow-hidden">
                {/* Masked Image */}
                <motion.div
                  key={active}
                  initial={{ clipPath: "ellipse(0% 100% at 100% 50%)" }}
                  animate={{ clipPath: "ellipse(75% 100% at 100% 50%)" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.img}
                    alt="Industry"
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Green Overlay */}
                <motion.div
                  key={active + "-blue"}
                  initial={{ clipPath: "ellipse(0% 100% at 0% 50%)" }}
                  animate={{ clipPath: "ellipse(65% 100% at 0% 50%)" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 bg-linear-to-br from-blue-700 to-blue-900 flex items-center"
                >
                  <div className="px-12 text-white max-w-sm">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs mb-4">
                        Enterprise Ready
                      </span>

                      <h4 className="text-2xl md:text-3xl font-semibold mb-3">
                        {current.highlight.title}
                      </h4>

                      <p className="text-sm md:text-base leading-relaxed opacity-90">
                        {current.highlight.desc}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
