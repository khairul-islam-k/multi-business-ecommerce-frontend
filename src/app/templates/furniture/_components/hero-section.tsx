"use client";

import {
  AnimatePresence,
  motion,
  type PanInfo,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";

import type { HeaderSlide } from "@/types/website/website";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";

type HeroSectionProps = {
  bannerSlide: HeaderSlide[];
};

const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 500;

const HeroSection = ({
  bannerSlide,
}: HeroSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalSlides = bannerSlide?.length ?? 0;
  const activeHero = bannerSlide?.[activeIndex];

  const handleNext = useCallback(() => {
    if (totalSlides <= 1) return;

    setDirection(1);

    setActiveIndex(
      (previous) => (previous + 1) % totalSlides,
    );
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    if (totalSlides <= 1) return;

    setDirection(-1);

    setActiveIndex((previous) =>
      previous === 0
        ? totalSlides - 1
        : previous - 1,
    );
  }, [totalSlides]);

  /**
   * Automatically change the slide every five seconds.
   */
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = window.setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [handleNext, totalSlides]);

  /**
   * Keep the selected index valid when slides change.
   */
  useEffect(() => {
    if (
      activeIndex >= totalSlides &&
      totalSlides > 0
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalSlides]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipedLeft =
      info.offset.x < -SWIPE_DISTANCE ||
      info.velocity.x < -SWIPE_VELOCITY;

    const swipedRight =
      info.offset.x > SWIPE_DISTANCE ||
      info.velocity.x > SWIPE_VELOCITY;

    if (swipedLeft) {
      handleNext();
      return;
    }

    if (swipedRight) {
      handlePrev();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
  ) => {
    if (event.key === "ArrowLeft") {
      handlePrev();
    }

    if (event.key === "ArrowRight") {
      handleNext();
    }
  };

  if (!activeHero || totalSlides === 0) {
    return null;
  }

  return (
    <section
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Hero banner slider"
      className="relative h-[280px] w-full overflow-hidden bg-[var(--store-bg-2)] outline-none sm:h-[340px] lg:h-[400px]"
    >
      {/* Draggable banner image */}
      <AnimatePresence
        initial={false}
        mode="popLayout"
        custom={direction}
      >
        <motion.div
          key={activeHero.id}
          custom={direction}
          initial={{
            opacity: 0,
            x: direction > 0 ? "8%" : "-8%",
            scale: 1.03,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            x: direction > 0 ? "-8%" : "8%",
            scale: 1.02,
          }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          drag={totalSlides > 1 ? "x" : false}
          dragConstraints={{
            left: 0,
            right: 0,
          }}
          dragElastic={0.18}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        >
          <Image
            src={imageUrlSet(activeHero.imageUrl)}
            alt={
              activeHero.title || "Banner image"
            }
            fill
            priority={activeIndex === 0}
            sizes="100vw"
            draggable={false}
            className="pointer-events-none select-none object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Centered dark overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/45" />

      {/* Centered banner content */}
      <div className="pointer-events-none relative z-20 mx-auto flex h-full w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <AnimatePresence
          initial={false}
          mode="wait"
        >
          <motion.div
            key={activeHero.id}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -25,
            }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
            }}
            className="mx-auto w-full max-w-3xl text-center text-white"
          >
            {activeHero.subTitle && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1,
                  duration: 0.4,
                }}
                className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--store-primary)] sm:text-sm"
              >
                {activeHero.subTitle}
              </motion.p>
            )}

            {activeHero.title && (
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                }}
                className="mx-auto max-w-3xl text-2xl font-extrabold leading-tight sm:text-3xl lg:text-5xl"
              >
                {activeHero.title}
              </motion.h1>
            )}

            {activeHero.description && (
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
                  delay: 0.3,
                  duration: 0.5,
                }}
                className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7"
              >
                {activeHero.description}
              </motion.p>
            )}

            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.5,
              }}
              className="pointer-events-auto mt-5 flex justify-center"
            >
              <Link
                href="/store/products"
                className="inline-flex items-center justify-center bg-[var(--store-light)] px-6 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Shop Now
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider indicators */}
      {totalSlides > 1 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
        >
          {bannerSlide.map((item, index) => (
            <span
              key={item.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-7 bg-[var(--store-primary)]"
                  : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;