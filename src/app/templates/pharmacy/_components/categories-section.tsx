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

    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const dragStartScrollLeftRef = useRef(0);
    const dragMovedRef = useRef(false);

    const [itemsPerView, setItemsPerView] =
        useState(2);

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

    const maxSlideIndex = Math.max(
        categories.length - itemsPerView,
        0,
    );

    const hasMultipleSlides = maxSlideIndex > 0;

    /**
     * Set responsive category cards.
     *
     * Mobile: 2
     * Small: 3
     * Medium: 4
     * Large: 6
     * Extra large: 8
     */
    useEffect(() => {
        const updateItemsPerView = () => {
            const screenWidth = window.innerWidth;

            if (screenWidth >= 1280) {
                setItemsPerView(8);
            } else if (screenWidth >= 1024) {
                setItemsPerView(6);
            } else if (screenWidth >= 768) {
                setItemsPerView(4);
            } else if (screenWidth >= 640) {
                setItemsPerView(3);
            } else {
                setItemsPerView(2);
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

    const handlePrevious = () => {
        const currentIndex =
            activeCardIndexRef.current;

        const previousIndex =
            currentIndex <= 0
                ? maxSlideIndex
                : currentIndex - 1;

        scrollToCard(previousIndex);
    };

    const handleNext = () => {
        const currentIndex =
            activeCardIndexRef.current;

        const nextIndex =
            currentIndex >= maxSlideIndex
                ? 0
                : currentIndex + 1;

        scrollToCard(nextIndex);
    };

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

    const findClosestCardIndex =
        useCallback(() => {
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
                        card.offsetLeft -
                        slider.scrollLeft,
                    );

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestCardIndex = index;
                    }
                });

            return closestCardIndex;
        }, [maxSlideIndex]);

    const handleSliderScroll = () => {
        if (isDraggingRef.current) return;

        activeCardIndexRef.current =
            findClosestCardIndex();
    };

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

        window.setTimeout(() => {
            dragMovedRef.current = false;
        }, 0);
    };

    const handleClickCapture = (
        event: React.MouseEvent<HTMLDivElement>,
    ) => {
        if (!dragMovedRef.current) return;

        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <section className="my-4 bg-[var(--store-bg-1)] sm:my-5 md:my-7 lg:my-10">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-[var(--store-text)] sm:text-2xl">
                        Shop By Category
                    </h2>

                    {hasMultipleSlides && (
                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                aria-label="Previous category"
                                className="grid size-9 cursor-pointer place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
                            >
                                <ChevronLeft className="size-4" />
                            </button>

                            <button
                                type="button"
                                onClick={handleNext}
                                aria-label="Next category"
                                className="grid size-9 cursor-pointer place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-card)] text-[var(--store-text)] shadow-sm transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    )}
                </div>

                {isLoading || isFetching ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                        {Array.from({ length: 8 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="overflow-hidden rounded-xl border border-[var(--store-border)] bg-[var(--store-card)] p-3 shadow-sm"
                                >
                                    <div className="mx-auto size-20 animate-pulse rounded-lg bg-[var(--store-bg-3)] sm:size-24" />

                                    <div className="mt-3 flex min-h-10 items-center justify-center">
                                        <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--store-bg-3)]" />
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
                        className="
    grid cursor-grab snap-x snap-mandatory
    grid-flow-col
    auto-cols-[calc((100%-0.75rem)/2)]
    select-none gap-3 overflow-x-auto
    scroll-smooth pb-2
    active:cursor-grabbing
    sm:auto-cols-[calc((100%-1.5rem)/3)]
    md:auto-cols-[calc((100%-2.25rem)/4)]
    lg:auto-cols-[calc((100%-3.75rem)/6)]
    xl:auto-cols-[calc((100%-5.25rem)/8)]
    [&::-webkit-scrollbar]:hidden
  "
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
                                className="group min-w-0 snap-start overflow-hidden rounded-xl border border-[var(--store-border)] bg-[var(--store-card)] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--store-primary)] hover:shadow-md"
                            >
                                {/* Full-width image with standard height */}
                                <div className="relative h-28 w-full overflow-hidden rounded-t-xl bg-[var(--store-bg-3)] sm:h-32 lg:h-36">
                                    <Image
                                        src={imageUrlSet(category.imageUrl)}
                                        alt={category.name}
                                        fill
                                        draggable={false}
                                        sizes="(max-width: 639px) 50vw, (max-width: 767px) 33vw, (max-width: 1023px) 25vw, (max-width: 1279px) 17vw, 13vw"
                                        className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
                                        unoptimized
                                    />
                                </div>

                                {/* Category name */}
                                <div className="flex min-h-12 items-center justify-center px-2 py-2 text-center">
                                    <h3 className="line-clamp-2 text-xs font-semibold leading-4 text-[var(--store-text)] transition-colors group-hover:text-[var(--store-primary)] sm:text-sm sm:leading-5">
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