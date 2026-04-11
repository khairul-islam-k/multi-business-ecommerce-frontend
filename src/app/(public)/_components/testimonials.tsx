"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    logo: "DATACENTERHAWK",
    review: "Transformed how we manage infrastructure.",
    author: "Sarah Chen",
    role: "CTO",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    logo: "MLB",
    review: "Unified our entire e-commerce ecosystem.",
    author: "Michael Rodriguez",
    role: "Head of Digital",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rodriguez",
  },
  {
    id: 3,
    logo: "PHARMACY",
    review: "Top-notch compliance and security.",
    author: "Dr. Aisha Patel",
    role: "Operations Director",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
  },
  {
    id: 4,
    logo: "RETAILCO",
    review: "Scaled from 3 to 47 stores easily.",
    author: "Rahim Khan",
    role: "CEO",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const visibleCount = 2.5;
  const maxIndex = testimonials.length - visibleCount;

  const next = () => setCurrentIndex((p) => Math.min(p + 1, maxIndex));
  const prev = () => setCurrentIndex((p) => Math.max(p - 1, 0));

  const handleCardClick = (id: number) => {
    router.push(`/review/${id}`);
  };

  return (
    <section className="py-24 bg-linear-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-bold">What Customers Say</h2>
          <p className="text-blue-100! text-lg max-w-md">
            Discover how businesses like yours are using OneComm to boost
            efficiency, <br className="hidden md:block" /> increase revenue, and
            simplify their daily workflows.
          </p>

          <button className="w-fit border border-white/40 hover:border-white px-8 py-3 rounded-full text-sm backdrop-blur-sm cursor-pointer">
            View All
          </button>
        </div>

        {/* Carousel */}
        <div>
          <div className="overflow-x-hidden">
            <motion.div
              className="flex gap-5"
              animate={{
                x: `calc(-${currentIndex * (100 / visibleCount)}% - ${currentIndex * 20}px)`,
              }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            >
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  onClick={() => handleCardClick(t.id)}
                  whileHover={{ scale: 0.975 }}
                  whileTap={{ scale: 1.025 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/30 rounded-2xl p-6 min-w-60 cursor-pointer flex flex-col justify-between shadow-lg z-10"
                >
                  {/* Top */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs tracking-wider text-blue-200">
                      {t.logo}
                    </span>
                    <Quote className="w-5 h-5 text-blue-300" />
                  </div>

                  {/* Review */}
                  <p className="text-sm text-blue-100 leading-relaxed mb-6">
                    “{t.review}”
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={t.avatar}
                      alt={t.author}
                      width={36}
                      height={36}
                      className="rounded-full"
                      unoptimized
                    />
                    <div>
                      <p className="text-sm font-medium">{t.author}</p>
                      <p className="text-xs text-blue-300">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
