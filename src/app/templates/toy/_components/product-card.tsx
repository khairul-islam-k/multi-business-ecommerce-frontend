"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useCart } from "@/app/store/_components/contex/CartContex";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { useAddCartMutation } from "@/lib/api/hooks/add-cart";
import { useTemplateProductWishListMutation } from "@/lib/api/hooks/template-product-wishList";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import type {
  DashboardColors,
  ThemeConfig,
} from "@/types/website/website";
import type { StorefrontProduct } from "@/types/template/template-product";

import VariantModal from "./variant-modal";

type Props = {
  product: StorefrontProduct;
  viewMode?: "grid" | "list";
  activeId?: string;
  theme?: ThemeConfig;
  dashboardColor?: DashboardColors;
};

const ProductCard = ({
  product,
  viewMode = "grid",
  activeId,
  theme,
  dashboardColor,
}: Props) => {
  const router = useRouter();

  const { getAuthUser } = useCart();
  const user = getAuthUser();

  const message = useMessage();

  const { createAddCart } =
    useAddCartMutation();

  const { addWishList } =
    useTemplateProductWishListMutation();

  const [
    variantModalOpen,
    setVariantModalOpen,
  ] = useState(false);

  const thumbnail =
    product.images.find(
      (image) => image.isThumbnail,
    )?.imageUrl ??
    product.images[0]?.imageUrl;

  const isList = viewMode === "list";

  const productDetailsHref =
    `/store/products/details/${product.slug}`;

  const handleAddToCart = async (
    value: StorefrontProduct,
  ) => {
    if (!user) {
      message.error("Please login first");
      router.push("/store/login");
      return;
    }

    if (value.variants.length > 0) {
      setVariantModalOpen(true);
      return;
    }

    if (!value.id) {
      message.error("Product is required");
      return;
    }

    try {
      await createAddCart.mutateAsync({
        productId: value.id,
        quantity: 1,
      });

      setVariantModalOpen(false);

      message.success(
        "Product added to cart successfully",
      );
    } catch (error) {
      message.error(
        getWebErrorMessage(error),
      );
    }
  };

  const handleAddToWishList = async (
    value: StorefrontProduct,
  ) => {
    if (!user) {
      message.error("Please login first");
      router.push("/store/login");
      return;
    }

    if (value.variants.length > 0) {
      setVariantModalOpen(true);
      return;
    }

    if (!value.id) {
      message.error("Product is required");
      return;
    }

    try {
      await addWishList.mutateAsync({
        productId: value.id,
      });

      setVariantModalOpen(false);

      message.success(
        "Product added to wishlist successfully",
      );
    } catch (error) {
      message.error(
        getWebErrorMessage(error),
      );
    }
  };

  return (
    <>
      <div
        className={`group rounded-xl relative w-full cursor-pointer overflow-hidden border border-[var(--store-border)] bg-[var(--store-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--store-primary)]/30 hover:shadow-xl ${
          isList
            ? "lg:flex lg:min-h-[300px] lg:items-stretch"
            : "min-h-[360px]"
        }`}
      >
        {/* Full-card details link */}
        <Link
          href={productDetailsHref}
          aria-label={`View ${product.name} details`}
          className="absolute inset-0 z-10 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--store-primary)]"
        />

        {/* Image area */}
        <div
          className={`relative overflow-hidden bg-[#f8f5f1] dark:bg-white/5 ${
            isList
              ? "h-[220px] sm:h-[240px] lg:h-auto lg:min-h-[300px] lg:w-[340px] lg:shrink-0"
              : "h-[210px] sm:h-[225px] lg:h-[240px]"
          }`}
        >
          {thumbnail ? (
            <Image
              src={imageUrlSet(thumbnail)}
              alt={product.name}
              fill
              sizes={
                isList
                  ? "(max-width: 1024px) 100vw, 340px"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}

          {/* Product tag */}
          {product.tags?.map((tag) => {
            const activeTag =
              tag.id === activeId;

            if (!activeTag) {
              return null;
            }

            return (
              <span
                key={tag.id}
                className="absolute left-3 top-3 z-20 bg-[#f16d59] px-3 py-1 text-xs font-semibold text-white"
              >
                {tag.name}
              </span>
            );
          })}

          {/* Always-visible action icons */}
          <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
            <button
              type="button"
              onClick={() =>
                handleAddToWishList(product)
              }
              aria-label="Add to wishlist"
              className="grid size-10 place-items-center rounded-full border border-black/5 bg-white text-gray-700 shadow-md transition hover:bg-[#f16d59] hover:text-white dark:border-white/10 dark:bg-black/75 dark:text-white dark:hover:bg-[#f16d59]"
            >
              <Heart className="size-[18px]" />
            </button>

            <button
              type="button"
              disabled={
                !product.stockSummary.inStock
              }
              onClick={() =>
                handleAddToCart(product)
              }
              aria-label="Add to cart"
              className="grid size-10 place-items-center rounded-full border border-black/5 bg-white text-gray-700 shadow-md transition hover:bg-[#f16d59] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-black/75 dark:text-white dark:hover:bg-[#f16d59]"
            >
              <ShoppingCart className="size-[18px]" />
            </button>

            <Link
              href={productDetailsHref}
              aria-label="View product details"
              className="grid size-10 place-items-center rounded-full border border-black/5 bg-white text-gray-700 shadow-md transition hover:bg-[#f16d59] hover:text-white dark:border-white/10 dark:bg-black/75 dark:text-white dark:hover:bg-[#f16d59]"
            >
              <Eye className="size-[18px]" />
            </Link>
          </div>
        </div>

        {/* Product information */}
        <div
          className={`relative p-5 ${
            isList
              ? "text-center lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-8 lg:text-left"
              : "flex min-h-[145px] flex-col text-center"
          }`}
        >
          <h3
            className={`line-clamp-1 font-semibold text-[var(--store-text)] transition group-hover:text-[#f16d59] ${
              isList
                ? "text-lg lg:text-2xl"
                : "text-base sm:text-lg"
            }`}
          >
            {product.name}
          </h3>

          {isList && (
            <p className="mt-3 hidden max-w-2xl text-sm leading-7 text-[var(--store-muted)] lg:line-clamp-3">
              {product.description}
            </p>
          )}

          <p className="mt-3 text-lg font-bold text-[var(--store-text)] sm:text-xl">
            ৳{product.price}
          </p>

          <p
            className={`mt-1.5 text-xs font-medium ${
              product.stockSummary.inStock
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {product.stockSummary.inStock
              ? "In Stock"
              : "Out of Stock"}
          </p>

          {/* List-view actions */}
          {isList && (
            <div className="relative z-20 mt-6 hidden items-center gap-3 lg:flex">
              <button
                type="button"
                disabled={
                  !product.stockSummary.inStock
                }
                onClick={() =>
                  handleAddToCart(product)
                }
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#f16d59] px-7 text-sm font-semibold text-white transition hover:bg-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="size-4" />

                Add to Cart
              </button>

              <Link
                href={productDetailsHref}
                className="inline-flex h-12 items-center justify-center gap-2 border border-[var(--store-border)] px-7 text-sm font-semibold text-[var(--store-text)] transition hover:border-[#f16d59] hover:text-[#f16d59]"
              >
                <Eye className="size-4" />

                View Details
              </Link>
            </div>
          )}
        </div>
      </div>

      <VariantModal
        product={product}
        open={variantModalOpen}
        onClose={() =>
          setVariantModalOpen(false)
        }
        dashboardColor={dashboardColor}
        theme={theme}
      />
    </>
  );
};

export default ProductCard;