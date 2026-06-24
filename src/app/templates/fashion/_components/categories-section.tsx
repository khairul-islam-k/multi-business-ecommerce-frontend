"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import { StorefrontCategory, StorefrontCategoryTreeItem } from "@/types/template/public-website";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";


function flattenCategoryTree(
  tree: StorefrontCategoryTreeItem[],
): StorefrontCategory[] {
  const result: StorefrontCategory[] = [];

  const walk = (items: StorefrontCategoryTreeItem[]) => {
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

const ITEMS_PER_SLIDE = 5;

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size),
  );
};

const CategoriesSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const { data: categoriesData } = useProductCategoryQuery();

  const singleArrayCategory = flattenCategoryTree(categoriesData ?? []);
  const categories = new Set([...singleArrayCategory]).values().toArray();


  const categorySlides = useMemo(() => {
    return chunkArray(categories , ITEMS_PER_SLIDE);
  }, [categories]);

  const handleNext = () => {
    setActiveSlide((prev) =>
      prev === categorySlides.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrev = () => {
    setActiveSlide((prev) =>
      prev === 0 ? categorySlides.length - 1 : prev - 1,
    );
  };

  return (
    <section className="bg-[#fffdf9] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f16d59]">
              Shop by Category
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
              Explore Our Categories
            </h2>
          </div>

          {/* Arrow Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={handlePrev}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              aria-label="Previous categories"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              aria-label="Next categories"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5"
            >
              {categorySlides[activeSlide]?.map((category) => (
                <Link
                  key={category.id}
                  href={`/store/products?categoryId=${category.id}`}
                  className="group text-center"
                >
                  {/* Image */}
                  <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-gray-200 bg-white p-2 transition-all delay-75 duration-300 ease-in-out group-hover:border-[#f16d59] group-hover:shadow-lg sm:h-40 sm:w-40">
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src={imageUrlSet(category.imageUrl)}
                        alt={category.name}
                        fill
                        sizes="160px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Name and Count */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-900 transition duration-300 group-hover:text-[#f16d59]">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {category?._count?.products} Products
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Arrows */}
        <div className="mt-8 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={handlePrev}
            className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
            aria-label="Next categories"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {categorySlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === index
                  ? "w-8 bg-[#f16d59]"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to category slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;