"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Eye,
  Heart,
  ShoppingCart,
} from "lucide-react";

import { StorefrontProduct } from "@/types/template/template-product";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { useAddCartMutation } from "@/lib/api/hooks/add-cart";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { useTemplateProductWishListMutation } from "@/lib/api/hooks/template-product-wishList";
import { useCart } from "@/app/store/_components/contex/CartContex";
import {
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
  const { store } = useParams<{
    store: string;
  }>();

  const { getAuthUser } = useCart();
  const user = getAuthUser();

  const message = useMessage();

  const { createAddCart } =
    useAddCartMutation();

  const { addWishList } =
    useTemplateProductWishListMutation();

  const [variantModalOpen, setVariantModalOpen] =
    useState(false);

  const thumbnail =
    product.images.find(
      (image) => image.isThumbnail,
    )?.imageUrl ||
    product.images[0]?.imageUrl;

  const isList = viewMode === "list";

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
        className={`group overflow-hidden rounded-lg border border-gray-200 bg-[var(--store-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          isList
            ? "lg:flex lg:items-stretch"
            : ""
        }`}
      >
        {/* Product image */}
        <div
          className={`relative overflow-hidden bg-[#f8f5f1] ${
            isList
              ? "h-[160px] lg:h-auto lg:min-h-[280px] lg:w-[320px] lg:shrink-0"
              : "h-[160px]"
          }`}
        >
          {thumbnail ? (
            <Image
              src={imageUrlSet(thumbnail)}
              alt={product.name}
              fill
              sizes={
                isList
                  ? "(max-width: 1024px) 100vw, 320px"
                  : "(max-width: 768px) 100vw, 25vw"
              }
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm text-gray-400">
              No image available
            </div>
          )}

          {/* Product tag */}
          {product.tags?.map((singleData) => {
            const activeTag =
              singleData.id === activeId;

            if (!activeTag) {
              return null;
            }

            return (
              <span
                key={singleData.id}
                className="absolute left-3 top-3 z-10 rounded-full bg-[#f16d59] px-3 py-1 text-xs font-semibold text-white"
              >
                {singleData.name}
              </span>
            );
          })}

          {/* Right-side icons */}
          <div className="absolute right-3 top-3 z-20 flex flex-col items-center gap-2">
            {/* Wishlist */}
            <button
              type="button"
              onClick={() =>
                handleAddToWishList(product)
              }
              aria-label="Add to wishlist"
              className="grid size-10 place-items-center rounded-full bg-white text-gray-700 shadow-md transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
            >
              <Heart className="size-5" />
            </button>

            {/* Add to cart */}
            <button
              type="button"
              disabled={
                !product.stockSummary.inStock
              }
              onClick={() =>
                handleAddToCart(product)
              }
              aria-label="Add to cart"
              className="grid size-10 place-items-center rounded-full bg-white text-gray-700 shadow-md transition-all duration-300 hover:bg-[#f16d59] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-700"
            >
              <ShoppingCart className="size-5" />
            </button>

            {/* View product */}
            <Link
              href={`/store/products/details/${product.slug}`}
              aria-label="View product"
              className="grid size-10 place-items-center rounded-full bg-white text-gray-700 shadow-md transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
            >
              <Eye className="size-5" />
            </Link>
          </div>
        </div>

        {/* Product content */}
        <div
          className={`p-5 ${
            isList
              ? "text-center lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-8 lg:text-left"
              : "text-center"
          }`}
        >
          <h3
            className={`line-clamp-1 font-semibold transition group-hover:text-[#f16d59] ${
              isList
                ? "text-base lg:text-2xl"
                : "text-base"
            }`}
          >
            {product.name}
          </h3>

          {/* Description for list view */}
          {isList && (
            <p className="mt-3 hidden max-w-2xl text-sm leading-6 text-gray-500 lg:block">
              {product.description}
            </p>
          )}

          {/* Price */}
          <p className="mt-3 text-lg font-bold text-[var(--store-text-primary)]">
            ৳{product.price}
          </p>

          {/* Stock status */}
          <p
            className={`mt-2 text-xs font-medium ${
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
            <div className="mt-5 hidden items-center gap-3 lg:flex">
              <button
                type="button"
                disabled={
                  !product.stockSummary.inStock
                }
                onClick={() =>
                  handleAddToCart(product)
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f16d59] px-6 text-sm font-semibold text-white transition hover:bg-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="size-4" />

                Add to Cart
              </button>

              <Link
                href={`/store/${store}/products/details/${product.id}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gray-300 px-6 text-sm font-semibold text-gray-800 transition hover:border-[#f16d59] hover:text-[#f16d59]"
              >
                <Eye className="size-4" />

                View Details
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Variant modal */}
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