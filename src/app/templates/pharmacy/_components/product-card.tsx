"use client";

import Image from "next/image";
import {
    Heart,
    ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    type KeyboardEvent,
    type MouseEvent,
    useState,
} from "react";

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
    const message = useMessage();

    const { getAuthUser } = useCart();
    const user = getAuthUser();

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

    const detailsUrl = `/store/products/details/${product.slug}`;

    const activeTag = product.tags?.find(
        (tag) => tag.id === activeId,
    );

    const handleCardClick = () => {
        router.push(detailsUrl);
    };

    const handleCardKeyDown = (
        event: KeyboardEvent<HTMLDivElement>,
    ) => {
        if (event.target !== event.currentTarget) {
            return;
        }

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            router.push(detailsUrl);
        }
    };

    const handleAddToCart = async (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        if (!user) {
            message.error("Please login first");
            router.push("/store/login");
            return;
        }

        if (!product.stockSummary.inStock) {
            message.error("This product is out of stock");
            return;
        }

        if (product.variants.length > 0) {
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
            message.error(
                getWebErrorMessage(error),
            );
        }
    };

    const handleAddToWishList = async (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        if (!user) {
            message.error("Please login first");
            router.push("/store/login");
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
            message.error(
                getWebErrorMessage(error),
            );
        }
    };

    return (
        <>
            <div
                role="link"
                tabIndex={0}
                onClick={handleCardClick}
                onKeyDown={handleCardKeyDown}
                aria-label={`View ${product.name}`}
                className={`group w-full cursor-pointer overflow-hidden rounded-xl border border-[var(--store-border)] bg-[var(--store-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--store-primary)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-primary)] ${isList
                        ? "sm:flex sm:min-h-[250px]"
                        : "h-full"
                    }`}
            >
                {/* Product image */}
                <div
                    className={`relative overflow-hidden bg-[var(--store-bg-2)] ${isList
                            ? "h-[240px] sm:h-auto sm:w-[280px] sm:shrink-0"
                            : "h-[210px] sm:h-[230px] lg:h-[250px]"
                        }`}
                >
                    {thumbnail ? (
                        <Image
                            src={imageUrlSet(thumbnail)}
                            alt={product.name}
                            fill
                            sizes={
                                isList
                                    ? "(max-width: 639px) 100vw, 280px"
                                    : "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
                            }
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-[var(--store-muted)]">
                            No image available
                        </div>
                    )}


                    {/* Stock status */}
                    <span
                        className={`absolute bottom-3 left-3 rounded-md px-2 py-1 text-[10px] font-semibold ${product.stockSummary.inStock
                                ? "bg-green-600 text-white"
                                : "bg-red-500 text-white"
                            }`}
                    >
                        {product.stockSummary.inStock
                            ? "In Stock"
                            : "Out of Stock"}
                    </span>
                </div>

                {/* Product content */}
                {/* Product content */}
                <div
                    className={`flex flex-col ${isList
                            ? "flex-1 p-4 sm:justify-center sm:p-5"
                            : "p-3"
                        }`}
                >
                    {/* Product name */}
                    <h3
                        className={`line-clamp-2 font-semibold text-[var(--store-text)] transition-colors group-hover:text-[var(--store-primary)] ${isList
                                ? "text-base leading-5 sm:text-lg"
                                : "text-sm leading-5"
                            }`}
                    >
                        {product.name}
                    </h3>

                    {/* Product description */}
                    {isList && product.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--store-muted)] sm:text-sm">
                            {product.description}
                        </p>
                    )}

                    {/* Price and add button */}
                    <div
                        className={`flex items-center justify-between gap-2 ${isList ? "mt-4" : "mt-2"
                            }`}
                    >
                        <div className="min-w-0">
                            <p className="text-[10px] leading-none text-[var(--store-muted)]">
                                Price
                            </p>

                            <p className="mt-1 truncate text-base font-bold leading-none text-[var(--store-text)] sm:text-lg">
                                ৳{product.price}
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={
                                !product.stockSummary.inStock ||
                                createAddCart.isPending
                            }
                            onClick={handleAddToCart}
                            aria-label={`Add ${product.name} to cart`}
                            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--store-accent)] px-3 text-xs font-semibold leading-none text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ShoppingCart className="size-3.5" />

                            <span>
                                {createAddCart.isPending
                                    ? "Adding..."
                                    : "Add"}
                            </span>
                        </button>
                    </div>
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