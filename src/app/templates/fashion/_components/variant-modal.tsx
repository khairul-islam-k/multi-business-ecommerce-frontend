"use client";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { useAddCartMutation } from "@/lib/api/hooks/add-cart";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { AddToCartPayload } from "@/types/template/add-cart";
import { StorefrontProduct } from "@/types/template/template-product";
import { ShoppingCart, Star, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type ProductVariant = NonNullable<StorefrontProduct["variants"]>[number];

type Props = {
    product: StorefrontProduct;
    open: boolean;
    onClose: () => void;
};

const VariantModal = ({
    product,
    open,
    onClose,
}: Props) => {
    const message = useMessage();
    const { createAddCart } = useAddCartMutation();

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open, onClose]);

    if (!open) return null;

    const productThumbnail =
        product.images?.find((image) => image.isThumbnail)?.imageUrl ||
        product.images?.[0]?.imageUrl;

    const variants = product.variants ?? [];

    const getVariantImage = (variant: ProductVariant) => {
        const variantImage =
            variant.images?.find((image) => image.isThumbnail)?.imageUrl ||
            variant.images?.[0]?.imageUrl;

        return variantImage || productThumbnail;
    };

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
            await createAddCart.mutateAsync(values);
            onClose()
            message.success("Product added to cart successfully");
        } catch (error) {
            message.error(getWebErrorMessage(error));
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-3 py-5 sm:px-4">
            {/* Overlay */}
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/50"
                aria-label="Close modal"
            />

            {/* Modal Box */}
            <div className="relative z-10 max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-950 sm:text-2xl">
                            Select Variant
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">{product.name}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid size-9 place-items-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-[#f16d59] hover:text-white"
                        aria-label="Close modal"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-4 sm:p-6">
                    {variants.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                No variant found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                This product does not have any variant.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {variants.map((variant) => {
                                const imageUrl = getVariantImage(variant);

                                const price =
                                    variant.effectivePrice ||
                                    variant.priceOverride ||
                                    product.price;

                                return (
                                    <div
                                        key={variant.id}
                                        className="group/variant overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        {/* Image Area */}
                                        <div className="relative h-[260px] overflow-hidden bg-[#f8f5f1] sm:h-[300px]">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrlSet(imageUrl)}
                                                    alt={variant.title || product.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover transition-transform duration-700 group-hover/variant:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                    No Image
                                                </div>
                                            )}

                                            <span className="absolute left-4 top-4 rounded-full bg-[#f16d59] px-3 py-1 text-xs font-semibold text-white">
                                                Variant
                                            </span>

                                            {/* Hover Icons */}
                                            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-8 items-center gap-3 opacity-0 transition-all duration-300 group-hover/variant:translate-y-0 group-hover/variant:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleAddItem({
                                                            productId: product.id,
                                                            variantId: variant.id,
                                                            quantity: 1
                                                        })
                                                    }}
                                                    className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
                                                    aria-label="Add variant to cart"
                                                >
                                                    <ShoppingCart className="h-5 w-5" />
                                                </button>

                                            </div>
                                        </div>

                                        {/* Variant Content */}
                                        <div className="p-5 text-center">
                                            <h3 className="line-clamp-1 text-base font-semibold text-gray-950 transition group-hover/variant:text-[#f16d59]">
                                                {variant.title}
                                            </h3>

                                            <p className="mt-1 text-xs text-gray-500">
                                                SKU: {variant.sku}
                                            </p>

                                            <div className="mt-2 flex items-center justify-center gap-1">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <Star
                                                        key={index}
                                                        className={`h-4 w-4 ${index < product.reviewSummary.averageRating
                                                            ? "fill-[#f16d59] text-[#f16d59]"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}

                                                <span className="ml-1 text-xs text-gray-500">
                                                    ({product.reviewSummary.reviewCount})
                                                </span>
                                            </div>

                                            <p className="mt-3 text-lg font-bold text-gray-950">
                                                ৳{price}
                                            </p>

                                            <p
                                                className={`mt-2 text-xs font-medium ${variant.status === "ACTIVE"
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                {variant.status === "ACTIVE"
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleAddItem({
                                                        productId: product.id,
                                                        variantId: variant.id,
                                                        quantity: 1
                                                    })
                                                }}
                                                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#f16d59] px-6 text-sm font-semibold text-white transition hover:bg-gray-950"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default VariantModal;