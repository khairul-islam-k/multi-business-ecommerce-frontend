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

import type { HeaderSlide } from "@/types/website/website";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import BannerSidebar from "./banner-sidebar";

type HeroSectionProps = {
    bannerSlide: HeaderSlide[];
};

const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 500;
const AUTO_SLIDE_DELAY = 5000;

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
     * Automatically change the banner.
     */
    useEffect(() => {
        if (totalSlides <= 1) return;

        const interval = window.setInterval(() => {
            handleNext();
        }, AUTO_SLIDE_DELAY);

        return () => {
            window.clearInterval(interval);
        };
    }, [handleNext, totalSlides]);

    /**
     * Reset the active index when the banner list changes.
     */
    useEffect(() => {
        if (totalSlides === 0) {
            setActiveIndex(0);
            return;
        }

        if (activeIndex >= totalSlides) {
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

    const handleIndicatorClick = (
        index: number,
    ) => {
        if (index === activeIndex) return;

        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
    };

    if (!activeHero || totalSlides === 0) {
        return null;
    }

    return (
        <div className="mt-4">

            <div className="grid
            gap-4
             lg:grid-cols-12 lg:h-[450px]">
                <aside className="lg:col-span-3 bg-[var(--store-card)]">
                    <BannerSidebar />
                </aside>

                {/* middle container with slide */}
                <main className="lg:col-span-9">

                    <section
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        aria-label="Banner slider"
                        className="relative h-[180px] w-full overflow-hidden bg-[var(--store-bg-2)] outline-none sm:h-[280px] md:h-[340px] lg:h-[450px] rounded-[5px]"
                    >
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
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: direction > 0 ? "-8%" : "8%",
                                }}
                                transition={{
                                    duration: 0.6,
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
                                className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
                            >
                                <Image
                                    src={imageUrlSet(activeHero.imageUrl)}
                                    alt={
                                        activeHero.title?.trim() ||
                                        `Banner ${activeIndex + 1}`
                                    }
                                    fill
                                    priority={activeIndex === 0}
                                    sizes="100vw"
                                    draggable={false}
                                    className="pointer-events-none select-none"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {totalSlides > 1 && (
                            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                                {bannerSlide.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            handleIndicatorClick(index)
                                        }
                                        aria-label={`Show banner ${index + 1}`}
                                        aria-current={
                                            activeIndex === index
                                                ? "true"
                                                : undefined
                                        }
                                        className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index
                                            ? "w-7 bg-[var(--store-primary)]"
                                            : "w-2 bg-white/70"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                </main>

            </div>
        </div>
    );
};

export default HeroSection;