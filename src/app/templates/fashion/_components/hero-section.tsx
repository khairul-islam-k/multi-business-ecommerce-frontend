"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { HeaderSlide } from "@/types/website/website";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";

type HeroSectionProps = {
  bannerSlide: HeaderSlide[];
};

const AUTO_SLIDE_DELAY = 5000;

const HeroSection = ({
  bannerSlide = [],
}: HeroSectionProps) => {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const totalSlides = bannerSlide.length;
  const hasMultipleSlides = totalSlides > 1;
  const activeHero = bannerSlide[activeIndex];

  const handleNext = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setActiveIndex(
      (previousIndex) =>
        (previousIndex + 1) % totalSlides,
    );
  };

  const handlePrev = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setActiveIndex((previousIndex) =>
      previousIndex === 0
        ? totalSlides - 1
        : previousIndex - 1,
    );
  };

  useEffect(() => {
    if (activeIndex >= totalSlides) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalSlides]);

  useEffect(() => {
    if (!hasMultipleSlides) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex(
        (previousIndex) =>
          (previousIndex + 1) % totalSlides,
      );
    }, AUTO_SLIDE_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasMultipleSlides, totalSlides]);

  if (!activeHero) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[var(--store-bg-2)]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 h-[90vh] lg:grid-cols-2">
        {/* Left content */}
        <div className="relative z-10 flex items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-8">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHero.id}
                initial={{
                  opacity: 0,
                  x: -50,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 50,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                {activeHero.subTitle && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.1,
                      duration: 0.5,
                    }}
                    className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f16d59] sm:text-sm"
                  >
                    {activeHero.subTitle}
                  </motion.p>
                )}

                {activeHero.title && (
                  <motion.h1
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.2,
                      duration: 0.5,
                    }}
                    className="max-w-xl text-3xl font-extrabold leading-tight text-[var(--store-text-primary)] sm:text-4xl lg:text-5xl"
                  >
                    {activeHero.title}
                  </motion.h1>
                )}

                {activeHero.description && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.3,
                      duration: 0.5,
                    }}
                    className="mt-4 max-w-lg text-sm leading-7 text-[var(--store-muted)] sm:text-base"
                  >
                    {activeHero.description}
                  </motion.p>
                )}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.4,
                    duration: 0.5,
                  }}
                  className="mt-6"
                >
                  <Link
                    href="/store/products"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#f16d59] px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
                  >
                    Shop Now
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            {hasMultipleSlides && (
              <div className="mt-7 flex items-center gap-3">
                {bannerSlide.map(
                  (item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setActiveIndex(index)
                      }
                      aria-label={`Go to slide ${
                        index + 1
                      }`}
                      aria-current={
                        activeIndex === index
                          ? "true"
                          : undefined
                      }
                      className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                        activeIndex === index
                          ? "w-8 bg-[#f16d59]"
                          : "w-2.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right image */}
        <div className="relative h-[280px] overflow-hidden sm:h-[340px] lg:h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHero.id}
              initial={{
                opacity: 0,
                x: 80,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: -80,
                scale: 0.98,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="absolute inset-0"
            >
              <Image
                src={imageUrlSet(
                  activeHero.imageUrl,
                )}
                alt={activeHero.title ?? ""}
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[var(--store-bg-2)]/15 lg:via-transparent lg:to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Mobile arrows */}
          {hasMultipleSlides && (
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                className="grid size-10 place-items-center rounded-full border border-white/30 bg-black/30 text-white shadow-lg backdrop-blur-md transition hover:bg-[#f16d59]"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="grid size-10 place-items-center rounded-full border border-white/30 bg-black/30 text-white shadow-lg backdrop-blur-md transition hover:bg-[#f16d59]"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop arrows */}
      {hasMultipleSlides && (
        <div className="absolute bottom-5 right-6 z-20 hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="grid size-10 place-items-center rounded-full border border-gray-200 bg-white/85 text-gray-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="grid size-10 place-items-center rounded-full border border-gray-200 bg-white/85 text-gray-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;