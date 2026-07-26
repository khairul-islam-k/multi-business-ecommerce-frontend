"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useProductTagsQuery,
  useTemplateProductQuery,
} from "@/lib/api/hooks/public-website";

import ProductCard from "./product-card";

type ProductTag = {
  id: string;
  name: string;
  description?: string | null;
};

type ProductTagSectionProps = {
  tag: ProductTag;
  index: number;
};

const ProductTagSection = ({
  tag,
  index,
}: ProductTagSectionProps) => {
  const sliderRef =
    useRef<HTMLDivElement | null>(null);

  const currentSlideRef = useRef(0);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);

  const [canScrollRight, setCanScrollRight] =
    useState(false);

  const {
    data: products,
    isLoading,
    isFetching,
  } = useTemplateProductQuery({
    tagId: tag.id,
  });

  const productItems = useMemo(
    () => products?.items ?? [],
    [products?.items],
  );

  /**
   * Return every product card element from
   * the carousel.
   */
  const getCarouselCards = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return [];
    }

    return Array.from(
      slider.children,
    ) as HTMLElement[];
  }, []);

  /**
   * Update arrow availability based on the
   * current scroll position.
   */
  const updateNavigationState =
    useCallback(() => {
      const slider = sliderRef.current;

      if (!slider) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }

      const maximumScrollLeft =
        slider.scrollWidth - slider.clientWidth;

      setCanScrollLeft(slider.scrollLeft > 4);

      setCanScrollRight(
        slider.scrollLeft <
          maximumScrollLeft - 4,
      );
    }, []);

  /**
   * Find the card closest to the current
   * horizontal scroll position.
   */
  const getClosestSlideIndex =
    useCallback(() => {
      const slider = sliderRef.current;
      const cards = getCarouselCards();

      if (!slider || cards.length === 0) {
        return 0;
      }

      let closestIndex = 0;
      let closestDistance =
        Number.POSITIVE_INFINITY;

      cards.forEach((card, cardIndex) => {
        const distance = Math.abs(
          card.offsetLeft - slider.scrollLeft,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = cardIndex;
        }
      });

      return closestIndex;
    }, [getCarouselCards]);

  /**
   * Scroll to one product card.
   */
  const scrollToSlide = useCallback(
    (slideIndex: number) => {
      const slider = sliderRef.current;
      const cards = getCarouselCards();

      if (!slider || cards.length === 0) {
        return;
      }

      const safeIndex = Math.min(
        Math.max(slideIndex, 0),
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

      currentSlideRef.current = safeIndex;

      window.setTimeout(() => {
        updateNavigationState();
      }, 350);
    },
    [
      getCarouselCards,
      updateNavigationState,
    ],
  );

  /**
   * Move one product card to the left.
   * When already at the beginning, move to
   * the last product.
   */
  const handlePrevious = () => {
    const cards = getCarouselCards();

    if (cards.length === 0) {
      return;
    }

    const currentIndex =
      getClosestSlideIndex();

    const previousIndex =
      currentIndex <= 0
        ? cards.length - 1
        : currentIndex - 1;

    scrollToSlide(previousIndex);
  };

  /**
   * Move one product card to the right.
   * When the slider reaches the end, return
   * to the first product.
   */
  const handleNext = () => {
    const slider = sliderRef.current;
    const cards = getCarouselCards();

    if (!slider || cards.length === 0) {
      return;
    }

    const maximumScrollLeft =
      slider.scrollWidth - slider.clientWidth;

    const reachedEnd =
      slider.scrollLeft >=
      maximumScrollLeft - 4;

    if (reachedEnd) {
      scrollToSlide(0);
      return;
    }

    const currentIndex =
      getClosestSlideIndex();

    const nextIndex = Math.min(
      currentIndex + 1,
      cards.length - 1,
    );

    scrollToSlide(nextIndex);
  };

  /**
   * Keep arrow state and active card synchronized
   * after mouse-wheel scrolling or mobile swiping.
   */
  const handleCarouselScroll = () => {
    currentSlideRef.current =
      getClosestSlideIndex();

    updateNavigationState();
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.3),
        ease: "easeOut",
      }}
      className="my-4 border-b border-[var(--store-border)] pb-8 sm:my-5 md:my-7 lg:my-8"
    >
      {/* Section heading and carousel arrows */}
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-bold text-[var(--store-text-primary)]">
            {tag.name}
          </h2>

          {tag.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--store-muted)]">
              {tag.description}
            </p>
          )}
        </div>

        {productItems.length > 1 && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label={`Previous ${tag.name} products`}
              className="grid size-10 cursor-pointer place-items-center border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label={`Next ${tag.name} products`}
              className="grid size-10 cursor-pointer place-items-center border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      {isLoading || isFetching ? (
        /* Carousel skeleton */
        <div className="flex gap-3 overflow-hidden sm:gap-4">
          {Array.from({ length: 5 }).map(
            (_, itemIndex) => (
              <div
                key={itemIndex}
                className="w-[82%] shrink-0 animate-pulse overflow-hidden border border-[var(--store-border)] bg-[var(--store-bg-1)] sm:w-[48%] md:w-[32%] lg:w-[31%] xl:w-[24%]"
              >
                <div className="h-[280px] bg-[var(--store-bg-2)] sm:h-[310px]" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 bg-[var(--store-bg-2)]" />

                  <div className="h-5 w-1/2 bg-[var(--store-bg-2)]" />

                  <div className="h-4 w-1/3 bg-[var(--store-bg-2)]" />
                </div>
              </div>
            ),
          )}
        </div>
      ) : productItems.length > 0 ? (
        <div
          ref={sliderRef}
          onScroll={handleCarouselScroll}
          className="grid snap-x snap-mandatory grid-flow-col auto-cols-[82%] gap-3 overflow-x-auto scroll-smooth pb-3 sm:auto-cols-[48%] sm:gap-4 md:auto-cols-[32%] lg:auto-cols-[31%] xl:auto-cols-[24%] [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {productItems.map((product) => (
            <div
              key={product.id}
              className="min-w-0 snap-start"
            >
              <ProductCard
                activeId={tag.id}
                product={product}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[var(--store-border)] bg-[var(--store-bg-1)] px-6 py-10 text-center">
          <p className="text-sm font-medium text-[var(--store-muted)]">
            No products found for {tag.name}.
          </p>
        </div>
      )}
    </motion.div>
  );
};

const ExploreOurProduct = () => {
  const {
    data: productTags,
    isLoading,
    isFetching,
  } = useProductTagsQuery();

  const tags = productTags ?? [];

  return (
    <section className="bg-[var(--store-bg-3)] py-px">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading || isFetching ? (
          <div className="mt-12 space-y-12">
            {Array.from({ length: 3 }).map(
              (_, sectionIndex) => (
                <div key={sectionIndex}>
                  <div className="mb-7 flex items-center justify-between gap-4">
                    <div className="space-y-3">
                      <div className="h-8 w-64 animate-pulse bg-[var(--store-bg-2)]" />

                      <div className="h-4 w-80 max-w-full animate-pulse bg-[var(--store-bg-2)]" />
                    </div>

                    <div className="flex gap-2">
                      <div className="size-10 animate-pulse bg-[var(--store-bg-2)]" />
                      <div className="size-10 animate-pulse bg-[var(--store-bg-2)]" />
                    </div>
                  </div>

                  <div className="flex gap-3 overflow-hidden sm:gap-4">
                    {Array.from({
                      length: 5,
                    }).map(
                      (_, productIndex) => (
                        <div
                          key={productIndex}
                          className="w-[82%] shrink-0 animate-pulse overflow-hidden border border-[var(--store-border)] bg-[var(--store-bg-1)] sm:w-[48%] md:w-[32%] lg:w-[31%] xl:w-[24%]"
                        >
                          <div className="h-[280px] bg-[var(--store-bg-2)] sm:h-[310px]" />

                          <div className="space-y-3 p-5">
                            <div className="h-5 w-3/4 bg-[var(--store-bg-2)]" />

                            <div className="h-5 w-1/2 bg-[var(--store-bg-2)]" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : tags.length > 0 ? (
          <div className="mt-8">
            {tags.map((tag, index) => (
              <ProductTagSection
                key={tag.id}
                tag={tag}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-[var(--store-border)] bg-[var(--store-bg-1)] px-6 py-12 text-center">
            <p className="text-base font-medium text-[var(--store-muted)]">
              No product tags found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreOurProduct;