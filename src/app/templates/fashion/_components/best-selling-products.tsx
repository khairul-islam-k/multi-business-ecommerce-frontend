"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ProductCard from "./product-card";
import { useTemplateProductQuery } from "@/lib/api/hooks/public-website";

const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, label, [role="button"], [data-no-drag]';

const BestSellingProducts = () => {
  const scrollRef =
    useRef<HTMLDivElement | null>(null);

  const { data: products } =
    useTemplateProductQuery({});

  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleScrollLeft = () => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollBy({
      left: -scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollBy({
      left: scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!scrollRef.current) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest(INTERACTIVE_SELECTOR)) {
      return;
    }

    isPointerDownRef.current = true;
    isDraggingRef.current = false;

    startXRef.current = event.clientX;
    scrollLeftRef.current =
      scrollRef.current.scrollLeft;
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (
      !isPointerDownRef.current ||
      !scrollRef.current
    ) {
      return;
    }

    const moveX =
      event.clientX - startXRef.current;

    if (Math.abs(moveX) < 5) {
      return;
    }

    isDraggingRef.current = true;

    if (
      !scrollRef.current.hasPointerCapture(
        event.pointerId,
      )
    ) {
      scrollRef.current.setPointerCapture(
        event.pointerId,
      );
    }

    scrollRef.current.scrollLeft =
      scrollLeftRef.current - moveX;
  };

  const stopDragging = (
    event?: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event &&
      scrollRef.current?.hasPointerCapture(
        event.pointerId,
      )
    ) {
      scrollRef.current.releasePointerCapture(
        event.pointerId,
      );
    }

    isPointerDownRef.current = false;

    window.setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  };

  const handleClickCapture = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (isDraggingRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const productItems = products?.items ?? [];

  if (productItems.length === 0) {
    return null;
  }

  return (
    <section className="bg-[var(--store-bg-3)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#f16d59] sm:text-sm">
              Top Products
            </p>

            <h2 className="text-2xl font-bold text-[var(--store-text-primary)] sm:text-3xl">
              Latest Products
            </h2>
          </div>

          {/* Desktop arrows */}
          {productItems.length > 1 && (
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={handleScrollLeft}
                className="grid size-11 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
                aria-label="Scroll left"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={handleScrollRight}
                className="grid size-11 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
                aria-label="Scroll right"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* Product slider */}
        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onPointerLeave={stopDragging}
          onClickCapture={handleClickCapture}
          className="flex cursor-grab snap-x snap-mandatory select-none gap-4 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing sm:gap-5 lg:gap-6 [touch-action:pan-y] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {productItems.map(
            (product, index) => (
              <motion.div
                key={product.id}
                initial={{
                  opacity: 0,
                  x: 40,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay:
                    Math.min(index, 5) * 0.05,
                  ease: "easeOut",
                }}
                className="
                  min-w-full
                  snap-start
                  sm:min-w-[calc((100%-20px)/2)]
                  md:min-w-[calc((100%-40px)/3)]
                  lg:min-w-[calc((100%-96px)/5)]
                "
              >
                <ProductCard
                  product={product}
                />
              </motion.div>
            ),
          )}
        </div>

        {/* Mobile arrows */}
        {productItems.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={handleScrollLeft}
              className="grid size-11 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={handleScrollRight}
              className="grid size-11 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellingProducts;