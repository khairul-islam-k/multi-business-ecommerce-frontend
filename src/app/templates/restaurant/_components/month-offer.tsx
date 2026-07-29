"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import type { BestOfferImage } from "@/types/website/website";

type MonthOfferProps = {
    monthlyOffer?: BestOfferImage[];
};

type ValidOffer = BestOfferImage & {
    slug: string;
    banner: string;
};

const AUTO_SLIDE_DELAY = 4000;

const isValidOffer = (
    offer: BestOfferImage,
): offer is ValidOffer => {
    return (
        typeof offer.slug === "string" &&
        offer.slug.trim().length > 0 &&
        typeof offer.banner === "string" &&
        offer.banner.trim().length > 0
    );
};

const MonthOffer = ({
    monthlyOffer = [],
}: MonthOfferProps) => {
    const [currentSlide, setCurrentSlide] =
        useState(0);

    const [isHovered, setIsHovered] =
        useState(false);

    const activeOffers = useMemo(
        () => monthlyOffer.filter(isValidOffer),
        [monthlyOffer],
    );

    const totalSlides = activeOffers.length;
    const hasMultipleSlides = totalSlides > 1;

    useEffect(() => {
        setCurrentSlide(0);
    }, [activeOffers.length]);

    useEffect(() => {
        if (!hasMultipleSlides || isHovered) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setCurrentSlide((previousSlide) =>
                previousSlide >= totalSlides - 1
                    ? 0
                    : previousSlide + 1,
            );
        }, AUTO_SLIDE_DELAY);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [
        hasMultipleSlides,
        isHovered,
        totalSlides,
    ]);

    const handlePreviousSlide = () => {
        if (!hasMultipleSlides) {
            return;
        }

        setCurrentSlide((previousSlide) =>
            previousSlide <= 0
                ? totalSlides - 1
                : previousSlide - 1,
        );
    };

    const handleNextSlide = () => {
        if (!hasMultipleSlides) {
            return;
        }

        setCurrentSlide((previousSlide) =>
            previousSlide >= totalSlides - 1
                ? 0
                : previousSlide + 1,
        );
    };

    if (activeOffers.length === 0) {
        return null;
    }

    return (
        <section className="w-full py-5 sm:py-8">
            <div className="mx-auto w-full">
                <div
                    className="group/slider relative overflow-hidden border border-gray-200 bg-[#ff0000] shadow-sm dark:border-white/10 dark:bg-gray-950"
                    onMouseEnter={() =>
                        setIsHovered(true)
                    }
                    onMouseLeave={() =>
                        setIsHovered(false)
                    }
                >
                    {/* Slides */}
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(-${currentSlide * 100
                                }%)`,
                        }}
                    >
                        {activeOffers.map(
                            (offer, slideIndex) => (
                                <div
                                    key={`${offer.slug}-${slideIndex}`}
                                    className="min-w-full"
                                >
                                    <div className="grid min-h-[440px] grid-cols-1 md:min-h-[480px] md:grid-cols-2 lg:min-h-[520px]">
                                        {/* Left image */}
                                        <div className="relative rounded-xl h-[220px] w-full overflow-hidden sm:h-[280px] md:h-[320px] lg:h-[360px] my-auto mx-auto lg:w-[300px]">
                                            <Image
                                                src={imageUrlSet(offer.banner)}
                                                alt={
                                                    offer.title ||
                                                    `${offer.slug} offer`
                                                }
                                                fill
                                                priority={slideIndex === 0}
                                                sizes="(max-width: 767px) 100vw, 40vw"
                                                className="transition-transform duration-700 group-hover/slider:scale-105"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/5" />

                                            {hasMultipleSlides && (
                                                <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm md:hidden">
                                                    {slideIndex + 1} / {totalSlides}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right content */}
                                        <div className="relative flex items-center px-6 py-10 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 sm:px-10 sm:py-12
                                        text-white lg:px-16">
                                            {/* Decorative background */}
                                            <div className="pointer-events-none absolute right-0 top-0 size-48 rounded-full bg-[var(--store-primary)]/5 blur-3xl" />

                                            <div className="relative z-10 max-w-xl">
                                                <span className="mb-4 inline-flex rounded-full bg-[var(--store-primary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
                                                    Monthly special offer
                                                </span>

                                                {offer.title && (
                                                    <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                                        {offer.title}
                                                    </h2>
                                                )}

                                                {offer.subTitle && (
                                                    <p className="mt-5 max-w-lg text-sm leading-7">
                                                        {offer.subTitle}
                                                    </p>
                                                )}

                                                <Link
                                                    href={`/store/products/details/${offer.slug}`}
                                                    className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--store-primary)] px-7 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl sm:h-12 sm:px-8"
                                                >
                                                    Shop Now
                                                    <ChevronRight className="size-4" />
                                                </Link>

                                                {/* Desktop dots */}
                                                {hasMultipleSlides && (
                                                    <div className="mt-9 hidden items-center gap-2 md:flex">
                                                        {activeOffers.map(
                                                            (
                                                                dotOffer,
                                                                dotIndex,
                                                            ) => (
                                                                <button
                                                                    key={`${dotOffer.slug}-${dotIndex}-dot`}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setCurrentSlide(
                                                                            dotIndex,
                                                                        )
                                                                    }
                                                                    aria-label={`Go to offer slide ${dotIndex + 1
                                                                        }`}
                                                                    aria-current={
                                                                        currentSlide ===
                                                                            dotIndex
                                                                            ? "true"
                                                                            : undefined
                                                                    }
                                                                    className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${currentSlide ===
                                                                            dotIndex
                                                                            ? "w-8 bg-[var(--store-primary)]"
                                                                            : "w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                                        }`}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>

                    {/* Previous button */}
                    {hasMultipleSlides && (
                        <button
                            type="button"
                            onClick={handlePreviousSlide}
                            aria-label="Previous offer"
                            className="absolute left-3 top-[120px] z-20 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-white sm:left-5 sm:top-[170px] md:left-4 md:top-1/2 dark:bg-gray-900/90 dark:text-white dark:hover:bg-gray-900"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                    )}

                    {/* Next button */}
                    {hasMultipleSlides && (
                        <button
                            type="button"
                            onClick={handleNextSlide}
                            aria-label="Next offer"
                            className="absolute right-3 top-[120px] z-20 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-white sm:right-5 sm:top-[170px] md:right-4 md:top-1/2 dark:bg-gray-900/90 dark:text-white dark:hover:bg-gray-900"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    )}

                    {/* Mobile navigation dots */}
                    {hasMultipleSlides && (
                        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:hidden">
                            {activeOffers.map(
                                (offer, slideIndex) => (
                                    <button
                                        key={`${offer.slug}-${slideIndex}-mobile-dot`}
                                        type="button"
                                        onClick={() =>
                                            setCurrentSlide(slideIndex)
                                        }
                                        aria-label={`Go to offer slide ${slideIndex + 1
                                            }`}
                                        aria-current={
                                            currentSlide === slideIndex
                                                ? "true"
                                                : undefined
                                        }
                                        className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${currentSlide === slideIndex
                                                ? "w-7 bg-[var(--store-primary)]"
                                                : "w-2 bg-gray-300 dark:bg-gray-700"
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

export default MonthOffer;