"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  onResolved: (
    slug: string,
    inOffer: boolean,
  ) => void;
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

    onResolved(
      slug,
      product?.inOffer === true,
    );
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
  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [itemsPerSlide, setItemsPerSlide] =
    useState(1);

  const [offerStatuses, setOfferStatuses] =
    useState<
      Record<string, boolean | undefined>
    >({});

  const validOfferItems =
    useMemo<ValidOffer[]>(() => {
      return monthlyOffer.filter(isValidOffer);
    }, [monthlyOffer]);

  const uniqueSlugs = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        validOfferItems.map(
          (offer) => offer.slug,
        ),
      ),
    );
  }, [validOfferItems]);

  /*
   * Mobile: 1 card per slide
   * Tablet/Desktop: 2 cards per slide
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 768px)",
    );

    const updateItemsPerSlide = () => {
      setItemsPerSlide(
        mediaQuery.matches ? 2 : 1,
      );
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

  const handleOfferStatusResolved =
    useCallback(
      (
        slug: string,
        inOffer: boolean,
      ) => {
        setOfferStatuses(
          (previousStatuses) => {
            if (
              previousStatuses[slug] ===
              inOffer
            ) {
              return previousStatuses;
            }

            return {
              ...previousStatuses,
              [slug]: inOffer,
            };
          },
        );
      },
      [],
    );

  const isCheckingOffers = useMemo(() => {
    return uniqueSlugs.some(
      (slug) =>
        offerStatuses[slug] === undefined,
    );
  }, [offerStatuses, uniqueSlugs]);

  const activeOffers =
    useMemo<ValidOffer[]>(() => {
      return validOfferItems.filter(
        (offer) =>
          offerStatuses[offer.slug] === true,
      );
    }, [offerStatuses, validOfferItems]);

  const slides = useMemo<ValidOffer[][]>(
    () => {
      const groupedOffers: ValidOffer[][] =
        [];

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
    },
    [activeOffers, itemsPerSlide],
  );

  useEffect(() => {
    setCurrentSlide(0);
  }, [itemsPerSlide, activeOffers.length]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(
      () => {
        setCurrentSlide(
          (previousSlide) => {
            if (
              previousSlide >=
              slides.length - 1
            ) {
              return 0;
            }

            return previousSlide + 1;
          },
        );
      },
      4000,
    );

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
          onResolved={
            handleOfferStatusResolved
          }
        />
      ))}

      {isCheckingOffers ? (
        <section className="overflow-hidden py-4">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Array.from({
                length: itemsPerSlide,
              }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[16/8] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        </section>
      ) : activeOffers.length > 0 ? (
        <section className="overflow-hidden">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--store-primary)]">
                  Special offers
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[var(--store-text-primary)] md:text-3xl">
                  Monthly Offers
                </h2>
              </div>

              {slides.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={
                      handlePreviousSlide
                    }
                    aria-label="Previous offer slide"
                    className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next offer slide"
                    className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
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
                {slides.map(
                  (slide, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="min-w-full"
                    >
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {slide.map((offer) => (
                          <Link
                            key={offer.slug}
                            href={`/store/products/details/${offer.slug}`}
                            aria-label={`View ${
                              offer.title ??
                              offer.slug
                            } offer`}
                            className="group relative block aspect-[16/8] cursor-pointer overflow-hidden rounded-2xl bg-[var(--store-bg-2)] shadow-sm"
                          >
                            <Image
                              src={imageUrlSet(
                                offer.banner,
                              )}
                              alt={
                                offer.title ??
                                `${offer.slug} monthly offer`
                              }
                              fill
                              priority={
                                slideIndex === 0
                              }
                              sizes="(max-width: 767px) 100vw, 50vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

                            {/* Offer content */}
                            <div className="absolute inset-0 flex items-center">
                              <div className="max-w-[85%] p-5 text-white sm:p-7 lg:max-w-[75%] lg:p-8">
                                {offer.title && (
                                  <h3 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                                    {offer.title}
                                  </h3>
                                )}

                                {offer.subTitle && (
                                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/85 sm:text-base">
                                    {
                                      offer.subTitle
                                    }
                                  </p>
                                )}

                                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 transition-transform duration-300 group-hover:translate-x-1">
                                  Shop now
                                  <ChevronRight
                                    size={17}
                                  />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {slides.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {slides.map(
                  (_, slideIndex) => (
                    <button
                      key={slideIndex}
                      type="button"
                      onClick={() =>
                        setCurrentSlide(
                          slideIndex,
                        )
                      }
                      aria-label={`Go to offer slide ${
                        slideIndex + 1
                      }`}
                      className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                        currentSlide ===
                        slideIndex
                          ? "w-8 bg-[var(--store-primary)]"
                          : "w-2.5 bg-gray-300 dark:bg-gray-700"
                      }`}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
};

export default MonthOffer;