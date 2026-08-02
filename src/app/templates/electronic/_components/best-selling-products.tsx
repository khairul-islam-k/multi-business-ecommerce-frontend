"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useMemo,
  useRef,
} from "react";

import { useTemplateProductQuery } from "@/lib/api/hooks/public-website";

import ProductCard from "./product-card";

const PRODUCTS_PER_SLIDE = 5;
const DRAG_THRESHOLD = 60;

const BestSellingProducts = () => {
  const scrollRef =
    useRef<HTMLDivElement | null>(null);

  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const { data: products } =
    useTemplateProductQuery({});

  /*
   * Divide all products into groups
   * containing five products each.
   */
  const productSlides = useMemo(() => {
    const productItems =
      products?.items ?? [];

    const slides = [];

    for (
      let index = 0;
      index < productItems.length;
      index += PRODUCTS_PER_SLIDE
    ) {
      slides.push(
        productItems.slice(
          index,
          index + PRODUCTS_PER_SLIDE,
        ),
      );
    }

    return slides;
  }, [products?.items]);

  const handleScrollLeft = () => {
    const slider = scrollRef.current;

    if (!slider) {
      return;
    }

    slider.scrollBy({
      left: -slider.clientWidth,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    const slider = scrollRef.current;

    if (!slider) {
      return;
    }

    const isAtLastSlide =
      slider.scrollLeft +
        slider.clientWidth >=
      slider.scrollWidth - 10;

    /*
     * Return to the first slide after
     * reaching the final slide.
     */
    if (isAtLastSlide) {
      slider.scrollTo({
        left: 0,
        behavior: "smooth",
      });

      return;
    }

    slider.scrollBy({
      left: slider.clientWidth,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const slider = scrollRef.current;

    if (!slider) {
      return;
    }

    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    startXRef.current = event.clientX;
    scrollLeftRef.current =
      slider.scrollLeft;

    if (event.pointerType !== "touch") {
      slider.setPointerCapture(
        event.pointerId,
      );
    }
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const slider = scrollRef.current;

    if (
      !isDraggingRef.current ||
      !slider ||
      event.pointerType === "touch"
    ) {
      return;
    }

    const moveX =
      event.clientX - startXRef.current;

    if (
      Math.abs(moveX) >
      DRAG_THRESHOLD
    ) {
      hasDraggedRef.current = true;
    }

    slider.scrollLeft =
      scrollLeftRef.current - moveX;
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const slider = scrollRef.current;

    if (!slider) {
      return;
    }

    const movedDistance =
      event.clientX - startXRef.current;

    isDraggingRef.current = false;

    if (
      event.pointerType !== "touch" &&
      slider.hasPointerCapture(
        event.pointerId,
      )
    ) {
      slider.releasePointerCapture(
        event.pointerId,
      );
    }

    /*
     * Move to the next or previous full
     * slide after dragging the mouse.
     */
    if (
      Math.abs(movedDistance) >=
      DRAG_THRESHOLD
    ) {
      if (movedDistance < 0) {
        handleScrollRight();
      } else {
        handleScrollLeft();
      }
    } else {
      /*
       * Snap back to the closest slide.
       */
      const nearestSlide = Math.round(
        slider.scrollLeft /
          slider.clientWidth,
      );

      slider.scrollTo({
        left:
          nearestSlide *
          slider.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const handlePointerCancel = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const slider = scrollRef.current;

    isDraggingRef.current = false;

    if (
      slider &&
      event.pointerType !== "touch" &&
      slider.hasPointerCapture(
        event.pointerId,
      )
    ) {
      slider.releasePointerCapture(
        event.pointerId,
      );
    }
  };

  const handleClickCapture = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!hasDraggedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    window.setTimeout(() => {
      hasDraggedRef.current = false;
    }, 0);
  };

  if (productSlides.length === 0) {
    return null;
  }

  return (
    <section className="bg-[var(--store-bg-3)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            
            <h2 className="text-3xl font-bold text-[var(--store-text-primary)] sm:text-2xl">
              Latest Products
            </h2>
          </div>

          {/* Desktop buttons */}
          {productSlides.length > 1 && (
            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={handleScrollLeft}
                aria-label="Previous products"
                className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={handleScrollRight}
                aria-label="Next products"
                className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Slides */}
        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={
            handlePointerCancel
          }
          onClickCapture={
            handleClickCapture
          }
          className="flex cursor-grab snap-x snap-mandatory select-none overflow-x-auto scroll-smooth active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            touchAction: "pan-y",
          }}
        >
          {productSlides.map(
            (slideProducts, slideIndex) => (
              <div
                key={`product-slide-${slideIndex}`}
                className="grid min-w-full snap-start grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
              >
                {slideProducts.map(
                  (product, productIndex) => (
                    <motion.div
                      key={product.id}
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
                      }}
                      transition={{
                        duration: 0.4,
                        delay:
                          productIndex *
                          0.05,
                        ease: "easeOut",
                      }}
                      className="min-w-0"
                    >
                      <ProductCard
                        product={product}
                      />
                    </motion.div>
                  ),
                )}
              </div>
            ),
          )}
        </div>

        {/* Mobile buttons */}
        {productSlides.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={handleScrollLeft}
              aria-label="Previous products"
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleScrollRight}
              aria-label="Next products"
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellingProducts;