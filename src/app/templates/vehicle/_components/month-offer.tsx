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
    <section className="w-full overflow-hidden my-6">
      {/* Left and right page padding */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-5">
        <div
          className="group/slider relative w-full overflow-hidden"
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
              transform: `translateX(-${
                currentSlide * 100
              }%)`,
            }}
          >
            {activeOffers.map(
              (offer, slideIndex) => (
                <div
                  key={`${offer.slug}-${slideIndex}`}
                  className="relative min-w-full rounded-xl overflow-hidden"
                >
                  {/* Reduced banner height */}
                  <div className="relative h-[220px] w-full sm:h-[400px] lg:h-[400px]">
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
                      sizes="100vw"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/45" />

                    {/* Center content */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center px-12 text-center sm:px-16 lg:px-24">
                      <div className="mx-auto max-w-2xl text-white">
                        {offer.title && (
                          <h2 className="text-2xl font-bold leading-tight drop-shadow-md sm:text-4xl lg:text-5xl">
                            {offer.title}
                          </h2>
                        )}

                        {offer.subTitle && (
                          <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-white/90 drop-shadow-sm sm:text-base sm:leading-7">
                            {offer.subTitle}
                          </p>
                        )}

                        <Link
                          href={`/store/products/details/${offer.slug}`}
                          className="mt-5 inline-flex h-10 items-center justify-center bg-white px-6 text-sm font-semibold text-gray-950 shadow-lg transition hover:bg-[var(--store-primary)] hover:text-white sm:h-11 sm:px-7 rounded-lg"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Previous arrow */}
          {hasMultipleSlides && (
            <button
              type="button"
              onClick={handlePreviousSlide}
              aria-label="Previous offer"
              className="absolute left-3 top-1/2 z-20 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:scale-110 hover:bg-black/80 sm:left-5 sm:size-11"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}

          {/* Next arrow */}
          {hasMultipleSlides && (
            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next offer"
              className="absolute right-3 top-1/2 z-20 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:scale-110 hover:bg-black/80 sm:right-5 sm:size-11"
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          {/* Slide number */}
          {hasMultipleSlides && (
            <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {currentSlide + 1} /{" "}
              {totalSlides}
            </div>
          )}

          {/* Navigation dots */}
          {hasMultipleSlides && (
            <div className="absolute bottom-4 right-4 z-20 hidden items-center gap-2 sm:flex">
              {activeOffers.map(
                (offer, slideIndex) => (
                  <button
                    key={`${offer.slug}-dot`}
                    type="button"
                    onClick={() =>
                      setCurrentSlide(slideIndex)
                    }
                    aria-label={`Go to offer slide ${
                      slideIndex + 1
                    }`}
                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                      currentSlide === slideIndex
                        ? "w-7 bg-white"
                        : "w-2 bg-white/45 hover:bg-white/75"
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