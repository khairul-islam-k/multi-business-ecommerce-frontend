import Image, { type StaticImageData } from "next/image";

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

  // Return directly when the API already provides a complete URL.
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

const MonthOffer = ({ monthlyOffer = [] }: MonthOfferProps) => {
  const firstImage = getImageUrl(
    monthlyOffer[0]?.imageUrl,
    monthOffer_1,
  );

  const secondImage = getImageUrl(
    monthlyOffer[1]?.imageUrl,
    monthOffer_2,
  );

  const thirdImage = getImageUrl(
    monthlyOffer[2]?.imageUrl,
    monthOffer_3,
  );

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Best Offers of the Month
          </h2>

          <p className="mt-4 text-base leading-8">
            Discover this month&apos;s best fashion deals on selected
            clothing, accessories, and seasonal essentials. Shop your
            favorite styles at special prices while stocks last.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* First dynamic image */}
          <div className="group relative min-h-[420px] overflow-hidden rounded-3xl bg-gray-100 sm:min-h-[560px] lg:min-h-[680px]">
            <Image
              src={firstImage}
              alt="Best offer of the month"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="grid grid-rows-2 gap-6">
            {/* Second dynamic image */}
            <div className="group relative min-h-[300px] overflow-hidden rounded-3xl bg-gray-100 lg:min-h-0">
              <Image
                src={secondImage}
                alt="Monthly offer"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Third dynamic image */}
            <div className="group relative min-h-[300px] overflow-hidden rounded-3xl bg-gray-100 lg:min-h-0">
              <Image
                src={thirdImage}
                alt="Special monthly offer"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthOffer;