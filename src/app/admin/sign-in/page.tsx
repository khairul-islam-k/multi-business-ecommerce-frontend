"use client";

import LoginForm from "./_components/login-form";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Logo from "@/components/shared/logo";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    title: "Launch Your Store",
    subtitle: "In minutes, not months",
    highlight: "No coding required",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&q=80",
    title: "Sell Globally",
    subtitle: "Reach customers worldwide",
    highlight: "120+ countries supported",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80",
    title: "Grow Faster",
    subtitle: "Powerful tools at your fingertips",
    highlight: "AI-powered insights",
  },
];

export default function SignInPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* LEFT: Image Slider + Overlay Info */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black/25">
        <AnimatePresence mode="wait">
          {heroSlides.map(
            (slide, index) =>
              index === currentSlide && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/60 to-transparent" />
                </motion.div>
              ),
          )}
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center px-16">
          <div className="max-w-md text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">
                    Trusted by 100,000+ merchants
                  </span>
                </div>

                <h1 className="text-6xl font-bold leading-tight mb-6">
                  {heroSlides[currentSlide].title}
                </h1>

                <p className="text-2xl text-white/90 mb-4">
                  {heroSlides[currentSlide].subtitle}
                </p>

                <div className="text-blue-400 text-xl font-medium">
                  {heroSlides[currentSlide].highlight}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-16 flex gap-3 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900">
              Welcome back
            </h2>
            <p className="text-gray-600 mt-2">Sign in to manage your store</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
