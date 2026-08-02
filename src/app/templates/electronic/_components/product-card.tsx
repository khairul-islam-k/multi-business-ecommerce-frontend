"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useCart } from "@/app/store/_components/contex/CartContex";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { useAddCartMutation } from "@/lib/api/hooks/add-cart";
import { useTemplateProductWishListMutation } from "@/lib/api/hooks/template-product-wishList";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import type { StorefrontProduct } from "@/types/template/template-product";
import type {
  DashboardColors,
  ThemeConfig,
} from "@/types/website/website";

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
  const message = useMessage();

  const [variantModalOpen, setVariantModalOpen] =
    useState(false);

  const { getAuthUser } = useCart();
  const user = getAuthUser();

  const { createAddCart } =
    useAddCartMutation();

  const { addWishList } =
    useTemplateProductWishListMutation();

  const thumbnail =
    product.images.find(
      (image) => image.isThumbnail,
    )?.imageUrl ||
    product.images[0]?.imageUrl;

  const isList = viewMode === "list";
  const isInStock =
    product.stockSummary.inStock;

  const productDetailsUrl =
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
    <div
      className={`group relative flex overflow-hidden rounded-xl border-x border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:border-[#f16d59]/50 hover:shadow-xl ${
        isList
          ? "flex-col lg:min-h-[310px] lg:flex-row"
          : "flex-col"
      }`}
    >
      {/* Product image section */}
      <div
        className={`relative flex shrink-0 items-center justify-center ${
          isList
            ? "min-h-[260px] p-6 lg:w-[300px]"
            : "min-h-[250px] p-5"
        }`}
      >
        {/* Product tags */}
        <div className="absolute left-4 top-4 z-20 flex flex-col items-start gap-2">
          {product.tags?.map((tag) => {
            const isActiveTag =
              tag.id === activeId;

            if (!isActiveTag) {
              return null;
            }

            return (
              <span
                key={tag.id}
                className="rounded-full bg-[#f16d59] px-3 py-1 text-[11px] font-semibold text-white shadow-sm"
              >
                {tag.name}
              </span>
            );
          })}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() =>
            handleAddToWishList(product)
          }
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Fixed size image */}
        <Link
          href={productDetailsUrl}
          className={`relative block overflow-hidden rounded-lg ${
            isList
              ? "h-[210px] w-[210px] lg:h-[200px] lg:w-[200px]"
              : "h-[200px] w-[200px] sm:h-[150px] sm:w-[150px]"
          }`}
        >
          {thumbnail ? (
            <Image
              src={imageUrlSet(thumbnail)}
              alt={product.name}
              fill
              sizes={
                isList
                  ? "230px"
                  : "(max-width: 640px) 200px, 220px"
              }
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gray-100 text-sm text-gray-400">
              No image
            </div>
          )}
        </Link>
      </div>

      {/* Product content */}
      <div
        className={`flex min-w-0 flex-1 flex-col ${
          isList
            ? "p-5 lg:p-7"
            : "p-4 sm:p-5"
        }`}
      >
        {/* Product name at top */}
        <Link href={productDetailsUrl}>
          <h3
            className={`font-semibold leading-6 text-[var(--store-text-primary)] transition-colors duration-300 hover:text-[#f16d59] group-hover:text-[#f16d59] ${
              isList
                ? "line-clamp-2 text-lg lg:text-xl"
                : 'mb-2'
            }`}
          >
            {product.name}
          </h3>
        </Link>


        {/* List description */}
        {isList &&
          product.description && (
            <p className="mt-4 hidden max-w-2xl line-clamp-3 text-sm leading-6 text-gray-500 lg:block">
              {product.description}
            </p>
          )}

        {/* Push price to the bottom */}
        <div className="mt-auto">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xl font-bold text-[var(--store-text-primary)]">
                ৳{product.price}
              </p>

              <p
                className={`mt-1 text-xs font-semibold ${
                  isInStock
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {isInStock
                  ? "In Stock"
                  : "Out of Stock"}
              </p>
            </div>
          </div>

          {/* Actions always visible on mobile */}
          <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
            <Link
              href={productDetailsUrl}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:border-[#f16d59] hover:text-[#f16d59]"
            >
              <Eye className="h-4 w-4" />
              View
            </Link>

            <button
              type="button"
              disabled={!isInStock}
              onClick={() =>
                handleAddToCart(product)
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#f16d59] px-3 text-xs font-semibold text-white transition hover:bg-gray-950 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Desktop hover action buttons */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 hidden translate-y-full bg-white/95 p-3 opacity-0 shadow-[0_-8px_25px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:block">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={productDetailsUrl}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-[#f16d59] hover:bg-[#fff7f5] hover:text-[#f16d59]"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>

          <button
            type="button"
            disabled={!isInStock}
            onClick={() =>
              handleAddToCart(product)
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f16d59] px-4 text-sm font-semibold text-white transition hover:bg-gray-950 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
          </button>
        </div>
      </div>

      <VariantModal
        product={product}
        open={variantModalOpen}
        onClose={() =>
          setVariantModalOpen(false)
        }
        theme={theme}
        dashboardColor={
          dashboardColor
        }
      />
    </div>
  );
};

export default ProductCard;