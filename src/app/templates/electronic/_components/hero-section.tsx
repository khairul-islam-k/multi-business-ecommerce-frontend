"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import type { HeaderSlide } from "@/types/website/website";

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
  const hasMultipleSlides =
    totalSlides > 1;

  const activeHero =
    bannerSlide[activeIndex];

  const handleNext = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setActiveIndex(
      (previousIndex) =>
        (previousIndex + 1) %
        totalSlides,
    );
  };

  const handlePrev = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setActiveIndex(
      (previousIndex) =>
        previousIndex === 0
          ? totalSlides - 1
          : previousIndex - 1,
    );
  };

  useEffect(() => {
    if (
      totalSlides > 0 &&
      activeIndex >= totalSlides
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalSlides]);

  useEffect(() => {
    if (!hasMultipleSlides) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        setActiveIndex(
          (previousIndex) =>
            (previousIndex + 1) %
            totalSlides,
        );
      }, AUTO_SLIDE_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    hasMultipleSlides,
    totalSlides,
  ]);

  if (!activeHero) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[var(--store-bg-2)]">
      <div
        className="
          mx-auto grid h-[320px] w-full max-w-7xl
          grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
          sm:h-[380px]
          lg:h-[70vh]
          lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,1fr)_minmax(0,1.2fr)]
        "
      >
        {/* Empty left section on desktop */}
        <div
          aria-hidden="true"
          className="hidden lg:block"
        />

        {/* Text content section */}
        <div className="relative z-10 flex min-w-0 items-center px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="w-full min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHero.id}
                initial={{
                  opacity: 0,
                  x: -40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 40,
                }}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                }}
              >
                {activeHero.subTitle && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.1,
                      duration: 0.45,
                    }}
                    className="
                      mb-2 line-clamp-2
                      text-[8px] font-bold uppercase
                      tracking-[0.1em] text-[#f16d59]
                      sm:text-[11px]
                      sm:tracking-[0.2em]
                      lg:text-xs
                      lg:tracking-[0.25em]
                    "
                  >
                    {activeHero.subTitle}
                  </motion.p>
                )}

                {activeHero.title && (
                  <motion.h1
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.2,
                      duration: 0.45,
                    }}
                    className="
                      max-w-xl text-lg
                      leading-[1.15]
                      text-[var(--store-text-primary)]
                      sm:text-2xl
                      lg:text-4xl
                      xl:text-5xl
                    "
                  >
                    {activeHero.title}
                  </motion.h1>
                )}

                {activeHero.description && (
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
                      delay: 0.3,
                      duration: 0.45,
                    }}
                    className="
                      mt-2 line-clamp-3 max-w-lg
                      text-[9px] leading-4
                      text-[var(--store-muted)]
                      sm:mt-3 sm:text-xs
                      sm:leading-5
                      lg:line-clamp-none
                      lg:text-sm
                      lg:leading-6
                    "
                  >
                    {activeHero.description}
                  </motion.p>
                )}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.4,
                    duration: 0.45,
                  }}
                  className="mt-3 sm:mt-5"
                >
                  <Link
                    href={
                      "/store/products"
                    }
                    className="
                      inline-flex h-8 items-center
                      justify-center rounded-full
                      bg-[#f16d59] px-4
                      text-[10px] font-semibold
                      text-white transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:opacity-90
                      sm:h-10 sm:px-6
                      sm:text-xs
                      lg:h-11 lg:px-7
                      lg:text-sm
                    "
                  >
                    {activeHero.buttonText ||
                      "Shop Now"}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {hasMultipleSlides && (
              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5">
                {/* Slider dots */}
                <div className="flex items-center gap-1.5 sm:gap-2">
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
                        className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 ${
                          activeIndex === index
                            ? "w-5 bg-[#f16d59] sm:w-6"
                            : "w-1.5 bg-gray-300 hover:bg-gray-400 sm:w-2"
                        }`}
                      />
                    ),
                  )}
                </div>

                {/* Mobile slider buttons */}
                <div className="flex items-center gap-1 lg:hidden">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous slide"
                    className="grid size-7 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] shadow-sm transition hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next slide"
                    className="grid size-7 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] shadow-sm transition hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right image section */}
        <div className="relative h-full min-w-0 bg-[var(--store-bg-2)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHero.id}
              initial={{
                opacity: 0,
                x: 50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -50,
              }}
              transition={{
                duration: 0.65,
                ease: "easeOut",
              }}
              className="absolute inset-0"
            >
              <Image
                src={imageUrlSet(
                  activeHero.imageUrl,
                )}
                alt={
                  activeHero.title ||
                  "Hero banner"
                }
                fill
                priority={
                  activeIndex === 0
                }
                sizes="
                  (max-width: 639px) 50vw,
                  (max-width: 1023px) 50vw,
                  42vw
                "
                className="
                  object-contain object-center
                  p-1 sm:p-2
                  lg:object-cover lg:p-0
                "
              />

              {/* Overlay only on desktop */}
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[var(--store-bg-2)]/10 via-transparent to-transparent lg:block" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop arrows */}
      {hasMultipleSlides && (
        <div className="absolute bottom-4 right-6 z-20 hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="grid size-9 place-items-center rounded-full border border-gray-200 bg-white/85 text-gray-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
          >
            <ChevronLeft className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="grid size-9 place-items-center rounded-full border border-gray-200 bg-white/85 text-gray-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;