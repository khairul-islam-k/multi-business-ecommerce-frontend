"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    logo: "DATACENTERHAWK",
    review:
      "Broadleaf transformed how we manage our complex infrastructure and customer accounts.",
    author: "Sarah Chen",
    role: "CTO at DataCenterHawk",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    logo: "MLB",
    review:
      "Implementing Broadleaf unified our entire e-commerce ecosystem with incredible results.",
    author: "Michael Rodriguez",
    role: "Head of Digital, MLB",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rodriguez",
  },
  {
    id: 3,
    logo: "PHARMACY",
    review:
      "The compliance and security features give us complete peace of mind with sensitive data.",
    author: "Dr. Aisha Patel",
    role: "Operations Director",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
  },
  {
    id: 4,
    logo: "RETAILCO",
    review:
      "OneComm helped us scale from 3 to 47 stores seamlessly. Best decision we made.",
    author: "Rahim Khan",
    role: "CEO at RetailCo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const visibleCount = 2.5;
  const maxIndex = testimonials.length - visibleCount;

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleCardClick = (id: number) => {
    router.push(`/review/${id}`);
  };

  return (
    <section className="py-24 bg-blue-600 text-white! overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Header */}
        <div className="w-full md:w-3/4 flex flex-col gap-5 mb-12">
          <div>
            <h2 className="text-5xl font-bold leading-tight mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-200! text-xl max-w-md">
              Real stories from businesses transforming with OneComm
            </p>
          </div>

          <button className="mt-6 md:mt-0 border border-white hover:border-blue-400 hover:text-white px-8 py-3 rounded-full text-sm font-medium transition-all">
            View All Stories
          </button>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{
                x: `calc(-${currentIndex * (100 / visibleCount)}% - ${currentIndex * 24}px)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  onClick={() => handleCardClick(testimonial.id)}
                  whileTap={{ scale: 1.01 }}
                  whileHover={{ scale: 0.98 }}
                  className="border border-white hover:border-blue-500/50 rounded-3xl p-8 min-w-64 cursor-pointer transition-all duration-300 flex flex-col"
                >
                  {/* Logo */}
                  <div className="relative size-10 rounded-full overflow-hidden ring-2 ring-blue-400 mb-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={100}
                      height={100}
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Review */}
                  <p className="text-gray-300 text-[17px] leading-relaxed flex-1 mb-8">
                    “{testimonial.review}”
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold text-white">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-300">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-10 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-14 h-14 flex items-center justify-center border border-gray-700 hover:border-gray-400 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="w-14 h-14 flex items-center justify-center border border-gray-700 hover:border-gray-400 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
