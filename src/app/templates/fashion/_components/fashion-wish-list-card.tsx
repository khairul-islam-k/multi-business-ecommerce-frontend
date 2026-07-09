"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Loader2,
  ShoppingCart,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { useAddCartMutation } from "@/lib/api/hooks/add-cart";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { WishlistItem } from "@/types/template/wishList";
import { AddToCartPayload } from "@/types/template/add-cart";
import { useTemplateProductWishListMutation } from "@/lib/api/hooks/template-product-wishList";

type Props = {
  item: WishlistItem;
  viewMode?: "grid" | "list";
};

const FashionWishListCard = ({
  item,
  viewMode = "grid",
}: Props) => {
  const message = useMessage();
  const { createAddCart } = useAddCartMutation();
  const { removeWishList } = useTemplateProductWishListMutation();

  const [isRemoving, setIsRemoving] = useState(false);

  const product = item.product;
  const variant = item.variant;
  const image = item.image;

  const isList = viewMode === "list";

  const thumbnail = image?.imageUrl;
  const price = variant?.priceOverride || product?.price;
  const variantTitle = variant?.title;

    const quantity = Number(item?.stockSummary?.totalQuantity) ?? 0;

  const averageRating = 0;
  const reviewCount = 0;

  const handleAddItem = async (values: AddToCartPayload) => {

    if (!values.productId) {
      message.error("Product is required");
      return;
    }

    if (!values.quantity || values.quantity < 1) {
      message.error("Quantity must be at least 1");
      return;
    }

    try {
      if (values.variantId) {
        await createAddCart.mutateAsync(values);
        message.success("Product added to cart successfully");
      } else {
        await createAddCart.mutateAsync({
          productId: values.productId,
          quantity: 1
        });
        message.success("Product added to cart successfully");
      }
    } catch (error) {
      message.error(getWebErrorMessage(error));
    }
  };

  const handleRemoveWishlist = async () => {

    try {
      setIsRemoving(true);

      await removeWishList.mutateAsync(item.id);

      message.success("Product removed from wishlist");
    } catch (error) {
      message.error(getWebErrorMessage(error));
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div
      className={`group overflow-hidden border border-gray-200 bg-[var(--store-bg-1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isList ? "lg:flex lg:items-stretch" : ""
        }`}
    >
      {/* Image Area */}
      <div
        className={`relative overflow-hidden bg-[#f8f5f1] ${isList
          ? "h-[300px] lg:h-auto lg:min-h-[280px] lg:w-[320px] lg:shrink-0"
          : "h-[300px]"
          }`}
      >
        {thumbnail ? (
          <Image
            src={imageUrlSet(thumbnail)}
            alt={image?.altText || product.name}
            fill
            sizes={
              isList
                ? "(max-width: 1024px) 100vw, 320px"
                : "(max-width: 768px) 100vw, 25vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-semibold text-gray-400">
            No Image
          </div>
        )}

        {/* Status */}
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${quantity ? "bg-green-600" : "bg-red-500"
            }`}
        >
          {quantity ? "Available" : "Unavailable"}
        </span>

        {/* Heart Icon */}
        <button
          onClick={handleRemoveWishlist}
          disabled={isRemoving}
          type="button"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-red-500 shadow-sm transition-all duration-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Remove from wishlist"
        >
          {isRemoving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Trash2 className="h-5 w-5" />
          )}
        </button>

        {/* Bottom Icons */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-8 items-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {/* <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
            aria-label="Compare"
          >
            <GitCompareArrows className="h-5 w-5" />
          </button> */}

          <button
            type="button"
            disabled={!quantity || createAddCart.isPending}
            onClick={() => handleAddItem({
              productId: product.id,
              variantId: variant?.id,
              quantity: 1
            })}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add to cart"
          >
            {createAddCart.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
          </button>

          <Link
            href={`/store/products/details/${product?.slug}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
            aria-label="View product"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div
        className={`p-5 ${isList
          ? "text-center lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-8 lg:text-left"
          : "text-center"
          }`}
      >
        <h3
          className={`line-clamp-1 font-semibold transition group-hover:text-[#f16d59] ${isList ? "text-base lg:text-2xl" : "text-base"
            }`}
        >
          {product?.name}
        </h3>

        {variantTitle && (
          <p className="mt-2 text-xs font-semibold text-[#f16d59]">
            {variantTitle}
          </p>
        )}

        {isList && (
          <p className="mt-3 hidden max-w-2xl text-sm leading-6 text-gray-500 lg:block">
            {product?.description}
          </p>
        )}

        <div
          className={`mt-2 flex items-center gap-1 ${isList ? "justify-center lg:justify-start" : "justify-center"
            }`}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${index < averageRating
                ? "fill-[#f16d59] text-[#f16d59]"
                : "text-gray-300"
                }`}
            />
          ))}

          <span className="ml-1 text-xs">({reviewCount})</span>
        </div>

        <p className="mt-3 text-lg font-bold">৳{price}</p>

        <p
          className={`mt-2 text-xs font-medium ${quantity ? "text-green-600" : "text-red-500"
            }`}
        >
          {quantity ? "In Stock" : "Unavailable"}
        </p>

        {/* List view buttons only large screen */}
        {isList && (
          <div className="mt-5 hidden items-center gap-3 lg:flex">
            <button
              type="button"
              disabled={!quantity || createAddCart.isPending}
              // onClick={handleAddToCart}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f16d59] px-6 text-sm font-semibold text-white transition hover:bg-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createAddCart.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              Add to Cart
            </button>

            <Link
              href={`/store/products/details/${product.slug}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gray-300 px-6 text-sm font-semibold text-gray-800 transition hover:border-[#f16d59] hover:text-[#f16d59]"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FashionWishListCard;