"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    ArrowDownAZ,
    ArrowUpAZ,
    ChevronDown,
    Grid2X2,
    List,
} from "lucide-react";

import ProductCard from "../_components/product-card";
import {
    useProductCategoryQuery,
    useTemplateProductQuery,
} from "@/lib/api/hooks/public-website";
import Loader from "@/components/shared/loader";
import { SortOrder } from "@/lib/api";
import { DashboardColors, ThemeConfig } from "@/types/website/website";
import { useDebounce } from "use-debounce";
import { ProductCategorySidebar } from "../_components/product-category-sidebar";

type ProductProps = {
    categoryId?: string;
    theme?: ThemeConfig;
    dashboardColor?: DashboardColors;
    search?: string;
};



const FurnitureProductPage = ({
    categoryId,
    theme,
    dashboardColor,
    search
}: ProductProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const [sortBy, setSortBy] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const { data: products } = useTemplateProductQuery({
        categoryId,
        sortBy,
        sortOrder,
        search
    });

    // all categories
    const { data: categories, isLoading, isFetching } = useProductCategoryQuery();

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleCategoryClick = (id: string) => {
        router.push(`${pathname}?categoryId=${id}`);
    };

    const handleClearCategory = () => {
        router.push(pathname);
    };

    const productItems = products?.items ?? [];

    if (isLoading || isFetching) return <Loader />;

    return (
        <section className="bg-[var(--store-bg-3)] py-8">


            <div className="mx-auto grid w-12/13 grid-cols-1 gap-3 px-4 sm:px-6 lg:grid-cols-[270px_1fr] lg:px-8">
                {/* Left Sidebar */}
                <ProductCategorySidebar
                    categories={categories}
                    categoryId={categoryId}
                    handleClearCategory={handleClearCategory}
                    handleCategoryClick={handleCategoryClick}
                />

                {/* Right Content */}
                <div>
                    {/* Top Filter Bar */}
                    <div className="mb-8 flex flex-col gap-4 bg-[var(--store-bg-1)] p-4 shadow-sm sm:p-5 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
                            Total Products Found: {products?.items.length ?? 0}
                        </h1>

                        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                            {/* Sort label and select: one line on mobile */}
                            <div className="flex w-full items-center gap-2 whitespace-nowrap md:w-auto">
                                <label
                                    htmlFor="product-sort"
                                    className="shrink-0 text-sm font-semibold sm:text-base"
                                >
                                    Sort by:
                                </label>

                                <div className="relative min-w-0 flex-1 md:w-48 md:flex-none">
                                    <select
                                        id="product-sort"
                                        value={sortBy}
                                        onChange={(event) => setSortBy(event.target.value)}
                                        className="h-11 w-full appearance-none rounded-md border border-gray-300 bg-[var(--store-bg-1)] px-3 pr-9 text-sm outline-none transition focus:border-[#f16d59] md:h-12"
                                    >
                                        <option value="name">Name</option>
                                        <option value="price">Price</option>
                                        <option value="createdAt">Created At</option>
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>

                            {/* Sort order and view buttons */}
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                                    }
                                    className="inline-flex h-11 items-center gap-2 rounded-md border border-gray-200 bg-[var(--store-bg-1)] px-3 text-sm font-semibold shadow-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white md:h-12"
                                >
                                    {sortOrder === "desc" ? (
                                        <>
                                            <ArrowUpAZ className="size-4" />
                                            ASC
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownAZ className="size-4" />
                                            DESC
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setViewMode("list")}
                                    aria-label="List view"
                                    className={`grid h-11 w-11 place-items-center rounded-md border transition md:h-12 md:w-12 ${viewMode === "list"
                                        ? "border-[#f16d59] bg-[#f16d59] text-white"
                                        : "border-gray-300 bg-[var(--store-bg-1)] text-gray-500 hover:border-[#f16d59] hover:text-[#f16d59]"
                                        }`}
                                >
                                    <List className="h-5 w-5 md:h-6 md:w-6" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setViewMode("grid")}
                                    aria-label="Grid view"
                                    className={`grid h-11 w-11 place-items-center rounded-md border transition md:h-12 md:w-12 ${viewMode === "grid"
                                        ? "border-[#f16d59] bg-[#f16d59] text-white"
                                        : "border-gray-300 bg-[var(--store-bg-1)] text-gray-500 hover:border-[#f16d59] hover:text-[#f16d59]"
                                        }`}
                                >
                                    <Grid2X2 className="h-5 w-5 md:h-6 md:w-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {productItems.length > 0 ? (
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                                    : "grid grid-cols-1 gap-6"
                            }
                        >
                            {/* check filteredProducts */}

                            {products?.items.map((product) => (
                                <ProductCard
                                    viewMode={viewMode}
                                    key={product.id}
                                    product={product}
                                    theme={theme}
                                    dashboardColor={dashboardColor}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl bg-[var(--store-bg-1)] px-6 py-16 text-center shadow-sm">
                            <h3 className="text-xl font-bold text-gray-950">
                                No products found
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Try another category or clear the category filter.
                            </p>

                            <button
                                type="button"
                                onClick={handleClearCategory}
                                className="mt-5 rounded-full bg-[#f16d59] px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-950"
                            >
                                View All Products
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FurnitureProductPage;
