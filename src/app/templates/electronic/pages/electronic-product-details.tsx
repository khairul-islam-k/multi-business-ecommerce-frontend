"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useProductWebReview, useTemplateProduct } from "@/lib/api/hooks/public-website";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useAddCartMutation } from "@/lib/api/hooks/add-cart";
import { useTemplateProductWishListMutation } from "@/lib/api/hooks/template-product-wishList";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { StorefrontProduct } from "@/types/template/template-product";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import VariantModal from "../_components/variant-modal";
import { motion } from "framer-motion";
import Pagination from "@/app/store/_components/pagination";
import ProductReviewForm from "../../fashion/_components/product_review_form";

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rating ? "fill-[#f16d59] text-[#f16d59]" : "text-gray-300"
            }`}
        />
      ))}
    </div>
  );
};

const ElectronicProductDetails = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState("");

  const message = useMessage();

  // variant modal
  const [variantModalOpen, setVariantModalOpen] = useState<boolean>(false);

  // add to card
  const { createAddCart } = useAddCartMutation();
  const { addWishList } = useTemplateProductWishListMutation();

  // fetch product
  const { data: product, isLoading, isFetching } = useTemplateProduct(productSlug);

  // review 
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const {data: reviewData} = useProductWebReview(productSlug, {
    limit,
    page: currentPage,
  });

  const total = reviewData?.meta.total ?? 1;
  const totalPages = Math.ceil(total / limit);

  // select initial image
  useEffect(() => {
    if (product?.images) {
      setSelectedImage(product?.images[0]?.imageUrl);
    }
  }, [product]);


  const handleAddToCart = async (value: StorefrontProduct) => {

    if (value.variants.length > 0) {
      setVariantModalOpen(true);
    } else {

      if (!value.id) {
        message.error("Product is required");
        return;
      }


      try {
        await createAddCart.mutateAsync({
          productId: value.id,
          quantity: 1
        });
        setVariantModalOpen(false);
        message.success("Product added to cart successfully");
      } catch (error) {
        message.error(getWebErrorMessage(error));
      }

    }
  }

  const handleAddToWishList = async (value: StorefrontProduct) => {

    if (value.variants.length > 0) {
      setVariantModalOpen(true);
    } else {

      if (!value.id) {
        message.error("Product is required");
        return;
      }


      try {
        await addWishList.mutateAsync({
          productId: value.id
        });
        setVariantModalOpen(false);
        message.success("Product added to Wish successfully");
      } catch (error) {
        message.error(getWebErrorMessage(error));
      }

    }
  }

  // caroucel
  const thumbnailRef = useRef<HTMLDivElement | null>(null);

  const handleThumbnailPrev = () => {
    thumbnailRef.current?.scrollBy({
      left: -220,
      behavior: "smooth",
    });
  };

  const handleThumbnailNext = () => {
    thumbnailRef.current?.scrollBy({
      left: 220,
      behavior: "smooth",
    });
  };

  // end caroucel

  const productImages = product?.images ?? [];
  const variants = product?.variants ?? [];
  const averageRating = product?.reviewSummary.averageRating ?? 0;
  const reviews = reviewData?.items ?? [];

  if (isLoading || isFetching) return <span>Loading...</span>

  return (
    <section className="bg-[var(--store-bg-3)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link href="/store" className="hover:text-[#f16d59]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/store/products" className="hover:text-[#f16d59]">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span>{product?.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 bg-[var(--store-bg-1)] p-5 shadow-sm lg:grid-cols-2 lg:p-8">
          {/* Left Image Side */}
          <div>
            <div className="relative h-[420px] overflow-hidden bg-[#f8f5f1] sm:h-[520px]">
              {selectedImage && (
                <Image
                  src={imageUrlSet(selectedImage)}
                  alt={product?.name ?? ""}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              )}

              {product?.tags?.[0]?.name && (
                <span className="absolute left-5 top-5 rounded-full bg-[#f16d59] px-4 py-1.5 text-xs font-bold text-white">
                  {product.tags[0].name}
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            <div className="relative mt-4">
              {productImages.length > 4 && (
                <button
                  type="button"
                  onClick={handleThumbnailPrev}
                  className="absolute left-0 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-[var(--store-bg-1)] shadow-md transition hover:bg-[#f16d59] hover:text-white"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}

              <div
                ref={thumbnailRef}
                className="flex gap-3 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {productImages.map((image) => {
                  const isActive = selectedImage === image.imageUrl;

                  return (
                    <motion.button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImage(image.imageUrl)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 bg-[#f8f5f1] transition ${isActive
                          ? "border-[#f16d59]"
                          : "border-gray-200 hover:border-[#f16d59]/60"
                        }`}
                    >
                      <Image
                        src={imageUrlSet(image.imageUrl)}
                        alt={image.altText ?? ""}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />

                      {isActive && (
                        <motion.span
                          layoutId="active-thumbnail"
                          className="absolute inset-0 rounded-2xl ring-2 ring-[#f16d59] ring-offset-2"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {productImages.length > 4 && (
                <button
                  type="button"
                  onClick={handleThumbnailNext}
                  className="absolute right-0 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-[var(--store-bg-1)] shadow-md transition hover:bg-[#f16d59] hover:text-white"
                >
                  <ChevronRight className="size-5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Text Side */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 inline-flex w-fit items-center rounded-full bg-[#f16d59]/10 px-4 py-1.5 text-xs font-bold text-[#f16d59]">
              {product?.tags[0]?.name}
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              {product?.name}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${index < averageRating
                      ? "fill-[#f16d59] text-[#f16d59]"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>

              <span className="text-sm">
                ({product?.reviewSummary?.reviewCount} Review)
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#f16d59]">
              ৳{product?.price}
            </p>

            <p className="mt-5 text-base leading-7">
              {product?.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${product?.stockSummary?.inStock
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-500"
                  }`}
              >
                <Check className="h-4 w-4" />
                {product?.stockSummary?.inStock ? "In Stock" : "Out of Stock"}
              </span>

              <span className="text-sm text-gray-500">
                Available: {product?.stockSummary.availableQuantity}
              </span>
            </div>

            {/* Variant */}
            {variants?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold text-gray-950">
                  Select Variant
                </h3>

                <div className="flex flex-wrap gap-3">
                  {variants?.map((variant) => {
                    const oneVariantImage = variant?.images[0]?.imageUrl ?? "";
                    const oneProductImage = product?.images[0].imageUrl ?? "";
                    return (
                      <button
                        key={variant?.id}
                        type="button"
                        onClick={() => {
                          // setSelectedVariantId(variant.id);
                          setSelectedImage(oneVariantImage || oneProductImage);
                        }}
                        className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${selectedVariantId === variant.id
                          ? "border-[#f16d59] bg-[#f16d59] text-white"
                          : "border-gray-300 text-gray-700 hover:border-[#f16d59] hover:text-[#f16d59]"
                          }`}
                      >
                        {variant.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}


            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  if (product) {
                    handleAddToCart(product)
                  }
                }}
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#f16d59] px-8 text-sm font-bold text-white transition hover:bg-gray-950"
              >
                <ShoppingCart className="h-5 w-5" />
                Add To Cart
              </button>

              <button
                onClick={() => {
                  if (product) {
                    handleAddToWishList(product);
                  }
                }}
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 border border-gray-300 px-8 text-sm font-bold transition hover:border-[#f16d59] hover:text-[#f16d59]"
              >
                <Heart className="h-5 w-5" />
                Wishlist
              </button>

            </div>

            {/* Product Info */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="space-y-3 text-sm">
              

                <p>
                  <span className="font-bold">Total Stock:</span>{" "}
                  <span>
                    {product?.stockSummary.totalQuantity}
                  </span>
                </p>

                <p>
                  <span className="font-bold">Reserved:</span>{" "}
                  <span>
                    {product?.stockSummary.quantityReserved}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 bg-[var(--store-bg-1)] p-5 shadow-sm lg:p-8 mx-auto max-w-[1220px]">
        <div className="mb-6 flex flex-col gap-2 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">
              Customer Reviews
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Total Reviews: {product?.reviews.length}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <RatingStars rating={product?.reviewSummary.averageRating ?? 0} />

            <span className="text-sm font-semibold text-gray-700">
              {product?.reviewSummary.averageRating} out of 5
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
                        {review?.reviewerName?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-950">
                          {review?.reviewerName}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {review.reviewerEmail}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <RatingStars rating={review.rating} />

                      <span className="text-sm font-semibold text-gray-700">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${review.status === "APPROVED"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                        }`}
                    >
                      {review.status}
                    </span>

                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <h4 className="text-base font-bold text-gray-950">
                    {review.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
            <h3 className="text-lg font-bold text-gray-950">No reviews yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Be the first person to review this product.
            </p>
          </div>
        )}
      </div>

      {
        product && <VariantModal
          product={product}
          open={variantModalOpen}
          onClose={() => setVariantModalOpen(false)}
        />
      }

    </section>
  );
};

export default ElectronicProductDetails;
