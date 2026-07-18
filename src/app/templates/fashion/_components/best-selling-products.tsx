"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "./product-card";
import { useTemplateProductQuery } from "@/lib/api/hooks/public-website";

const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, label, [role="button"], [data-no-drag]';

const BestSellingProducts = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { data: products } = useTemplateProductQuery({
    // tagId: activeTab,
  });

  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -340,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 340,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!scrollRef.current) return;

    const target = event.target as HTMLElement;

    // Do not start dragging when clicking a button, link, input, etc.
    if (target.closest(INTERACTIVE_SELECTOR)) {
      return;
    }

    isPointerDownRef.current = true;
    isDraggingRef.current = false;

    startXRef.current = event.clientX;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isPointerDownRef.current || !scrollRef.current) return;

    const moveX = event.clientX - startXRef.current;

    // Avoid treating a normal click as a drag.
    if (Math.abs(moveX) < 5) {
      return;
    }

    isDraggingRef.current = true;

    if (!scrollRef.current.hasPointerCapture(event.pointerId)) {
      scrollRef.current.setPointerCapture(event.pointerId);
    }

    scrollRef.current.scrollLeft =
      scrollLeftRef.current - moveX;
  };

  const stopDragging = (
    event?: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event &&
      scrollRef.current?.hasPointerCapture(event.pointerId)
    ) {
      scrollRef.current.releasePointerCapture(event.pointerId);
    }

    isPointerDownRef.current = false;

    window.setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  };

  const handleClickCapture = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    // Prevent a card/link click only when the user actually dragged.
    if (isDraggingRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <section className="bg-[var(--store-bg-3)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#f16d59]">
              Top Products
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Best Selling Products
            </h2>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={handleScrollLeft}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleScrollRight}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onPointerLeave={stopDragging}
          onClickCapture={handleClickCapture}
          className="flex cursor-grab select-none gap-6 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing [touch-action:pan-y] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products?.items?.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className="min-w-[280px] sm:min-w-[300px] lg:min-w-[305px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={handleScrollLeft}
            className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleScrollRight}
            className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellingProducts;