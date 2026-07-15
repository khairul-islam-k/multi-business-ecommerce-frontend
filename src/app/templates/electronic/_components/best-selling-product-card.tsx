"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  GitCompareArrows,
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { StorefrontProduct } from "@/types/template/template-product";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { useAddCartMutation } from "@/lib/api/hooks/add-cart";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { useTemplateProductWishListMutation } from "@/lib/api/hooks/template-product-wishList";
import { useCart } from "@/app/store/_components/contex/CartContex";

import VariantModal from "./variant-modal";

type BestSellingProductCardProps = {
  product: StorefrontProduct;
  activeId?: string;
};

const BestSellingProductCard = ({
  product,
  activeId,
}: BestSellingProductCardProps) => {
  const router = useRouter();
  const message = useMessage();

  const { getAuthUser } = useCart();
  const user = getAuthUser();

  const { createAddCart } = useAddCartMutation();
  const { addWishList } =
    useTemplateProductWishListMutation();

  const [variantModalOpen, setVariantModalOpen] =
    useState(false);

  const thumbnail =
    product.images?.find((image) => image.isThumbnail)
      ?.imageUrl ||
    product.images?.[0]?.imageUrl;

  const averageRating =
    Number(product.reviewSummary?.averageRating) || 0;

  const reviewCount =
    product.reviewSummary?.reviewCount ?? 0;

  const isInStock =
    product.stockSummary?.inStock ?? false;

  const activeTag =
    product.tags?.find((tag) => tag.id === activeId) ??
    product.tags?.[0];

  const handleAuthentication = () => {
    if (user) return true;

    message.error("Please login first");
    router.push("/store/login");

    return false;
  };

  const handleAddToCart = async () => {
    if (!handleAuthentication()) return;

    if (product.variants?.length > 0) {
      setVariantModalOpen(true);
      return;
    }

    if (!product.id) {
      message.error("Product is required");
      return;
    }

    try {
      await createAddCart.mutateAsync({
        productId: product.id,
        quantity: 1,
      });

      message.success(
        "Product added to cart successfully",
      );
    } catch (error) {
      message.error(getWebErrorMessage(error));
    }
  };

  const handleAddToWishList = async () => {
    if (!handleAuthentication()) return;

    if (product.variants?.length > 0) {
      setVariantModalOpen(true);
      return;
    }

    if (!product.id) {
      message.error("Product is required");
      return;
    }

    try {
      await addWishList.mutateAsync({
        productId: product.id,
      });

      message.success(
        "Product added to wishlist successfully",
      );
    } catch (error) {
      message.error(getWebErrorMessage(error));
    }
  };

  return (
    <>
      <article className="group flex h-full min-w-0 overflow-hidden rounded-2xl border border-[var(--store-border)] bg-[var(--store-card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--store-primary)] hover:shadow-xl">
        {/* Left image */}
        <div className="relative min-h-[190px] w-[42%] shrink-0 overflow-hidden bg-[var(--store-bg-3)] sm:min-h-[220px] sm:w-[44%]">
          {thumbnail ? (
            <Image
              src={imageUrlSet(thumbnail)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 42vw, 260px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--store-muted)]">
              No image
            </div>
          )}

          {/* Tag */}
          {activeTag && (
            <span className="absolute left-3 top-3 max-w-[85%] truncate rounded-full bg-[var(--store-primary)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {activeTag.name}
            </span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleAddToWishList}
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-[var(--store-primary)] hover:text-white"
          >
            <Heart className="size-4" />
          </button>
        </div>

        {/* Right content */}
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--store-primary)]">
              Best Selling
            </p>

            <Link
              href={`/store/products/details/${product.slug}`}
              className="mt-2 block"
            >
              <h3 className="line-clamp-2 text-base font-bold leading-6 text-[var(--store-text)] transition group-hover:text-[var(--store-primary)] sm:text-lg">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="mt-3 flex flex-wrap items-center gap-1">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <Star
                    key={index}
                    className={`size-3.5 sm:size-4 ${
                      index < Math.round(averageRating)
                        ? "fill-[var(--store-warning)] text-[var(--store-warning)]"
                        : "text-gray-300"
                    }`}
                  />
                ),
              )}

              <span className="ml-1 text-xs text-[var(--store-muted)]">
                ({reviewCount})
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--store-muted)] sm:text-sm">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="text-lg font-bold text-[var(--store-text)] sm:text-xl">
                ৳{product.price}
              </p>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
                  isInStock
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {isInStock
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--store-primary)] px-3 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              <ShoppingCart className="size-4 shrink-0" />

              <span className="truncate">
                Add to Cart
              </span>
            </button>

            <button
              type="button"
              aria-label="Compare product"
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--store-border)] text-[var(--store-muted)] transition hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
            >
              <GitCompareArrows className="size-4" />
            </button>

            <Link
              href={`/store/products/details/${product.slug}`}
              aria-label="View product details"
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--store-border)] text-[var(--store-muted)] transition hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
            >
              <Eye className="size-4" />
            </Link>
          </div>
        </div>
      </article>

      <VariantModal
        product={product}
        open={variantModalOpen}
        onClose={() => setVariantModalOpen(false)}
      />
    </>
  );
};

export default BestSellingProductCard;