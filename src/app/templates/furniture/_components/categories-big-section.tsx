"use client";

import Image from "next/image";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import type {
  StorefrontCategory,
  StorefrontCategoryTreeItem,
} from "@/types/template/public-website";

const AUTO_SLIDE_DELAY = 3000;
const DRAG_THRESHOLD = 6;

function flattenCategoryTree(
  tree: StorefrontCategoryTreeItem[],
): StorefrontCategory[] {
  const result: StorefrontCategory[] = [];

  const walk = (
    items: StorefrontCategoryTreeItem[],
  ) => {
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

const CategoriesBigSection = () => {
  const sliderRef = useRef<HTMLDivElement | null>(
    null,
  );

  const activeCardIndexRef = useRef(0);
  const isSliderHoveredRef = useRef(false);

  /*
   * Desktop mouse-drag refs.
   */
  const isMouseDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  const [isMouseDragging, setIsMouseDragging] =
    useState(false);

  const [activeCardIndex, setActiveCardIndex] =
    useState(0);

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

  const hasMultipleSlides = categories.length > 1;

  const getCards = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return [];
    }

    return Array.from(
      slider.children,
    ) as HTMLElement[];
  }, []);

  const updateActiveIndex = useCallback(
    (index: number) => {
      activeCardIndexRef.current = index;
      setActiveCardIndex(index);
    },
    [],
  );

  /*
   * Scroll to a selected category card.
   */
  const scrollToCard = useCallback(
    (cardIndex: number) => {
      const slider = sliderRef.current;
      const cards = getCards();

      if (!slider || cards.length === 0) {
        return;
      }

      const safeIndex = Math.min(
        Math.max(cardIndex, 0),
        cards.length - 1,
      );

      const selectedCard = cards[safeIndex];

      if (!selectedCard) {
        return;
      }

      slider.scrollTo({
        left: selectedCard.offsetLeft,
        behavior: "smooth",
      });

      updateActiveIndex(safeIndex);
    },
    [getCards, updateActiveIndex],
  );

  /*
   * Previous category.
   */
  const handlePrevious = () => {
    const currentIndex =
      activeCardIndexRef.current;

    const previousIndex =
      currentIndex <= 0
        ? categories.length - 1
        : currentIndex - 1;

    scrollToCard(previousIndex);
  };

  /*
   * Next category.
   */
  const handleNext = useCallback(() => {
    const currentIndex =
      activeCardIndexRef.current;

    const nextIndex =
      currentIndex >= categories.length - 1
        ? 0
        : currentIndex + 1;

    scrollToCard(nextIndex);
  }, [categories.length, scrollToCard]);

  /*
   * Automatic slide.
   */
  useEffect(() => {
    if (!hasMultipleSlides) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (
        isSliderHoveredRef.current ||
        isMouseDraggingRef.current
      ) {
        return;
      }

      handleNext();
    }, AUTO_SLIDE_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [handleNext, hasMultipleSlides]);

  /*
   * Find the card closest to the current
   * scroll position.
   */
  const findClosestCardIndex =
    useCallback(() => {
      const slider = sliderRef.current;
      const cards = getCards();

      if (!slider || cards.length === 0) {
        return 0;
      }

      let closestIndex = 0;
      let closestDistance =
        Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const distance = Math.abs(
          card.offsetLeft - slider.scrollLeft,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    }, [getCards]);

  /*
   * Keep active slide synchronized after
   * scrolling or mobile swiping.
   */
  const handleSliderScroll = () => {
    if (isMouseDraggingRef.current) {
      return;
    }

    const closestIndex =
      findClosestCardIndex();

    updateActiveIndex(closestIndex);
  };

  /*
   * Start desktop mouse drag.
   *
   * Do not use setPointerCapture here.
   * It can prevent the Link from receiving clicks.
   */
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) {
      return;
    }

    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    isMouseDraggingRef.current = true;
    dragMovedRef.current = false;

    setIsMouseDragging(true);

    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current =
      slider.scrollLeft;
  };

  /*
   * Move slider while holding the left
   * mouse button.
   */
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!isMouseDraggingRef.current) {
      return;
    }

    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const movement =
      event.clientX - dragStartXRef.current;

    if (
      Math.abs(movement) >= DRAG_THRESHOLD
    ) {
      dragMovedRef.current = true;
      event.preventDefault();
    }

    slider.scrollLeft =
      dragStartScrollLeftRef.current - movement;
  };

  /*
   * Finish mouse drag and snap to the
   * closest category.
   */
  const finishMouseDragging = () => {
    if (!isMouseDraggingRef.current) {
      return;
    }

    isMouseDraggingRef.current = false;
    setIsMouseDragging(false);

    const closestIndex =
      findClosestCardIndex();

    scrollToCard(closestIndex);

    /*
     * Keep it true until the following click event
     * finishes so dragging does not open the link.
     */
    window.setTimeout(() => {
      dragMovedRef.current = false;
    }, 0);
  };

  /*
   * Block navigation only when the user dragged.
   * A normal mouse click redirects correctly.
   */
  const handleCardClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!dragMovedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <section className="my-5 bg-[var(--store-bg-1)] md:my-8 lg:my-10">
      <div className="mx-auto w-[92.3077%] max-w-[1600px]">
        {isLoading || isFetching ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 2 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[280px] w-[83.333%] shrink-0 animate-pulse bg-[var(--store-bg-3)] sm:h-[360px] lg:h-[440px]"
                />
              ),
            )}
          </div>
        ) : categories.length === 0 ? (
          <div className="border border-dashed border-[var(--store-border)] bg-[var(--store-card)] px-6 py-14 text-center">
            <Package className="mx-auto size-10 text-[var(--store-muted)]" />

            <h3 className="mt-4 text-lg font-semibold text-[var(--store-text)]">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-[var(--store-muted)]">
              Product categories are not available
              right now.
            </p>
          </div>
        ) : (
          <div className="group/slider relative">
            {/* Left arrow */}
            {hasMultipleSlides && (
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous category"
                className="absolute left-3 top-1/2 z-30 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:scale-110 hover:bg-black/80 sm:left-5 sm:size-12"
              >
                <ChevronLeft className="size-5 sm:size-6" />
              </button>
            )}

            {/* Category slider */}
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={finishMouseDragging}
              onMouseEnter={() => {
                isSliderHoveredRef.current = true;
              }}
              onMouseLeave={() => {
                isSliderHoveredRef.current = false;
                finishMouseDragging();
              }}
              onDragStart={(event) => {
                event.preventDefault();
              }}
              className={`grid snap-x snap-mandatory grid-flow-col auto-cols-[83.333%] select-none gap-4 overflow-x-auto scroll-smooth pb-2 pr-[16.667%] [&::-webkit-scrollbar]:hidden ${
                isMouseDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
              }`}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {categories.map(
                (category, index) => (
                  <Link
                    key={category.id}
                    href={`/store/products?categoryId=${category.id}`}
                    draggable={false}
                    onClick={handleCardClick}
                    className="group relative min-w-0 snap-start overflow-hidden bg-[var(--store-bg-3)] shadow-md"
                  >
                    <div className="relative h-[280px] w-full sm:h-[360px] lg:h-[440px]">
                      <Image
                        src={imageUrlSet(
                          category.imageUrl,
                        )}
                        alt={category.name}
                        fill
                        draggable={false}
                        sizes="(max-width: 639px) 83vw, 83vw"
                        className="pointer-events-none object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />

                      {/* Image overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/5 to-black/25" />

                      {/* Single-line category name */}
                      <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 sm:left-6 sm:right-6 sm:top-6">
                        <h3 className="truncate whitespace-nowrap text-lg font-bold text-white drop-shadow-md sm:text-2xl">
                          {category.name} collection
                        </h3>
                      </div>

                      {/* Slide number */}
                      <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm sm:bottom-6 sm:left-6">
                        {index + 1} /{" "}
                        {categories.length}
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>

            {/* Right arrow */}
            {hasMultipleSlides && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next category"
                className="absolute right-3 top-1/2 z-30 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:scale-110 hover:bg-black/80 sm:right-5 sm:size-12"
              >
                <ChevronRight className="size-5 sm:size-6" />
              </button>
            )}

            {/* Navigation dots */}
            {hasMultipleSlides && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {categories.map(
                  (category, index) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        scrollToCard(index)
                      }
                      aria-label={`Go to category ${
                        index + 1
                      }`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeCardIndex === index
                          ? "w-7 bg-[var(--store-primary)]"
                          : "w-2 bg-[var(--store-muted)]/35"
                      }`}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesBigSection;