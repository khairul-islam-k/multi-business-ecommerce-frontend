"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ImageIcon, Star } from "lucide-react";

import Pagination from "@/app/store/_components/pagination";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useProductWebReview } from "@/lib/api/hooks/public-website";

type ReviewProps = {
  productSlug: string;
  averageRating: number | undefined;
};

type ProductReviewImage = {
  id: string;
  businessId: string;
  reviewId: string;
  imageUrl: string;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type ReviewImageGalleryProps = {
  images: ProductReviewImage[];
  reviewTitle?: string | null;
};

const RatingStars = ({ rating }: { rating: number }) => {
  const normalizedRating = Math.round(Number(rating) || 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < normalizedRating
              ? "fill-[#f16d59] text-[#f16d59]"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewImageGallery = ({
  images,
  reviewTitle,
}: ReviewImageGalleryProps) => {
  const activeImages = images.filter((image) => !image.deletedAt);

  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    activeImages[0]?.id ?? null,
  );

  useEffect(() => {
    setSelectedImageId(activeImages[0]?.id ?? null);
  }, [images]);
  

  if (activeImages.length === 0) {
    return null;
  }

  const selectedImage =
    activeImages.find((image) => image.id === selectedImageId) ??
    activeImages[0];

  return (
    <div className="mt-5">
      {/* Selected large image */}
      <div className="relative aspect-[16/10] w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        {selectedImage?.imageUrl ? (
          <Image
            src={imageUrlSet(selectedImage.imageUrl)}
            alt={
              selectedImage.altText ||
              reviewTitle ||
              "Customer review image"
            }
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 576px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* Thumbnail images */}
      {activeImages.length > 1 && (
        <div className="mt-3 flex max-w-xl gap-2 overflow-x-auto pb-1">
          {activeImages.map((image) => {
            const isSelected = image.id === selectedImage?.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageId(image.id)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-100 transition ${
                  isSelected
                    ? "border-[#f16d59] ring-2 ring-[#f16d59]/20"
                    : "border-gray-200 hover:border-[#f16d59]/60"
                }`}
                aria-label="Show review image"
              >
                <Image
                  src={imageUrlSet(image.imageUrl)}
                  alt={
                    image.altText ||
                    reviewTitle ||
                    "Review thumbnail"
                  }
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProductReview = ({
  productSlug,
  averageRating,
}: ReviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { data: reviewData } = useProductWebReview(productSlug, {
    limit,
    page: currentPage,
  });

  const total = reviewData?.meta.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const reviews = reviewData?.items ?? [];

  return (
    <div className="mx-auto mt-8 max-w-[1220px] bg-[var(--store-bg-1)] p-5 shadow-sm lg:p-8">
      <div className="mb-6 flex flex-col gap-2 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-950">
            Customer Reviews
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Total Reviews: {total}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars rating={averageRating ?? 0} />

          <span className="text-sm font-semibold text-gray-700">
            {averageRating ?? 0} out of 5
          </span>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-gray-200 p-5 transition hover:border-[#f16d59] hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#f16d59]/10 text-sm font-bold text-[#f16d59]">
                      {review.reviewerName
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-950">
                        {review.reviewerName}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {review.reviewerEmail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <RatingStars rating={Number(review.rating)} />

                    <span className="text-sm font-semibold text-gray-700">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      review.status === "APPROVED"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {review.status}
                  </span>

                  <span className="text-xs text-gray-500">
                    {review.createdAt
                      ? new Date(
                          review.createdAt,
                        ).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="text-base font-bold text-gray-950">
                  {review.title || "Untitled review"}
                </h4>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                  {review.comment || "No review comment provided."}
                </p>
              </div>

              <ReviewImageGallery
                images={review.images ?? []}
                reviewTitle={review.title}
              />
            </div>
          ))}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
          <h3 className="text-lg font-bold text-gray-950">
            No reviews yet
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Be the first person to review this product.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReview;