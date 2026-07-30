"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import type {
  StorefrontCategory,
  StorefrontCategoryTreeItem,
} from "@/types/template/public-website";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";

function flattenCategoryTree(
  tree: StorefrontCategoryTreeItem[],
): StorefrontCategory[] {
  const result: StorefrontCategory[] = [];

  const walk = (
    items: StorefrontCategoryTreeItem[],
  ) => {
    items.forEach((item) => {
      result.push(item.category);

      if (item.children?.length) {
        walk(item.children);
      }
    });
  };

  walk(tree);

  return result;
}

function chunkArray<T>(
  array: T[],
  size: number,
): T[][] {
  return Array.from(
    {
      length: Math.ceil(array.length / size),
    },
    (_, index) =>
      array.slice(
        index * size,
        index * size + size,
      ),
  );
}

const CategoriesSection = () => {
  const [activeSlide, setActiveSlide] =
    useState(0);

  const [itemsPerSlide, setItemsPerSlide] =
    useState(5);

  const { data: categoriesData } =
    useProductCategoryQuery();

  const categories = useMemo(() => {
    const flattenedCategories =
      flattenCategoryTree(
        categoriesData ?? [],
      );

    // Remove duplicate categories by ID
    return Array.from(
      new Map(
        flattenedCategories.map(
          (category) => [
            category.id,
            category,
          ],
        ),
      ).values(),
    );
  }, [categoriesData]);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 640) {
        setItemsPerSlide(1);
      } else if (screenWidth < 1024) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(5);
      }
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

  const categorySlides = useMemo(() => {
    return chunkArray(
      categories,
      itemsPerSlide,
    );
  }, [categories, itemsPerSlide]);

  const totalSlides = categorySlides.length;
  const hasMultipleSlides = totalSlides > 1;

  useEffect(() => {
    setActiveSlide(0);
  }, [itemsPerSlide, categories.length]);

  const handleNext = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setActiveSlide((previousSlide) =>
      previousSlide === totalSlides - 1
        ? 0
        : previousSlide + 1,
    );
  };

  const handlePrev = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setActiveSlide((previousSlide) =>
      previousSlide === 0
        ? totalSlides - 1
        : previousSlide - 1,
    );
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-[var(--store-bg-1)] py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f16d59]">
              Shop by Category
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Explore Our Categories
            </h2>
          </div>

          {/* Desktop arrows */}
          {hasMultipleSlides && (
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={handlePrev}
                className="grid size-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
                aria-label="Previous categories"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="grid size-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
                aria-label="Next categories"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSlide}-${itemsPerSlide}`}
              initial={{
                opacity: 0,
                x: 80,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -80,
              }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5"
            >
              {categorySlides[
                activeSlide
              ]?.map((category) => (
                <Link
                  key={category.id}
                  href={`/store/products?categoryId=${category.id}`}
                  className="group mx-auto w-full max-w-[280px] text-center sm:max-w-none"
                >
                  {/* Image */}
                  <div className="mx-auto flex size-52 items-center justify-center rounded-full border border-gray-200 bg-white p-2 transition-all duration-300 group-hover:border-[#f16d59] group-hover:shadow-lg sm:size-40">
                    <div className="relative size-full overflow-hidden rounded-full">
                      <Image
                        src={imageUrlSet(
                          category.imageUrl,
                        )}
                        alt={category.name}
                        fill
                        sizes="(max-width: 639px) 208px, 160px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Name and count */}
                  <div className="mt-4">
                    <h3 className="text-base font-semibold transition duration-300 group-hover:text-[#f16d59] sm:text-sm">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {category._count?.products ??
                        0}{" "}
                      Products
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile arrows */}
        {hasMultipleSlides && (
          <div className="mt-8 flex items-center justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={handlePrev}
              className="grid size-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              aria-label="Previous categories"
            >
              <ChevronLeft className="size-5" />
            </button>

            <span className="min-w-14 text-center text-sm font-medium text-gray-500">
              {activeSlide + 1} /{" "}
              {totalSlides}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="grid size-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              aria-label="Next categories"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}

        {/* Dots */}
        {hasMultipleSlides && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categorySlides.map(
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setActiveSlide(index)
                  }
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-8 bg-[#f16d59]"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to category slide ${
                    index + 1
                  }`}
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;