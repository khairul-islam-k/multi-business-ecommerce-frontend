"use client";

import Image from "next/image";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { RestaurantSection as RestaurantSectionType } from "@/types/website/website";

type RestaurantProps = {
  restaurantData: RestaurantSectionType;
};

const RestaurantSection = ({
  restaurantData,
}: RestaurantProps) => {
  const {
    name,
    description,
    image,
  } = restaurantData;

  if (!name && !description && !image) {
    return null;
  }

  return (
    <section className="bg-[var(--store-bg-2)]">
      <div className="mx-auto grid overflow-hidden border border-black/5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-zinc-900 lg:grid-cols-2">
        {/* Left content */}
        <div className="flex items-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="w-full">
            <div className="mb-5 flex items-center gap-3">
   
            </div>

            {name && (
              <h2 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl dark:text-white">
                {name}
              </h2>
            )}

            {description && (
              <div className="mt-6 max-h-[260px] overflow-y-auto pr-3 text-sm leading-7 [scrollbar-width:thin] sm:text-base sm:leading-8 dark:text-gray-300">
                <p className="whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Right image */}
        <div className="relative w-full h-[300px] md:h-[450px]  overflow-hidden">
          {image ? (
            <Image
              src={imageUrlSet(image)}
              alt={name || "Restaurant image"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[360px] items-center justify-center bg-gray-100 text-sm text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
              No restaurant image available
            </div>
          )}


          
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;