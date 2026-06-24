"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./product-card";
import { useTemplateProductQuery } from "@/lib/api/hooks/public-website";

const BestSellingProducts = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const {data: products} = useTemplateProductQuery({
      // tagId: activeTab
    });

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

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;

    isDraggingRef.current = true;
    startXRef.current = event.clientX;
    scrollLeftRef.current = scrollRef.current.scrollLeft;

    scrollRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;

    const moveX = event.clientX - startXRef.current;
    scrollRef.current.scrollLeft = scrollLeftRef.current - moveX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;

    isDraggingRef.current = false;
    scrollRef.current.releasePointerCapture(event.pointerId);
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="bg-[#f6f6f6] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#f16d59]">
              Top Products
            </p>

            <h2 className="text-3xl font-bold text-gray-950 sm:text-4xl lg:text-5xl">
              Best Selling Products
            </h2>
          </div>

          {/* Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
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
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="flex cursor-grab select-none gap-6 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {
          products?.items.map((product, index) => (
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

        {/* Mobile Buttons */}
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
            className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
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