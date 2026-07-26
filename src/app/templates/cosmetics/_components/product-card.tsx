"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Heart,
  ShoppingCart,
} from "lucide-react";
import {
  useParams,
  useRouter,
} from "next/navigation";
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
    )?.imageUrl ??
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
    <div
      className={`group w-full overflow-hidden rounded-none border border-gray-200 bg-[var(--store-card)] transition-all duration-300 hover:shadow-xl ${
        isList
          ? "lg:flex lg:min-h-[360px] lg:items-stretch"
          : "min-h-[440px]"
      }`}
    >
      {/* Image area */}
      <div
        className={`relative overflow-hidden rounded-none bg-[#f8f5f1] ${
          isList
            ? "h-[260px] sm:h-[300px] lg:h-auto lg:min-h-[360px] lg:w-[400px] lg:shrink-0"
            : "h-[280px] sm:h-[310px] lg:h-[330px]"
        }`}
      >
        {thumbnail ? (
          <Image
            src={imageUrlSet(thumbnail)}
            alt={product.name}
            fill
            sizes={
              isList
                ? "(max-width: 1024px) 100vw, 400px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-110"
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
              className="absolute left-4 top-4 bg-[#f16d59] px-3 py-1 text-xs font-semibold text-white"
            >
              {tag.name}
            </span>
          );
        })}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={() =>
            handleAddToWishList(product)
          }
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Image bottom actions */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 translate-y-8 items-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            disabled={
              !product.stockSummary.inStock
            }
            onClick={() =>
              handleAddToCart(product)
            }
            aria-label="Add to cart"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>

          <Link
            href={`/store/products/details/${product.slug}`}
            aria-label="View product"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Product information */}
      <div
        className={`p-6 ${
          isList
            ? "text-center lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-10 lg:text-left"
            : "flex min-h-[160px] flex-col text-center"
        }`}
      >
        <Link
          href={`/store/products/details/${product.slug}`}
        >
          <h3
            className={`line-clamp-1 font-semibold text-[var(--store-text)] transition group-hover:text-[#f16d59] ${
              isList
                ? "text-lg lg:text-2xl"
                : "text-lg"
            }`}
          >
            {product.name}
          </h3>
        </Link>

        {isList && (
          <p className="mt-4 hidden max-w-2xl text-sm leading-7 text-gray-500 lg:block">
            {product.description}
          </p>
        )}

        <p className="mt-4 text-xl font-bold text-[var(--store-text)]">
          ৳{product.price}
        </p>

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
          <div className="mt-6 hidden items-center gap-3 lg:flex">
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
              <ShoppingCart className="h-4 w-4" />

              Add to Cart
            </button>

            <Link
              href={`/store/products/details/${product.slug}`}
              className="inline-flex h-12 items-center justify-center gap-2 border border-gray-300 px-7 text-sm font-semibold text-gray-800 transition hover:border-[#f16d59] hover:text-[#f16d59]"
            >
              <Eye className="h-4 w-4" />

              View Details
            </Link>
          </div>
        )}
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
    </div>
  );
};

export default ProductCard;