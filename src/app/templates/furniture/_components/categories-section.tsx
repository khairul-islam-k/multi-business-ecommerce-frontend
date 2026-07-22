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

const CategoriesSection = () => {
  const sliderRef = useRef<HTMLDivElement | null>(
    null,
  );

  const activeCardIndexRef = useRef(0);
  const isSliderHoveredRef = useRef(false);

  /*
   * Mouse drag references
   */
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const dragMovedRef = useRef(false);

  const [itemsPerView, setItemsPerView] =
    useState(1);

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

  /*
   * The final card that can be aligned at the
   * beginning of the slider.
   */
  const maxSlideIndex = Math.max(
    categories.length - itemsPerView,
    0,
  );

  const hasMultipleSlides = maxSlideIndex > 0;

  /*
   * Calculate visible category cards according
   * to screen size.
   */
  useEffect(() => {
    const updateItemsPerView = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth >= 1280) {
        setItemsPerView(6);
      } else if (screenWidth >= 1024) {
        setItemsPerView(3);
      } else if (screenWidth >= 640) {
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

  /*
   * Scroll to a specific category card.
   */
  const scrollToCard = useCallback(
    (cardIndex: number) => {
      const slider = sliderRef.current;

      if (!slider) return;

      const cards = Array.from(
        slider.children,
      ) as HTMLElement[];

      if (cards.length === 0) return;

      const safeIndex = Math.min(
        Math.max(cardIndex, 0),
        maxSlideIndex,
      );

      const selectedCard = cards[safeIndex];

      if (!selectedCard) return;

      slider.scrollTo({
        left: selectedCard.offsetLeft,
        behavior: "smooth",
      });

      activeCardIndexRef.current = safeIndex;
    },
    [maxSlideIndex],
  );

  /*
   * Reset slider position if the screen size changes
   * and the current index is no longer available.
   */
  useEffect(() => {
    if (
      activeCardIndexRef.current >
      maxSlideIndex
    ) {
      activeCardIndexRef.current = 0;

      sliderRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, [maxSlideIndex]);

  /*
   * Left arrow navigation.
   */
  const handlePrevious = () => {
    const currentIndex =
      activeCardIndexRef.current;

    const previousIndex =
      currentIndex <= 0
        ? maxSlideIndex
        : currentIndex - 1;

    scrollToCard(previousIndex);
  };

  /*
   * Right arrow navigation.
   */
  const handleNext = () => {
    const currentIndex =
      activeCardIndexRef.current;

    const nextIndex =
      currentIndex >= maxSlideIndex
        ? 0
        : currentIndex + 1;

    scrollToCard(nextIndex);
  };

  /*
   * Automatically move one card every 3 seconds.
   */
  useEffect(() => {
    if (!hasMultipleSlides) return;

    const intervalId = window.setInterval(() => {
      if (
        isSliderHoveredRef.current ||
        isDraggingRef.current
      ) {
        return;
      }

      const currentIndex =
        activeCardIndexRef.current;

      const nextIndex =
        currentIndex >= maxSlideIndex
          ? 0
          : currentIndex + 1;

      scrollToCard(nextIndex);
    }, AUTO_SLIDE_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    hasMultipleSlides,
    maxSlideIndex,
    scrollToCard,
  ]);

  /*
   * Find the card nearest to the current
   * scroll position.
   */
  const findClosestCardIndex = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) return 0;

    const cards = Array.from(
      slider.children,
    ) as HTMLElement[];

    if (cards.length === 0) return 0;

    let closestCardIndex = 0;
    let closestDistance =
      Number.POSITIVE_INFINITY;

    cards
      .slice(0, maxSlideIndex + 1)
      .forEach((card, index) => {
        const distance = Math.abs(
          card.offsetLeft - slider.scrollLeft,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestCardIndex = index;
        }
      });

    return closestCardIndex;
  }, [maxSlideIndex]);

  /*
   * Synchronize the active card after normal
   * scrolling or mobile swiping.
   */
  const handleSliderScroll = () => {
    if (isDraggingRef.current) return;

    activeCardIndexRef.current =
      findClosestCardIndex();
  };

  /*
   * Start mouse click-and-drag.
   */
  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    const slider = sliderRef.current;

    if (!slider) return;

    isDraggingRef.current = true;
    dragMovedRef.current = false;

    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current =
      slider.scrollLeft;

    slider.setPointerCapture(event.pointerId);
  };

  /*
   * Move slider while holding the mouse.
   */
  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDraggingRef.current) return;

    const slider = sliderRef.current;

    if (!slider) return;

    const movement =
      event.clientX - dragStartXRef.current;

    if (Math.abs(movement) > 5) {
      dragMovedRef.current = true;
    }

    slider.scrollLeft =
      dragStartScrollLeftRef.current - movement;
  };

  /*
   * Finish mouse dragging and snap to
   * the closest category card.
   */
  const finishDragging = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDraggingRef.current) return;

    const slider = sliderRef.current;

    isDraggingRef.current = false;

    if (
      slider?.hasPointerCapture(event.pointerId)
    ) {
      slider.releasePointerCapture(
        event.pointerId,
      );
    }

    const closestCardIndex =
      findClosestCardIndex();

    scrollToCard(closestCardIndex);

    /*
     * Keep dragMoved true until the click event
     * finishes, preventing accidental navigation.
     */
    window.setTimeout(() => {
      dragMovedRef.current = false;
    }, 0);
  };

  /*
   * Prevent opening the category link when the
   * user was dragging instead of clicking.
   */
  const handleClickCapture = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!dragMovedRef.current) return;

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <section className="my-4 bg-[var(--store-bg-1)] sm:my-5 md:my-7 lg:my-10">
      <div className="mx-auto w-full max-13/12 px-4 sm:px-6 lg:px-8">
        {/* Heading and navigation arrows */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[var(--store-text)]">
            Popular categories
          </h2>

          {hasMultipleSlides && (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous category"
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next category"
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden border border-[var(--store-border)] bg-[var(--store-card)] shadow-sm"
                >
                  <div className="h-52 w-full animate-pulse bg-[var(--store-bg-3)] sm:h-48" />

                  <div className="flex min-h-14 items-center justify-center px-3 py-3">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--store-bg-3)]" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--store-border)] bg-[var(--store-card)] px-6 py-14 text-center">
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
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDragging}
            onPointerCancel={finishDragging}
            onClickCapture={handleClickCapture}
            onMouseEnter={() => {
              isSliderHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              isSliderHoveredRef.current = false;
            }}
            onDragStart={(event) => {
              event.preventDefault();
            }}
            className="grid cursor-grab snap-x snap-mandatory grid-flow-col auto-cols-[88%] select-none gap-4 overflow-x-auto scroll-smooth pb-2 active:cursor-grabbing sm:auto-cols-[calc((100%-1rem)/2)] lg:auto-cols-[calc((100%-2rem)/3)] xl:auto-cols-[calc((100%-5rem)/6)] [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              touchAction: "pan-y",
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/store/products?categoryId=${category.id}`}
                draggable={false}
                className="group min-w-0 snap-start overflow-hidden border border-[var(--store-border)] bg-[var(--store-card)] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--store-primary)] hover:shadow-md"
              >
                <div className="relative h-52 lg:h-56 w-full overflow-hidden bg-[var(--store-bg-3)] sm:h-48">
                  <Image
                    src={imageUrlSet(
                      category.imageUrl,
                    )}
                    alt={category.name}
                    fill
                    draggable={false}
                    sizes="(max-width: 639px) 88vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 17vw"
                    className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>

                <div className="flex min-h-14 items-center justify-center px-3 py-3 text-center">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--store-text)] transition-colors group-hover:text-[var(--store-primary)]">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;