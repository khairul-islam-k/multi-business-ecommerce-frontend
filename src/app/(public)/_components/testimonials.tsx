// components/Testimonials.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    logo: "DATACENTERHAWK",
    content:
      "Broadleaf has transformed how we manage our complex infrastructure and customer accounts. The platform's flexibility and scalability are unmatched.",
    author: "Sarah Chen",
    role: "CTO at DataCenterHawk",
    image: "https://via.placeholder.com/80", // Replace with real logo/image
  },
  {
    id: 2,
    logo: "MLB",
    content:
      "Implementing Broadleaf allowed us to unify our entire e-commerce ecosystem. The results have been incredible in terms of performance and user experience.",
    author: "Michael Rodriguez",
    role: "Head of Digital, MLB",
    image: "https://via.placeholder.com/80",
  },
  {
    id: 3,
    logo: "Pharmacy",
    content:
      "The compliance and security features give us peace of mind while handling sensitive customer data. Best enterprise commerce platform we've used.",
    author: "Dr. Aisha Patel",
    role: "Operations Director",
    image: "https://via.placeholder.com/80",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  return (
    <section className="bg-blue-700 text-white! py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Left Side - Heading */}
          <div className="md:w-5/12">
            <h2 className="text-5xl font-bold leading-tight mb-6">
              What Our
              <br />
              Customers Say
            </h2>
            <p className="text-blue-100! text-xl mb-10">
              Discover what you can achieve with our platform and transform from
              case studies across every industry.
            </p>
            <button className="border border-blue-400 hover:bg-blue-800 text-blue-100! px-8 py-3.5 rounded-full font-medium transition-all">
              All Customer Stories →
            </button>
          </div>

          {/* Testimonial Carousel */}
          <div className="md:w-7/12 relative">
            <div className="relative h-105 overflow-hidden">
              <AnimatePresence mode="wait">
                {testimonials.map(
                  (testimonial, index) =>
                    index === current && (
                      <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 h-full flex flex-col justify-between">
                          <div>
                            <div className="text-6xl text-blue-100! mb-8">
                              “
                            </div>
                            <p className="text-2xl leading-relaxed text-white! mb-10">
                              {testimonial.content}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
                              {testimonial.logo[0]}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {testimonial.author}
                              </p>
                              <p className="text-blue-100! text-sm">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prev}
                className="w-14 h-14 border border-white/30 hover:border-white/60 rounded-2xl flex items-center justify-center transition-all"
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={next}
                className="w-14 h-14 border border-white/30 hover:border-white/60 rounded-2xl flex items-center justify-center transition-all"
              >
                →
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
