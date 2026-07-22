"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useTemplateProduct } from "@/lib/api/hooks/public-website";
import type { BestOfferImage } from "@/types/website/website";

type MonthOfferProps = {
  monthlyOffer?: BestOfferImage[];
};

type ValidOffer = BestOfferImage & {
  slug: string;
  banner: string;
};

type OfferStatusCheckerProps = {
  slug: string;
  onResolved: (slug: string, inOffer: boolean) => void;
};

const isValidOffer = (
  offer: BestOfferImage,
): offer is ValidOffer => {
  return (
    typeof offer.slug === "string" &&
    offer.slug.trim().length > 0 &&
    typeof offer.banner === "string" &&
    offer.banner.trim().length > 0
  );
};

const OfferStatusChecker = ({
  slug,
  onResolved,
}: OfferStatusCheckerProps) => {
  const {
    data: product,
    isLoading,
    isFetching,
  } = useTemplateProduct(slug);

  useEffect(() => {
    if (isLoading || isFetching) {
      return;
    }

    onResolved(slug, product?.inOffer === true);
  }, [
    isLoading,
    isFetching,
    product?.inOffer,
    slug,
    onResolved,
  ]);

  return null;
};

const MonthOffer = ({
  monthlyOffer = [],
}: MonthOfferProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  const [offerStatuses, setOfferStatuses] = useState<
    Record<string, boolean | undefined>
  >({});

  const validOfferItems = useMemo<ValidOffer[]>(
    () => monthlyOffer.filter(isValidOffer),
    [monthlyOffer],
  );

  const uniqueSlugs = useMemo<string[]>(
    () =>
      Array.from(
        new Set(
          validOfferItems.map((offer) => offer.slug),
        ),
      ),
    [validOfferItems],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 768px)",
    );

    const updateItemsPerSlide = () => {
      setItemsPerSlide(mediaQuery.matches ? 3 : 1);
    };

    updateItemsPerSlide();

    mediaQuery.addEventListener(
      "change",
      updateItemsPerSlide,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateItemsPerSlide,
      );
    };
  }, []);

  const handleOfferStatusResolved = useCallback(
    (slug: string, inOffer: boolean) => {
      setOfferStatuses((previousStatuses) => {
        if (previousStatuses[slug] === inOffer) {
          return previousStatuses;
        }

        return {
          ...previousStatuses,
          [slug]: inOffer,
        };
      });
    },
    [],
  );

  const isCheckingOffers = useMemo(
    () =>
      uniqueSlugs.some(
        (slug) => offerStatuses[slug] === undefined,
      ),
    [offerStatuses, uniqueSlugs],
  );

  const activeOffers = useMemo<ValidOffer[]>(
    () =>
      validOfferItems.filter(
        (offer) =>
          offerStatuses[offer.slug] === true,
      ),
    [offerStatuses, validOfferItems],
  );

  const slides = useMemo<ValidOffer[][]>(() => {
    const groupedOffers: ValidOffer[][] = [];

    for (
      let index = 0;
      index < activeOffers.length;
      index += itemsPerSlide
    ) {
      groupedOffers.push(
        activeOffers.slice(
          index,
          index + itemsPerSlide,
        ),
      );
    }

    return groupedOffers;
  }, [activeOffers, itemsPerSlide]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [itemsPerSlide, activeOffers.length]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentSlide((previousSlide) => {
        if (previousSlide >= slides.length - 1) {
          return 0;
        }

        return previousSlide + 1;
      });
    }, 4000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [slides.length]);

  const handlePreviousSlide = () => {
    if (slides.length <= 1) {
      return;
    }

    setCurrentSlide((previousSlide) =>
      previousSlide === 0
        ? slides.length - 1
        : previousSlide - 1,
    );
  };

  const handleNextSlide = () => {
    if (slides.length <= 1) {
      return;
    }

    setCurrentSlide((previousSlide) =>
      previousSlide >= slides.length - 1
        ? 0
        : previousSlide + 1,
    );
  };

  if (validOfferItems.length === 0) {
    return null;
  }

  return (
    <>
      {uniqueSlugs.map((slug) => (
        <OfferStatusChecker
          key={slug}
          slug={slug}
          onResolved={handleOfferStatusResolved}
        />
      ))}

      {isCheckingOffers ? (
        <section>
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {Array.from({
                length: itemsPerSlide,
              }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[16/7] animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          </div>
        </section>
      ) : activeOffers.length > 0 ? (
        <section className="overflow-hidden ">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
    
              </div>

              {slides.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousSlide}
                    aria-label="Previous offer slide"
                    className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition hover:bg-[var(--store-bg-2)]"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next offer slide"
                    className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition hover:bg-[var(--store-bg-2)]"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${
                    currentSlide * 100
                  }%)`,
                }}
              >
                {slides.map((slide, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="min-w-full"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {slide.map((offer) => (
                        <Link
                          key={offer.slug}
                          href={`/store/products/details/${offer.slug}`}
                          aria-label={`View ${offer.slug} product details`}
                          className="group relative block aspect-[16/7] cursor-pointer overflow-hidden rounded-2xl bg-[var(--store-bg-2)]"
                        >
                          <Image
                            src={imageUrlSet(
                              offer.banner,
                            )}
                            alt={`${offer.slug} monthly offer`}
                            fill
                            priority={slideIndex === 0}
                            sizes="(max-width: 767px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {slides.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {slides.map((_, slideIndex) => (
                  <button
                    key={slideIndex}
                    type="button"
                    onClick={() =>
                      setCurrentSlide(slideIndex)
                    }
                    aria-label={`Go to offer slide ${
                      slideIndex + 1
                    }`}
                    className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                      currentSlide === slideIndex
                        ? "w-8 bg-[var(--store-primary)]"
                        : "w-2.5 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
};

export default MonthOffer;