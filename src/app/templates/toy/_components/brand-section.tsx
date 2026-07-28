"use client";

import Image from "next/image";
import React, { useMemo } from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useProductBrands } from "@/lib/api/hooks/public-website";
import { useRouter } from "next/navigation";

const BrandSection = () => {

    const router = useRouter();

  const {
    data: brandsData,
    isLoading,
    isFetching,
  } = useProductBrands();

  const marqueeBrands = useMemo(() => {
    if (!brandsData?.length) {
      return [];
    }

    // Duplicate items for a continuous marquee animation
    return [...brandsData, ...brandsData];
  }, [brandsData]);

  if (isLoading || isFetching) {
    return (
      <section className="overflow-hidden bg-[var(--store-bg-1)] py-12">
        <div className="mx-auto w-full px-4 lg:w-[1100px] 2xl:w-[1300px]">
          <div className="mb-8 text-center">
            <div className="mx-auto h-7 w-48 animate-pulse rounded-md bg-[var(--store-bg-2)]" />
            <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded-md bg-[var(--store-bg-2)]" />
          </div>

          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-[170px] shrink-0 animate-pulse rounded-2xl border border-[var(--store-border)] bg-[var(--store-card)] p-4"
              >
                <div className="aspect-square rounded-xl bg-[var(--store-bg-2)]" />
                <div className="mx-auto mt-4 h-4 w-24 rounded bg-[var(--store-bg-2)]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!brandsData?.length) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-[var(--store-bg-1)] py-12">
      <div className="mx-auto w-full px-4 lg:w-[1100px] 2xl:w-[1300px]">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--store-primary)]">
            Popular brands
          </p>

          <h2 className="text-2xl font-bold text-[var(--store-text-primary)] sm:text-3xl">
            Shop Your Favorite Brands
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--store-muted)]">
            Explore products from the brands you already know and love.
          </p>
        </div>
      </div>

      <div className="group relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--store-bg-1)] to-transparent sm:w-24" />

        {/* Right fade it blare */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--store-bg-1)] to-transparent sm:w-24" />

        <div className="brand-marquee flex w-max gap-4 px-4 group-hover:[animation-play-state:paused] sm:gap-5">
          {marqueeBrands.map((brand, index) => {
            const logoUrl = brand.logoUrl?.trim();

            return (
              <div
                key={`${brand.id}-${index}`}
                onClick={()=> router.push(`/store/products?brandId=${brand.id}`)}
                className="group/card cursor-pointer w-[150px] shrink-0 rounded-2xl border border-[var(--store-border)] bg-[var(--store-card)] p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--store-primary)]/40 hover:shadow-md sm:w-[180px] sm:p-4"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--store-bg-2)]">
                  {logoUrl ? (
                    <Image
                      src={imageUrlSet(logoUrl)}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 640px) 150px, 180px"
                      className="object-contain p-5 transition-transform duration-300 group-hover/card:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      <span className="text-3xl font-bold uppercase text-[var(--store-muted)]">
                        {brand.name?.charAt(0) || "B"}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="mt-4 truncate text-center text-sm font-semibold text-[var(--store-text-primary)] transition group-hover/card:text-[var(--store-primary)]">
                  {brand.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .brand-marquee {
          animation: brand-marquee 28s linear infinite;
          will-change: transform;
        }

        @keyframes brand-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default BrandSection;