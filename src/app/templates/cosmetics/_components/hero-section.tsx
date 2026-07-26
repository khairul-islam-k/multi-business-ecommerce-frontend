"use client";

import {
    AnimatePresence,
    motion,
    PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { HeaderSlide } from "@/types/website/website";
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
            previous === 0 ? totalSlides - 1 : previous - 1,
        );
    }, [totalSlides]);

    /*
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

    /*
     * Keep the active index valid if the slide list changes.
     */
    useEffect(() => {
        if (activeIndex >= totalSlides && totalSlides > 0) {
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
            className="relative h-[50vh] min-h-[360px] w-full overflow-hidden bg-[var(--store-bg-2)] outline-none sm:min-h-[420px] lg:min-h-[500px]"
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
                        alt={activeHero.title || "Banner image"}
                        fill
                        priority={activeIndex === 0}
                        sizes="100vw"
                        draggable={false}
                        className="pointer-events-none select-none object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Dark image overlay */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

            {/* Banner content */}
            <div className="pointer-events-none relative z-20 mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                <AnimatePresence
                    initial={false}
                    mode="wait"
                >
                    <motion.div
                        key={activeHero.id}
                        initial={{
                            opacity: 0,
                            x: direction > 0 ? -35 : 35,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            x: direction > 0 ? 35 : -35,
                        }}
                        transition={{
                            duration: 0.55,
                            ease: "easeOut",
                        }}
                        className="max-w-2xl text-white"
                    >
                        {activeHero.subTitle && (
                            <motion.p
                                initial={{
                                    opacity: 0,
                                    y: 15,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 0.1,
                                    duration: 0.4,
                                }}
                                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--store-primary)] sm:text-sm"
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
                                    duration: 0.5,
                                }}
                                className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-6xl"
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
                                    duration: 0.5,
                                }}
                                className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base"
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
                                duration: 0.5,
                            }}
                            className="pointer-events-auto mt-6"
                        >
                            <Link
                                href="/store/products"
                                className="inline-flex items-center justify-center rounded-full bg-[var(--store-primary)] px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
                            >
                                Shop Now
                            </Link>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Passive slide indicators—no buttons */}
            {totalSlides > 1 && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
                >
                    {bannerSlide.map((item, index) => (
                        <span
                            key={item.id}
                            className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === index
                                    ? "w-8 bg-[var(--store-primary)]"
                                    : "w-2.5 bg-white/60"
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSection;