"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { HeaderSlide } from "@/types/website/website";
import Image from "next/image";
import Link from "next/link";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";

const HeroSection = ({bannerSlide}:{bannerSlide: HeaderSlide[]}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const activeHero = bannerSlide[activeIndex];

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % bannerSlide.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? bannerSlide.length - 1 : prev - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative overflow-hidden bg-[var(--store-bg-2)]">
            <div className="mx-auto grid min-h-[620px] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
                {/* Left Text Content */}
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeHero.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#f16d59]"
                            >
                                {activeHero.subTitle}
                            </motion.p>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
                            >
                                {activeHero.title}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="mt-6 max-w-lg text-base leading-8"
                            >
                                {activeHero.description}
                            </motion.p>

                            {/* Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="mt-8"
                            >
                                <Link
                                    href="/store/products"
                                    className="inline-flex rounded-full bg-[#f16d59] px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f16d59]"
                                >
                                    Shop Now
                                </Link>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Dots */}
                    <div className="mt-10 flex items-center gap-3">
                        {bannerSlide.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === index
                                        ? "w-8 bg-[#f16d59]"
                                        : "w-2.5 bg-gray-300 hover:bg-gray-400"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Image */}
                <div className="relative min-h-[420px] lg:min-h-[560px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeHero.id}
                            initial={{ opacity: 0, x: 80, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -80, scale: 0.96 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={imageUrlSet(activeHero.imageUrl)}
                                alt={activeHero?.title ?? ''}
                                fill
                                priority={activeIndex === 0}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-contain"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Arrow Buttons */}
            <div className="absolute bottom-8 right-6 hidden items-center gap-3 lg:flex">
                <button
                    type="button"
                    onClick={handlePrev}
                    className="grid h-11 w-11 place-items-center rounded-full border border-gray-20 text-xl shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
                    aria-label="Previous slide"
                >
                    ←
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-xl shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
                    aria-label="Next slide"
                >
                    →
                </button>
            </div>
        </section>
    );
};

export default HeroSection;