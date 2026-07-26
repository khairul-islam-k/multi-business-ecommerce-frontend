"use client";

import Image from "next/image";
import Link from "next/link";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import type { BestOfferImage } from "@/types/website/website";

type MonthOfferProps = {
  monthlyOffer?: BestOfferImage[];
};

type ValidOffer = BestOfferImage & {
  slug: string;
  banner: string;
};

const AUTO_SLIDE_DELAY = 4000;
const MOBILE_ITEMS_PER_SLIDE = 1;
const DESKTOP_ITEMS_PER_SLIDE = 2;
const MIN_DRAG_DISTANCE = 50;

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

const MonthOffer = ({
  monthlyOffer = [],
}: MonthOfferProps) => {
  const sliderRef =
    useRef<HTMLDivElement | null>(null);

  const dragStartXRef =
    useRef<number | null>(null);

  const hasDraggedRef = useRef(false);

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [isHovered, setIsHovered] =
    useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const [dragOffset, setDragOffset] =
    useState(0);

  const [itemsPerSlide, setItemsPerSlide] =
    useState(MOBILE_ITEMS_PER_SLIDE);

  const activeOffers = useMemo(
    () => monthlyOffer.filter(isValidOffer),
    [monthlyOffer],
  );

  /*
   * Mobile: one card per slide.
   * sm and larger: two cards per slide.
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 640px)",
    );

    const updateItemsPerSlide = () => {
      setItemsPerSlide(
        mediaQuery.matches
          ? DESKTOP_ITEMS_PER_SLIDE
          : MOBILE_ITEMS_PER_SLIDE,
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

  /*
   * Group the offer items based on the screen size.
   */
  const offerSlides = useMemo(() => {
    const slides: ValidOffer[][] = [];

    for (
      let index = 0;
      index < activeOffers.length;
      index += itemsPerSlide
    ) {
      slides.push(
        activeOffers.slice(
          index,
          index + itemsPerSlide,
        ),
      );
    }

    return slides;
  }, [activeOffers, itemsPerSlide]);

  const totalSlides = offerSlides.length;

  const hasMultipleSlides =
    totalSlides > 1;

  /*
   * Reset the slider when the number of grouped
   * slides changes.
   */
  useEffect(() => {
    setCurrentSlide(0);
    setDragOffset(0);
  }, [totalSlides, itemsPerSlide]);

  /*
   * Automatic slide navigation.
   */
  useEffect(() => {
    if (
      !hasMultipleSlides ||
      isHovered ||
      isDragging
    ) {
      return;
    }

    const intervalId = window.setInterval(
      () => {
        setCurrentSlide(
          (previousSlide) =>
            previousSlide >= totalSlides - 1
              ? 0
              : previousSlide + 1,
        );
      },
      AUTO_SLIDE_DELAY,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    hasMultipleSlides,
    isDragging,
    isHovered,
    totalSlides,
  ]);

  const navigateToPreviousSlide = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setCurrentSlide((previousSlide) =>
      previousSlide <= 0
        ? totalSlides - 1
        : previousSlide - 1,
    );
  };

  const navigateToNextSlide = () => {
    if (!hasMultipleSlides) {
      return;
    }

    setCurrentSlide((previousSlide) =>
      previousSlide >= totalSlides - 1
        ? 0
        : previousSlide + 1,
    );
  };

  const resetDragState = () => {
    dragStartXRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!hasMultipleSlides) {
      return;
    }

    /*
     * Only allow the left mouse button.
     * Touch and pen events are also supported.
     */
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    dragStartXRef.current = event.clientX;
    hasDraggedRef.current = false;

    setIsDragging(true);
    setDragOffset(0);

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      dragStartXRef.current === null ||
      !isDragging
    ) {
      return;
    }

    const difference =
      event.clientX - dragStartXRef.current;

    if (Math.abs(difference) > 5) {
      hasDraggedRef.current = true;
    }

    /*
     * Add slight resistance when dragging beyond
     * the first or last slide.
     */
    const draggingBeyondFirst =
      currentSlide === 0 &&
      difference > 0;

    const draggingBeyondLast =
      currentSlide === totalSlides - 1 &&
      difference < 0;

    if (
      draggingBeyondFirst ||
      draggingBeyondLast
    ) {
      setDragOffset(difference * 0.35);
      return;
    }

    setDragOffset(difference);
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (dragStartXRef.current === null) {
      return;
    }

    const difference =
      event.clientX - dragStartXRef.current;

    const sliderWidth =
      sliderRef.current?.offsetWidth ??
      window.innerWidth;

    const dragThreshold = Math.max(
      MIN_DRAG_DISTANCE,
      sliderWidth * 0.12,
    );

    if (difference <= -dragThreshold) {
      navigateToNextSlide();
    } else if (
      difference >= dragThreshold
    ) {
      navigateToPreviousSlide();
    }

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    resetDragState();
  };

  const handlePointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    resetDragState();
  };

  /*
   * Prevent opening the product link when the
   * user was dragging the slider.
   */
  const handleClickCapture = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (!hasDraggedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    hasDraggedRef.current = false;
  };

  if (offerSlides.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-5">
        <div
          ref={sliderRef}
          className={`group/slider relative w-full select-none overflow-hidden touch-pan-y ${
            isDragging
              ? "cursor-grabbing"
              : hasMultipleSlides
                ? "cursor-grab"
                : ""
          }`}
          onMouseEnter={() =>
            setIsHovered(true)
          }
          onMouseLeave={() =>
            setIsHovered(false)
          }
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={
            handlePointerCancel
          }
          onClickCapture={handleClickCapture}
          onDragStart={(event) =>
            event.preventDefault()
          }
        >
          {/* Slider track */}
          <div
            className={`flex ease-in-out ${
              isDragging
                ? "transition-none"
                : "transition-transform duration-700"
            }`}
            style={{
              transform: `translate3d(calc(-${
                currentSlide * 100
              }% + ${dragOffset}px), 0, 0)`,
              willChange: "transform",
            }}
          >
            {offerSlides.map(
              (slideOffers, slideIndex) => (
                <div
                  key={`offer-slide-${slideIndex}`}
                  className="min-w-full"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                    {slideOffers.map(
                      (offer) => {
                        const isSingleDesktopCard =
                          itemsPerSlide === 2 &&
                          slideOffers.length ===
                            1;

                        return (
                          <article
                            key={offer.slug}
                            className={`group/card relative h-[250px] overflow-hidden sm:h-[400px] lg:h-[500px] ${
                              isSingleDesktopCard
                                ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-10px)]"
                                : ""
                            }`}
                          >
                            <Image
                              src={imageUrlSet(
                                offer.banner,
                              )}
                              alt={
                                offer.title ||
                                `${offer.slug} offer`
                              }
                              fill
                              priority={
                                slideIndex === 0
                              }
                              draggable={false}
                              sizes="(max-width: 639px) 100vw, 50vw"
                              className="pointer-events-none object-cover transition duration-700 group-hover/card:scale-105"
                            />

                            {/* Overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-black/45 transition group-hover/card:bg-black/55" />

                            {/* Content */}
                            <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center sm:px-8 lg:px-12">
                              <div className="mx-auto max-w-xl text-white">
                                {offer.title && (
                                  <h2 className="line-clamp-2 text-2xl font-bold leading-tight drop-shadow-md sm:text-3xl lg:text-4xl">
                                    {offer.title}
                                  </h2>
                                )}

                                {offer.subTitle && (
                                  <p className="mx-auto mt-3 line-clamp-2 max-w-lg text-sm leading-6 text-white/90 drop-shadow-sm sm:text-base">
                                    {
                                      offer.subTitle
                                    }
                                  </p>
                                )}

                                <Link
                                  href={`/store/products/details/${offer.slug}`}
                                  draggable={false}
                                  className="mt-5 inline-flex h-10 items-center justify-center bg-white px-6 text-sm font-semibold text-gray-950 shadow-lg transition hover:bg-[var(--store-primary)] hover:text-white sm:h-11 sm:px-7"
                                >
                                  Shop Now
                                </Link>
                              </div>
                            </div>
                          </article>
                        );
                      },
                    )}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Slide number */}
          {hasMultipleSlides && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {currentSlide + 1} /{" "}
              {totalSlides}
            </div>
          )}

          {/* Navigation dots */}
          {hasMultipleSlides && (
            <div className="absolute bottom-4 right-4 z-20 hidden items-center gap-2 sm:flex">
              {offerSlides.map(
                (_, slideIndex) => (
                  <button
                    key={`offer-dot-${slideIndex}`}
                    type="button"
                    onClick={() => {
                      setCurrentSlide(
                        slideIndex,
                      );

                      setDragOffset(0);
                    }}
                    aria-label={`Go to offer slide ${
                      slideIndex + 1
                    }`}
                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                      currentSlide ===
                      slideIndex
                        ? "w-7 bg-white"
                        : "w-2 bg-white/45 hover:bg-white/75"
                    }`}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MonthOffer;