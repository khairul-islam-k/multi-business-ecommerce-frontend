"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChefHat,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { ChefItem } from "@/types/website/website";

type OurChefProps = {
  ourChef: ChefItem[];
};

const CHEFS_PER_SLIDE = 4;
const AUTO_SLIDE_DELAY = 5000;

const OurChef = ({
  ourChef,
}: OurChefProps) => {
  const [activeSlide, setActiveSlide] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  const chefSlides = useMemo(() => {
    const slides: ChefItem[][] = [];

    for (
      let index = 0;
      index < ourChef.length;
      index += CHEFS_PER_SLIDE
    ) {
      slides.push(
        ourChef.slice(
          index,
          index + CHEFS_PER_SLIDE,
        ),
      );
    }

    return slides;
  }, [ourChef]);

  const totalSlides = chefSlides.length;

  useEffect(() => {
    if (
      totalSlides <= 1 ||
      isPaused
    ) {
      return;
    }

    const interval = window.setInterval(
      () => {
        setActiveSlide(
          (previous) =>
            (previous + 1) % totalSlides,
        );
      },
      AUTO_SLIDE_DELAY,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused, totalSlides]);

  useEffect(() => {
    if (
      activeSlide >= totalSlides &&
      totalSlides > 0
    ) {
      setActiveSlide(totalSlides - 1);
    }
  }, [activeSlide, totalSlides]);

  const handlePrevious = () => {
    setActiveSlide(
      (previous) =>
        previous === 0
          ? totalSlides - 1
          : previous - 1,
    );
  };

  const handleNext = () => {
    setActiveSlide(
      (previous) =>
        (previous + 1) % totalSlides,
    );
  };

  if (!ourChef?.length) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-[var(--store-bg-1)] px-4 sm:px-6 pb-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
             
            </div>

            <h2 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl lg:text-5xl dark:text-white">
              Our Professional Chefs
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base dark:text-gray-300">
              Meet the talented chefs who
              prepare every dish with fresh
              ingredients, creativity and
              passion.
            </p>
          </div>

          {/* Desktop navigation */}
          {totalSlides > 1 && (
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous chefs"
                className="grid size-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next chefs"
                className="grid size-11 place-items-center rounded-full bg-[#f16d59] text-white shadow-lg shadow-[#f16d59]/20 transition-all duration-300 hover:bg-gray-950"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() =>
            setIsPaused(true)
          }
          onMouseLeave={() =>
            setIsPaused(false)
          }
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${activeSlide * 100}%)`,
              }}
            >
              {chefSlides.map(
                (slide, slideIndex) => (
                  <div
                    key={`chef-slide-${slideIndex}`}
                    className="w-full shrink-0"
                  >
                    <div className="grid min-h-[430px] grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-7">
                      {slide.map(
                        (
                          chef,
                          chefIndex,
                        ) => {
                          const isLowerCard =
                            chefIndex % 2 !==
                            0;

                          return (
                            <article
                              key={`${chef.name}-${chefIndex}`}
                              className={[
                                "group relative h-fit overflow-hidden rounded-[24px]",
                                "border border-black/5 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]",
                                "transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.14)]",
                                "dark:border-white/10 dark:bg-zinc-900",
                                isLowerCard
                                  ? "mt-10 sm:mt-14 lg:mt-20"
                                  : "mt-0",
                              ].join(" ")}
                            >
                              {/* Chef image */}
                              <div className="relative h-[250px] overflow-hidden sm:h-[320px] lg:h-[360px]">
                                {chef.image ? (
                                  <Image
                                    src={imageUrlSet(
                                      chef.image,
                                    )}
                                    alt={
                                      chef.name ||
                                      "Restaurant chef"
                                    }
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-zinc-800">
                                    <ChefHat className="size-12 text-gray-400" />
                                  </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                                {/* Decorative label */}
                                <div className="absolute left-4 top-4 grid size-10 place-items-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md">
                                  <ChefHat className="size-5" />
                                </div>

                                {/* Chef name */}
                                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb09f] sm:text-xs">
                                    Professional Chef
                                  </p>

                                  <h3 className="line-clamp-2 text-base font-bold text-white sm:text-xl">
                                    {chef.name}
                                  </h3>
                                </div>
                              </div>
                            </article>
                          );
                        },
                      )}

                      {/* Empty spaces when the last slide has fewer than four chefs */}
                      {Array.from({
                        length:
                          CHEFS_PER_SLIDE -
                          slide.length,
                      }).map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="hidden lg:block"
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Mobile navigation */}
          {totalSlides > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3 sm:hidden">
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous chefs"
                className="grid size-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next chefs"
                className="grid size-10 place-items-center rounded-full bg-[#f16d59] text-white"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}

          {/* Slider dots */}
          {totalSlides > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {chefSlides.map(
                (_, index) => (
                  <button
                    key={`dot-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveSlide(index)
                    }
                    aria-label={`Go to chef slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeSlide === index
                        ? "w-8 bg-[#f16d59]"
                        : "w-2.5 bg-gray-300 hover:bg-[#f16d59]/60 dark:bg-gray-700"
                    }`}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OurChef;