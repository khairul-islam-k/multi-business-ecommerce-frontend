"use client";

import Image from "next/image";
import Link from "next/link";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { HeaderSlide } from "@/types/website/website";

type HeroSectionProps = {
  bannerSlide: HeaderSlide[];
};

const HeroSection = ({
  bannerSlide,
}: HeroSectionProps) => {
  const banner = bannerSlide?.[0];

  if (!banner) {
    return null;
  }

  return (
    <section className="relative h-[50vh] md:h-[90vh] min-h-[420px] w-full overflow-hidden">
      {/* Banner background image */}
      <Image
        src={imageUrlSet(banner.imageUrl)}
        alt={
          banner.title ||
          "Restaurant banner"
        }
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />

      {/* Decorative background glow */}
      <div className="absolute -left-32 top-1/2 size-[350px] -translate-y-1/2 rounded-full bg-orange-500/20 blur-3xl" />

      {/* Banner content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:px-12">
        <div className="max-w-2xl text-white">
          {banner.subTitle && (
            <div className="mb-4 flex items-center gap-3">
              <span className="h-0.5 w-8 rounded-full bg-orange-400 sm:w-10" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300 sm:text-sm">
                {banner.subTitle}
              </p>
            </div>
          )}

          {banner.title && (
            <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {banner.title}
            </h1>
          )}

          {banner.description && (
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:mt-5 sm:text-base sm:leading-7">
              {banner.description}
            </p>
          )}

          {banner.buttonText && (
            <div className="mt-6 sm:mt-7">
              <Link
                href="/store/products"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600"
              >
                {banner.buttonText}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="pointer-events-none absolute -bottom-1 left-0 z-20 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block h-[55px] w-full sm:h-[75px] lg:h-[95px]"
          aria-hidden="true"
        >
          <path
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64V120H1380C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120H0Z"
            fill="currentColor"
            className="text-[var(--store-bg-1)] dark:text-zinc-950"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;