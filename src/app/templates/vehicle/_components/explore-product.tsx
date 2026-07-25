"use client";

import Image from "next/image";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useProductBrands } from "@/lib/api/hooks/public-website";
import { Van } from "lucide-react";
import ProductTagSectionPage from "./Product-Tags-section";

const ExploreProduct = () => {
  const {
    data: brandsData,
    isLoading: isBrandsLoading,
    isFetching: isBrandsFetching,
  } = useProductBrands();

  if (isBrandsLoading) {
    return (
      <section className="px-4 py-8 lg:px-5">
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-12 lg:gap-6">
          <div className="col-span-3 grid grid-cols-3 gap-3 lg:col-span-2 lg:block lg:space-y-0">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-lg bg-gray-200 lg:h-20 lg:rounded-none"
                />
              ),
            )}
          </div>

          <div className="col-span-3 min-h-[300px] animate-pulse rounded-lg bg-gray-200 lg:col-span-10" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 lg:px-5">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-5 flex items-center justify-between">

          {isBrandsFetching && (
            <span className="text-xs text-[var(--store-text-secondary)]">
              Updating...
            </span>
          )}
        </div>

        {/* 
          Mobile: one-column section
          Desktop: 2-column + 10-column layout
        */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Brand sidebar */}
          <aside className="col-span-1 lg:col-span-2">

            <div className="bg-[var(--store-bg-3)] flex items-center gap-3">
                <div className="bg-black text-white p-2">
                    <Van />
                </div>

                <div>
                    Search By Make
                </div>

            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:block lg:overflow-hidden lg:border lg:border-[var(--store-border)]">
              {brandsData?.map((brand) => {
                const logoUrl =
                  brand.logoUrl?.trim();

                return (
                  <button
                    key={brand.id}
                    type="button"
                    className="group flex min-w-0 flex-col items-center justify-center gap-2 rounded-lg  bg-[var(--store-bg-1)] px-2 text-center transition hover:border-[var(--store-primary)] hover:shadow-md lg:flex-row lg:justify-start lg:rounded-none lg:border-x-0 lg:border-t-0 lg:px-3 lg:text-left lg:shadow-none lg:last:border-b-0"
                  >
                    {/* Brand image */}
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-white lg:size-16">
                      {logoUrl ? (
                        <Image
                          src={imageUrlSet(
                            logoUrl,
                          )}
                          alt={`${brand.name} logo`}
                          fill
                          sizes="(max-width: 1024px) 64px, 80px"
                          quality={100}
                          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-bold text-gray-700">
                          {brand.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Brand name */}
                    <p className="w-full truncate text-xs font-semibold text-[var(--store-text-primary)] sm:text-sm lg:text-left">
                      {brand.name}
                    </p>
                  </button>
                );
              })}
            </div>

            {!brandsData?.length && (
              <div className="border border-[var(--store-border)] px-4 py-10 text-center text-sm text-[var(--store-text-secondary)]">
                No brands found.
              </div>
            )}
          </aside>

          {/* Right content */}
          <main className="col-span-1 lg:col-span-10">
            <div className="rounded-lg">

                <ProductTagSectionPage />

            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default ExploreProduct;