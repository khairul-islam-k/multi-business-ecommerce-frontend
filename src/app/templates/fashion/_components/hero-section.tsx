"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import banner_1 from "@/assets/fashion/banner/banner-1.png";
import banner_2 from "@/assets/fashion/banner/banner-2.png";
import banner_3 from "@/assets/fashion/banner/banner-3.png";

type HeroItem = {
    id: number;
    photo: StaticImageData;
    title: string;
    subTitle: string;
    description: string;
};

const heroData: HeroItem[] = [
    {
        id: 1,
        photo: banner_1,
        title: "Start Shopping Now!",
        subTitle: "Dive in and Explore",
        description:
            "Explore our curated collection and find the perfect pieces that speak to your style and needs. Begin your fashion journey today.",
    },
    {
        id: 2,
        photo: banner_2,
        title: "New Fashion Collection",
        subTitle: "Fresh Styles Arrived",
        description:
            "Discover trendy outfits, premium fabrics, and modern designs made for your everyday lifestyle.",
    },
    {
        id: 3,
        photo: banner_3,
        title: "Upgrade Your Wardrobe",
        subTitle: "Style Made Simple",
        description:
            "Find clothing that matches your personality, comfort, and confidence in every season.",
    },
];

const HeroSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const activeHero = heroData[activeIndex];

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % heroData.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? heroData.length - 1 : prev - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative overflow-hidden bg-[#fef8ee]">
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
                                className="max-w-xl text-4xl font-extrabold leading-tight text-gray-950 sm:text-5xl lg:text-6xl"
                            >
                                {activeHero.title}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="mt-6 max-w-lg text-base leading-8 text-gray-600"
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
                                    href="/products"
                                    className="inline-flex rounded-full bg-[#f16d59] px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f16d59]"
                                >
                                    Shop Now
                                </Link>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Dots */}
                    <div className="mt-10 flex items-center gap-3">
                        {heroData.map((item, index) => (
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
                                src={activeHero.photo}
                                alt={activeHero.title}
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
                    className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
                    aria-label="Previous slide"
                >
                    ←
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
                    aria-label="Next slide"
                >
                    →
                </button>
            </div>
        </section>
    );
};

export default HeroSection;