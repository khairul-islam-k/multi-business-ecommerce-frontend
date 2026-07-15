"use client";

import React, { useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  Grid2X2,
  List,
} from "lucide-react";

import ProductCard from "../_components/product-card";
import {
  useTemplateProductQuery,
} from "@/lib/api/hooks/public-website";
import { SortOrder } from "@/lib/api";

type ProductProps = {
  categoryId?: string;
};

const ElectronicProduct = ({ categoryId }: ProductProps) => {

  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data: products } = useTemplateProductQuery({
    categoryId,
    sortBy,
    sortOrder,
  });

  // all categories

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");


  return (
    <section className="bg-[var(--store-bg-3)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 bg-[var(--store-bg-1)] p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-bold md:text-2xl">
            Total Products Found: {products?.items?.length ?? 0}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-lg font-semibold">Sort by:</label>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-12 w-48 appearance-none rounded-md border border-gray-300 bg-[var(--store-bg-1)] px-4 pr-10 text-sm outline-none focus:border-[#f16d59]"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="createdAt">Created At</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>

            <button
              type="button"
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[var(--store-bg-1)] px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
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
                  : "border-gray-300 bg-[var(--store-bg-1)] text-gray-500 hover:text-[#f16d59]"
                }`}
              aria-label="List view"
            >
              <List className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`grid h-12 w-12 place-items-center rounded-md border transition ${viewMode === "grid"
                  ? "border-[#f16d59] bg-[#f16d59] text-white"
                  : "border-gray-300 bg-[var(--store-bg-1)] text-gray-500 hover:text-[#f16d59]"
                }`}
              aria-label="Grid view"
            >
              <Grid2X2 className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {products?.items?.length ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid grid-cols-1 gap-6"
            }
          >
            {products.items.map((product) => (
              <ProductCard
                key={product.id}
                viewMode={viewMode}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[var(--store-bg-1)] px-6 py-16 text-center shadow-sm">
            <h3 className="text-xl font-bold text-[var(--store-text)]">
              No products found
            </h3>

            <p className="mt-2 text-sm text-[var(--store-muted)]">
              No products are available right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ElectronicProduct;
