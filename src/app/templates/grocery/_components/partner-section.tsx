"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

import { useProductBrands } from "@/lib/api/hooks/public-website";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";

type BrandStatus = "ACTIVE" | "INACTIVE";

type Brand = {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  status: BrandStatus;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const PartnerSection = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  const {
    data: brandsData,
    isLoading,
    isFetching,
  } = useProductBrands();

  /*
   * Prevent undefined errors while the API is loading.
   */
  const brands: Brand[] = brandsData ?? [];

  const totalSlides = Math.max(
    1,
    Math.ceil(brands.length / itemsPerView),
  );

  const hasMultipleSlides = totalSlides > 1;

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;

      if (width >= 1280) {
        setItemsPerView(6);
      } else if (width >= 1024) {
        setItemsPerView(4);
      } else if (width >= 640) {
        setItemsPerView(3);
      } else {
        setItemsPerView(2);
      }
    };

    updateItemsPerView();

    window.addEventListener("resize", updateItemsPerView);

    return () => {
      window.removeEventListener(
        "resize",
        updateItemsPerView,
      );
    };
  }, []);

  useEffect(() => {
    if (activeSlide >= totalSlides) {
      setActiveSlide(Math.max(totalSlides - 1, 0));
    }
  }, [activeSlide, totalSlides]);

  const scrollToSlide = (slideIndex: number) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const safeIndex = Math.min(
      Math.max(slideIndex, 0),
      totalSlides - 1,
    );

    slider.scrollTo({
      left: safeIndex * slider.clientWidth,
      behavior: "smooth",
    });

    setActiveSlide(safeIndex);
  };

  const handleNext = () => {
    const nextSlide =
      activeSlide >= totalSlides - 1
        ? 0
        : activeSlide + 1;

    scrollToSlide(nextSlide);
  };

  const handlePrevious = () => {
    const previousSlide =
      activeSlide <= 0
        ? totalSlides - 1
        : activeSlide - 1;

    scrollToSlide(previousSlide);
  };

  const handleSliderScroll = () => {
    const slider = sliderRef.current;

    if (!slider || slider.clientWidth === 0) {
      return;
    }

    const currentSlide = Math.round(
      slider.scrollLeft / slider.clientWidth,
    );

    setActiveSlide(
      Math.min(
        Math.max(currentSlide, 0),
        totalSlides - 1,
      ),
    );
  };

  return (
    <section className="bg-[var(--store-bg-1)] my-4 sm:my-5 md:my-7 lg:my-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-5 sm:mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--store-text)] sm:text-3xl">
              Popular Brands
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--store-muted)] sm:text-base">
              Browse products from our popular brands.
            </p>
          </div>

          {/* Desktop navigation */}
          {hasMultipleSlides && (
            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous brands"
                className="grid size-10 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next brands"
                className="grid size-10 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {isLoading || isFetching ? (
          /* Loading skeleton */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-xl border border-[var(--store-border)] bg-[var(--store-card)] p-4"
                >
                  <div className="mx-auto h-14 w-24 rounded-lg bg-[var(--store-bg-3)]" />

                  <div className="mx-auto mt-4 h-4 w-3/4 rounded bg-[var(--store-bg-3)]" />
                </div>
              ),
            )}
          </div>
        ) : brands.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-[var(--store-border)] bg-[var(--store-card)] px-6 py-12 text-center">
            <Package className="mx-auto size-10 text-[var(--store-muted)]" />

            <h3 className="mt-4 text-lg font-semibold text-[var(--store-text)]">
              No brands found
            </h3>

            <p className="mt-2 text-sm text-[var(--store-muted)]">
              Product brands are not available right now.
            </p>
          </div>
        ) : (
          <>
            {/* Brand slider */}
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              className="grid snap-x snap-mandatory grid-flow-col auto-cols-[calc((100%-0.75rem)/2)] gap-3 overflow-x-auto scroll-smooth pb-3 sm:auto-cols-[calc((100%-2rem)/3)] lg:auto-cols-[calc((100%-3rem)/4)] xl:auto-cols-[calc((100%-5rem)/6)] [&::-webkit-scrollbar]:hidden"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/store/products?brandId=${brand.id}`}
                  className="group flex min-w-0 snap-start flex-col items-center justify-center rounded-xl border border-[var(--store-border)] bg-[var(--store-card)] px-3 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--store-primary)] hover:shadow-lg"
                >
                  {/* Brand logo */}
                  <div className="relative h-14 w-16 overflow-hidden rounded-lg">
                    <Image
                      src={imageUrlSet(brand.logoUrl)}
                      alt={brand.name}
                      fill
                      sizes="96px"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  {/* Brand name */}
                  <h3 className="mt-4 line-clamp-2 text-sm font-semibold leading-5 text-[var(--store-text)] transition group-hover:text-[var(--store-primary)]">
                    {brand.name}
                  </h3>
                </Link>
              ))}
            </div>

            {/* Mobile navigation */}
            {hasMultipleSlides && (
              <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label="Previous brands"
                  className="grid size-10 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)]"
                >
                  <ChevronLeft className="size-5" />
                </button>

                <span className="min-w-16 text-center text-sm font-medium text-[var(--store-muted)]">
                  {activeSlide + 1} / {totalSlides}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next brands"
                  className="grid size-10 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)]"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}

            {/* Slider dots */}
            {hasMultipleSlides && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({
                  length: totalSlides,
                }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollToSlide(index)}
                    aria-label={`Go to brand slide ${
                      index + 1
                    }`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeSlide === index
                        ? "w-8 bg-[var(--store-primary)]"
                        : "w-2.5 bg-[var(--store-muted)]/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PartnerSection;