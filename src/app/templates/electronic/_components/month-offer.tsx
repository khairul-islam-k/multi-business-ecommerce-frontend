import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import monthOffer_1 from "@/assets/fashion/month-offer/month-offer-1.png";
import monthOffer_2 from "@/assets/fashion/month-offer/month-offer-2.png";
import monthOffer_3 from "@/assets/fashion/month-offer/month-offer-3.png";

import type { BestOfferImage } from "@/types/website/website";

type MonthOfferProps = {
  monthlyOffer?: BestOfferImage[];
};

const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

const getImageUrl = (
  imageUrl: string | null | undefined,
  fallbackImage: StaticImageData,
): string | StaticImageData => {
  if (!imageUrl) {
    return fallbackImage;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  const normalizedPath = imageUrl.startsWith("/")
    ? imageUrl
    : `/${imageUrl}`;

  return `${MEDIA_BASE_URL}${normalizedPath}`;
};

const MonthOffer = ({
  monthlyOffer = [],
}: MonthOfferProps) => {
  const centerImage = getImageUrl(
    monthlyOffer[0]?.imageUrl,
    monthOffer_1,
  );

  const leftImage = getImageUrl(
    monthlyOffer[1]?.imageUrl,
    monthOffer_2,
  );

  const rightImage = getImageUrl(
    monthlyOffer[2]?.imageUrl,
    monthOffer_3,
  );

  return (
    <section className="overflow-hidden bg-[var(--store-bg-2)] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--store-primary)]">
            Limited Time Deals
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[var(--store-text)] sm:text-4xl lg:text-5xl">
            Best Offers of the Month
          </h2>

          <p className="mt-4 text-sm leading-7 text-[var(--store-muted)] sm:text-base sm:leading-8">
            Discover this month&apos;s best fashion deals on selected
            clothing, accessories, and seasonal essentials. Shop your
            favorite styles at special prices while stocks last.
          </p>
        </div>

        {/* Offer images */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.4fr_0.8fr] lg:items-center lg:gap-6">
          {/* Left small offer */}
          <Link
            href="/store/products"
            className="group relative min-h-[320px] overflow-hidden rounded-3xl bg-[var(--store-bg-3)] sm:min-h-[400px] lg:min-h-[500px]"
          >
            <Image
              src={leftImage}
              alt="Monthly fashion offer"
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                Trending
              </span>

              <h3 className="mt-3 text-2xl font-bold">
                New Style Collection
              </h3>

              <p className="mt-2 text-sm text-white/80">
                Explore fresh designs made for your everyday style.
              </p>

              <span className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 transition group-hover:bg-[var(--store-primary)] group-hover:text-white">
                Shop Now
              </span>
            </div>
          </Link>

          {/* Center big offer */}
          <Link
            href="/store/products"
            className="group relative min-h-[440px] overflow-hidden rounded-3xl bg-[var(--store-bg-3)] shadow-xl sm:min-h-[600px] lg:min-h-[680px]"
          >
            <Image
              src={centerImage}
              alt="Best offer of the month"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

            <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
              <span className="inline-flex rounded-full bg-[var(--store-primary)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                Best Offer
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                Up to 50% Off
              </p>

              <h3 className="mt-3 max-w-lg text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Upgrade Your Wardrobe This Month
              </h3>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                Discover premium fashion essentials at special monthly
                prices before the offer ends.
              </p>

              <span className="mt-6 inline-flex rounded-full bg-[var(--store-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition group-hover:bg-white group-hover:text-gray-950">
                Explore Offers
              </span>
            </div>
          </Link>

          {/* Right small offer */}
          <Link
            href="/store/products"
            className="group relative min-h-[320px] overflow-hidden rounded-3xl bg-[var(--store-bg-3)] sm:min-h-[400px] lg:min-h-[500px]"
          >
            <Image
              src={rightImage}
              alt="Special monthly fashion offer"
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                Special Deal
              </span>

              <h3 className="mt-3 text-2xl font-bold">
                Seasonal Essentials
              </h3>

              <p className="mt-2 text-sm text-white/80">
                Find must-have clothing and accessories at special prices.
              </p>

              <span className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 transition group-hover:bg-[var(--store-primary)] group-hover:text-white">
                View Collection
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MonthOffer;