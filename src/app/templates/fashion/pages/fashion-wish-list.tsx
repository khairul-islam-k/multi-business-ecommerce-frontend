'use client';
import { useTemplateProductWishListQuery } from '@/lib/api/hooks/template-product-wishList';
import React, { useState } from 'react';
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, Grid2X2, List } from 'lucide-react';
import FashionWishListCard from '../_components/fashion-wish-list-card';

export type SortOrder = "asc" | "desc" | "ASC" | "DESC";

const FashionWishList = () => {
    const [sortBy, setSortBy] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const { data: wishList } = useTemplateProductWishListQuery();

    console.log('data', wishList);

    const products = wishList?.items ?? [];

    return (
        <div>

            <div>
                {/* Top Filter Bar */}
                <div className="mb-8 flex flex-col gap-4 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <h1 className="text-xl font-bold text-gray-950 md:text-2xl">
                        Total Products Found: {wishList?.items.length}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="text-lg font-semibold text-gray-950">
                            Sort by:
                        </label>

                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                                className="h-12 w-48 appearance-none rounded-md border border-gray-300 bg-white px-4 pr-10 text-sm text-gray-700 outline-none focus:border-[#f16d59]"
                            >
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="createdAt">CreatedAt</option>
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        </div>

                        <button
                            type="button"
                            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
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
                            className={`grid h-12 w-12 place-items-center rounded-md border transition ${viewMode === "list"
                                ? "border-[#f16d59] bg-[#f16d59] text-white"
                                : "border-gray-300 bg-white text-gray-500 hover:text-[#f16d59]"
                                }`}
                        >
                            <List className="h-6 w-6" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={`grid h-12 w-12 place-items-center rounded-md border transition ${viewMode === "grid"
                                ? "border-[#f16d59] bg-[#f16d59] text-white"
                                : "border-gray-300 bg-white text-gray-500 hover:text-[#f16d59]"
                                }`}
                        >
                            <Grid2X2 className="h-6 w-6" />
                        </button>
                    </div>

                </div>


                {/* Product Grid */}
                {products.length > 0 ? (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                                : "grid grid-cols-1 gap-6"
                        }
                    >

                        {/* check filteredProducts */}

                        {products.map((product) => (
                            <FashionWishListCard
                                key={product.id}
                                item={product}
                                viewMode={viewMode}
                            />
                        ))}


                    </div>
                ) : (
                    <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-gray-950">
                            No products found
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Try another category or clear the category filter.
                        </p>

                        {/* <button
                            type="button"
                            onClick={handleClearCategory}
                            className="mt-5 rounded-full bg-[#f16d59] px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-950"
                        >
                            View All Products
                        </button> */}
                    </div>
                )}
            </div>

        </div>
    );
};

export default FashionWishList;