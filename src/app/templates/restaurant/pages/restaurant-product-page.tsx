"use client";

import React, { useState } from "react";
import {
    usePathname,
    useRouter,
} from "next/navigation";
import {
    ArrowDownAZ,
    ArrowUpAZ,
    ChevronDown,
    Grid2X2,
    List,
    Search,
} from "lucide-react";

import ProductCard from "../_components/product-card";
import {
    useTemplateProductQuery,
} from "@/lib/api/hooks/public-website";
import Loader from "@/components/shared/loader";
import { SortOrder } from "@/lib/api";
import type {
    DashboardColors,
    HeaderSlide,
    ThemeConfig,
} from "@/types/website/website";
import Pagination from "@/app/store/_components/pagination";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useDebounce } from "use-debounce";

type ProductProps = {
    categoryId?: string;
    theme?: ThemeConfig;
    dashboardColor?: DashboardColors;
    brandId?: string;
    restaurantSlide: HeaderSlide;
};


const RestaurantProductPage = ({
    categoryId,
    brandId,
    theme,
    restaurantSlide,
    dashboardColor,
}: ProductProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const [searchText, setSearchText] = useState<string>('');
    const [search] = useDebounce(searchText, 500);

    const bgImage = imageUrlSet(restaurantSlide.imageUrl);

    const [sortBy, setSortBy] =
        useState<string>("createdAt");

    const [sortOrder, setSortOrder] =
        useState<SortOrder>("desc");

    const [viewMode, setViewMode] = useState<
        "grid" | "list"
    >("grid");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const limit = 12;

    const {
        data: products,
        isLoading: productsLoading,
        isFetching: productsFetching,
    } = useTemplateProductQuery({
        categoryId,
        page: currentPage,
        brandId,
        sortBy,
        sortOrder,
        limit,
        search,
    });

    const total = products?.meta?.total || 0;
    const totalPages = Math.ceil(total / limit);


    const productItems = products?.items ?? [];

    const handleClearCategory = () => {
        const params = new URLSearchParams();

        if (search?.trim()) {
            params.set("search", search.trim());
        }

        const query = params.toString();

        router.push(
            query ? `${pathname}?${query}` : pathname,
        );
    };

    const handleToggleSortOrder = () => {
        setSortOrder((previous) =>
            previous === "desc" ? "asc" : "desc",
        );
    };

    return (
        <section className="bg-[var(--store-bg-3)] pb-5">

            {/* Product content */}
            <section
                className="relative mb-5 overflow-hidden border border-white/20 bg-cover bg-center bg-no-repeat p-5 shadow-lg sm:p-6"
                style={{
                    backgroundImage: `url('${bgImage}')`,
                }}
            >
                {/* Background overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />

                <div className="relative z-10">
                    {/* Heading */}
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Product Filters
                            </h2>

                            <p className="mt-1 text-sm text-white/70">
                                {productItems.length} products found
                            </p>
                        </div>

                        <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                            Find your perfect product
                        </div>
                    </div>

                    {/* All filter fields */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Search field */}
                        <div>
                            <label
                                htmlFor="product-search"
                                className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-white/80"
                            >
                                Search products
                            </label>

                            <div
                                className="relative"
                            >
                                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/70" />

                                <input
                                    id="product-search"
                                    type="text"
                                    value={searchText}
                                    onChange={(event) =>
                                        setSearchText(
                                            event.currentTarget.value,
                                        )
                                    }
                                    placeholder="Search products..."
                                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-11 pr-20 text-sm font-medium text-white outline-none backdrop-blur-md transition placeholder:text-white/50 hover:bg-white/15 focus:border-white/50 focus:bg-white/15"
                                />


                                <button
                                    aria-label="Search products"
                                    className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg bg-[var(--store-primary)] text-white transition hover:opacity-90"
                                >
                                    <Search className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Sort field */}
                        <div>
                            <label
                                htmlFor="product-sort"
                                className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-white/80"
                            >
                                Sort by
                            </label>

                            <div className="relative">
                                <select
                                    id="product-sort"
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(
                                            event.currentTarget.value,
                                        )
                                    }
                                    className="h-12 w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-4 pr-10 text-sm font-medium text-white outline-none backdrop-blur-md transition hover:bg-white/15 focus:border-white/50 focus:bg-white/15"
                                >
                                    <option
                                        value="name"
                                        className="bg-gray-900 text-white"
                                    >
                                        Name
                                    </option>

                                    <option
                                        value="price"
                                        className="bg-gray-900 text-white"
                                    >
                                        Price
                                    </option>

                                    <option
                                        value="createdAt"
                                        className="bg-gray-900 text-white"
                                    >
                                        Created date
                                    </option>
                                </select>

                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/70" />
                            </div>
                        </div>

                        {/* Sort direction */}
                        <div>
                            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-white/80">
                                Sort direction
                            </span>

                            <div className="grid h-12 grid-cols-2 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSortOrder("asc")
                                    }
                                    aria-pressed={sortOrder === "asc"}
                                    className={`inline-flex items-center justify-center gap-2 px-4 text-xs font-bold transition ${sortOrder === "asc"
                                        ? "bg-[var(--store-primary)] text-white"
                                        : "text-white/80 hover:bg-white/15 hover:text-white"
                                        }`}
                                >
                                    <ArrowUpAZ className="size-4" />
                                    ASC
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSortOrder("desc")
                                    }
                                    aria-pressed={sortOrder === "desc"}
                                    className={`inline-flex items-center justify-center gap-2 border-l border-white/20 px-4 text-xs font-bold transition ${sortOrder === "desc"
                                        ? "bg-[var(--store-primary)] text-white"
                                        : "text-white/80 hover:bg-white/15 hover:text-white"
                                        }`}
                                >
                                    <ArrowDownAZ className="size-4" />
                                    DESC
                                </button>
                            </div>
                        </div>

                        {/* View mode */}
                        <div>
                            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-white/80">
                                Product view
                            </span>

                            <div className="grid h-12 grid-cols-2 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setViewMode("grid")
                                    }
                                    aria-label="Grid view"
                                    aria-pressed={viewMode === "grid"}
                                    className={`inline-flex items-center justify-center gap-2 px-4 text-xs font-bold transition ${viewMode === "grid"
                                        ? "bg-[var(--store-primary)] text-white"
                                        : "text-white/80 hover:bg-white/15 hover:text-white"
                                        }`}
                                >
                                    <Grid2X2 className="size-4" />
                                    Grid
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setViewMode("list")
                                    }
                                    aria-label="List view"
                                    aria-pressed={viewMode === "list"}
                                    className={`inline-flex items-center justify-center gap-2 border-l border-white/20 px-4 text-xs font-bold transition ${viewMode === "list"
                                        ? "bg-[var(--store-primary)] text-white"
                                        : "text-white/80 hover:bg-white/15 hover:text-white"
                                        }`}
                                >
                                    <List className="size-4" />
                                    List
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile toggle button */}
                    <button
                        type="button"
                        onClick={handleToggleSortOrder}
                        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto"
                    >
                        {sortOrder === "asc" ? (
                            <ArrowUpAZ className="size-4" />
                        ) : (
                            <ArrowDownAZ className="size-4" />
                        )}

                        Toggle sort direction
                    </button>
                </div>
            </section>

            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">

                <main className="min-w-0">
                    {productsLoading ||
                        productsFetching ? (
                        <Loader />
                    ) : productItems.length > 0 ? (
                        <div>
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                                        : "grid grid-cols-1 gap-5"
                                }
                            >
                                {productItems.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        viewMode={viewMode}
                                        product={product}
                                        theme={theme}
                                        dashboardColor={
                                            dashboardColor
                                        }
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}

                            />

                        </div>
                    ) : (
                        <div className="rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] px-6 py-16 text-center shadow-sm">
                            <h3 className="text-xl font-bold text-[var(--store-text-primary)]">
                                No products found
                            </h3>

                            <p className="mt-2 text-sm text-[var(--store-muted)]">
                                Try another category or clear
                                the category filter.
                            </p>

                            <button
                                type="button"
                                onClick={handleClearCategory}
                                className="mt-5 rounded-lg bg-[var(--store-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                View All Products
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </section>
    );
};

export default RestaurantProductPage;