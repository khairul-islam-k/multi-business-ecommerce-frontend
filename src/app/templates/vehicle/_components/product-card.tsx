"use client";

import Image from "next/image";
import Link from "next/link";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import type { StorefrontProduct } from "@/types/template/template-product";
import type {
    DashboardColors,
    ThemeConfig,
} from "@/types/website/website";

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
}: Props) => {
    const thumbnail =
        product.images.find(
            (image) => image.isThumbnail,
        )?.imageUrl ||
        product.images[0]?.imageUrl;

    const isList = viewMode === "list";

    const detailsHref =
        `/store/products/details/${product.slug}`;

    return (
        <Link
            href={detailsHref}
            aria-label={`View ${product.name} details`}
            className={`group block overflow-hidden rounded-[4px] border border-gray-200 bg-[var(--store-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-primary)] ${isList
                    ? "lg:flex lg:items-stretch"
                    : ""
                }`}
        >
            {/* Product image */}
            <div className="p-1">

                <div
                    className={`relative overflow-hidden bg-[#f8f5f1] ${isList
                            ? "h-[180px] lg:h-auto lg:min-h-[280px] lg:w-[320px] lg:shrink-0"
                            : "md:h-[180px] h-[100px]"
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
                                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            }
                            className="transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                            No image available
                        </div>
                    )}

                    {/* Stock badge */}
                    <span
                        className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${product.stockSummary.inStock
                                ? "bg-green-600"
                                : "bg-red-500"
                            }`}
                    >
                        {product.stockSummary.inStock
                            ? "In Stock"
                            : "Out of Stock"}
                    </span>
                </div>
            </div>

            {/* Product content */}
            <div
                className={`p-4 ${isList
                        ? "lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-8"
                        : ""
                    }`}
            >
                <h3
                    className={`font-semibold text-[var(--store-text-primary)] transition-colors duration-300 group-hover:text-[#f16d59] ${isList
                            ? "text-base lg:text-2xl"
                            : "text-base"
                        }`}
                >
                    {product.name}
                </h3>

                {isList &&
                    product.description && (
                        <p className="mt-3 hidden max-w-2xl text-sm leading-6 text-[var(--store-text-secondary)] lg:line-clamp-3">
                            {product.description}
                        </p>
                    )}

                <p
                    className={`font-bold text-[var(--store-text-primary)] ${isList
                            ? "text-xl lg:text-2xl"
                            : "text-lg"
                        }`}
                >
                    ৳{product.price}
                </p>
            </div>
        </Link>
    );
};

export default ProductCard;