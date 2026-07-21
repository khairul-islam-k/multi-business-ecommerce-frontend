"use client";

import React, {
  useEffect,
  useMemo,
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

import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import type {
  StorefrontCategory,
  StorefrontCategoryTreeItem,
} from "@/types/template/public-website";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";

function flattenCategoryTree(
  tree: StorefrontCategoryTreeItem[],
): StorefrontCategory[] {
  const result: StorefrontCategory[] = [];

  const walk = (items: StorefrontCategoryTreeItem[]) => {
    items.forEach((item) => {
      if (item.category) {
        result.push(item.category);
      }

      if (item.children?.length) {
        walk(item.children);
      }
    });
  };

  walk(tree);

  return result;
}

function removeDuplicateCategories(
  categories: StorefrontCategory[],
): StorefrontCategory[] {
  return Array.from(
    new Map(
      categories.map((category) => [
        category.id,
        category,
      ]),
    ).values(),
  );
}

const CategoriesSection = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  const {
    data: categoriesData,
    isLoading,
    isFetching,
  } = useProductCategoryQuery();

  const categories = useMemo(() => {
    const flattenedCategories = flattenCategoryTree(
      categoriesData ?? [],
    );

    return removeDuplicateCategories(
      flattenedCategories,
    );
  }, [categoriesData]);

  const totalSlides = Math.max(
    1,
    Math.ceil(categories.length / itemsPerView),
  );

  const hasMultipleSlides = totalSlides > 1;

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;

      if (width >= 1280) {
        // Show 6 cards on XL desktop
        setItemsPerView(6);
      } else if (width >= 1024) {
        setItemsPerView(3);
      } else if (width >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();

    window.addEventListener(
      "resize",
      updateItemsPerView,
    );

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
        {/* Section header */}
        <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
          <div>

            <h2 className="mt-3 font-bold text-[var(--store-text)] text-2xl">
              Our Categories
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--store-muted)] sm:text-base">
              Browse our grocery categories and find
              products that match your needs.
            </p>
          </div>

          {/* Desktop navigation */}
          {hasMultipleSlides && (
            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous categories"
                className="grid size-11 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next categories"
                className="grid size-11 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {isLoading || isFetching ? (
          /* Loading cards */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-[var(--store-border)] bg-[var(--store-card)]"
                >
                  <div className="mx-auto mt-4 size-20 animate-pulse rounded-lg bg-[var(--store-bg-3)]" />

                  <div className="space-y-3 p-4">
                    <div className="mx-auto h-5 w-3/4 animate-pulse rounded bg-[var(--store-bg-3)]" />

                    <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-[var(--store-bg-3)]" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : categories.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-[var(--store-border)] bg-[var(--store-card)] px-6 py-14 text-center">
            <Package className="mx-auto size-10 text-[var(--store-muted)]" />

            <h3 className="mt-4 text-lg font-semibold text-[var(--store-text)]">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-[var(--store-muted)]">
              Product categories are not available right
              now.
            </p>
          </div>
        ) : (
          <>
            {/* Horizontal category slider */}
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              className="grid snap-x snap-mandatory grid-flow-col auto-cols-[88%] gap-4 overflow-x-auto scroll-smooth pb-3 sm:auto-cols-[calc((100%-1rem)/2)] lg:auto-cols-[calc((100%-2rem)/3)] xl:auto-cols-[calc((100%-5rem)/6)] [&::-webkit-scrollbar]:hidden"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/store/products?categoryId=${category.id}`}
                  className="group flex min-w-0 snap-start flex-col overflow-hidden rounded-2xl border border-[var(--store-border)] bg-[var(--store-card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--store-primary)] hover:shadow-lg"
                >
                  {/* Top image */}
                  <div className="relative mx-auto mt-4 w-[80px] h-[50px] shrink-0 overflow-hidden rounded-lg bg-[var(--store-card)]">
                    <Image
                      src={imageUrlSet(
                        category.imageUrl,
                      )}
                      alt={category.name}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>

                  {/* Bottom text */}
                  <div className="flex flex-1 flex-col p-4 text-center">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--store-text)] transition group-hover:text-[var(--store-primary)]">
                      {category.name}
                    </h3>

                    <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[var(--store-muted)]">
                      <Package className="size-4 shrink-0" />

                      <span>
                        {category._count?.products ?? 0}{" "}
                        Products
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile navigation */}
            {hasMultipleSlides && (
              <div className="mt-7 flex items-center justify-center gap-3 sm:hidden">
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label="Previous categories"
                  className="grid size-11 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
                >
                  <ChevronLeft className="size-5" />
                </button>

                <span className="min-w-16 text-center text-sm font-medium text-[var(--store-muted)]">
                  {activeSlide + 1} / {totalSlides}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next categories"
                  className="grid size-11 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}

            {/* Slider dots */}
            {hasMultipleSlides && (
              <div className="mt-7 flex justify-center gap-2">
                {Array.from({
                  length: totalSlides,
                }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      scrollToSlide(index)
                    }
                    aria-label={`Go to category slide ${
                      index + 1
                    }`}
                    aria-current={
                      activeSlide === index
                        ? "true"
                        : undefined
                    }
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeSlide === index
                        ? "w-8 bg-[var(--store-primary)]"
                        : "w-2.5 bg-[var(--store-muted)]/30 hover:bg-[var(--store-muted)]/60"
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

export default CategoriesSection;