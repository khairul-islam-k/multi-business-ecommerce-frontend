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
    () =>
      monthlyOffer.filter(isValidOffer),
    [monthlyOffer],
  );

  const totalSlides = activeOffers.length;
  const hasMultipleSlides =
    totalSlides > 1;

  useEffect(() => {
    setCurrentSlide(0);
  }, [activeOffers.length]);

  useEffect(() => {
    if (
      !hasMultipleSlides ||
      isHovered
    ) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        setCurrentSlide(
          (previousSlide) =>
            previousSlide >=
            totalSlides - 1
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

    setCurrentSlide(
      (previousSlide) =>
        previousSlide <= 0
          ? totalSlides - 1
          : previousSlide - 1,
    );
  };

  const handleNextSlide = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setCurrentSlide(
      (previousSlide) =>
        previousSlide >= totalSlides - 1
          ? 0
          : previousSlide + 1,
    );
  };

  if (activeOffers.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[var(--store-bg-1)]">
      <div className="mx-auto w-full">
        <div
          className="group/slider relative overflow-hidden"
          onMouseEnter={() =>
            setIsHovered(true)
          }
          onMouseLeave={() =>
            setIsHovered(false)
          }
        >
          {/* Sliding cards */}
          <div
            className="flex items-stretch transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${
                currentSlide * 100
              }%)`,
            }}
          >
            {activeOffers.map(
              (offer, slideIndex) => (
                <div
                  key={`${offer.slug}-${slideIndex}`}
                  className="min-w-full self-stretch"
                >
                  <article className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-[var(--store-border)] bg-[var(--store-card)] p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:min-h-[700px] sm:p-6 lg:min-h-[740px]">
                    {/* Section title */}
                    <div className="mb-5 text-center">
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f16d59]">
                        Limited Time
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-[var(--store-text-primary)]">
                        Special Offer
                      </h3>
                    </div>

                    {/* Offer image */}
                    <Link
                      href={`/store/products/details/${offer.slug}`}
                      className="
                        relative mx-auto block
                        h-[260px] w-[88%]
                        max-w-[320px]
                        overflow-hidden rounded-xl
                        bg-[var(--store-bg-3)]
                        sm:h-[330px]
                        sm:max-w-[380px]
                        lg:h-[370px]
                        lg:max-w-[420px]
                      "
                    >
                      <Image
                        src={imageUrlSet(
                          offer.banner,
                        )}
                        alt={
                          offer.title ||
                          `${offer.slug} offer`
                        }
                        fill
                        priority={
                          slideIndex === 0
                        }
                        sizes="
                          (max-width: 640px) 88vw,
                          (max-width: 1024px) 380px,
                          420px
                        "
                        className="object-contain p-2 transition-transform duration-700 group-hover/slider:scale-105"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                      <span className="absolute left-3 top-3 rounded-full bg-[#f16d59] px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                        Special Offer
                      </span>
                    </Link>

                    {/* Text content */}
                    <div className="flex flex-1 flex-col px-1 pb-1 pt-6 text-center sm:px-3">
                      {offer.title && (
                        <h2 className="line-clamp-2 text-xl font-bold leading-tight text-[var(--store-text-primary)] sm:text-2xl">
                          {offer.title}
                        </h2>
                      )}

                      {offer.subTitle && (
                        <p className="mx-auto mt-3 line-clamp-3 max-w-md text-sm leading-6 text-[var(--store-muted)]">
                          {offer.subTitle}
                        </p>
                      )}

                      {/* Button remains at card bottom */}
                      <div className="mt-auto pt-6">
                        <Link
                          href={`/store/products/details/${offer.slug}`}
                          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#f16d59] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-950"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </article>
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
              className="absolute left-3 top-[245px] z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/40 text-white shadow-lg backdrop-blur-sm transition hover:scale-110 hover:bg-[#f16d59] sm:left-4 sm:top-[285px] sm:size-10 lg:top-[315px]"
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
              className="absolute right-3 top-[245px] z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/40 text-white shadow-lg backdrop-blur-sm transition hover:scale-110 hover:bg-[#f16d59] sm:right-4 sm:top-[285px] sm:size-10 lg:top-[315px]"
            >
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation dots */}
        {hasMultipleSlides && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {activeOffers.map(
              (offer, slideIndex) => (
                <button
                  key={`${offer.slug}-dot`}
                  type="button"
                  onClick={() =>
                    setCurrentSlide(
                      slideIndex,
                    )
                  }
                  aria-label={`Go to offer slide ${
                    slideIndex + 1
                  }`}
                  aria-current={
                    currentSlide ===
                    slideIndex
                      ? "true"
                      : undefined
                  }
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide ===
                    slideIndex
                      ? "w-8 bg-[#f16d59]"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MonthOffer;