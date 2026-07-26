"use client";

import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";

import { useTemplateProductQuery } from "@/lib/api/hooks/public-website";

// Change this import path according to your project.
import ProductCard from "../_components/product-card";

const AUTO_SLIDE_DELAY = 4000;
const MIN_DRAG_DISTANCE = 50;

const FeatureProduct = () => {
  const sliderRef =
    useRef<HTMLDivElement | null>(null);

  const dragStartXRef =
    useRef<number | null>(null);

  const hasDraggedRef = useRef(false);

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [itemsPerSlide, setItemsPerSlide] =
    useState(1);

  const [isHovered, setIsHovered] =
    useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const [dragOffset, setDragOffset] =
    useState(0);

  const {
    data: products,
    isLoading,
    isFetching,
  } = useTemplateProductQuery({
    sortOrder: "desc",
    limit: 12,
  });

  const productItems = useMemo(
    () => products?.items ?? [],
    [products?.items],
  );

  /**
   * Set responsive card count.
   *
   * Mobile: 1
   * Tablet: 2
   * Laptop: 3
   * Desktop: 4
   */
  useEffect(() => {
    const updateItemsPerSlide = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth >= 1280) {
        setItemsPerSlide(4);
        return;
      }

      if (screenWidth >= 1024) {
        setItemsPerSlide(3);
        return;
      }

      if (screenWidth >= 640) {
        setItemsPerSlide(2);
        return;
      }

      setItemsPerSlide(1);
    };

    updateItemsPerSlide();

    window.addEventListener(
      "resize",
      updateItemsPerSlide,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateItemsPerSlide,
      );
    };
  }, []);

  /**
   * Group products into responsive slides.
   *
   * For example, with four cards per slide:
   *
   * [
   *   [product1, product2, product3, product4],
   *   [product5, product6, product7, product8],
   * ]
   */
  const productSlides = useMemo(() => {
    return Array.from(
      {
        length: Math.ceil(
          productItems.length /
            itemsPerSlide,
        ),
      },
      (_, slideIndex) => {
        const startIndex =
          slideIndex * itemsPerSlide;

        return productItems.slice(
          startIndex,
          startIndex + itemsPerSlide,
        );
      },
    );
  }, [itemsPerSlide, productItems]);

  const totalSlides = productSlides.length;

  const hasMultipleSlides =
    totalSlides > 1;

  /**
   * Keep the current slide valid when screen
   * size or product count changes.
   */
  useEffect(() => {
    setCurrentSlide((previousSlide) => {
      if (totalSlides === 0) {
        return 0;
      }

      return Math.min(
        previousSlide,
        totalSlides - 1,
      );
    });

    setDragOffset(0);
  }, [totalSlides, itemsPerSlide]);

  const navigateToNextSlide =
    useCallback(() => {
      if (!hasMultipleSlides) {
        return;
      }

      setCurrentSlide((previousSlide) =>
        previousSlide >= totalSlides - 1
          ? 0
          : previousSlide + 1,
      );
    }, [
      hasMultipleSlides,
      totalSlides,
    ]);

  const navigateToPreviousSlide =
    useCallback(() => {
      if (!hasMultipleSlides) {
        return;
      }

      setCurrentSlide((previousSlide) =>
        previousSlide <= 0
          ? totalSlides - 1
          : previousSlide - 1,
      );
    }, [
      hasMultipleSlides,
      totalSlides,
    ]);

  /**
   * Automatic slider.
   *
   * It pauses while:
   * - mouse is hovering
   * - user is dragging
   */
  useEffect(() => {
    if (
      !hasMultipleSlides ||
      isHovered ||
      isDragging
    ) {
      return;
    }

    const intervalId = window.setInterval(
      navigateToNextSlide,
      AUTO_SLIDE_DELAY,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    hasMultipleSlides,
    isDragging,
    isHovered,
    navigateToNextSlide,
  ]);

  const resetDragging = () => {
    dragStartXRef.current = null;

    setIsDragging(false);
    setDragOffset(0);
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!hasMultipleSlides) {
      return;
    }

    /**
     * Only allow the left mouse button.
     * Touch and pen are also supported.
     */
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    dragStartXRef.current = event.clientX;
    hasDraggedRef.current = false;

    setIsDragging(true);
    setDragOffset(0);

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      dragStartXRef.current === null ||
      !isDragging
    ) {
      return;
    }

    const difference =
      event.clientX -
      dragStartXRef.current;

    if (Math.abs(difference) > 5) {
      hasDraggedRef.current = true;
    }

    setDragOffset(difference);
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (dragStartXRef.current === null) {
      return;
    }

    const difference =
      event.clientX -
      dragStartXRef.current;

    const sliderWidth =
      sliderRef.current?.offsetWidth ??
      window.innerWidth;

    const dragThreshold = Math.max(
      MIN_DRAG_DISTANCE,
      sliderWidth * 0.08,
    );

    /**
     * Drag left: next slide.
     * Drag right: previous slide.
     */
    if (difference <= -dragThreshold) {
      navigateToNextSlide();
    } else if (
      difference >= dragThreshold
    ) {
      navigateToPreviousSlide();
    }

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    resetDragging();

    /**
     * Keep hasDraggedRef true until the click
     * event has been prevented.
     */
    window.setTimeout(() => {
      hasDraggedRef.current = false;
    }, 0);
  };

  const handlePointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    resetDragging();
  };

  /**
   * ProductCard may contain Link elements.
   * Prevent navigation when the user drags.
   */
  const handleClickCapture = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (!hasDraggedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    hasDraggedRef.current = false;
  };

  if (isLoading) {
    return (
      <section className="w-full py-10 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <div className="h-8 w-64 animate-pulse rounded bg-black/10 dark:bg-white/10" />

            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-black/10 dark:bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-black/10 bg-[var(--store-bg-1)] dark:border-white/10"
              >
                <div className="aspect-[4/5] animate-pulse bg-black/10 dark:bg-white/10" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-black/10 dark:bg-white/10" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-black/10 dark:bg-white/10" />

                  <div className="h-10 w-full animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (productItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden py-10 sm:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-7 flex items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--store-primary,#f16d59)]" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--store-primary,#f16d59)]">
                Handpicked for you
              </p>
            </div>

            <h2 className="mt-3 text-2xl font-bold text-[var(--store-text-primary)] sm:text-3xl lg:text-4xl">
              Our Featured Products
            </h2>

            <p className="mt-2 max-w-xl text-sm text-[var(--store-text-primary)]/60 sm:text-base">
              Explore our latest and most
              popular product collection.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {isFetching && (
              <span className="hidden text-xs text-[var(--store-text-primary)]/50 sm:block">
                Updating...
              </span>
            )}

            <Link
              href="/store/products"
              className="hidden border-b border-[var(--store-text-primary)] pb-1 text-sm font-semibold text-[var(--store-text-primary)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)] sm:inline-flex"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className={`relative w-full select-none overflow-hidden touch-pan-y ${
            isDragging
              ? "cursor-grabbing"
              : hasMultipleSlides
                ? "cursor-grab"
                : ""
          }`}
          onMouseEnter={() =>
            setIsHovered(true)
          }
          onMouseLeave={() =>
            setIsHovered(false)
          }
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={
            handlePointerCancel
          }
          onClickCapture={handleClickCapture}
          onDragStart={(event) =>
            event.preventDefault()
          }
        >
          {/* Slider track */}
          <div
            className={`flex ${
              isDragging
                ? "transition-none"
                : "transition-transform duration-700 ease-in-out"
            }`}
            style={{
              transform: `translate3d(calc(-${
                currentSlide * 100
              }% + ${dragOffset}px), 0, 0)`,
              willChange: "transform",
            }}
          >
            {productSlides.map(
              (
                slideProducts,
                slideIndex,
              ) => (
                <div
                  key={`featured-slide-${slideIndex}`}
                  className="min-w-full"
                >
                  <div
                    className={`grid gap-4 sm:gap-5 ${
                      itemsPerSlide === 1
                        ? "grid-cols-1"
                        : itemsPerSlide === 2
                          ? "grid-cols-2"
                          : itemsPerSlide === 3
                            ? "grid-cols-3"
                            : "grid-cols-4"
                    }`}
                  >
                    {slideProducts.map(
                      (product) => (
                        <div
                          key={product.id}
                          className="min-w-0"
                        >
                          <ProductCard
                            product={product}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Slider footer */}
        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-xs text-[var(--store-text-primary)]/50">
            Drag or swipe to explore products
          </p>

          {hasMultipleSlides && (
            <div className="flex items-center gap-2">
              {productSlides.map(
                (_, slideIndex) => (
                  <button
                    key={`featured-dot-${slideIndex}`}
                    type="button"
                    onClick={() => {
                      setCurrentSlide(
                        slideIndex,
                      );

                      setDragOffset(0);
                    }}
                    aria-label={`Go to featured product slide ${
                      slideIndex + 1
                    }`}
                    aria-current={
                      currentSlide === slideIndex
                        ? "true"
                        : undefined
                    }
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === slideIndex
                        ? "w-8 bg-[var(--store-primary,#f16d59)]"
                        : "w-2 bg-black/20 hover:bg-[var(--store-primary,#f16d59)]/60 dark:bg-white/25"
                    }`}
                  />
                ),
              )}
            </div>
          )}
        </div>

        {/* Mobile view all */}
        <Link
          href="/store/products"
          className="mt-7 flex h-11 w-full items-center justify-center rounded-full border border-black/10 text-sm font-semibold text-[var(--store-text-primary)] transition hover:border-[var(--store-primary,#f16d59)] hover:bg-[var(--store-primary,#f16d59)] hover:text-white dark:border-white/10 sm:hidden"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default FeatureProduct;