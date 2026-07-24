"use client";

import React, {
  useCallback,
  useEffect,
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

  const [itemsPerView, setItemsPerView] =
    useState(1);

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
   * Define how many cards are visible on each
   * responsive screen size.
   */
  useEffect(() => {
    const updateItemsPerView = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth >= 1280) {
        setItemsPerView(5);
      } else if (screenWidth >= 1024) {
        setItemsPerView(4);
      } else if (screenWidth >= 768) {
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
   * The last valid card index that can be aligned
   * at the beginning of the carousel.
   */
  const getMaximumStartIndex = useCallback(() => {
    const cards = getCarouselCards();

    return Math.max(
      cards.length - itemsPerView,
      0,
    );
  }, [getCarouselCards, itemsPerView]);

  /**
   * Find the card nearest to the current scroll
   * position.
   */
  const getClosestSlideIndex =
    useCallback(() => {
      const slider = sliderRef.current;
      const cards = getCarouselCards();

      if (!slider || cards.length === 0) {
        return 0;
      }

      const maximumStartIndex =
        getMaximumStartIndex();

      let closestIndex = 0;
      let closestDistance =
        Number.POSITIVE_INFINITY;

      cards
        .slice(0, maximumStartIndex + 1)
        .forEach((card, cardIndex) => {
          const distance = Math.abs(
            card.offsetLeft -
              slider.scrollLeft,
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = cardIndex;
          }
        });

      return closestIndex;
    }, [
      getCarouselCards,
      getMaximumStartIndex,
    ]);

  const scrollToSlide = useCallback(
    (slideIndex: number) => {
      const slider = sliderRef.current;
      const cards = getCarouselCards();

      if (!slider || cards.length === 0) {
        return;
      }

      const maximumStartIndex =
        getMaximumStartIndex();

      const safeIndex = Math.min(
        Math.max(slideIndex, 0),
        maximumStartIndex,
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
    },
    [
      getCarouselCards,
      getMaximumStartIndex,
    ],
  );

  /**
   * Move one complete group backward.
   */
  const handlePrevious = () => {
    const cards = getCarouselCards();

    if (cards.length <= itemsPerView) {
      return;
    }

    const currentIndex =
      getClosestSlideIndex();

    const maximumStartIndex =
      getMaximumStartIndex();

    const previousIndex =
      currentIndex <= 0
        ? maximumStartIndex
        : Math.max(
            currentIndex - itemsPerView,
            0,
          );

    scrollToSlide(previousIndex);
  };

  /**
   * Move one complete group forward.
   */
  const handleNext = () => {
    const cards = getCarouselCards();

    if (cards.length <= itemsPerView) {
      return;
    }

    const currentIndex =
      getClosestSlideIndex();

    const maximumStartIndex =
      getMaximumStartIndex();

    const nextIndex =
      currentIndex >= maximumStartIndex
        ? 0
        : Math.min(
            currentIndex + itemsPerView,
            maximumStartIndex,
          );

    scrollToSlide(nextIndex);
  };

  const handleCarouselScroll = () => {
    currentSlideRef.current =
      getClosestSlideIndex();
  };

  const showNavigation =
    productItems.length > itemsPerView;

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
      className="border-b border-[var(--store-border)]"
    >
      {/* Section heading */}
      <div className="flex items-end justify-between gap-4 my-4">
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

        {showNavigation && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label={`Previous ${tag.name} products`}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label={`Next ${tag.name} products`}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      {isLoading || isFetching ? (
        <div className="flex gap-3 overflow-hidden sm:gap-4">
          {Array.from({ length: 5 }).map(
            (_, itemIndex) => (
              <div
                key={itemIndex}
                className="
                  w-[82%] shrink-0 animate-pulse
                  overflow-hidden rounded-xl
                  border border-[var(--store-border)]
                  bg-[var(--store-bg-1)]
                  sm:w-[calc((100%-1rem)/2)]
                  md:w-[calc((100%-2rem)/3)]
                  lg:w-[calc((100%-3rem)/4)]
                  xl:w-[calc((100%-4rem)/5)]
                "
              >
                <div className="h-[220px] bg-[var(--store-bg-2)] sm:h-[250px]" />

                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 rounded bg-[var(--store-bg-2)]" />

                  <div className="h-5 w-1/2 rounded bg-[var(--store-bg-2)]" />

                  <div className="h-4 w-1/3 rounded bg-[var(--store-bg-2)]" />
                </div>
              </div>
            ),
          )}
        </div>
      ) : productItems.length > 0 ? (
        <div
          ref={sliderRef}
          onScroll={handleCarouselScroll}
          className="
            grid snap-x snap-mandatory
            grid-flow-col
            auto-cols-[82%]
            gap-3 overflow-x-auto
            scroll-smooth pb-3
            sm:auto-cols-[calc((100%-1rem)/2)]
            sm:gap-4
            md:auto-cols-[calc((100%-2rem)/3)]
            lg:auto-cols-[calc((100%-3rem)/4)]
            xl:auto-cols-[calc((100%-4rem)/5)]
            [&::-webkit-scrollbar]:hidden
          "
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
        <div className="rounded-xl border border-dashed border-[var(--store-border)] bg-[var(--store-bg-1)] px-6 py-10 text-center">
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
                      <div className="h-8 w-64 animate-pulse rounded bg-[var(--store-bg-2)]" />

                      <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[var(--store-bg-2)]" />
                    </div>

                    <div className="flex gap-2">
                      <div className="size-10 animate-pulse rounded-full bg-[var(--store-bg-2)]" />

                      <div className="size-10 animate-pulse rounded-full bg-[var(--store-bg-2)]" />
                    </div>
                  </div>

                  <div className="flex gap-3 overflow-hidden sm:gap-4">
                    {Array.from({
                      length: 5,
                    }).map(
                      (_, productIndex) => (
                        <div
                          key={productIndex}
                          className="
                            w-[82%] shrink-0 animate-pulse
                            overflow-hidden rounded-xl
                            border border-[var(--store-border)]
                            bg-[var(--store-bg-1)]
                            sm:w-[calc((100%-1rem)/2)]
                            md:w-[calc((100%-2rem)/3)]
                            lg:w-[calc((100%-3rem)/4)]
                            xl:w-[calc((100%-4rem)/5)]
                          "
                        >
                          <div className="h-[220px] bg-[var(--store-bg-2)] sm:h-[250px]" />

                          <div className="space-y-3 p-4">
                            <div className="h-5 w-3/4 rounded bg-[var(--store-bg-2)]" />

                            <div className="h-5 w-1/2 rounded bg-[var(--store-bg-2)]" />
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
          <div className="mt-12 rounded-xl border border-dashed border-[var(--store-border)] bg-[var(--store-bg-1)] px-6 py-12 text-center">
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