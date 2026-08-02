"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import type {
  StorefrontCategory,
  StorefrontCategoryTreeItem,
} from "@/types/template/public-website";

const AUTO_SLIDE_DELAY = 3500;
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

const CategoriesSection = () => {
  const sliderRef =
    useRef<HTMLDivElement | null>(null);

  const activeSlideRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const pointerStartXRef = useRef(0);
  const initialScrollLeftRef = useRef(0);

  const [activeSlide, setActiveSlide] =
    useState(0);

  const [itemsPerView, setItemsPerView] =
    useState(1);

  const [isDragging, setIsDragging] =
    useState(false);

  const [isInteracting, setIsInteracting] =
    useState(false);

  const [isHovered, setIsHovered] =
    useState(false);

  const {
    data: categoriesData,
    isLoading,
    isFetching,
  } = useProductCategoryQuery();

  const categories = useMemo(() => {
    const flattenedCategories =
      flattenCategoryTree(
        categoriesData ?? [],
      );

    return removeDuplicateCategories(
      flattenedCategories,
    );
  }, [categoriesData]);

  const totalSlides = Math.max(
    1,
    Math.ceil(
      categories.length / itemsPerView,
    ),
  );

  const hasMultipleSlides =
    totalSlides > 1;

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  /*
   * Detect how many cards are visible
   * at each responsive breakpoint.
   */
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;

      if (width >= 1280) {
        setItemsPerView(5);
        return;
      }

      if (width >= 1024) {
        setItemsPerView(3);
        return;
      }

      if (width >= 640) {
        setItemsPerView(2);
        return;
      }

      setItemsPerView(1);
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
      const newSlide = Math.max(
        totalSlides - 1,
        0,
      );

      setActiveSlide(newSlide);
      activeSlideRef.current = newSlide;
    }
  }, [activeSlide, totalSlides]);

  const getMaximumScroll = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return 0;
    }

    return Math.max(
      slider.scrollWidth -
        slider.clientWidth,
      0,
    );
  }, []);

  const getSlidePosition = useCallback(
    (slideIndex: number) => {
      const slider = sliderRef.current;

      if (!slider) {
        return 0;
      }

      const maximumScroll =
        getMaximumScroll();

      if (totalSlides <= 1) {
        return 0;
      }

      /*
       * Distribute slide positions evenly
       * across the available scroll width.
       */
      const progress =
        slideIndex / (totalSlides - 1);

      return maximumScroll * progress;
    },
    [getMaximumScroll, totalSlides],
  );

  const scrollToSlide = useCallback(
    (
      slideIndex: number,
      behavior: ScrollBehavior = "smooth",
    ) => {
      const slider = sliderRef.current;

      if (!slider) {
        return;
      }

      const safeIndex = Math.min(
        Math.max(slideIndex, 0),
        totalSlides - 1,
      );

      slider.scrollTo({
        left: getSlidePosition(safeIndex),
        behavior,
      });

      activeSlideRef.current = safeIndex;
      setActiveSlide(safeIndex);
    },
    [getSlidePosition, totalSlides],
  );

  const getCurrentSlide = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider || totalSlides <= 1) {
      return 0;
    }

    const maximumScroll =
      getMaximumScroll();

    if (maximumScroll === 0) {
      return 0;
    }

    const progress =
      slider.scrollLeft / maximumScroll;

    const calculatedSlide = Math.round(
      progress * (totalSlides - 1),
    );

    return Math.min(
      Math.max(calculatedSlide, 0),
      totalSlides - 1,
    );
  }, [getMaximumScroll, totalSlides]);

  /*
   * Automatically move to the next slide.
   *
   * Auto sliding pauses while the user is
   * hovering, touching, or dragging.
   */
  useEffect(() => {
    if (
      !hasMultipleSlides ||
      isHovered ||
      isInteracting ||
      isDragging
    ) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        const currentSlide =
          activeSlideRef.current;

        const nextSlide =
          currentSlide >=
          totalSlides - 1
            ? 0
            : currentSlide + 1;

        scrollToSlide(nextSlide);
      }, AUTO_SLIDE_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    hasMultipleSlides,
    isDragging,
    isHovered,
    isInteracting,
    scrollToSlide,
    totalSlides,
  ]);

  const handleSliderScroll = () => {
    if (isPointerDownRef.current) {
      return;
    }

    const currentSlide =
      getCurrentSlide();

    activeSlideRef.current =
      currentSlide;

    setActiveSlide(currentSlide);
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    setIsInteracting(true);

    /*
     * Touch devices use native horizontal
     * swipe scrolling.
     */
    if (event.pointerType === "touch") {
      return;
    }

    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;

    pointerStartXRef.current =
      event.clientX;

    initialScrollLeftRef.current =
      slider.scrollLeft;

    setIsDragging(true);

    slider.setPointerCapture(
      event.pointerId,
    );
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (
      !isPointerDownRef.current ||
      event.pointerType === "touch"
    ) {
      return;
    }

    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const distance =
      event.clientX -
      pointerStartXRef.current;

    if (
      Math.abs(distance) >
      DRAG_THRESHOLD
    ) {
      hasDraggedRef.current = true;
    }

    slider.scrollLeft =
      initialScrollLeftRef.current -
      distance;
  };

  const finishPointerInteraction = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    setIsInteracting(false);

    /*
     * Touch scrolling is handled natively.
     */
    if (event.pointerType === "touch") {
      window.requestAnimationFrame(() => {
        const currentSlide =
          getCurrentSlide();

        activeSlideRef.current =
          currentSlide;

        setActiveSlide(currentSlide);
      });

      return;
    }

    if (!isPointerDownRef.current) {
      return;
    }

    const slider = sliderRef.current;

    isPointerDownRef.current = false;
    setIsDragging(false);

    if (
      slider?.hasPointerCapture(
        event.pointerId,
      )
    ) {
      slider.releasePointerCapture(
        event.pointerId,
      );
    }

    /*
     * Snap to the nearest slide after
     * releasing the mouse.
     */
    if (hasDraggedRef.current) {
      const nearestSlide =
        getCurrentSlide();

      window.requestAnimationFrame(() => {
        scrollToSlide(nearestSlide);
      });
    }
  };

  const handleLostPointerCapture = () => {
    isPointerDownRef.current = false;

    setIsDragging(false);
    setIsInteracting(false);
  };

  const handleClickCapture = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    /*
     * Prevent category navigation when
     * the user dragged the slider.
     */
    if (!hasDraggedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    window.setTimeout(() => {
      hasDraggedRef.current = false;
    }, 0);
  };

  return (
    <section className="bg-[var(--store-bg-1)] py-5 sm:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-4 rounded-2xl border border-[var(--store-border)] bg-[var(--store-card)] p-4"
              >
                <div className="size-20 shrink-0 rounded-xl bg-[var(--store-bg-3)]" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-[var(--store-bg-3)]" />

                  <div className="h-3 w-1/2 rounded bg-[var(--store-bg-3)]" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--store-border)] bg-[var(--store-card)] px-6 py-14 text-center">
            <Package className="mx-auto size-10 text-[var(--store-muted)]" />

            <h3 className="mt-4 text-lg font-semibold text-[var(--store-text)]">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-[var(--store-muted)]">
              Product categories are not
              available right now.
            </p>
          </div>
        ) : (
          <>
            {/* Auto-running draggable slider */}
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                finishPointerInteraction
              }
              onPointerCancel={
                finishPointerInteraction
              }
              onLostPointerCapture={
                handleLostPointerCapture
              }
              onClickCapture={
                handleClickCapture
              }
              onMouseEnter={() =>
                setIsHovered(true)
              }
              onMouseLeave={() => {
                setIsHovered(false);
                setIsInteracting(false);
              }}
              className={`grid grid-flow-col gap-4 overflow-x-auto pb-2 select-none touch-pan-x [&::-webkit-scrollbar]:hidden ${
                isDragging
                  ? "cursor-grabbing snap-none scroll-auto"
                  : "cursor-grab snap-x snap-mandatory scroll-smooth"
              } auto-cols-[88%] sm:auto-cols-[calc((100%-1rem)/2)] lg:auto-cols-[calc((100%-2rem)/3)] xl:auto-cols-[calc((100%-4rem)/5)]`}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {categories.map(
                (category) => (
                  <Link
                    key={category.id}
                    href={`/store/products?categoryId=${category.id}`}
                    draggable={false}
                    onDragStart={(event) =>
                      event.preventDefault()
                    }
                    className="group flex min-w-0 snap-start items-center gap-4 border border-[var(--store-border)] bg-[var(--store-card)] p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[var(--store-primary)] hover:shadow-lg"
                  >
                    {/* Category image */}
                    <div className="relative size-20 shrink-0 overflow-hidden bg-[var(--store-bg-3)]">
                      <Image
                        src={imageUrlSet(
                          category.imageUrl,
                        )}
                        alt={category.name}
                        fill
                        sizes="80px"
                        draggable={false}
                        className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    </div>

                    {/* Category information */}
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--store-text)] transition group-hover:text-[var(--store-primary)]">
                        {category.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--store-muted)]">
                        <Package className="size-4 shrink-0" />

                        <span>
                          {category._count
                            ?.products ?? 0}{" "}
                          Products
                        </span>
                      </div>

                      <p className="mt-3 text-xs font-semibold text-[var(--store-primary)]">
                        Explore category
                      </p>
                    </div>
                  </Link>
                ),
              )}
            </div>

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